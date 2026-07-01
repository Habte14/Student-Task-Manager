@echo off
cd /d "%~dp0"
echo Starting Task Manager...
echo This window must stay open while you use the app.
echo.
call npm run dev:all
pause
