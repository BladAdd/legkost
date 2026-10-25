# Домашний сервер ИИ: как это работает

Сайт `https://bladadd.github.io/legkost/` по умолчанию отвечает через домашний ноутбук. Никаких ручных туннелей и ввода адресов: всё делает `server/publish.mjs`.

## Схема

```
посетитель → GitHub Pages → ai-endpoint.json → https://….lhr.life
                                                    ↓
                                      ноутбук: шлюз :3001 → Ollama qwen2.5:3b
```

- `ai-endpoint.json` лежит в корне репозитория и раздаётся всем посетителям.
- `publish.mjs` обновляет в нём поле `gateway`, коммитит и пушит файл.
- Панель помощника читает файл с `cache: no-store`, проверяет `/api/ai/health` и, если сервер жив, шлёт запросы на ноутбук.
- Проверка и чат — простые CORS-запросы: GET без лишних заголовков и POST с `Content-Type: text/plain` (шлюз всё равно разбирает JSON из тела). Поэтому браузер не делает preflight, а туннель не может его сломать.
- Если сервер выключен или адрес устарел, панель молча переходит на бесплатное облако. ИИ доступен всегда.

## Запуск

```powershell
cd server
start-ai.bat
```

Или напрямую:

```powershell
node server/publish.mjs
```

Скрипт:

1. проверяет, запущен ли шлюз, и при необходимости поднимает `server/ai-gateway.mjs`;
2. открывает SSH-туннель `ssh -R 80:127.0.0.1:3001 nokey@localhost.run`;
3. ждёт адрес `https://….lhr.life` и проверяет его снаружи, включая CORS;
4. пишет адрес в `ai-endpoint.json`, коммитит и пушит;
5. держит туннель живым: каждые 30 секунд проверяет публичный адрес, при трёх провалах подряд перезапускает туннель и публикует новый адрес;
6. по `Ctrl+C` или через `server\stop-ai.bat` снимает адрес с сайта и останавливает шлюз.

Повторный запуск не поднимет второй туннель: `publish.mjs` хранит PID в `server/.publish.pid` и при живом процессе выходит с подсказкой. `stop-ai.bat` останавливает всё дерево процессов и снимает адрес с сайта.

localhost.run не показывает браузерам заглушку, поэтому health-check — обычный GET без preflight. Запасной localtunnel (`AI_TUNNEL=local`) показывает страницу «Tunnel website ahead»; сайт обходит её заголовком `bypass-tunnel-reminder`, а шлюз разрешает этот заголовок в CORS.

## Переменные

| Переменная | Значение по умолчанию | Что делает |
| --- | --- | --- |
| `PORT` | `3001` | порт шлюза |
| `AI_MODEL` | `qwen2.5:3b` | модель Ollama |
| `AI_PUBLISH` | `1` | `0` — не коммитить адрес в git |
| `AI_TUNNEL` | `lhr` | `lhr` — localhost.run, `local` — localtunnel, `cloudflare` — Cloudflare, `0` — только шлюз |
| `CLOUDFLARED_PATH` | — | путь к своему `cloudflared` (только для `AI_TUNNEL=cloudflare`) |

## Важное

- **Ноутбук должен быть включён.** Если он выключен, сайт показывает `🌙 Сервер выключен · отвечает облако` и отвечает через облако.
- **Адрес меняется при перезапуске.** localhost.run выдаёт новый поддомен. Сайт это переживает: старый адрес не отвечает → облако, новый адрес подхватится после публикации. Если SSH-процесс жив, а туннель уже не работает, `publish.mjs` заметит это по health-check и перезапустит его сам.
- **SSH.** Нужен клиент OpenSSH (`ssh -V`). В Windows 10/11 он уже установлен. Туннель идёт на `127.0.0.1:3001`, потому что шлюз слушает IPv4 `0.0.0.0:3001`.
- **GitHub Pages кэширует ~1–10 минут.** Свежий адрес может появиться не сразу; до этого работает облако.
- **Модель.** На GTX 1050 Ti (4 ГБ VRAM) используй `qwen2.5:3b`: 1–5 с и без «рассуждений». `qwen3:4b` отвечает 30–80 с и обрезается.
- **Нагрузка.** Запросы к Ollama идут в очередь. Для семьи и друзей этого достаточно; для большого трафика нужен VPS или облако.
- **Безопасность.** Шлюз открыт в интернет. При желании задай `AI_KEY` в окружении — тогда клиент должен присылать заголовок `X-AI-Key`. Дополнительно шлюз ограничивает частоту: 1 запрос в 2 секунды и 15 в минуту с одного IP.

## Почему localhost.run, а не Cloudflare или localtunnel

- **Cloudflare** (`trycloudflare.com`) в Орске не регистрируется: провайдер режет служебный канал, cloudflared получает `control stream error: context deadline exceeded`, а сайт — ошибку 1033.
- **Localtunnel** работает, но периодически отдаёт 502/408 и иногда ломает CORS-preflight. Поэтому он оставлен запасным вариантом.
- **localhost.run** идёт по обычному SSH, не показывает заглушку и стабильно отдаёт CORS.

Cloudflare можно включить вручную:

```powershell
$env:AI_TUNNEL="cloudflare"
node server/publish.mjs
```

Localtunnel:

```powershell
$env:AI_TUNNEL="local"
node server/publish.mjs
```

## Если что-то сломалось

| Симптом | Что проверить |
| --- | --- |
| `шлюз не поднялся` | запущена ли Ollama: `ollama list`; есть ли модель: `ollama pull qwen2.5:3b` |
| `localhost.run не выдал адрес` | `ssh -V`; проверь вручную: `ssh -R 80:127.0.0.1:3001 nokey@localhost.run` |
| `localtunnel не выдал адрес` | интернет, `npx --version`, доступ к `loca.lt`; попробуй `npx --yes localtunnel --port 3001 --local-host 127.0.0.1` вручную |
| `снаружи шлюз не отвечает` | антивирус/firewall; `ALLOW_ORIGIN` содержит `https://bladadd.github.io` |
| На сайте всё ещё облако | подожди 1–10 минут (кэш Pages) и нажми «проверить» в панели |
| `Не удалось запушить адрес` | `git pull --rebase`, затем перезапусти `publish.mjs` |
| Туннель часто падает | перезапусти `publish.mjs`; для стабильности — VPS или Cloudflare с аккаунтом |

## Постоянный адрес (необязательно)

Localtunnel можно попросить о поддомене:

```powershell
npx localtunnel --port 3001 --local-host 127.0.0.1 --subdomain legkost-ai
```

Он не гарантирован: если занят, сервис выдаст другой. localhost.run даёт постоянный поддомен на бесплатном аккаунте (ключ SSH). Для настоящего постоянного URL нужен свой домен:

- Cloudflare Named Tunnel (аккаунт Cloudflare + домен) — `cloudflared tunnel create` и `cloudflared tunnel route dns`;
- VPS с `server/ai-gateway.mjs` и reverse-proxy (Caddy/Nginx).

Полученный адрес можно вписать в `ai-endpoint.json` вручную (поле `gateway`) или указать в **Профиль → Свой шлюз**.

## Альтернативы

- **Cloudflare Worker + Groq** (`server/cloudflare-worker.js`) — ИИ 24/7 без ноутбука, нужен аккаунт Cloudflare и секрет `GROQ_API_KEY`.
- **VPS** — разверни `server/ai-gateway.mjs` на Railway/Render/DigitalOcean и укажи его URL в профиле.
