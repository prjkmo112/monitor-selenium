# 📘 monitor-selenium

> Selenium WebDriver 모니터링 유틸리티

`monitor-selenium`은 E2E 테스트나 웹 자동화 시, 특정 트리거(예: 페이지 이동, 클릭, 입력 등)에 따라 자동으로 스크린샷을 찍고 저장해주는 미들웨어 스타일의 유틸리티입니다.  
테스트 실패 시 디버깅을 쉽게 하며, 로그를 자동화하여 QA와 CI/CD 파이프라인을 보완합니다.

---

## ✨ 주요 기능

- 🖼 `driver.get()`, `click()`, `submit()`, `sendKeys()` 등 실행 전 자동 스크린샷
- ⏱ 인터벌 기반 주기적 스크린샷 저장
- 📂 저장 디렉토리/파일명 포맷 커스터마이징
- 🧪 기존 WebDriver 인스턴스를 래핑하여 미들웨어처럼 사용 가능
- 🔌 테스트 종료 시 자동 캡처 (onExit)
- 📄 HTML DOM Snapshot 저장 (일부 옵션)

---

## 📦 설치

```bash
npm install monitor-selenium
# 또는
yarn add monitor-selenium
```

---

## 🚀 사용 예시

```ts
import { Builder } from 'selenium-webdriver';
import { ScreenshotMonitor } from 'monitor-selenium';

const driver = await new Builder().forBrowser('chrome').build();

const monitor = new ScreenshotMonitor(driver, {
  onBeforeGet: true,
  onBeforeClick: true,
  onBeforeSendKeys: true,
  interval: 5000,
  dir: './screenshots',
  filename: "test_screenshot_%date%__%idx%",
  log: console.log,
});

monitor.monitor();

await driver.get('https://example.com');
const input = await driver.findElement({ name: 'q' });
await input.sendKeys('ChatGPT');
await input.submit();
await driver.quit();
```

---

## ⚙️ 설정 옵션

| 옵션명              | 설명 |
|--------------------|------|
| `onExit`           | `driver.quit()` 직전 스크린샷 저장 여부 |
| `onBeforeGet`      | `driver.get()` 전 스크린샷 저장 여부 |
| `onBeforeClick`    | `.click()` 호출 전 스크린샷 저장 |
| `onBeforeSubmit`   | `.submit()` 호출 전 스크린샷 저장 |
| `onBeforeSendKeys` | `.sendKeys()` 전 스크린샷 저장 |
| `interval`         | ms 단위 주기적 캡처 (0이면 비활성화) |
| `dir`              | 스크린샷 저장 경로 |
| `filename`         | 저장 파일명 포맷 |
| `takeScreenshot`   | (선택) 커스텀 스크린샷 함수 |
| `log`              | 로그 출력 함수 (예: `console.log`) |

📌 파일명 포맷 지원:
- `%idx%`: 자동 증가 인덱스 (0, 1, 2, ...)
- `%date%`: 현재 날짜 (예: 2025-07-21)
- `%datetime%`: ISO 타임스탬프 (예: 2025-07-21T12:34:56.789Z)
- `%timestamp%`: 유닉스 시간(ms) (예: 1721541234567)
- `%event%`: 트리거된 이벤트 이름 (예: click, submit, interval 등)

---

## 🧪 테스트 실행

```bash
npm install
npm run test
```

- `jest`를 사용한 테스트 코드 포함
- `test/screenshots/` 폴더에 결과 저장됨

---

## 📁 디렉토리 구조 예시

```
monitor-selenium/
├── src/                 # 주요 소스 코드
│   └── app/monitor/
│       └── MonitorSelenium.ts
├── test/
│   └── e2e/
│       └── screenshot-monitor.test.ts
├── dist/                # 빌드 결과물 (esm/cjs)
├── screenshots/         # 실행 시 생성되는 캡처 이미지
├── package.json
└── README.md
```

---

## 🧱 기술 스택 및 빌드

- TypeScript
- Rollup (ESM + CJS 동시 지원)
- Jest (테스트 프레임워크)
- Node >=16

```bash
npm run build
```
