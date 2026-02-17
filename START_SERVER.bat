@echo off
REM EdgeNudge Local Server Launcher
REM Starts a simple HTTP server on port 8000

echo.
echo ===============================================
echo   EdgeNudge - Starting Local Server
echo ===============================================
echo.
echo Opening browser in 3 seconds...
echo Server will run on: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ===============================================
echo.

cd /d "%~dp0frontend"

REM Wait 3 seconds then open browser
timeout /t 3 /nobreak >nul
start http://localhost:8000

REM Start Python HTTP server
python -m http.server 8000
