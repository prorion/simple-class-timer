// Context Isolation을 위한 preload 스크립트
const { contextBridge, ipcRenderer } = require('electron');

// 렌더러 프로세스에서 사용할 API 노출
contextBridge.exposeInMainWorld('electronAPI', {
  toggleFullscreen: () => ipcRenderer.send('toggle-fullscreen'),
  onFullscreenChange: (callback) => ipcRenderer.on('fullscreen-changed', callback)
});
