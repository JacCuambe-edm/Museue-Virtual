@echo off
echo Iniciando Museu Virtual da EDM...
echo.

start "Backend API" cmd /k "cd /d %~dp0backend && node index.js"
timeout /t 2 >nul

start "Frontend Vite" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo Backend:  http://localhost:5050
echo Frontend: http://localhost:5173
echo.
