@echo off
setlocal

cd /d "%~dp0"

echo Starting Lawind AI servers...
echo.

start "Lawind Backend" cmd /k cd /d "%~dp0" ^&^& call venv\Scripts\activate.bat ^&^& cd backend ^&^& uvicorn main:app --reload --host 0.0.0.0 --port 8500

start "Lawind Frontend" cmd /k cd /d "%~dp0frontend" ^&^& npm run dev

echo.
echo Backend:  http://localhost:8500  (API docs at /docs)
echo Frontend: http://localhost:8600
echo.
echo Both servers are starting in separate windows.
echo Close those windows to stop the servers.

endlocal
