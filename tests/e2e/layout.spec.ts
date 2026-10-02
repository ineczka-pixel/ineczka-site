// Фичи: docs/features/hero.md, docs/features/decorative-splashes.md,
//       docs/features/ai-services.md, docs/features/handmade.md
import { test, expect } from '@playwright/test';
import { openSite } from '../helpers/site';

test.describe('Первый экран', () => {
  test('оливковая клякса стоит ровно в нижнем левом углу (HR-VISUAL-1)', async ({ page }) => {
    await openSite(page);
    const r = await page.evaluate(() => {
      const s = document.querySelector('#top')!.getBoundingClientRect();
      const d = document.querySelector('#top .deco-olive-splash')!.getBoundingClientRect();
      return { dl: d.left - s.left, db: s.bottom - d.bottom, ratio: d.width / d.height };
    });
    expect(Math.abs(r.dl)).toBeLessThanOrEqual(1);
    expect(Math.abs(r.db)).toBeLessThanOrEqual(1);
    // блок повторяет пропорции картинки 675×336 — без пустых полей внутри
    expect(r.ratio).toBeCloseTo(675 / 336, 1);
  });

  test('фиолетовая клякса стоит вплотную в правом верхнем углу, без белых зазоров (HR-VISUAL-1)', async ({ page }) => {
    await openSite(page);
    const r = await page.evaluate(() => {
      const s = document.querySelector('#top')!.getBoundingClientRect();
      const d = document.querySelector('#top .deco-purple-splash')!.getBoundingClientRect();
      return { dr: s.right - d.right, dt: d.top - s.top, ratio: d.width / d.height };
    });
    expect(Math.abs(r.dr)).toBeLessThanOrEqual(1);
    expect(Math.abs(r.dt)).toBeLessThanOrEqual(1);
    // блок в пропорциях картинки 390×408 — мазок доходит до краёв блока
    expect(r.ratio).toBeCloseTo(390 / 408, 1);
  });

  test('подзаголовок: на телефоне без отступов из пробелов и с пустой строкой перед Handmade (HR-TEXT-2)', async ({ page, isMobile }) => {
    await openSite(page);
    const p = page.locator('#top p');
    const lines = await p.evaluate((el) => {
      // левые края строк текста
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = [...range.getClientRects()].filter((r) => r.width > 4);
      return { left: el.getBoundingClientRect().left, starts: [...new Set(rects.map((r) => Math.round(r.left)))] };
    });
    const indent = page.locator('#top p .hero-indent').first();
    const gap = page.locator('#top p .hero-gap');
    if (isMobile) {
      await expect(indent).toBeHidden();
      await expect(gap).toBeVisible();
      expect(Math.min(...lines.starts)).toBeLessThanOrEqual(Math.round(lines.left) + 1);
    } else {
      await expect(indent).toBeVisible();
      await expect(gap).toBeHidden();
    }
  });
});

test.describe('AI-CREATOR: сетка услуг', () => {
  test('на телефоне 2 колонки и ничего не вылезает за экран (HR-VISUAL-2)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await openSite(page);
    const grid = page.locator('#ai-creator .services-grid');
    const cols = await grid.evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(' ').length);
    expect(cols).toBe(2);
    const over = await grid.locator(':scope > div').evaluateAll((cards) =>
      cards.filter((c) => c.getBoundingClientRect().right > window.innerWidth).length);
    expect(over).toBe(0);
  });

  test('на компьютере 3 колонки, как раньше', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openSite(page);
    const cols = await page.locator('#ai-creator .services-grid').evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(' ').length);
    expect(cols).toBe(3);
  });
});

test.describe('Handmade: превью', () => {
  test('вертикальные картины показываются целиком, без обрезки (HR-IMAGES-1)', async ({ page }) => {
    await openSite(page);
    const imgs = await page.locator('#handmade .gallery-btn img').evaluateAll((els) =>
      (els as HTMLImageElement[]).map((i) => {
        const r = i.getBoundingClientRect();
        return { src: i.getAttribute('src'), natural: i.naturalWidth / i.naturalHeight, box: r.width / r.height };
      }));
    const vertical = imgs.filter((i) => i.natural < 1);
    expect(vertical.length).toBe(7);
    for (const i of vertical) expect(Math.abs(i.box - i.natural), i.src!).toBeLessThan(0.02);
    // горизонтальные с нестандартными пропорциями (не 4:3) тоже показываются целиком
    for (const i of imgs.filter((x) => x.src!.includes('handmade-12'))) expect(Math.abs(i.box - i.natural)).toBeLessThan(0.02);
  });

  test('на компьютере 4 колонки на всю ширину, без пустых', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openSite(page);
    const lefts = await page.locator('#handmade .gallery-btn').evaluateAll((bs) => [...new Set(bs.map((b) => Math.round(b.getBoundingClientRect().left)))]);
    expect(lefts.length).toBe(4);
    const [grid, btnRight] = await page.locator('#handmade .masonry').evaluate((g) => [g.getBoundingClientRect().right,
      Math.max(...[...g.querySelectorAll('.gallery-btn')].map((b) => b.getBoundingClientRect().right))]);
    expect(Math.abs(grid - btnRight)).toBeLessThanOrEqual(2);
  });
});

test.describe('Портфолио: превью на телефоне', () => {
  test('на телефоне ленты портфолио — сетка в 2 колонки без горизонтальной прокрутки (HR-VISUAL-2)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await openSite(page);
    const rows = page.locator('#ai-creator .scroll-row');
    const n = await rows.count();
    expect(n).toBe(7);
    for (let i = 0; i < n; i++) {
      const r = await rows.nth(i).evaluate((row) => ({
        cols: new Set([...row.querySelectorAll('.scroll-item')].map((it) => Math.round(it.getBoundingClientRect().left))).size,
        scrolls: row.scrollWidth > row.clientWidth + 1,
        over: [...row.querySelectorAll('.scroll-item')].some((it) => it.getBoundingClientRect().right > window.innerWidth),
      }));
      expect(r, `лента ${i + 1}`).toEqual({ cols: 2, scrolls: false, over: false });
    }
  });

  test('раскадровки на телефоне не меняются — сетка кадров как раньше', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await openSite(page);
    const cols = await page.locator('.contact-sheet').first().evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(' ').length);
    expect(cols).toBeGreaterThanOrEqual(3);
  });

  test('на компьютере ленты портфолио остаются горизонтальными', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openSite(page);
    const displays = await page.locator('#ai-creator .scroll-row').evaluateAll((rs) => rs.map((r) => getComputedStyle(r).display));
    expect(displays).toEqual(Array(7).fill('flex'));
  });
});
