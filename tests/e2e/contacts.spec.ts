// Фича: docs/features/contacts.md
import { test, expect } from '@playwright/test';
import { openSite } from '../helpers/site';

test.describe('Контакты', () => {
  test('ссылки контактов имеют правильный формат', async ({ page }) => {
    await openSite(page);
    const c = page.locator('#contacts');
    await expect(c.getByRole('link', { name: '+375 29 720-27-85' })).toHaveAttribute('href', 'tel:+375297202785');
    await expect(c.getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', 'https://wa.me/375297202785');
    await expect(c.getByRole('link', { name: 'Telegram' })).toHaveAttribute('href', 'https://t.me/ineczka');
    await expect(c.getByRole('link', { name: 'Instagram' })).toHaveAttribute('href', 'https://instagram.com/ineczka');
  });

  test('номер в tel: и в WhatsApp совпадает с видимым номером', async ({ page }) => {
    await openSite(page);
    const visible = (await page.locator('#contacts a[href^="tel:"]').innerText()).replace(/\D/g, '');
    const tel = (await page.locator('#contacts a[href^="tel:"]').getAttribute('href'))!.replace(/\D/g, '');
    const wa = (await page.locator('#contacts a[href*="wa.me"]').getAttribute('href'))!.replace(/\D/g, '');
    expect(tel).toBe(visible);
    expect(wa).toBe(visible);
  });

  test('копирайт содержит текущий год сайта', async ({ page }) => {
    await openSite(page);
    await expect(page.locator('#contacts')).toContainText('© Ineczka — AI-CREATOR & Handmade, 2026');
  });
});
