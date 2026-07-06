@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0\.."
set "ROOT=%cd%"
set "LOG=%ROOT%\logs\database.log"

if not exist "%ROOT%\logs" mkdir "%ROOT%\logs"

echo [%date% %time%] === Lawind Database Services ===
echo Logging to: %LOG%
echo.>> "%LOG%"
echo [%date% %time%] === Database session started ===>> "%LOG%"

where docker >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker not found. Install Docker Desktop and ensure it is in PATH.
    echo [%date% %time%] ERROR: Docker not found>> "%LOG%"
    pause
    exit /b 1
)

docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker daemon is not running. Start Docker Desktop first.
    echo [%date% %time%] ERROR: Docker daemon not running>> "%LOG%"
    pause
    exit /b 1
)

echo Starting PostgreSQL ^(port 5432^) and Qdrant ^(port 6333^)...
echo [%date% %time%] Running: docker compose up>> "%LOG%"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "docker compose up 2>&1 | ForEach-Object { $_; Add-Content -Path '%LOG%' -Value ((Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + ' ' + $_) }"

echo.
echo [%date% %time%] Database services stopped.
echo [%date% %time%] === Database session ended ===>> "%LOG%"
pause
