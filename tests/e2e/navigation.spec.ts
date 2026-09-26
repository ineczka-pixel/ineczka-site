// Фича: docs/features/header-navigation.md, docs/features/hero.md, docs/features/cta-blocks.md, docs/features/ai-services.md
import { test, expect } from '@playwright/test';
import { openSite, PORTFOLIO_ANCHORS } from '../helpers/site';

test.describe('Навигация и якоря', () => {
  test('каждая внутренняя ссылка #id ведёт на существующий элемент', async ({ page }) => {
    await openSite(page);
    const missing = await page.locator('a[href^="#"]').evaluateAll((as) =>
      as.map((a) => a.getAttribute('href')!.slice(1)).filter((id) => !document.getElementById(id)));
    expect(missing).toEqual([]);
  });

  test('шапка закреплена (sticky) и видна после прокрутки', async ({ page }) => {
    test.fail(true, 'KI-001: sticky не работает из-за overflow-x: hidden на обёртке — docs/known-issues.md');
    await openSite(page);
    await page.evaluate(() => window.scrollTo(0, 3000));
    const header = page.locator('header');
    await expect(header).toBeInViewport();
    const top = await header.evaluate((h) => h.getBoundingClientRect().top);
    expect(top).toBe(0);
  });

  for (const [label, id] of [['AI-CREATOR', 'ai-creator'], ['Handmade', 'handmade'], ['Обо мне', 'about'], ['Контакты', 'contacts']]) {
    test(`пункт меню «${label}» прокручивает к #${id}`, async ({ page }) => {
      await openSite(page);
      await page.locator('header nav a', { hasText: label }).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeInViewport();
    });
  }

  test('кнопки героя ведут к разделам', async ({ page }) => {
    await openSite(page);
    await page.locator('#top a.btn-blue').click();
    await expect(page.locator('#handmade')).toBeInViewport();
    await page.goto('/index.html');
    await page.locator('#top a.btn-purple').click();
    await expect(page.locator('#ai-creator')).toBeInViewport();
  });

  test('логотип в шапке ведёт наверх', async ({ page }) => {
    await openSite(page);
    await page.evaluate(() => window.scrollTo(0, 4000));
    await page.locator('header a[href="#top"]').click();
    await expect(page.locator('#top h1')).toBeInViewport();
  });

  test('CTA «Обсудить проект» и «Узнать подробнее» ведут к контактам', async ({ page }) => {
    await openSite(page);
    for (const text of ['Обсудить проект', 'Узнать подробнее']) {
      await page.goto('/index.html');
      await page.getByRole('link', { name: text }).click();
      await expect(page.locator('#contacts')).toBeInViewport();
    }
  });

  test('каждая группа услуг ссылается на свой блок портфолио', async ({ page }) => {
    await openSite(page);
    const targets = await page.locator('#ai-creator a.service-link, #ai-creator a.service-link-light')
      .evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href')!.slice(1)))]);
    expect(targets.sort()).toEqual([...PORTFOLIO_ANCHORS].sort());
  });

  test('ссылка услуги прокручивает к портфолио и заголовок не прячется под шапкой', async ({ page }) => {
    // Пока KI-001 не исправлен, шапка не липкая и проверка проходит. После исправления
    // на мобильном она упадёт: шапка ~157px > scroll-margin-top 90px (KI-002).
    await openSite(page);
    await page.locator('a.service-link[href="#portfolio-brands"]').first().click();
    const block = page.locator('#portfolio-brands h4');
    await expect(block).toBeInViewport();
    const headerBottom = await page.locator('header').evaluate((h) => h.getBoundingClientRect().bottom);
    const blockTop = await block.evaluate((h) => h.getBoundingClientRect().top);
    expect(blockTop).toBeGreaterThanOrEqual(headerBottom - 1);
  });
});
