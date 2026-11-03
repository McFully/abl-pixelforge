@echo off
title Lanzador ABL PIXELFORGE
echo Iniciando ABL PIXELFORGE para Windows 11...
set NODE_ENV=production
npm run build:renderer
start "" npx electron src/main/index.js
exit
