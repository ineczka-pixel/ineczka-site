// Съёмка скриншотов для ручной проверки человеком: review/screenshots/*.jpg
// Затем scripts/build-review.mjs собирает review/index.html. См. docs/testing/human-review.md
import { test } from '@playwright/test';
import fs from 'node:fs';
import { openSite, SECTIONS } from '../helpers/site';

const OUT = 'review/screenshots';
const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

test.beforeAll(() => {
  fs.mkdirSync(OUT, { recursive: true });
  // картинка превью ссылки (og:image) — показываем как есть
  fs.copyFileSync('assets/og-image.jpg', `${OUT}/og-image.jpg`);
});

for (const vp of VIEWPORTS) {
  test(`секции — ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await openSite(page, { fonts: true });
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    for (const id of SECTIONS) {
      await page.locator(`#${id}`).screenshot({ path: `${OUT}/${id}-${vp.name}.jpg`, type: 'jpeg', quality: 70 });
    }
    await page.screenshot({ path: `${OUT}/full-${vp.name}.jpg`, type: 'jpeg', quality: 55, fullPage: true });
  });
}

test('состояния лайтбокса', async ({ page }) => {
  for (const vp of [VIEWPORTS[0], VIEWPORTS[2]]) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await openSite(page, { fonts: true });
    await page.locator('#handmade .gallery-btn').nth(4).click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/lightbox-image-${vp.name}.jpg`, type: 'jpeg', quality: 70 });
    await page.keyboard.press('Escape');
    await page.locator('.contact-sheet').nth(1).locator('.gallery-btn').nth(5).click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/lightbox-storyboard-${vp.name}.jpg`, type: 'jpeg', quality: 70 });
    await page.keyboard.press('Escape');
  }
});
