const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  selectFiles: () => ipcRenderer.invoke('dialog:selectFiles'),
  selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
  selectOutputFolder: () => ipcRenderer.invoke('dialog:selectOutputFolder'),
  
  compressImage: (options) => ipcRenderer.invoke('engine:compress', options),
  saveCompressedFile: (options) => ipcRenderer.invoke('engine:save', options),
  comparePresets: (filePath) => ipcRenderer.invoke('engine:comparePresets', filePath),
  
  getHistory: () => ipcRenderer.invoke('history:get'),
  clearHistory: () => ipcRenderer.invoke('history:clear'),
  deleteHistoryItem: (id) => ipcRenderer.invoke('history:delete', id),
  openFileInExplorer: (filePath) => ipcRenderer.invoke('shell:openPath', filePath),
  
  getAppStats: () => ipcRenderer.invoke('stats:get'),
});
