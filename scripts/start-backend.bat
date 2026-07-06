@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0\.."
set "ROOT=%cd%"
set "LOG=%ROOT%\logs\backend.log"

if not exist "%ROOT%\logs" mkdir "%ROOT%\logs"

echo [%date% %time%] === Lawind Backend ===
echo Logging to: %LOG%
echo.>> "%LOG%"
echo [%date% %time%] === Backend session started ===>> "%LOG%"

if not exist "%ROOT%\venv\Scripts\activate.bat" (
    echo [ERROR] Virtual environment not found at venv\
    echo Create it with: python -m venv venv
    echo Then: pip install -r backend\requirements.txt
    echo [%date% %time%] ERROR: venv not found>> "%LOG%"
    pause
    exit /b 1
)

call "%ROOT%\venv\Scripts\activate.bat"
cd /d "%ROOT%\backend"

echo Starting uvicorn on http://localhost:8500 ...
echo [%date% %time%] Running: uvicorn main:app --reload --host 0.0.0.0 --port 8500>> "%LOG%"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "uvicorn main:app --reload --host 0.0.0.0 --port 8500 2>&1 | ForEach-Object { $_; Add-Content -Path '%LOG%' -Value ((Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + ' ' + $_) }"

echo.
echo [%date% %time%] Backend stopped.
echo [%date% %time%] === Backend session ended ===>> "%LOG%"
pause
