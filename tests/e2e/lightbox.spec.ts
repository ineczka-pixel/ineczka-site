// Фича: docs/features/lightbox.md, docs/features/portfolio-galleries.md, docs/features/handmade.md
import { test, expect } from '@playwright/test';
import { openSite, overlay, lbImage, lbVideo, counter, expectLightboxClosed } from '../helpers/site';

const firstHandmade = '#handmade .gallery-btn >> nth=0';
// одиночная работа (без листания) — первое превью в «Для брендов и бизнеса»
const singleWork = '#portfolio-brands .gallery-btn >> nth=0';

test.describe('Лайтбокс: изображения', () => {
  test('по умолчанию закрыт', async ({ page }) => {
    await openSite(page);
    await expectLightboxClosed(page);
  });

  test('клик по работе открывает её в полном размере', async ({ page }) => {
    await openSite(page);
    await page.locator(firstHandmade).click();
    await expect(overlay(page)).toBeVisible();
    await expect(lbImage(page)).toBeVisible();
    await expect(lbImage(page)).toHaveAttribute('src', /handmade-1-motorcycle\.jpg$/);
    await expect(lbImage(page)).toHaveAttribute('alt', 'Мотоцикл — картина из CD-дисков');
    await expect(lbVideo(page)).toBeHidden();
  });

  test('одиночная работа портфолио открывается без стрелок и счётчика', async ({ page }) => {
    await openSite(page);
    await page.locator(singleWork).scrollIntoViewIfNeeded();
    await page.locator(singleWork).click();
    await expect(lbImage(page)).toBeVisible();
    await expect(page.locator('#lightbox-prev')).toBeHidden();
    await expect(page.locator('#lightbox-next')).toBeHidden();
    await expect(counter(page)).toBeHidden();
  });

  test('закрывается кнопкой ×', async ({ page }) => {
    await openSite(page);
    await page.locator(firstHandmade).click();
    await page.getByRole('button', { name: 'Закрыть просмотр' }).click();
    await expectLightboxClosed(page);
  });

  test('закрывается клавишей Escape', async ({ page }) => {
    await openSite(page);
    await page.locator(firstHandmade).click();
    await page.keyboard.press('Escape');
    await expectLightboxClosed(page);
  });

  test('закрывается кликом по затемнению', async ({ page }) => {
    await openSite(page);
    await page.locator(firstHandmade).click();
    await overlay(page).click({ position: { x: 10, y: 10 } });
    await expectLightboxClosed(page);
  });

  test('каждая кнопка галереи открывает именно свою картинку', async ({ page }) => {
    await openSite(page);
    const buttons = page.locator('.gallery-btn:not([data-video-src])[onclick^="openMedia"]');
    const n = await buttons.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      const btn = buttons.nth(i);
      const expected = await btn.locator('img').evaluate((im: HTMLImageElement) => im.currentSrc || im.src);
      await btn.scrollIntoViewIfNeeded();
      await btn.click();
      await expect(lbImage(page)).toHaveAttribute('src', expected);
      await page.keyboard.press('Escape');
      await expectLightboxClosed(page);
    }
  });

  test('каждая кнопка галереи имеет aria-label', async ({ page }) => {
    await openSite(page);
    const noLabel = await page.locator('.gallery-btn').evaluateAll((bs) => bs.filter((b) => !b.getAttribute('aria-label')).length);
    expect(noLabel).toBe(0);
  });
});

test.describe('Лайтбокс: видео', () => {
  test('видео открывается и начинает играть, при закрытии останавливается', async ({ page }) => {
    await openSite(page);
    const btn = page.locator('[data-video-src="assets/video-1.mp4"]');
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await expect(lbVideo(page)).toBeVisible();
    await expect(lbImage(page)).toBeHidden();
    await expect(lbVideo(page)).toHaveAttribute('src', 'assets/video-1.mp4');
    // Chromium из поставки Playwright не содержит H.264 — реальное воспроизведение
    // проверяется только в Google Chrome (PW_CHANNEL=chrome) или человеком (HR-VIDEO-1).
    const h264 = await page.evaluate(() => document.createElement('video').canPlayType('video/mp4; codecs="avc1.42E01E"'));
    if (h264) {
      await expect.poll(() => lbVideo(page).evaluate((v: HTMLVideoElement) => v.readyState), { timeout: 10_000 }).toBeGreaterThan(0);
    } else {
      test.info().annotations.push({ type: 'human-check', description: 'Воспроизведение H.264 не проверено: браузер без кодека. См. HR-VIDEO-1.' });
    }
    await page.keyboard.press('Escape');
    await expectLightboxClosed(page);
    const state = await lbVideo(page).evaluate((v: HTMLVideoElement) => ({ paused: v.paused, src: v.getAttribute('src') }));
    expect(state).toEqual({ paused: true, src: null });
  });

  test('после видео картинка открывается без видео на фоне', async ({ page }) => {
    await openSite(page);
    await page.locator('[data-video-src="assets/video-2.mp4"]').click();
    await page.keyboard.press('Escape');
    await page.locator(firstHandmade).click();
    await expect(lbImage(page)).toBeVisible();
    await expect(lbVideo(page)).toBeHidden();
  });
});

test.describe('Лайтбокс: раскадровки', () => {
  const sheets = [
    { idx: 0, name: 'Книжный магазин', total: 15, prefix: 'storyboard1' },
    { idx: 1, name: 'Мушкетёры', total: 22, prefix: 'storyboard2' },
  ];

  for (const s of sheets) {
    test(`«${s.name}»: ${s.total} кадров, счётчик и листание`, async ({ page }) => {
      await openSite(page);
      const frames = page.locator('.contact-sheet').nth(s.idx).locator('.gallery-btn');
      await expect(frames).toHaveCount(s.total);
      await frames.nth(2).scrollIntoViewIfNeeded();
      await frames.nth(2).click();
      await expect(counter(page)).toHaveText(`Кадр 3 из ${s.total}`);
      await expect(lbImage(page)).toHaveAttribute('src', new RegExp(`${s.prefix}-frame-03\\.jpg$`));
      await page.locator('#lightbox-next').click();
      await expect(counter(page)).toHaveText(`Кадр 4 из ${s.total}`);
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowLeft');
      await expect(counter(page)).toHaveText(`Кадр 2 из ${s.total}`);
      // клик по стрелке не должен закрывать лайтбокс (stopPropagation)
      await expect(overlay(page)).toBeVisible();
    });
  }

  test('границы: на первом кадре «назад» ничего не делает, на последнем — «вперёд»', async ({ page }) => {
    await openSite(page);
    const frames = page.locator('.contact-sheet').first().locator('.gallery-btn');
    await frames.first().click();
    await page.locator('#lightbox-prev').click();
    await expect(counter(page)).toHaveText('Кадр 1 из 15');
    await page.keyboard.press('Escape');
    await frames.last().click();
    await page.keyboard.press('ArrowRight');
    await expect(counter(page)).toHaveText('Кадр 15 из 15');
  });

  test('раскадровки не смешиваются между собой', async ({ page }) => {
    await openSite(page);
    await page.locator('.contact-sheet').nth(1).locator('.gallery-btn').last().click();
    await expect(counter(page)).toHaveText('Кадр 22 из 22');
    await expect(lbImage(page)).toHaveAttribute('src', /storyboard2-frame-22\.jpg$/);
  });

  test('после закрытия раскадровки обычная картинка открывается без стрелок', async ({ page }) => {
    await openSite(page);
    await page.locator('.contact-sheet').first().locator('.gallery-btn').first().click();
    await page.keyboard.press('Escape');
    await page.locator(singleWork).scrollIntoViewIfNeeded();
    await page.locator(singleWork).click();
    await expect(counter(page)).toBeHidden();
    await expect(page.locator('#lightbox-next')).toBeHidden();
  });

  test('свайп пальцем листает раскадровку (HR-IMAGES-3)', async ({ page }) => {
    await openSite(page);
    await page.locator('.contact-sheet').first().locator('.gallery-btn').nth(4).click();
    await expect(counter(page)).toHaveText('Кадр 5 из 15');
    const swipe = (dx: number, dy = 0) => page.evaluate(([dx, dy]) => {
      const el = document.getElementById('lightbox-image')!;
      const t = (x: number, y: number) => new Touch({ identifier: 1, target: el, clientX: x, clientY: y });
      el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [t(200, 300)], changedTouches: [t(200, 300)] }));
      el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches: [], changedTouches: [t(200 + dx, 300 + dy)] }));
    }, [dx, dy]);
    await swipe(-120); // палец влево → следующий кадр
    await expect(counter(page)).toHaveText('Кадр 6 из 15');
    await swipe(120); // палец вправо → предыдущий
    await swipe(120);
    await expect(counter(page)).toHaveText('Кадр 4 из 15');
    await swipe(15); // короткое движение — не свайп
    await swipe(-30, 200); // вертикальное движение — не свайп
    await expect(counter(page)).toHaveText('Кадр 4 из 15');
    await expect(overlay(page)).toBeVisible();
  });

  test('стрелки клавиатуры не работают, когда лайтбокс закрыт', async ({ page }) => {
    await openSite(page);
    await page.keyboard.press('ArrowRight');
    await expectLightboxClosed(page);
  });
});

test.describe('Лайтбокс: картины из CD (Handmade)', () => {
  test('увеличенные картины листаются стрелками, клавишами и свайпом', async ({ page }) => {
    await openSite(page);
    const works = page.locator('#handmade .gallery-btn');
    const total = await works.count();
    await works.nth(1).scrollIntoViewIfNeeded();
    await works.nth(1).click();
    await expect(counter(page)).toHaveText(`Картина 2 из ${total}`);
    const src2 = await works.nth(2).locator('img').getAttribute('src');
    await page.locator('#lightbox-next').click();
    await expect(counter(page)).toHaveText(`Картина 3 из ${total}`);
    await expect(lbImage(page)).toHaveAttribute('src', new RegExp(src2!.replace('.', '\\.') + '$'));
    await page.keyboard.press('ArrowLeft');
    await expect(counter(page)).toHaveText(`Картина 2 из ${total}`);
    await page.evaluate(() => {
      const el = document.getElementById('lightbox-image')!;
      const t = (x: number) => new Touch({ identifier: 1, target: el, clientX: x, clientY: 300 });
      el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [t(250)], changedTouches: [t(250)] }));
      el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches: [], changedTouches: [t(100)] }));
    });
    await expect(counter(page)).toHaveText(`Картина 3 из ${total}`);
    await expect(page.locator('#lightbox-prev')).toBeVisible();
  });

  test('картины не смешиваются с раскадровками', async ({ page }) => {
    await openSite(page);
    const works = page.locator('#handmade .gallery-btn');
    const total = await works.count();
    await works.last().scrollIntoViewIfNeeded();
    await works.last().click();
    await page.keyboard.press('ArrowRight');
    await expect(counter(page)).toHaveText(`Картина ${total} из ${total}`);
    await page.keyboard.press('Escape');
    await page.locator('.contact-sheet').first().locator('.gallery-btn').first().click();
    await expect(counter(page)).toHaveText('Кадр 1 из 15');
  });
});

