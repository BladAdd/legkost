/* «Лёгкость» — остановка домашнего сервера ИИ.
   Запуск: server\stop-ai.bat  (или node server/stop-ai.mjs)

   Что делает:
   1. Находит процесс publish.mjs по файлу server/.publish.pid.
   2. Останавливает его вместе с туннелем и шлюзом.
   3. Снимает адрес с сайта (ai-endpoint.json), чтобы посетители ушли в облако.
*/
import { spawnSync } from 'node:child_process';
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const LOCK = join(__dirname, '.publish.pid');
const ENDPOINT = join(ROOT, 'ai-endpoint.json');

function readPid() {
  try { return parseInt(readFileSync(LOCK, 'utf8'), 10) || 0; } catch (e) { return 0; }
}

function isPublishProcess(pid) {
  try {
    if (process.platform === 'win32') {
      const out = spawnSync('powershell', [
        '-NoProfile',
        '-Command',
        '(Get-CimInstance Win32_Process -Filter "ProcessId=' + pid + '").CommandLine'
      ], { encoding: 'utf8', timeout: 15000 });
      return /publish\.mjs/i.test(out.stdout || '');
    }
    const out = spawnSync('ps', ['-p', String(pid), '-o', 'command='], { encoding: 'utf8' });
    return /publish\.mjs/i.test(out.stdout || '');
  } catch (e) { return false; }
}

const pid = readPid();
if (!pid) {
  console.log('Сервер ИИ не запущен: нет файла server\\.publish.pid.');
} else if (!isPublishProcess(pid)) {
  console.log('Процесс ' + pid + ' уже не является сервером ИИ — убираю старую блокировку.');
  try { unlinkSync(LOCK); } catch (e) {}
} else {
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    try { process.kill(pid, 'SIGTERM'); } catch (e) {}
  }
  try { unlinkSync(LOCK); } catch (e) {}
  console.log('Сервер, шлюз и туннель остановлены.');
}

const git = args => spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });
let data = {};
try { data = JSON.parse(readFileSync(ENDPOINT, 'utf8')); } catch (e) {}

if (data.gateway) {
  const payload = {
    gateway: '',
    model: '',
    started: '',
    updated: new Date().toISOString(),
    note: data.note || 'Публичный адрес домашнего сервера ИИ. Обновляется автоматически: server/publish.mjs'
  };
  writeFileSync(ENDPOINT, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  git(['add', '--', 'ai-endpoint.json']);
  const commit = git(['commit', '-m', 'Сервер ИИ выключен', '--', 'ai-endpoint.json']);
  if (commit.status === 0) {
    let push = git(['push', 'origin', 'HEAD:main']);
    if (push.status !== 0) {
      git(['pull', '--rebase', '--autostash', 'origin', 'main']);
      push = git(['push', 'origin', 'HEAD:main']);
    }
    if (push.status === 0) console.log('Адрес снят с сайта — посетители перейдут в облако.');
    else console.log('Адрес снят локально, но пуш не удался: ' + (push.stderr || '').trim());
  } else {
    console.log('Адрес уже был пуст или не изменился.');
  }
} else {
  console.log('Адрес на сайте уже пуст.');
}

console.log('Готово.');
