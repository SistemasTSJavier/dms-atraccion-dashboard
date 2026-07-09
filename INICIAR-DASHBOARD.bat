@echo off
title DMS Atraccion - Dashboard
cd /d "%~dp0"

echo ========================================
echo   DMS Atraccion - Dashboard
echo ========================================
echo.
echo Carpeta: %CD%
echo.

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js no esta instalado.
    echo Descargalo de: https://nodejs.org/
    pause
    exit /b 1
)

if not exist "package.json" (
    echo [ERROR] No se encontro package.json en esta carpeta.
    echo Asegurate de ejecutar este archivo desde la carpeta "dashboard".
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo Instalando dependencias por primera vez...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Fallo npm install
        pause
        exit /b 1
    )
    echo.
)

echo Iniciando dashboard...
echo Abre en el navegador: http://localhost:5173
echo.
echo Para cerrar, presiona Ctrl+C en esta ventana.
echo.

call npm run dev

pause
