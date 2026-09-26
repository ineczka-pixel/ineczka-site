# Видео-работы

**Назначение:** показать нейрофотосессии в движении.
**Где:** `index.html` 302–323 (в `#portfolio-avatars`). JS — ветка `data-video-src` в `openMedia` (590–599).

## Как устроено
- `button.gallery-btn` c `data-video-src="assets/video-N.mp4"`, превью `<img src="assets/video-N-poster.jpg">` 9:16 и иконкой ▶ (SVG).
- Клик → в лайтбоксе `#lightbox-video` получает `src` и `play()`. При закрытии — `pause()`, `removeAttribute('src')` (видео не играет в фоне).
- Кодек файлов — **H.264 + AAC** (`avc1`/`mp4a`). Chromium из Playwright H.264 не поддерживает, поэтому реальное воспроизведение проверяет человек (или прогон с `PW_CHANNEL=chrome`). См. [урок](../solutions/2026-09-26-playwright-chromium-no-h264.md).

## Как добавить видео
1. `assets/video-3.mp4` (H.264, ≤ 5–7 МБ, 9:16) + постер `assets/video-3-poster.jpg`.
2. Скопировать блок 313–323, поменять `data-video-src`, `data-video-alt`, `src` постера, `aria-label`, подпись.

## Тесты
- `page-load.spec.ts`: файлы из `data-video-src` существуют и отдаются как `video/mp4`.
- `lightbox.spec.ts`: видео открывается, картинка скрыта, после закрытия — пауза и сброс `src`; воспроизведение проверяется, если браузер умеет H.264 (иначе пометка `human-check`).
- Ручные: HR-VIDEO-1.
