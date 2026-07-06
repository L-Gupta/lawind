@echo off
setlocal EnableDelayedExpansion

cd /d "%~dp0"
set "ROOT=%~dp0"
set "LOG_DIR=%ROOT%logs"
set "STARTUP_LOG=%LOG_DIR%\startup.log"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

call :log "========================================"
call :log "Lawind dev environment startup"
call :log "Root: %ROOT%"

call :check_docker
call :check_venv
call :check_frontend_deps

call :log "Launching service windows..."

start "Lawind Database" cmd /k "%ROOT%scripts\start-database.bat"
timeout /t 2 /nobreak >nul
start "Lawind Backend" cmd /k "%ROOT%scripts\start-backend.bat"
timeout /t 1 /nobreak >nul
start "Lawind Frontend" cmd /k "%ROOT%scripts\start-frontend.bat"

call :log "All service windows launched"

echo.
echo ========================================
echo  Lawind AI - Development Servers
echo ========================================
echo.
echo  Database: PostgreSQL localhost:5432, Qdrant http://localhost:6333
echo  Backend:  http://localhost:8500  (API docs at /docs)
echo  Frontend: http://localhost:8600
echo.
echo  Logs: %LOG_DIR%\
echo    startup.log, database.log, backend.log, frontend.log
echo.
echo  Close each service window to stop that service.
echo ========================================
echo.

call :log "Startup complete"
endlocal
exit /b 0

:log
echo [%date% %time%] %~1
echo [%date% %time%] %~1>> "%STARTUP_LOG%"
exit /b 0

:check_docker
where docker >nul 2>&1
if errorlevel 1 (
    call :log "WARN: Docker not found - database window will show setup instructions"
) else (
    docker info >nul 2>&1
    if errorlevel 1 (
        call :log "WARN: Docker installed but daemon not running"
    ) else (
        call :log "OK: Docker is available"
    )
)
exit /b 0

:check_venv
if exist "%ROOT%venv\Scripts\activate.bat" (
    call :log "OK: Python venv found"
) else (
    call :log "WARN: Python venv not found at venv\ - backend will fail until created"
)
exit /b 0

:check_frontend_deps
if exist "%ROOT%frontend\node_modules" (
    call :log "OK: frontend node_modules found"
) else (
    call :log "WARN: frontend/node_modules missing - frontend window will run npm install"
)
exit /b 0
