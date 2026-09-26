// Аудит качества: НЕ падает, а собирает находки в review/audit.json,
// которые попадают в отчёт для человека (npm run review). См. docs/testing/strategy.md#аудит
import { test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';
import { openSite } from '../helpers/site';

type Finding = { id: string; severity: 'high' | 'medium' | 'low' | 'info'; title: string; details: string[] };
const findings: Finding[] = [];
const add = (f: Finding) => { if (f.details.length || f.severity === 'info') findings.push(f); };

const VIEWPORTS = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1280', width: 1280, height: 800 },
];

test.describe.configure({ mode: 'serial' });

test.afterAll(() => {
  const out = path.join('review', 'audit.json');
  fs.mkdirSync('review', { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString(), findings }, null, 2));
  console.log(`audit: ${findings.length} находок → ${out}`);
});

for (const vp of VIEWPORTS) {
  test(`вылезающие за экран элементы — ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await openSite(page);
    const over = await page.evaluate((w) => {
      const res: string[] = [];
      document.querySelectorAll('section *:not(.deco-purple-splash):not(.deco-olive-splash)').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || getComputedStyle(el).position === 'absolute') return;
        if (el.closest('.scroll-row')) return; // горизонтальная прокрутка — это задумано
        const pr = el.parentElement?.getBoundingClientRect();
        const parentOver = pr && (pr.right > w + 1 || pr.left < -1);
        if ((r.right > w + 1 || r.left < -1) && !parentOver) {
          const id = el.closest('section')?.id;
          const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
          res.push(`#${id} <${el.tagName.toLowerCase()}> left=${Math.round(r.left)} right=${Math.round(r.right)} «${text}»`);
        }
      });
      return res.slice(0, 15);
    }, vp.width);
    add({ id: `LAYOUT-OVERFLOW-${vp.name}`, severity: 'high', title: `Контент шире экрана (${vp.width}px) — обрезается`, details: over });

    const tiny = await page.evaluate(() => {
      const res: string[] = [];
      document.querySelectorAll('h3, .scroll-item > div, li').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.width < 90) res.push(`<${el.tagName.toLowerCase()}> ширина ${Math.round(r.width)}px «${(el.textContent || '').trim().slice(0, 30)}»`);
      });
      return res.slice(0, 10);
    });
    add({ id: `LAYOUT-CRAMPED-${vp.name}`, severity: 'medium', title: `Слишком узкие текстовые блоки (${vp.width}px)`, details: tiny });
  });
}

test('заглушки вместо работ', async ({ page }) => {
  await openSite(page);
  const ph = await page.locator('img[src$="placeholder.png"]').evaluateAll((imgs) => imgs.map((i) => {
    const block = i.closest('[id^="portfolio-"]');
    return `${block?.id}: ${i.getAttribute('alt')}`;
  }));
  add({ id: 'CONTENT-PLACEHOLDERS', severity: 'medium', title: `Заглушек placeholder.png на сайте: ${ph.length}`, details: ph });
});

test('SEO и превью ссылки в мессенджерах', async ({ page }) => {
  await openSite(page);
  const missing: string[] = [];
  for (const [sel, name] of [
    ['meta[name="description"]', 'meta description'],
    ['meta[property="og:title"]', 'og:title'],
    ['meta[property="og:image"]', 'og:image (картинка превью в Telegram/WhatsApp)'],
    ['link[rel~="icon"]', 'favicon'],
  ] as const) {
    if (!(await page.locator(sel).count())) missing.push(`нет ${name}`);
  }
  add({ id: 'SEO-META', severity: 'medium', title: 'Не хватает мета-тегов', details: missing });
});

test('шрифты', async ({ page }) => {
  await openSite(page);
  const links = await page.locator('link[href*="fonts.googleapis"]').evaluateAll((ls) => ls.map((l) => l.getAttribute('href')!));
  const css = await page.locator('style').first().innerText();
  const details: string[] = [];
  if (links.some((h) => h.includes('Bebas')) && !css.includes('Bebas')) details.push('Bebas Neue подключается, но нигде не используется — лишняя загрузка');
  const manrope = links.filter((h) => h.includes('Manrope')).length + (css.match(/@import[^;]*Manrope/g) || []).length;
  if (manrope > 1) details.push(`Manrope подключён ${manrope} раза (link + @import)`);
  if (css.includes('@import')) details.push('@import шрифтов внутри <style> блокирует отрисовку — лучше <link rel="preconnect"> + <link>');
  add({ id: 'PERF-FONTS', severity: 'low', title: 'Подключение шрифтов', details });
});

test('вес страницы и тяжёлые файлы', async ({ page }) => {
  const sizes: Record<string, number> = {};
  page.on('response', async (r) => {
    if (!r.url().startsWith('http://localhost')) return;
    const len = Number(r.headers()['content-length'] || 0);
    sizes[r.url().replace(/^.*localhost:\d+\//, '')] = len;
  });
  await openSite(page);
  await page.waitForLoadState('networkidle');
  const total = Object.values(sizes).reduce((a, b) => a + b, 0);
  const heavy = Object.entries(sizes).filter(([, s]) => s > 150_000).sort((a, b) => b[1] - a[1])
    .map(([f, s]) => `${f} — ${(s / 1024).toFixed(0)} КБ`);
  add({ id: 'PERF-WEIGHT', severity: total > 3_000_000 ? 'medium' : 'low',
    title: `Первая загрузка: ${(total / 1024 / 1024).toFixed(1)} МБ, файлов > 150 КБ: ${heavy.length}`,
    details: [...heavy.slice(0, 12), 'Кадры раскадровок показываются миниатюрами ~90px, а грузятся полноразмерными — стоит сделать превью и loading="lazy"'] });
});

test('доступность (axe, все уровни)', async ({ page }) => {
  await openSite(page);
  const r = await new AxeBuilder({ page }).analyze();
  add({ id: 'A11Y-AXE', severity: 'low', title: `axe-core: нарушений ${r.violations.length}`,
    details: r.violations.map((v) => `[${v.impact}] ${v.id}: ${v.help} — элементов: ${v.nodes.length}`) });
  const lb: string[] = [];
  await page.locator('#handmade .gallery-btn').first().click();
  const focusInside = await page.evaluate(() => !!document.activeElement?.closest('#lightbox-overlay'));
  if (!focusInside) lb.push('При открытии лайтбокса фокус не переходит внутрь — пользователи клавиатуры/скринридера «теряются»');
  if (!(await page.locator('#lightbox-overlay[role="dialog"]').count())) lb.push('У лайтбокса нет role="dialog" и aria-modal');
  add({ id: 'A11Y-LIGHTBOX', severity: 'low', title: 'Доступность лайтбокса', details: lb });
});

test('мобильные жесты в лайтбоксе', async ({ page }) => {
  await openSite(page);
  const html = await page.content();
  const d: string[] = [];
  if (!/touchstart|pointerdown|swipe/i.test(html)) d.push('Нет свайпа влево/вправо для листания раскадровки на телефоне — только маленькие стрелки');
  add({ id: 'UX-SWIPE', severity: 'low', title: 'Листание раскадровки на телефоне', details: d });
});
