@echo off
cd /d "%~dp0.."
set OLLAMA_URL=http://127.0.0.1:11434
set PORT=3001
set ALLOW_ORIGIN=https://bladadd.github.io
set AI_MODEL=qwen3:4b
set AI_RATE_LIMIT_SEC=2
set AI_MAX_PER_MIN=15
:: set AI_KEY=твой_секретный_ключ
echo Запуск публичного шлюза ИИ...
echo Если AI_KEY задан, передавай заголовок X-AI-Key с каждым запросом.
node server/ai-gateway.mjs
pause
