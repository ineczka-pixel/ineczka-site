# Портфолио по направлениям (горизонтальные ленты)

**Назначение:** примеры работ по каждой услуге.
**Где:** `index.html` 141–447. Блоки: `#portfolio-illustration` (144), `#portfolio-avatars` (299), `#portfolio-brands` (339), `#portfolio-video` (375), `#portfolio-artists` (399), `#portfolio-design` (423).

## Как устроено
- Блок: `div#portfolio-xxx` с `scroll-margin-top: 90px` (чтобы якорь не прятался под шапкой) → `h4` → `.scroll-row` (flex, горизонтальная прокрутка).
- Элемент `.scroll-item` (190px): `button.gallery-btn` с `onclick="openMedia(event)"` и `aria-label="Открыть работу: …"` → `<img>` (`object-fit: cover`, 4:3) → подпись.
- **20 из 26 элементов — заглушки `assets/placeholder.png`** (аудит `CONTENT-PLACEHOLDERS`).
- В `#portfolio-illustration` также две [раскадровки](storyboards.md); в `#portfolio-avatars` — [видео](video-works.md).

## Как добавить работу
1. Положить файл в `assets/` ([правила именования](assets.md)).
2. Скопировать `.scroll-item` (например, 342–347), заменить `src`, `alt`, `aria-label`, подпись.
3. Заменить заглушку — просто поменять `src`/`alt`/подпись у существующего элемента.
4. `npm run verify` → проверить скриншот в `review/index.html`.

## Тесты
- `lightbox.spec.ts`: каждая кнопка открывает именно свою картинку; у всех есть `aria-label`.
- `page-load.spec.ts`: все картинки загрузились.
- Ручные: HR-IMAGES-2.
