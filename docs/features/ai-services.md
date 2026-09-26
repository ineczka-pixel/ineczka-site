# AI-CREATOR: карточки услуг

**Назначение:** показать спектр AI-услуг и дать перейти к примерам.
**Где:** `index.html` 69–139, `<section id="ai-creator">`.

## Как устроено
- Вступление: надзаголовок, `h2 AI-CREATOR`, абзац (73–77).
- Сетка `display:grid; grid-template-columns: repeat(3, 1fr); grid-auto-flow: dense` (79):
  - Большая оливковая карточка (span 2×2) «Иллюстрация и сторителлинг» → `#portfolio-illustration`, внизу — «Самый частый запрос».
  - 5 карточек `#FAFAFA` с `h3` и списком `<li><a class="service-link" href="#portfolio-...">`.
- Каждая группа ссылается на свой блок в [portfolio-galleries](portfolio-galleries.md).
- Сетка **не адаптивная**: на 375px карточки уезжают за край ([KI-003](../known-issues.md#ki-003)).

## Как изменить
Новая услуга в существующей группе — `<li><a href="#portfolio-xxx" class="service-link">…</a></li>`.
Новая группа — скопировать карточку (92–99), новый блок портфолио с `id="portfolio-xxx"`, добавить id в `PORTFOLIO_ANCHORS` (`tests/helpers/site.ts`).

## Тесты
- `navigation.spec.ts`: группы ссылаются ровно на 6 блоков портфолио; клик прокручивает, заголовок не под шапкой.
- Аудит: `LAYOUT-OVERFLOW-*`, `LAYOUT-CRAMPED-*`.
- Ручные: HR-VISUAL-2.

## Известные проблемы
[KI-003](../known-issues.md#ki-003).
