const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 250,
    frame: true,
    alwaysOnTop: true,  // 항상 최상단에 위치
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
  
  // 개발 중에는 주석 해제하여 DevTools 사용 가능
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  // 메뉴바 숨기기
  Menu.setApplicationMenu(null);
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 전체화면 토글 IPC 핸들러
ipcMain.on('toggle-fullscreen', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    const isFullScreen = !win.isFullScreen();
    win.setFullScreen(isFullScreen);
    // 전체화면 상태 변경을 렌더러에 알림
    event.sender.send('fullscreen-changed', isFullScreen);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
