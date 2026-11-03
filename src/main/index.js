const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { processImageCompression } = require('./services/compressor');
const HistoryManager = require('./services/history');

let mainWindow = null;
let historyManager = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1080,
    minHeight: 700,
    backgroundColor: '#121316',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  historyManager = new HistoryManager();

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

// Diálogos de selección
ipcMain.handle('dialog:selectFiles', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Seleccionar Imágenes',
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Imágenes', extensions: ['png', 'jpg', 'jpeg', 'webp', 'avif', 'bmp', 'tiff'] }
    ]
  });
  return result.filePaths;
});

ipcMain.handle('dialog:selectFolder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Seleccionar Carpeta con Imágenes',
    properties: ['openDirectory']
  });
  if (result.canceled || result.filePaths.length === 0) return [];
  const folder = result.filePaths[0];
  const exts = ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.bmp', '.tiff'];
  const files = fs.readdirSync(folder)
    .filter(f => exts.includes(path.extname(f).toLowerCase()))
    .map(f => path.join(folder, f));
  return files;
});

ipcMain.handle('dialog:selectOutputFolder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Seleccionar Carpeta de Destino',
    properties: ['openDirectory', 'createDirectory']
  });
  return result.canceled ? null : result.filePaths[0];
});

// Operaciones del motor de compresión
ipcMain.handle('engine:compress', async (_, options) => {
  return await processImageCompression(options);
});

ipcMain.handle('engine:save', async (_, { bufferBase64, outputPath }) => {
  try {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const buf = Buffer.from(bufferBase64, 'base64');
    fs.writeFileSync(outputPath, buf);
    return { success: true, path: outputPath };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// Comparar presets reales para la tabla de resultados
ipcMain.handle('engine:comparePresets', async (_, filePath) => {
  const presets = [
    { format: 'webp', mode: 'lossless', quality: 100, label: 'WebP Lossless' },
    { format: 'webp', mode: 'quality', quality: 95, label: 'WebP 95%' },
    { format: 'webp', mode: 'quality', quality: 90, label: 'WebP 90%' },
    { format: 'avif', mode: 'lossless', quality: 100, label: 'AVIF Lossless' },
    { format: 'avif', mode: 'quality', quality: 95, label: 'AVIF 95%' },
    { format: 'avif', mode: 'quality', quality: 90, label: 'AVIF 90%' },
    { format: 'png', mode: 'lossless', quality: 100, label: 'PNG Optimizado' }
  ];

  const results = [];
  for (const p of presets) {
    try {
      const res = await processImageCompression({
        filePath,
        mode: p.mode,
        quality: p.quality,
        format: p.format
      });
      results.push({
        label: p.label,
        format: res.format,
        mode: res.mode,
        quality: p.quality,
        finalSize: res.finalSize,
        savedBytes: res.savedBytes,
        reductionPercent: res.reductionPercent,
        timeTaken: res.timeTaken,
        integrity: res.integrity,
        bufferBase64: res.outputBufferBase64
      });
    } catch (e) {
      console.error('Error preset:', p.label, e.message);
    }
  }
  return results;
});

// Historial
ipcMain.handle('history:get', () => historyManager.getRecords());
ipcMain.handle('history:clear', () => historyManager.clear());
ipcMain.handle('history:delete', (_, id) => historyManager.deleteRecord(id));
ipcMain.handle('shell:openPath', (_, filePath) => {
  if (fs.existsSync(filePath)) {
    shell.showItemInFolder(filePath);
    return true;
  }
  return false;
});

// Estadísticas globales agregadas
ipcMain.handle('stats:get', () => {
  const records = historyManager.getRecords();
  const totalImages = records.length;
  const totalSavedBytes = records.reduce((acc, r) => acc + (r.savedBytes > 0 ? r.savedBytes : 0), 0);
  const totalOriginalBytes = records.reduce((acc, r) => acc + r.originalSize, 0);
  const avgReduction = totalOriginalBytes > 0 ? ((totalSavedBytes / totalOriginalBytes) * 100).toFixed(1) : 0;
  const totalTimeMs = records.reduce((acc, r) => acc + (r.timeTaken || 0), 0);
  
  // Formato más usado
  const formats = {};
  records.forEach(r => { formats[r.format] = (formats[r.format] || 0) + 1; });
  let mostUsedFormat = 'Ninguno';
  let maxCount = 0;
  for (const [fmt, cnt] of Object.entries(formats)) {
    if (cnt > maxCount) {
      mostUsedFormat = fmt.toUpperCase();
      maxCount = cnt;
    }
  }

  return {
    totalImages,
    totalSavedBytes,
    avgReduction,
    totalTimeSeconds: (totalTimeMs / 1000).toFixed(1),
    mostUsedFormat,
    recentActivity: records.slice(0, 5)
  };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
