@echo off
cd /d "%~dp0"
node sync-rules.mjs
if errorlevel 1 (
  echo.
  echo 同步失败，请检查 GAME_RULES.md 的可编辑数值区。
  pause
  exit /b 1
)
echo.
echo 同步完成。刷新 index.html 即可看到新数值。
pause
