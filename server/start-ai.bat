@echo off
chcp 65001 >nul
cd /d "%~dp0.."
set OLLAMA_URL=http://127.0.0.1:11434
set PORT=3001
set ALLOW_ORIGIN=https://bladadd.github.io,http://localhost:8765,http://127.0.0.1:8765
set AI_MODEL=qwen2.5:3b
set AI_RATE_LIMIT_SEC=2
set AI_MAX_PER_MIN=15
:: set AI_KEY=твой_секретный_ключ
echo Запускаю ИИ-шлюз «Лёгкость»...
echo Модель: %AI_MODEL%. Если модели нет: ollama pull %AI_MODEL%
echo Если задан AI_KEY, клиент должен присылать заголовок X-AI-Key.
node server/ai-gateway.mjs
pause
