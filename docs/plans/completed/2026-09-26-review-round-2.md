# Plan: Правки по второй ручной проверке

**Цель:** замечания автора к версии 5ee55e1 (раунд 2).
**Затрагиваемые фичи:** [hero](../../features/hero.md), [decorative-splashes](../../features/decorative-splashes.md), [portfolio-galleries](../../features/portfolio-galleries.md), [contacts](../../features/contacts.md).
**Уроки:** [responsive-with-inline-styles](../../solutions/2026-09-26-responsive-with-inline-styles.md) — блок кляксы в пропорциях картинки, медиазапрос ≤640px.

## Validation Commands
- `npm test`

### Task 1: Фиолетовая клякса без белых зазоров (HR-VISUAL-1)
- [x] Блок 364×380 (пропорции 390×408), `top:0; right:0`
- [x] e2e: угол и пропорции

### Task 2: Портфолио на телефоне в 2 колонки, кроме раскадровок (HR-VISUAL-2)
- [x] `.scroll-row` → grid 2 колонки в медиазапросе ≤640px
- [x] e2e: 6 лент по 2 колонки без прокрутки; раскадровки не изменились; на компьютере flex

### Task 3: Instagram HTTP 429 (HR-CONTACTS-1)
- [x] Канонический адрес `https://www.instagram.com/ine4ka_viv/`, внешние ссылки `target="_blank" rel="noopener"`
- [x] KI-013: 429 — ограничение Instagram, проверить на опубликованном сайте

### Task 4: Compound
- [x] Эталоны Handmade обновлены (одобрено автором: HR-IMAGES-1)
- [x] Docs, номера строк, known-issues, чек-лист

## Ручная проверка
HR-VISUAL-1, HR-VISUAL-2, HR-CONTACTS-1
