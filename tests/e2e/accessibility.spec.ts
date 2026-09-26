// Фича: docs/testing/strategy.md#доступность
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openSite } from '../helpers/site';

test.describe('Доступность', () => {
  test('у всех <img> есть alt', async ({ page }) => {
    await openSite(page);
    const noAlt = await page.locator('img:not([alt])').count();
    expect(noAlt).toBe(0);
  });

  test('axe: нет критичных нарушений (critical)', async ({ page }) => {
    await openSite(page);
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
  });

  test('галерея доступна с клавиатуры: Enter на кнопке открывает лайтбокс', async ({ page }) => {
    await openSite(page);
    await page.locator('#handmade .gallery-btn').first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#lightbox-overlay')).toBeVisible();
  });
});
