@echo off
cd /d "%~dp0.."
set OLLAMA_URL=http://127.0.0.1:11434
set PORT=3001
set ALLOW_ORIGIN=http://localhost:3000
set AI_MODEL=qwen3:4b
echo Запуск шлюза ИИ...
node server/ai-gateway.mjs
pause
