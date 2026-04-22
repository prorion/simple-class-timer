(() => {
  if (window.__CLASS_TIMER_INITIALIZED__) return;
  window.__CLASS_TIMER_INITIALIZED__ = true;

  const timeDisplay = document.getElementById('time-display');
  const statusDisplay = document.getElementById('status-display');
  const app = document.getElementById('app');

  const isTauri = () => Boolean(window.__TAURI__);

  const updateStatus = (hours, minutes) => {
    let status = '';
    let className = '';

    if (hours < 9) {
      status = 'READY TIME';
      className = 'before-class';
    } else if (hours > 17 || (hours === 17 && minutes >= 50)) {
      status = 'SESSION ENDED';
      className = 'after-class';
    } else if ((hours === 11 && minutes >= 50) || hours === 12) {
      status = 'LUNCH BREAK';
      className = 'lunch-time';
    } else if (minutes >= 50) {
      status = 'BREAK TIME';
      className = 'break-time';
    } else {
      status = 'LEARNING TIME';
      className = 'in-class';
    }

    statusDisplay.textContent = status;
    app.className = className;
  };

  const updateTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    timeDisplay.textContent =
      `${String(hours).padStart(2, '0')}:` +
      `${String(minutes).padStart(2, '0')}:` +
      `${String(seconds).padStart(2, '0')}`;

    updateStatus(hours, minutes);
  };

  updateTime();
  setInterval(updateTime, 1000);

  const syncFullscreenBody = async () => {
    if (!isTauri()) return;
    const win = window.__TAURI__.window.getCurrentWindow();
    const on = await win.isFullscreen();
    document.body.classList.toggle('fullscreen', on);
  };

  (async () => {
    if (!isTauri()) return;
    const win = window.__TAURI__.window.getCurrentWindow();
    await syncFullscreenBody();
    await win.onResized(() => {
      void syncFullscreenBody();
    });
  })();

  app.addEventListener('dblclick', () => {
    void (async () => {
      if (!isTauri()) return;
      const win = window.__TAURI__.window.getCurrentWindow();
      const next = !(await win.isFullscreen());
      await win.setFullscreen(next);
      document.body.classList.toggle('fullscreen', next);
    })();
  });

  app.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    void (async () => {
      if (!isTauri()) return;

      const { Menu } = window.__TAURI__.menu;
      const win = window.__TAURI__.window.getCurrentWindow();
      const [fs, decorated] = await Promise.all([
        win.isFullscreen(),
        win.isDecorated(),
      ]);

      const menu = await Menu.new({
        items: [
          {
            id: 'enter_fs',
            text: '전체화면 보기',
            enabled: !fs,
            action: async () => {
              await win.setFullscreen(true);
              document.body.classList.add('fullscreen');
            },
          },
          {
            id: 'leave_fs',
            text: '윈도우 모드로 보기',
            enabled: fs,
            action: async () => {
              await win.setFullscreen(false);
              document.body.classList.remove('fullscreen');
            },
          },
          { item: 'Separator' },
          {
            id: 'toggle_decorations',
            text: decorated ? '타이틀바 숨기기' : '타이틀바 보이기',
            enabled: !fs,
            action: async () => {
              await win.setDecorations(!decorated);
            },
          },
          { item: 'Separator' },
          {
            id: 'quit',
            text: '종료',
            action: () => {
              void window.__TAURI__.core.invoke('quit');
            },
          },
        ],
      });

      await menu.popup(undefined, win);
    })();
  });
})();
