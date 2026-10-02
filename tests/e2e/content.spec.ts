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

test.describe('AI-аватары и образы / Для брендов', () => {
  test('AI-аватары: 7 мест с DJ Ineczka работами', async ({ page }) => {
    await openSite(page);
    const captions = await page.locator('#portfolio-avatars .scroll-item > div').allInnerTexts();
    expect(captions.map((c) => c.trim())).toContain('Нейрофотосессии (видео)');
    expect(captions.map((c) => c.trim())).toContain('AI-аватары для соцсетей');
    expect(captions.map((c) => c.trim())).toContain('Виртуальный персонаж бренда');
    expect(captions.map((c) => c.trim())).toContain('DJ Ineczka — визуал');
    expect(captions.map((c) => c.trim())).toContain('DJ Ineczka — портрет');
    expect(captions.length).toBe(7);
  });

  test('«Логотипы и брендбуки» вместо «Визуалы для сайта/лендинга», «Виртуальный персонаж бренда» вместо имидж-стайлинга', async ({ page }) => {
    await openSite(page);
    await expect(page.locator('#portfolio-brands .scroll-item').last()).toContainText('Логотипы и брендбуки');
    await expect(page.locator('#ai-creator a.service-link', { hasText: 'Логотипы и брендбуки' })).toHaveAttribute('href', '#portfolio-brands');
    await expect(page.locator('#ai-creator a.service-link', { hasText: 'Виртуальный персонаж бренда' })).toHaveAttribute('href', '#portfolio-avatars');
    await expect(page.locator('#ai-creator')).not.toContainText('Визуалы для сайта');
    await expect(page.locator('#ai-creator')).not.toContainText('имидж-стайлинг');
  });
});

test('Handmade: 12 картин, новые — сакура, зелёный и синий драконы, бабочка-поцелуй', async ({ page }) => {
  await openSite(page);
  const alts = await page.locator('#handmade .gallery-btn img').evaluateAll((els) => els.map((e) => e.getAttribute('alt')));
  expect(alts.length).toBe(12);
  expect(alts.slice(8)).toEqual([
    'Сакура — картина из CD-дисков', 'Зелёный дракон — картина из CD-дисков',
    'Синий дракон — картина из CD-дисков', 'Бабочка-поцелуй — картина из CD-дисков',
  ]);
});

