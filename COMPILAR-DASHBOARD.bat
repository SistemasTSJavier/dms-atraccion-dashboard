@echo off
title DMS Atraccion - Build
cd /d "%~dp0"

echo ========================================
echo   Compilar dashboard para produccion
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
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo Instalando dependencias...
    call npm install
)

echo Compilando...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Fallo el build
    pause
    exit /b 1
)

echo.
echo Listo. Archivos generados en la carpeta "dist"
pause
