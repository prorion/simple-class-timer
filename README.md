# 강의용 타이머 프로그램

[Tauri](https://v2.tauri.app/) 기반의 간단한 강의용 타이머(시계·상태 표시) 앱입니다.

## 기능

- **현재 시간 표시**: 실시간 HH:MM:SS
- **자동 상태·배경색**: 수업 전 / 수업 중 / 쉬는 시간 / 점심 / 종료 구간
- **항상 위**: 다른 창 위에 표시
- **더블클릭**: 전체화면 전환
- **우클릭**: 전체화면·윈도우 모드·종료(네이티브 메뉴)

## 요구 사항

- [Rust](https://www.rust-lang.org/tools/install) (프로젝트는 `rust-version = "1.77.2"` 이상을 가정)
- Node.js 22.x (예: nvm으로 관리)
- Windows: WebView2(대부분 설치됨). 설치 파일 빌드 시 부트스트랩 옵션은 `tauri.conf.json`의 `bundle.windows.webviewInstallMode`를 참고하세요.

## 개발 실행

```powershell
npm install
npm run dev
```

## Windows 설치 파일 빌드

```powershell
npm run build
```

생성물은 `src-tauri\target\release\bundle\nsis\` 아래 NSIS 설치 프로그램(예: `Class Timer_*_x64-setup.exe`)입니다. 실행 파일만 필요하면 `src-tauri\target\release\simple-class-timer.exe`를 사용하면 됩니다.

## 프로젝트 구조

```
simple-class-timer/
├── src-tauri/           # Rust + Tauri 설정
│   ├── src/
│   ├── capabilities/
│   └── tauri.conf.json
├── index.html
├── styles.css
├── renderer.js
├── package.json
└── README.md
```

## 라이선스

ISC
