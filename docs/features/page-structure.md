# Каркас страницы, мета и шрифты

**Назначение:** основа документа — язык, заголовок вкладки, адаптивность, шрифты, общие CSS-правила.
**Где:** `index.html` 1–58 (`<head>`, `<style>`), обёртка-`div` на строке 38 (закрывается на 564), `<script>` 565–699.

## Как устроено
- `<html lang="ru">`, `<title>Ineczka — AI-CREATOR и Handmade</title>`, `meta viewport`.
- Превью ссылки (строки 7–15): `meta description`, Open Graph (`og:type`, `og:url`, `og:title`, `og:description`, `og:image` 1200×630 = `assets/og-image.jpg` с логотипом), `twitter:card`. **`og:url` и `og:image` — абсолютные адреса** `https://ineczka-pixel.github.io/ineczka-site/…`: мессенджеры не понимают относительные. Сменится адрес сайта → поменять эти две строки.
- Медиазапрос `@media (max-width: 640px)` в конце `<style>` — «телефонная версия» (подзаголовок героя, сетка услуг).
- Шрифты Google: `<link>` на Bebas Neue (не используется) и Manrope 400–700, плюс `@import` Manrope 500/700/800 + Inter 400–600 внутри `<style>`.
  - Текст — **Inter**, заголовки `h1–h3` и `.font-display` — **Manrope**.
- `<style>` содержит только то, что нельзя сделать inline: `:hover`, скроллбары, классы переиспользования (см. [design-system](../design-system.md)).
- Обёртка `<div style="width:100%; min-height:100vh; overflow-x:hidden">` прячет горизонтальную прокрутку, **но ломает sticky-шапку** — [KI-001](../known-issues.md#ki-001).
- Порядок секций: `#top` → `#ai-creator` → `#handmade` → `#about` → `#contacts`, затем лайтбокс.

## Как изменить
- Новая секция: `<section id="..." style="...">` с внутренним контейнером `max-width:1180px; margin:0 auto; padding:100px 24px` (как в `#handmade`). Добавь id в `SECTIONS` в `tests/helpers/site.ts`, пункт меню (если нужен) и файл фичи.
- Мета-теги SEO/OG — в `<head>` после `<title>`. Проверить превью после публикации: отправить ссылку себе в Telegram (кэш превью сбрасывает @webpagebot).

## Тесты
- `tests/e2e/page-load.spec.ts`: нет JS-ошибок и 404, title/lang/viewport, порядок секций, один `h1`, все картинки загрузились.
- `page-load.spec.ts`: мета-теги превью и `og-image.jpg`.
- Аудит: `SEO-META`, `PERF-FONTS`.
- Ручные: HR-SHARE-1 (превью ссылки в мессенджерах).

## Известные проблемы
[KI-001](../known-issues.md#ki-001), [KI-005](../known-issues.md#ki-005), [KI-006](../known-issues.md#ki-006).

## История
- 2026-09-26 — правки по первой ручной проверке ([план](../plans/completed/2026-09-26-review-round-1.md)): мета-теги превью ссылки (HR-SHARE-1).
