// Визуальная регрессия: сравнивает секции с эталонами в tests/visual/__snapshots__.
// Эталоны обновляются ТОЛЬКО после того, как человек одобрил новый вид:
//   npm run test:visual:update
// См. docs/testing/strategy.md#визуальная-регрессия
import { test, expect } from '@playwright/test';
import { openSite, SECTIONS } from '../helpers/site';

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 },
];

for (const vp of VIEWPORTS) {
  for (const id of SECTIONS) {
    test(`${id} — ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await openSite(page, { fonts: true });
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.fonts.ready);
      // Снимаем раздел изолированно: скрываем шапку и остальные разделы, чтобы раздел
      // начинался с y=0. Иначе изменение высоты блока ВЫШЕ сдвигает раздел на доли пикселя,
      // сглаживание текста меняется и тест ложно краснеет (docs/solutions/2026-09-27-visual-subpixel-shift.md).
      await page.evaluate((keep) => {
        document.querySelectorAll('header, section').forEach((el) => {
          if (el.id !== keep) (el as HTMLElement).style.display = 'none';
        });
        window.scrollTo(0, 0);
      }, id);
      await expect(page.locator(`#${id}`)).toHaveScreenshot(`${id}-${vp.name}.png`);
    });
  }
}
