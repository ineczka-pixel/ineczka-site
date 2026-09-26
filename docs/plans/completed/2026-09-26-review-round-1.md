# Plan: Правки по первой ручной проверке

**Цель:** исправить всё, что автор отметила «Нужна правка» на странице проверки версии 7668740.
**Запрос автора:** ответы HR-VISUAL-1, HR-VISUAL-2, HR-IMAGES-1, HR-IMAGES-3, HR-TEXT-2, HR-CONTACTS-1, HR-SHARE-1.
**Затрагиваемые фичи:** [hero](../../features/hero.md), [decorative-splashes](../../features/decorative-splashes.md), [ai-services](../../features/ai-services.md), [handmade](../../features/handmade.md), [lightbox](../../features/lightbox.md), [storyboards](../../features/storyboards.md), [contacts](../../features/contacts.md), [page-structure](../../features/page-structure.md).
**Уроки из docs/solutions:** fonts-in-tests (visual-эталоны изменятся намеренно — не обновлять до одобрения).
**Известные проблемы рядом:** KI-003 (сетка услуг), KI-005 (OG), KI-007 (подзаголовок), KI-009 (свайп).

**Допущения (не уточнены у автора):**
- «Телефонная версия» = ширина экрана ≤ 640px.
- Строка-отступ перед «Handmade» в подзаголовке — только в телефонной версии (на компьютере автор замечаний не дала).
- Telegram: ссылка по номеру `https://t.me/+375297202785` (имени пользователя автор не дала).
- Адрес сайта для превью ссылки: `https://ineczka-pixel.github.io/ineczka-site/` (GitHub Pages) — поменять, если будет свой домен.

## Validation Commands
- `npm test`

### Task 1: Клякса в углу героя (HR-VISUAL-1)
- [x] Оливковая клякса в #top: блок по пропорциям картинки (420×209), `left:0; bottom:0`
- [x] e2e: нижний левый угол кляксы совпадает с углом секции

### Task 2: Сетка услуг 2 колонки на телефоне (HR-VISUAL-2, KI-003)
- [x] Класс `services-grid` + медиазапрос ≤640px: 2 колонки, внутренние отступы карточек 16px
- [x] e2e: на 375px 2 колонки и ничего не вылезает за экран

### Task 3: Вертикальные картины Handmade без обрезки (HR-IMAGES-1)
- [x] Сетка → «кирпичная кладка» (CSS columns), у вертикальных превью пропорции картины
- [x] e2e: вертикальные превью показываются без обрезки

### Task 4: Свайп в лайтбоксе (HR-IMAGES-3, KI-009)
- [x] touchstart/touchend на оверлее: влево → следующий кадр, вправо → предыдущий
- [x] e2e: свайп листает раскадровку

### Task 5: Подзаголовок героя на телефоне (HR-TEXT-2, KI-007)
- [x] Отступы из пробелов скрыты ≤640px, перед «Handmade» — пустая строка
- [x] e2e: на телефоне строки начинаются без отступа; на компьютере без изменений

### Task 6: Контакты (HR-CONTACTS-1)
- [x] Telegram → `https://t.me/+375297202785`, Instagram → `https://instagram.com/ine4ka_viv`
- [x] Звонок: формат `tel:` верный — выяснить, где проверялось (KI-012, вопрос автору)
- [x] e2e contacts.spec.ts обновить

### Task 7: Превью ссылки (HR-SHARE-1, KI-005)
- [x] `assets/og-image.jpg` 1200×630 с логотипом; meta description, og:title/description/image/type, twitter:card
- [x] e2e: мета-теги есть, картинка отдаётся

### Task 8: Compound
- [x] Обновить docs фич, номера строк в CLAUDE.md, known-issues, чек-лист; урок в docs/solutions

## Ручная проверка (после выполнения)
HR-VISUAL-1, HR-VISUAL-2, HR-IMAGES-1, HR-IMAGES-3, HR-TEXT-2, HR-CONTACTS-1, HR-SHARE-1
