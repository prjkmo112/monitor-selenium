# 📘 monitor-selenium

> A monitoring utility to Selenium WebDriver.

`monitor-selenium` is a middleware-style utility that automatically captures and saves screenshots during E2E testing or web automation, triggered by events such as page navigation, clicking, input, etc.  
It helps with debugging failed tests and streamlines logging in QA and CI/CD pipelines.

---

## ✨ Features

- 🖼 Automatically capture screenshots before `driver.get()`, `click()`, `submit()`, `sendKeys()`, etc.
- ⏱ Save screenshots periodically using interval triggers
- 📂 Customize storage directory and filename format
- 🧪 Wraps an existing WebDriver instance like a middleware
- 🔌 Automatically capture screenshot before driver quits (`onExit`)
- 📄 Save HTML DOM snapshot (some options)

---

## 📦 Installation

```bash
npm install monitor-selenium
# or
yarn add monitor-selenium
```

---

## 🚀 Usage Example

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

## ⚙️ Configuration Options

| Option              | Description |
|---------------------|-------------|
| `onExit`            | Capture screenshot before `driver.quit()` |
| `onBeforeGet`       | Capture before `driver.get()` |
| `onBeforeClick`     | Capture before `.click()` |
| `onBeforeSubmit`    | Capture before `.submit()` |
| `onBeforeSendKeys`  | Capture before `.sendKeys()` |
| `interval`          | Periodic capture in milliseconds (0 to disable) |
| `dir`               | Directory to store screenshots |
| `filename`          | Filename format |
| `takeScreenshot`    | (Optional) Custom screenshot function |
| `log`               | Logging function (e.g., `console.log`) |

📌 Supported filename format tokens:
- `%idx%`: Incremental index (0, 1, 2, ...)
- `%date%`: Current date (e.g., 2025-07-21)
- `%datetime%`: ISO timestamp (e.g., 2025-07-21T12:34:56.789Z)
- `%timestamp%`: Unix epoch time in milliseconds
- `%event%`: Triggering event name (e.g., click, submit, interval)

---

## 🧪 Running Tests

```bash
npm install
npm run test
```

- Includes test cases using `jest`
- Captured screenshots are stored in `test/screenshots/`

---

## 📁 Directory Structure Example

```
monitor-selenium/
├── src/                 # Source code
│   └── app/monitor/
│       └── MonitorSelenium.ts
├── test/
│   └── e2e/
│       └── screenshot-monitor.test.ts
├── dist/                # Build output (esm/cjs)
├── screenshots/         # Auto-generated screenshots
├── package.json
└── README.md
```

---

## 🧱 Tech Stack & Build

- TypeScript
- Rollup (ESM + CJS dual build)
- Jest (Test framework)
- Node >=16

```bash
npm run build
```
