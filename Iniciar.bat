@echo off
title ABL PIXELFORGE
cd /d "%~dp0"

if exist "release\win-unpacked\PIXELFORGE.exe" (
    start "" "release\win-unpacked\PIXELFORGE.exe"
    exit
)

call npm run build:renderer
start "" npx electron src/main/index.js
exit
