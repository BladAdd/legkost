/* «Лёгкость» — локальный шлюз к Ollama.
   Запуск: node server/ai-gateway.mjs
   Переменные окружения:
     OLLAMA_URL        — адрес Ollama (по умолчанию http://127.0.0.1:11434)
     PORT              — порт шлюза (по умолчанию 3001)
     ALLOW_ORIGIN      — разрешённый Origin для браузера (по умолчанию http://localhost:3000)
     AI_MODEL          — модель по умолчанию (по умолчанию qwen3:4b)
     AI_RATE_LIMIT_SEC — задержка между запросами в секундах (по умолчанию 1)
*/
import http from 'http';
import fs from 'fs';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const PORT = Number(process.env.PORT) || 3001;
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || 'http://localhost:3000';
const DEFAULT_MODEL = process.env.AI_MODEL || 'qwen3:4b';
const RATE_SEC = Number(process.env.AI_RATE_LIMIT_SEC) || 1;

let lastRequestAt = 0;

function json(res, code, body) {
  const payload = JSON.stringify(body);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': ALLOW_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Length': String(Buffer.byteLength(payload))
  });
  res.end(payload);
}

function options(res) {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': ALLOW_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400'
  });
  res.end();
}

async function ollamaRequest(path, body) {
  const url = new URL(path, OLLAMA_URL);
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
    signal: AbortSignal.timeout(120000)
  });
  const text = await res.text();
  if (!res.ok) throw new Error('Ollama ' + res.status + ' ' + text.slice(0, 200));
  return text ? JSON.parse(text) : {};
}

function rateOk() {
  const now = Date.now();
  if (now - lastRequestAt < RATE_SEC * 1000) return false;
  lastRequestAt = now;
  return true;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const { pathname } = url;

  if (req.method === 'OPTIONS') { options(res); return; }

  if (pathname === '/api/ai/health') {
    try {
      await ollamaRequest('/api/tags', null);
      json(res, 200, { ok: true, ollama: true, model: DEFAULT_MODEL });
    } catch (e) {
      json(res, 200, { ok: false, ollama: false, error: String(e.message || e) });
    }
    return;
  }

  if (pathname === '/api/ai/models') {
    try {
      const data = await ollamaRequest('/api/tags', null);
      json(res, 200, { ok: true, models: (data.models || []).map(m => m.name) });
    } catch (e) {
      json(res, 200, { ok: false, error: String(e.message || e) });
    }
    return;
  }

  if (pathname === '/api/ai/chat') {
    if (req.method !== 'POST') { json(res, 405, { error: 'only POST' }); return; }
    if (!rateOk()) { json(res, 429, { error: 'too many requests' }); return; }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { messages, model = DEFAULT_MODEL, temperature = 0.4, stream = false } = JSON.parse(body || '{}');
        if (!Array.isArray(messages) || !messages.length) {
          json(res, 400, { error: 'messages required' });
          return;
        }
        const data = await ollamaRequest('/v1/chat/completions', {
          model,
          messages,
          temperature,
          stream: false,
          max_tokens: 700
        });
        const content = data.choices && data.choices[0] && data.choices[0].message
          ? data.choices[0].message.content || ''
          : '';
        json(res, 200, { ok: true, content, model });
      } catch (e) {
        json(res, 502, { ok: false, error: String(e.message || e) });
      }
    });
    return;
  }

  json(res, 404, { error: 'not found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('AI-шлюз: http://127.0.0.1:' + PORT);
  console.log('Ollama: ' + OLLAMA_URL);
  console.log('Модель: ' + DEFAULT_MODEL);
  console.log('Разрешённый Origin: ' + ALLOW_ORIGIN);
});
