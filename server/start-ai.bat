@echo off
chcp 65001 >nul
cd /d "%~dp0.."
title Лёгкость — домашний сервер ИИ
set AI_MODEL=qwen2.5:3b
set PORT=3001

echo.
echo   Л Ё Г К О С Т Ь  ·  домашний сервер ИИ
echo   ------------------------------------
echo   Модель: %AI_MODEL%
echo   Туннель: localtunnel (npx скачает при первом запуске)
echo   Если модели нет: ollama pull %AI_MODEL%
echo   Остановить: Ctrl+C
echo.

node server/publish.mjs
pause
