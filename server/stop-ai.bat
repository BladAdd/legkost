@echo off
chcp 65001 >nul
cd /d "%~dp0.."
title Лёгкость — остановка сервера ИИ
echo.
echo   Останавливаю домашний сервер ИИ...
echo   Сайт вернётся в облачный режим.
echo.
node server/stop-ai.mjs
echo.
pause
