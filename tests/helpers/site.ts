import { Page, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/** Локальный кэш Google Fonts: делает скриншоты детерминированными и не зависит от сети. */
const FONT_CACHE = path.join(__dirname, '..', 'fixtures', 'fonts');

/** Все секции страницы — единый источник правды для тестов и отчёта. */
export const SECTIONS = ['top', 'ai-creator', 'handmade', 'about', 'contacts'] as const;
export const PORTFOLIO_ANCHORS = [
  'portfolio-illustration', 'portfolio-avatars', 'portfolio-brands',
  'portfolio-video', 'portfolio-artists', 'portfolio-design',
] as const;

/**
 * Открывает страницу и собирает ошибки консоли / упавшие запросы.
 * fonts=false (по умолчанию) — Google Fonts подменяются пустым CSS: функциональным
 * тестам шрифты не нужны, а загрузка через сеть добавляет 5–10 с на каждый тест.
 * Визуальные тесты и съёмка для ревью вызывают openSite(page, { fonts: true }).
 */
export async function openSite(page: Page, { fonts = false }: { fonts?: boolean } = {}) {
  if (!fonts) {
    await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  } else {
    await page.route(/fonts\.(googleapis|gstatic)\.com/, async (route) => {
      const url = route.request().url();
      const key = crypto.createHash('sha1').update(url).digest('hex').slice(0, 16);
      const isCss = url.includes('googleapis');
      const file = path.join(FONT_CACHE, key + (isCss ? '.css' : '.woff2'));
      if (!fs.existsSync(file)) {
        const resp = await route.fetch();
        fs.mkdirSync(FONT_CACHE, { recursive: true });
        fs.writeFileSync(file, await resp.body());
      }
      await route.fulfill({ status: 200, body: fs.readFileSync(file), contentType: isCss ? 'text/css' : 'font/woff2',
        headers: { 'Access-Control-Allow-Origin': '*' } });
    });
  }
  const errors: string[] = [];
  const failed: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    // внешние ресурсы (Google Fonts) не должны ронять тесты — проверяем только свои файлы
    if (m.type() === 'error' && !/^https?:\/\/(?!localhost)/.test(m.location().url || '')) errors.push(m.text());
  });
  page.on('response', (r) => {
    const url = r.url();
    if (url.startsWith('http://localhost') && r.status() >= 400) failed.push(`${r.status()} ${url}`);
  });
  await page.goto('/index.html');
  return { errors, failed };
}

export const overlay = (page: Page) => page.locator('#lightbox-overlay');
export const lbImage = (page: Page) => page.locator('#lightbox-image');
export const lbVideo = (page: Page) => page.locator('#lightbox-video');
export const counter = (page: Page) => page.locator('#lightbox-counter');

export async function expectLightboxClosed(page: Page) {
  await expect(overlay(page)).toBeHidden();
  await expect(lbImage(page)).toBeHidden();
  await expect(lbVideo(page)).toBeHidden();
}
