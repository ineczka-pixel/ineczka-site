import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results/artifacts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    [process.env.CI ? 'list' : 'line'],
    ['html', { outputFolder: 'test-results/html', open: 'never' }],
    ['json', { outputFile: process.env.PW_JSON || 'test-results/results.json' }],
  ],
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Google Fonts идут через прокси песочницы с собственным CA
    ignoreHTTPSErrors: true,
    // PW_CHANNEL=chrome — прогон в настоящем Google Chrome (с кодеком H.264)
    ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}),
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: 'disabled' },
  },
  snapshotPathTemplate: '{testDir}/__snapshots__/{arg}{ext}',
  projects: [
    // 1. Функциональные тесты — должны быть зелёными всегда (блокируют коммит).
    { name: 'e2e-desktop', testDir: './tests/e2e', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'e2e-mobile', testDir: './tests/e2e', use: { ...devices['Pixel 7'] } },
    // 2. Визуальная регрессия — сравнение с эталонными скриншотами.
    { name: 'visual', testDir: './tests/visual', use: { ...devices['Desktop Chrome'] } },
    // 3. Аудит — не падает, а собирает предупреждения (known issues) в отчёт.
    { name: 'audit', testDir: './tests/audit', use: { ...devices['Desktop Chrome'] } },
    // 4. Съёмка скриншотов для ручной проверки человеком (review/index.html).
    { name: 'review', testDir: './tests/review', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `node scripts/serve.mjs ${PORT}`,
    url: `http://localhost:${PORT}/index.html`,
    reuseExistingServer: !process.env.CI,
  },
});
