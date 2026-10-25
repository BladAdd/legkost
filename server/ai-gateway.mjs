/* «Лёгкость» — публичный шлюз к Ollama для GitHub Pages.
   Запуск: node server/ai-gateway.mjs
   Переменные окружения:
     OLLAMA_URL        — адрес Ollama (по умолчанию http://127.0.0.1:11434)
     PORT              — порт шлюза (по умолчанию 3001)
     ALLOW_ORIGIN      — разрешённый Origin (по умолчанию https://bladadd.github.io)
     AI_MODEL          — модель по умолчанию (по умолчанию qwen3:4b)
     AI_RATE_LIMIT_SEC — пауза между запросами одного IP (сек, по умолчанию 2)
     AI_MAX_PER_MIN    — максимум запросов в минуту с одного IP (по умолчанию 15)
     AI_KEY            — опциональный секретный ключ (заголовок X-AI-Key)
*/
import http from 'http';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const PORT = Number(process.env.PORT) || 3001;
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || 'https://bladadd.github.io';
const DEFAULT_MODEL = process.env.AI_MODEL || 'qwen3:4b';
const RATE_SEC = Number(process.env.AI_RATE_LIMIT_SEC) || 2;
const MAX_PER_MIN = Number(process.env.AI_MAX_PER_MIN) || 15;
const AI_KEY = process.env.AI_KEY || '';

const lastRequest = new Map(); // ip -> timestamp
const minuteHits = new Map();  // ip -> { count, resetAt }

function json(res, code, body) {
  const payload = JSON.stringify(body);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': ALLOW_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type, X-AI-Key',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Length': String(Buffer.byteLength(payload))
  });
  res.end(payload);
}

function options(res) {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': ALLOW_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type, X-AI-Key',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400'
  });
  res.end();
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return fwd.split(',')[0].trim();
  const conn = req.socket;
  return (conn && conn.remoteAddress) || 'unknown';
}

function rateLimit(ip) {
  const now = Date.now();
  const last = lastRequest.get(ip) || 0;
  if (now - last < RATE_SEC * 1000) return false;
  const entry = minuteHits.get(ip) || { count: 0, resetAt: now + 60000 };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + 60000;
  }
  if (entry.count >= MAX_PER_MIN) return false;
  entry.count++;
  minuteHits.set(ip, entry);
  lastRequest.set(ip, now);
  return true;
}

function checkKey(req) {
  if (!AI_KEY) return true;
  return req.headers['x-ai-key'] === AI_KEY;
}

async function ollamaRequest(path, body, method = 'POST') {
  const url = new URL(path, OLLAMA_URL);
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(120000)
  };
  if (method !== 'GET' && body) opts.body = JSON.stringify(body);
  const res = await fetch(url.toString(), opts);
  const text = await res.text();
  if (!res.ok) throw new Error('Ollama ' + res.status + ' ' + text.slice(0, 200));
  return text ? JSON.parse(text) : {};
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const { pathname } = url;
  const ip = clientIp(req);

  if (req.method === 'OPTIONS') { options(res); return; }

  if (pathname === '/api/ai/health') {
    try {
      await ollamaRequest('/api/tags', null, 'GET');
      json(res, 200, { ok: true, ollama: true, model: DEFAULT_MODEL });
    } catch (e) {
      json(res, 200, { ok: false, ollama: false, error: String(e.message || e) });
    }
    return;
  }

  if (pathname === '/api/ai/models') {
    try {
      const data = await ollamaRequest('/api/tags', null, 'GET');
      json(res, 200, { ok: true, models: (data.models || []).map(m => m.name) });
    } catch (e) {
      json(res, 200, { ok: false, error: String(e.message || e) });
    }
    return;
  }

  if (pathname === '/api/ai/chat') {
    if (req.method !== 'POST') { json(res, 405, { error: 'only POST' }); return; }
    if (!rateLimit(ip)) { json(res, 429, { error: 'too many requests' }); return; }
    if (!checkKey(req)) { json(res, 401, { error: 'invalid AI key' }); return; }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { messages, model = DEFAULT_MODEL, temperature = 0.4 } = JSON.parse(body || '{}');
        if (!Array.isArray(messages) || !messages.length) {
          json(res, 400, { error: 'messages required' });
          return;
        }
        const data = await ollamaRequest('/api/chat', {
          model,
          messages,
          stream: false,
          options: {
            temperature,
            num_ctx: 8192,
            num_predict: 700,
            think: false
          }
        });
        const content = data.message && data.message.content ? data.message.content : '';
        json(res, 200, { ok: true, content, model });
      } catch (e) {
        json(res, 502, { ok: false, error: String(e.message || e) });
      }
    });
    return;
  }

  json(res, 404, { error: 'not found' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('AI-шлюз: http://0.0.0.0:' + PORT);
  console.log('Ollama: ' + OLLAMA_URL);
  console.log('Модель: ' + DEFAULT_MODEL);
  console.log('Разрешённый Origin: ' + ALLOW_ORIGIN);
  console.log('Rate limit: ' + MAX_PER_MIN + ' в мин, пауза ' + RATE_SEC + ' сек');
  if (AI_KEY) console.log('Защита: X-AI-Key включена');
});
