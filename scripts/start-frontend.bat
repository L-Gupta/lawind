@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0\.."
set "ROOT=%cd%"
set "LOG=%ROOT%\logs\frontend.log"

if not exist "%ROOT%\logs" mkdir "%ROOT%\logs"

echo [%date% %time%] === Lawind Frontend ===
echo Logging to: %LOG%
echo.>> "%LOG%"
echo [%date% %time%] === Frontend session started ===>> "%LOG%"

if not exist "%ROOT%\frontend\package.json" (
    echo [ERROR] frontend\package.json not found. Are you in the correct repo?
    echo [%date% %time%] ERROR: frontend package.json not found>> "%LOG%"
    pause
    exit /b 1
)

if not exist "%ROOT%\frontend\node_modules" (
    echo [WARN] node_modules not found. Running npm install...
    echo [%date% %time%] WARN: node_modules missing, running npm install>> "%LOG%"
    cd /d "%ROOT%\frontend"
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed.
        echo [%date% %time%] ERROR: npm install failed>> "%LOG%"
        pause
        exit /b 1
    )
    echo [%date% %time%] npm install completed>> "%LOG%"
)

cd /d "%ROOT%\frontend"

echo Starting Next.js dev server on http://localhost:8600 ...
echo [%date% %time%] Running: npm run dev>> "%LOG%"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "npm run dev 2>&1 | ForEach-Object { $_; Add-Content -Path '%LOG%' -Value ((Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + ' ' + $_) }"

echo.
echo [%date% %time%] Frontend stopped.
echo [%date% %time%] === Frontend session ended ===>> "%LOG%"
pause
