@echo off
echo Starting Python AI Tutor Server...
echo.
echo Open your browser and go to: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Try Node.js http-server
where npx >nul 2>nul
if %errorlevel% equ 0 (
    echo Using Node.js http-server...
    npx http-server docs -p 8000 -o
    goto :end
)

REM Try Python
python --version >nul 2>nul
if %errorlevel% equ 0 (
    echo Using Python HTTP server...
    cd docs
    python -m http.server 8000
    goto :end
)

REM Try python3
python3 --version >nul 2>nul
if %errorlevel% equ 0 (
    echo Using Python3 HTTP server...
    cd docs
    python3 -m http.server 8000
    goto :end
)

echo ERROR: Neither Node.js nor Python found!
echo.
echo Please install one of these:
echo   - Node.js: https://nodejs.org/
echo   - Python: https://www.python.org/downloads/
echo.
echo Or use VS Code "Live Server" extension.
pause

:end
