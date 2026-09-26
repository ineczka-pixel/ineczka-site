// Фича: docs/features/page-structure.md, docs/features/assets.md
import { test, expect } from '@playwright/test';
import { openSite, SECTIONS } from '../helpers/site';

test.describe('Загрузка страницы', () => {
  test('страница открывается без JS-ошибок и 404', async ({ page }) => {
    const { errors, failed } = await openSite(page);
    await page.waitForLoadState('networkidle');
    expect(errors, 'ошибки в консоли').toEqual([]);
    expect(failed, 'локальные файлы, вернувшие ошибку').toEqual([]);
  });

  test('заголовок, язык и мета viewport', async ({ page }) => {
    await openSite(page);
    await expect(page).toHaveTitle('Ineczka — AI-CREATOR и Handmade');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /width=device-width/);
  });

  test('все секции присутствуют в правильном порядке', async ({ page }) => {
    await openSite(page);
    const ids = await page.locator('section[id]').evaluateAll((els) => els.map((e) => e.id));
    expect(ids).toEqual([...SECTIONS]);
  });

  test('ровно один h1', async ({ page }) => {
    await openSite(page);
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('все изображения реально загрузились (naturalWidth > 0)', async ({ page }) => {
    await openSite(page);
    // lazy-картинок нет, но прокрутим на всякий случай
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForLoadState('networkidle');
    const broken = await page.locator('img').evaluateAll((imgs) =>
      (imgs as HTMLImageElement[])
        .filter((i) => i.id !== 'lightbox-image')
        .filter((i) => !i.complete || i.naturalWidth === 0)
        .map((i) => i.getAttribute('src')));
    expect(broken).toEqual([]);
  });

  test('декоративные кляксы (CSS background) доступны', async ({ request }) => {
    for (const f of ['assets/splash-purple.png', 'assets/splash-olive.png']) {
      expect((await request.get(f)).status(), f).toBe(200);
    }
  });

  test('видео-файлы из data-video-src существуют', async ({ page, request }) => {
    await openSite(page);
    const srcs = await page.locator('[data-video-src]').evaluateAll((els) => els.map((e) => e.getAttribute('data-video-src')!));
    expect(srcs.length).toBeGreaterThan(0);
    for (const s of srcs) {
      const r = await request.head(s);
      expect(r.status(), s).toBe(200);
      expect(r.headers()['content-type']).toContain('video/mp4');
    }
  });
});
