# AI-CREATOR: карточки услуг

**Назначение:** показать спектр AI-услуг и дать перейти к примерам.
**Где:** `index.html` 87–157, `<section id="ai-creator">`.

## Как устроено
- Вступление: надзаголовок, `h2 AI-CREATOR`, абзац (91–95).
- Сетка `display:grid; grid-template-columns: repeat(3, 1fr); grid-auto-flow: dense` (97):
  - Большая оливковая карточка (span 2×2) «Иллюстрация и сторителлинг» → `#portfolio-illustration`, внизу — «Самый частый запрос».
  - 5 карточек `#FAFAFA` с `h3` и списком `<li><a class="service-link" href="#portfolio-...">`.
- Каждая группа ссылается на свой блок в [portfolio-galleries](portfolio-galleries.md).
- Сетка `.services-grid`: на компьютере 3 колонки, на телефоне (≤640px) — 2 колонки, отступ между карточками 10px, внутренние поля 16px (медиазапрос в `<style>`, `!important` перебивает inline-стиль). Большая карточка занимает обе колонки.

## Как изменить
Новая услуга в существующей группе — `<li><a href="#portfolio-xxx" class="service-link">…</a></li>`.
Новая группа — скопировать карточку (110–117), новый блок портфолио с `id="portfolio-xxx"`, добавить id в `PORTFOLIO_ANCHORS` (`tests/helpers/site.ts`).

## Тесты
- `navigation.spec.ts`: группы ссылаются ровно на 6 блоков портфолио; клик прокручивает, заголовок не под шапкой.
- `layout.spec.ts`: 2 колонки на 375px без вылезания, 3 колонки на 1280px.
- Аудит: `LAYOUT-OVERFLOW-*`, `LAYOUT-CRAMPED-*`.
- Ручные: HR-VISUAL-2.

## Известные проблемы
[KI-003](../known-issues.md#ki-003) — исправлено.

## История
- 2026-09-26 — правки по первой ручной проверке ([план](../plans/completed/2026-09-26-review-round-1.md)): 2 колонки на телефоне (HR-VISUAL-2).
