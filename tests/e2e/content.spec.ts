// Фичи: docs/features/portfolio-galleries.md, docs/features/storyboards.md
// Состав и подписи, согласованные с автором.
import { test, expect } from '@playwright/test';
import { openSite } from '../helpers/site';

test.describe('Иллюстрация и сторителлинг', () => {
  test('5 мест: 3 × Иллюстрация, Сериал вертикальный, Сериал горизонтальный', async ({ page }) => {
    await openSite(page);
    const captions = await page.locator('#portfolio-illustration .scroll-item > div').allInnerTexts();
    expect(captions.map((c) => c.trim())).toEqual([
      'Иллюстрация', 'Иллюстрация', 'Иллюстрация',
      'Сериал — вертикальный формат', 'Сериал — горизонтальный формат',
    ]);
    // у каждой кнопки своя подпись для скринридера
    const labels = await page.locator('#portfolio-illustration .scroll-row .gallery-btn').evaluateAll((bs) => bs.map((b) => b.getAttribute('aria-label')));
    expect(new Set(labels).size).toBe(5);
  });

  test('заголовки раскадровок: Сториборд — «Книжный магазин» и Сториборд — «Мушкетёры»', async ({ page }) => {
    await openSite(page);
    const titles = await page.locator('#portfolio-illustration .contact-sheet').evaluateAll((sheets) =>
      sheets.map((s) => s.parentElement!.firstElementChild!.textContent!.trim()));
    expect(titles).toEqual(['Сториборд — «Книжный магазин»', 'Сториборд — «Мушкетёры»']);
    await expect(page.locator('#portfolio-illustration')).not.toContainText('Раскадровка');
  });
});
