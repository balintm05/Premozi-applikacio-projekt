@echo off
title Premozi Launcher
color 0A
cls

:: ============== CONFIGURATION ==============
set BACKEND_FOLDER="ReactApp1.Server"
set FRONTEND_FOLDER="reactapp1.client"
set BROWSER="chrome.exe"
set BACKEND_URL="https://localhost:7153/swagger"
set FRONTEND_URL="https://localhost:60769"
set BACKEND_API_URL="https://localhost:7153"

:: ============== PATH SETUP ==============
set "BATCH_DIR=%~dp0"
cd /d "%BATCH_DIR%"
set BACKEND_PATH=%BATCH_DIR%%BACKEND_FOLDER%
set FRONTEND_PATH=%BATCH_DIR%%FRONTEND_FOLDER%

:: ============== BACKEND STARTUP ==============
echo Starting ASP.NET Core backend...
echo Backend path: %BACKEND_PATH%
start "Backend Server" cmd /k "cd /d %BACKEND_PATH% && dotnet watch run --urls=https://localhost:7153"
timeout /t 10 >nul

:: ============== FRONTEND STARTUP ==============
echo Starting Vite React frontend...
echo Frontend path: %FRONTEND_PATH%
start "Frontend Server" cmd /k "cd /d %FRONTEND_PATH% && npm run dev -- --port 60769"

:: Wait for both servers to initialize
timeout /t 5 >nul

:: ============== OPEN BROWSER WINDOWS ==============
echo Launching Frontend...
start "" %BROWSER% %FRONTEND_URL%

:: ============== STATUS ==============
echo.
echo ============ APPLICATION STATUS ============
echo Backend (Swagger): %BACKEND_URL%
echo Frontend: %FRONTEND_URL%
echo.
echo Both servers are running in separate command windows.
echo Close those windows to stop the servers.
echo.
timeout /t 5 >nul
exit