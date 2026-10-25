/* «Лёгкость» — публикация домашнего сервера ИИ.
   Запуск: node server/publish.mjs   (или server/start-ai.bat)

   Что делает:
   1. Поднимает шлюз к Ollama (server/ai-gateway.mjs), если он ещё не запущен.
   2. Открывает публичный туннель Cloudflare и получает адрес https://….trycloudflare.com
   3. Проверяет, что сайт может достучаться до шлюза.
   4. Записывает адрес в ai-endpoint.json и пушит его в GitHub —
      GitHub Pages раздаёт файл всем посетителям, и сайт сам переключается на твой ноут.
   5. Держит туннель живым: если он упал, поднимает новый и перепубликует адрес.
   6. По Ctrl+C снимает адрес с сайта (все вернутся в облачный режим).

   Переменные окружения:
     PORT          — порт шлюза (3001)
     AI_PUBLISH    — 0, чтобы не коммитить адрес в git
     AI_TUNNEL     — 0, чтобы не поднимать туннель (только шлюз)
*/
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PORT = Number(process.env.PORT) || 3001;
const LOCAL = 'http://127.0.0.1:' + PORT;
const PUBLISH = process.env.AI_PUBLISH !== '0';
const WANT_TUNNEL = process.env.AI_TUNNEL !== '0';
const ENDPOINT_FILE = join(ROOT, 'ai-endpoint.json');

const C = {
  reset: '\u001b[0m', bold: '\u001b[1m', dim: '\u001b[2m',
  orange: '\u001b[38;5;209m', green: '\u001b[38;5;71m', yellow: '\u001b[38;5;179m', red: '\u001b[38;5;167m'
};

let gatewayProc = null;
let tunnelProc = null;
let publicUrl = '';
let stopping = false;
let restartTimer = null;

function line(text) { console.log(text); }
function ok(text) { line(C.green + '✓ ' + C.reset + text); }
function warn(text) { line(C.yellow + '! ' + C.reset + text); }
function fail(text) { line(C.red + '× ' + C.reset + text); }

function banner() {
  line('');
  line(C.orange + C.bold + '  Л Ё Г К О С Т Ь  ·  домашний сервер ИИ' + C.reset);
  line(C.dim + '  ────────────────────────────────────────────' + C.reset);
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function health(url, timeoutMs = 4000) {
  try {
    const res = await fetch(url.replace(/\/$/, '') + '/api/ai/health', {
      cache: 'no-store',
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.ok && data.ollama ? data : null;
  } catch (e) { return null; }
}

/* ───────── ШЛЮЗ ───────── */
async function ensureGateway() {
  const already = await health(LOCAL);
  if (already) {
    ok('Шлюз уже запущен · модель ' + (already.model || 'неизвестна'));
    return;
  }
  line(C.dim + '  Запускаю шлюз к Ollama…' + C.reset);
  gatewayProc = spawn(process.execPath, [join(ROOT, 'server', 'ai-gateway.mjs')], {
    cwd: ROOT,
    env: {
      ...process.env,
      PORT: String(PORT),
      ALLOW_ORIGIN: 'https://bladadd.github.io,http://localhost:8765,http://127.0.0.1:8765'
    },
    stdio: 'inherit'
  });
  gatewayProc.on('exit', code => {
    if (stopping) return;
    fail('Шлюз завершился (код ' + code + '). Перезапусти через минуту.');
    shutdown(1);
  });

  for (let i = 0; i < 30; i++) {
    await sleep(600);
    const data = await health(LOCAL);
    if (data) {
      ok('Шлюз готов · модель ' + (data.model || 'неизвестна'));
      return;
    }
  }
  throw new Error('шлюз не поднялся за 18 секунд. Проверь, что Ollama запущена: ollama list');
}

/* ───────── ТУННЕЛЬ ───────── */
function cloudflaredPath() {
  if (process.env.CLOUDFLARED_PATH) return process.env.CLOUDFLARED_PATH;
  const dir = join(__dirname, 'bin');
  const local = join(dir, process.platform === 'win32' ? 'cloudflared.exe' : 'cloudflared');
  if (existsSync(local)) return local;
  const which = spawnSync(process.platform === 'win32' ? 'where' : 'which', ['cloudflared'], { encoding: 'utf8' });
  if (which.status === 0) return which.stdout.split(/\r?\n/)[0].trim();
  return '';
}

async function ensureCloudflared() {
  const found = cloudflaredPath();
  if (found) return found;
  const dir = join(__dirname, 'bin');
  const file = join(dir, process.platform === 'win32' ? 'cloudflared.exe' : 'cloudflared');
  const arch = process.arch === 'arm64' ? 'arm64' : (process.platform === 'win32' ? 'amd64' : 'amd64');
  const base = 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-';
  const suffix = process.platform === 'win32' ? 'windows-' + arch + '.exe'
    : (process.platform === 'darwin' ? 'darwin-' + arch : 'linux-' + arch);
  line(C.dim + '  Первый запуск: скачиваю cloudflared (один раз)…' + C.reset);
  mkdirSync(dir, { recursive: true });
  const res = await fetch(base + suffix);
  if (!res.ok) throw new Error('не удалось скачать cloudflared: HTTP ' + res.status);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  if (process.platform !== 'win32') {
    try { spawnSync('chmod', ['+x', file]); } catch (e) {}
  }
  ok('cloudflared готов: ' + file);
  return file;
}

function parseUrl(chunk) {
  const text = chunk.toString();
  const m = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/i.exec(text);
  return m ? m[0] : '';
}

async function startTunnel() {
  const bin = await ensureCloudflared();
  if (!bin) throw new Error('не найден cloudflared. Положи cloudflared.exe в server/bin/ или установи из cloudflare.com');

  line(C.dim + '  Открываю туннель Cloudflare → ' + LOCAL + C.reset);
  tunnelProc = spawn(bin, ['tunnel', '--url', LOCAL, '--no-autoupdate', '--protocol', 'http2'], {
    cwd: ROOT,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  const url = await new Promise((resolveUrl, reject) => {
    const timer = setTimeout(() => reject(new Error('туннель не выдал адрес за 40 секунд')), 40000);
    const onData = chunk => {
      const found = parseUrl(chunk);
      if (found) { clearTimeout(timer); resolveUrl(found); }
    };
    tunnelProc.stdout.on('data', onData);
    tunnelProc.stderr.on('data', onData);
    tunnelProc.on('exit', code => {
      if (stopping) return;
      clearTimeout(timer);
      reject(new Error('туннель закрылся (код ' + code + ')'));
    });
  });

  tunnelProc.on('exit', code => {
    if (stopping) return;
    fail('Туннель закрылся (код ' + code + '). Перезапускаю через 5 секунд…');
    scheduleTunnelRestart();
  });

  publicUrl = url;
  ok('Публичный адрес: ' + C.bold + url + C.reset);

  line(C.dim + '  Проверяю доступность из интернета…' + C.reset);
  for (let i = 0; i < 20; i++) {
    const data = await health(url, 5000);
    if (data) {
      ok('Туннель работает · снаружи видно модель ' + (data.model || 'неизвестна'));
      return data;
    }
    await sleep(1500);
  }
  throw new Error('адрес выдан, но снаружи шлюз не отвечает. Проверь интернет и firewall.');
}

function scheduleTunnelRestart() {
  if (stopping || restartTimer) return;
  restartTimer = setTimeout(async () => {
    restartTimer = null;
    try {
      const data = await startTunnel();
      await publishPublic(data);
    } catch (e) {
      fail(String(e.message || e));
      scheduleTunnelRestart();
    }
  }, 5000);
}

/* ───────── ПУБЛИКАЦИЯ АДРЕСА В GIT ───────── */
function readEndpoint() {
  try { return JSON.parse(readFileSync(ENDPOINT_FILE, 'utf8')); } catch (e) { return {}; }
}

function writeEndpoint(gateway, model) {
  const payload = {
    gateway: gateway || '',
    model: model || '',
    started: gateway ? new Date().toISOString() : '',
    updated: new Date().toISOString(),
    note: 'Публичный адрес домашнего сервера ИИ. Обновляется автоматически: server/publish.mjs'
  };
  writeFileSync(ENDPOINT_FILE, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  return payload;
}

function git(args) {
  return spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });
}

function publishPublic(data) {
  const previous = readEndpoint();
  const payload = writeEndpoint(publicUrl, data && data.model);
  if (previous.gateway === payload.gateway && previous.model === payload.model) {
    ok('Адрес на сайте уже актуален');
    return;
  }
  if (!PUBLISH) {
    warn('AI_PUBLISH=0 — адрес не отправлен в git');
    return;
  }
  const status = git(['status', '--porcelain', '--', 'ai-endpoint.json']).stdout.trim();
  if (!status) {
    ok('Адрес на сайте уже актуален');
    return;
  }
  git(['add', '--', 'ai-endpoint.json']);
  const commit = git(['commit', '-m', 'Сервер ИИ онлайн: ' + publicUrl, '--', 'ai-endpoint.json']);
  if (commit.status !== 0) {
    warn('Не удалось закоммитить адрес: ' + (commit.stderr || commit.stdout || '').trim());
    return;
  }
  let push = git(['push', 'origin', 'HEAD:main']);
  if (push.status !== 0) {
    git(['pull', '--rebase', '--autostash', 'origin', 'main']);
    push = git(['push', 'origin', 'HEAD:main']);
  }
  if (push.status !== 0) {
    warn('Не удалось запушить адрес: ' + (push.stderr || '').trim());
    return;
  }
  ok('Адрес отправлен на GitHub — сайт подхватит его через ~1 минуту');
}

function unpublish() {
  if (!PUBLISH) return;
  const current = readEndpoint();
  if (!current.gateway) return;
  writeEndpoint('', '');
  git(['add', '--', 'ai-endpoint.json']);
  const commit = git(['commit', '-m', 'Сервер ИИ выключен', '--', 'ai-endpoint.json']);
  if (commit.status === 0) git(['push', 'origin', 'HEAD:main']);
  ok('Адрес снят с сайта — посетители вернутся в облачный режим');
}

/* ───────── СТОП ───────── */
function kill(child) {
  if (!child || child.killed) return;
  try { child.kill(); } catch (e) {}
}

function shutdown(code) {
  if (stopping) return;
  stopping = true;
  if (restartTimer) clearTimeout(restartTimer);
  line('');
  warn('Останавливаюсь…');
  kill(tunnelProc);
  unpublish();
  kill(gatewayProc);
  setTimeout(() => process.exit(code || 0), 300);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

/* ───────── СТАРТ ───────── */
banner();
try {
  await ensureGateway();
  if (WANT_TUNNEL) {
    const data = await startTunnel();
    publishPublic(data);
    line('');
    line(C.green + C.bold + '  Готово. ИИ работает у всех посетителей через твой ноут.' + C.reset);
    line(C.dim + '  Сайт: https://bladadd.github.io/legkost/  ·  Остановить: Ctrl+C' + C.reset);
    line(C.dim + '  Ноут должен быть включён. Если выключить — сайт сам уйдёт в облако.' + C.reset);
    line('');
  } else {
    ok('AI_TUNNEL=0 — работает только локальный шлюз на ' + LOCAL);
  }
} catch (e) {
  fail(String(e.message || e));
  shutdown(1);
}
