// Фичи: docs/features/portfolio-galleries.md, docs/features/storyboards.md
// Состав и подписи, согласованные с автором.
import { test, expect, type Page } from '@playwright/test';
import { openSite } from '../helpers/site';

// [подпись, файл работы] по порядку: для видео — data-video-src, для картинки — src превью
async function rowWorks(page: Page, id: string) {
  return page.locator(`#${id} .scroll-row .scroll-item`).evaluateAll((items) => items.map((it) => {
    const b = it.querySelector('.gallery-btn')!;
    const file = b.getAttribute('data-video-src') || b.querySelector('img')!.getAttribute('src')!;
    return [it.querySelector(':scope > div')!.textContent!.trim(), file.replace('assets/', '')];
  }));
}

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
    expect((await rowWorks(page, 'portfolio-illustration')).map((w) => w[1])).toEqual([
      'illustration-retro.webp', 'illustration-dolls.webp', 'illustration-apteka.webp',
      'serial-vertical.mp4', 'serial-horizontal.mp4',
    ]);
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
  test('AI-аватары: 2 нейрофотосессии, 2 аватара для соцсетей, персонаж бренда, AI-аватар (видео)', async ({ page }) => {
    await openSite(page);
    expect(await rowWorks(page, 'portfolio-avatars')).toEqual([
      ['Нейрофотосессии (видео)', 'video-1.mp4'],
      ['Нейрофотосессии (видео)', 'video-2.mp4'],
      ['AI-аватары для соцсетей', 'avatar-socseti-1.mp4'],
      ['AI-аватары для соцсетей', 'avatar-socseti-2.mp4'],
      ['Виртуальный персонаж бренда', 'avatar-brand-character.mp4'],
      ['AI-аватары', 'avatar-kuznec.mp4'],
    ]);
  });

  test('«Логотипы и брендбуки» вместо «Визуалы для сайта/лендинга», «Виртуальный персонаж бренда» вместо имидж-стайлинга', async ({ page }) => {
    await openSite(page);
    await expect(page.locator('#portfolio-brands .scroll-item', { hasText: 'Логотипы' })).toHaveCount(3);
    await expect(page.locator('#portfolio-brands .scroll-item', { hasText: 'Брендбуки' })).toHaveCount(2);
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


test.describe('Работы автора в лентах портфолио', () => {
  test('Для брендов: 1-й ряд — визуализация, 2 креатива, 2 упаковки; 2-й ряд — 3 логотипа, 2 брендбука, 2 брендовые иллюстрации', async ({ page }) => {
    await openSite(page);
    await expect(page.locator('#portfolio-brands .scroll-row')).toHaveCount(2);
    expect(await rowWorks(page, 'portfolio-brands')).toEqual([
      ['Предметная визуализация товара', 'brand-speakers.webp'],
      ['Рекламные креативы', 'brand-illusion.webp'],
      ['Рекламные креативы', 'brand-burger.webp'],
      ['Упаковка и mockup', 'brand-svitaly-mockup.webp'],
      ['Упаковка и mockup', 'brand-oil-packaging.webp'],
      ['Логотипы', 'logo-svitaly.jpg'],
      ['Логотипы', 'logo-buffo.jpg'],
      ['Логотипы', 'logo-trubadur.jpg'],
      ['Брендбуки', 'logo-svitaly-variations.webp'],
      ['Брендбуки', 'brandbook-trubadur.jpg'],
      ['Брендовые иллюстрации', 'brand-ineczka-ai-creator.webp'],
      ['Брендовые иллюстрации', 'brand-trubadur-event.webp'],
    ]);
    const second = await page.locator('#portfolio-brands .scroll-row').nth(1).locator('.scroll-item').count();
    expect(second).toBe(7);
  });

  test('Видео и анимация: AI-клип, анимация, Reels/Shorts — все видео', async ({ page }) => {
    await openSite(page);
    expect(await rowWorks(page, 'portfolio-video')).toEqual([
      ['AI-клипы', 'video-ai-klip.mp4'],
      ['Анимация статичных изображений', 'video-animation.mp4'],
      ['Контент для Reels/Shorts', 'video-reels.mp4'],
    ]);
  });

  test('Для артистов: обложка трека Ineczka, промо-видео и афиша DJ, персонажи, маскоты', async ({ page }) => {
    await openSite(page);
    expect(await rowWorks(page, 'portfolio-artists')).toEqual([
      ['Обложки треков/альбомов', 'dj-ineczka-1.webp'],
      ['Промо-визуалы для выступлений', 'artist-promo.mp4'],
      ['Промо-визуалы для выступлений', 'dj-ineczka-promo-green.webp'],
      ['Персонажи', 'artist-character.mp4'],
      ['Маскоты', 'artist-mascots.mp4'],
    ]);
  });

  test('Графический дизайн: ровно 3 места — полиграфия, презентация (видео), инфографика', async ({ page }) => {
    await openSite(page);
    expect(await rowWorks(page, 'portfolio-design')).toEqual([
      ['Дизайн полиграфии', 'design-studio-one.webp'],
      ['Презентации и питч-деки', 'design-presentation.mp4'],
      ['Инфографика', 'design-infographic.webp'],
    ]);
  });

  test('в лентах портфолио не осталось заглушек', async ({ page }) => {
    await openSite(page);
    await expect(page.locator('#ai-creator .scroll-row img[src$="placeholder.png"]')).toHaveCount(0);
  });

  test('у каждого видео есть кадр-обложка, а сам ролик не тяжелее 8 МБ', async ({ page, request }) => {
    await openSite(page);
    const vids = await page.locator('#ai-creator [data-video-src]').evaluateAll((bs) => bs.map((b) => ({
      src: b.getAttribute('data-video-src')!, poster: b.querySelector('img')!.getAttribute('src')!,
    })));
    expect(vids.length).toBe(15);
    for (const v of vids) {
      expect(v.poster, v.src).toMatch(/-poster\.jpg$/);
      const r = await request.head(v.src);
      expect(Number(r.headers()['content-length']), v.src).toBeLessThan(8 * 1024 * 1024);
    }
  });
});
