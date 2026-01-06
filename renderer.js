// DOM 요소
const timeDisplay = document.getElementById('time-display');
const statusDisplay = document.getElementById('status-display');
const app = document.getElementById('app');

// 시간 업데이트 함수
function updateTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // 시간 표시 (HH:MM:SS 형식)
  const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  timeDisplay.textContent = timeString;

  // 상태 판단 및 UI 업데이트
  updateStatus(hours, minutes, seconds);
}

// 상태 업데이트 함수
function updateStatus(hours, minutes, seconds) {
  let status = '';
  let className = '';

  // 오전 9시 이전
  if (hours < 9) {
    status = 'READY TIME';
    className = 'before-class';
  }
  // 오후 5시 50분(17:50) 이후
  else if (hours > 17 || (hours === 17 && minutes >= 50)) {
    status = 'SESSION ENDED';
    className = 'after-class';
  }
  // 점심 시간 (11:50 ~ 12:59:59)
  else if ((hours === 11 && minutes >= 50) || hours === 12) {
    status = 'LUNCH BREAK';
    className = 'lunch-time';
  }
  // 쉬는 시간 (매 시 50분 ~ 59분 59초)
  else if (minutes >= 50) {
    status = 'BREAK TIME';
    className = 'break-time';
  }
  // 수업 시간 (정각 ~ 49분 49초)
  else {
    status = 'LEARNING TIME';
    className = 'in-class';
  }

  // UI 업데이트
  statusDisplay.textContent = status;
  app.className = className;
}

// 초기 실행 및 1초마다 업데이트
updateTime();
setInterval(updateTime, 1000);

// 더블클릭으로 전체화면 토글
app.addEventListener('dblclick', () => {
  if (window.electronAPI) {
    window.electronAPI.toggleFullscreen();
  }
});

// 우클릭으로 컨텍스트 메뉴 표시
app.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if (window.electronAPI) {
    window.electronAPI.showContextMenu();
  }
});

// 전체화면 상태 변경 감지
if (window.electronAPI) {
  window.electronAPI.onFullscreenChange((event, isFullScreen) => {
    if (isFullScreen) {
      document.body.classList.add('fullscreen');
    } else {
      document.body.classList.remove('fullscreen');
    }
  });
}
