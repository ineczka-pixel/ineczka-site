# Видео-работы

**Назначение:** показать видео-работы (аватары, сериалы, клипы, анимация, промо, персонажи, презентация).
**Где:** 15 видео во всех лентах `#ai-creator` (см. [portfolio-galleries](portfolio-galleries.md)). JS — поле `video` в `openSequence` и ветка видео в `render()`: видео листаются вместе с картинками своей ленты.

## Как устроено
- `button.gallery-btn` c `data-video-src="assets/video-N.mp4"`, превью `<img src="assets/video-N-poster.jpg">` 9:16 и иконкой ▶ (SVG).
- Клик → в лайтбоксе `#lightbox-video` получает `src` и `play()`; при перелистывании на картинку — `pause()` и снятие `src`. При закрытии — `pause()`, `removeAttribute('src')` (видео не играет в фоне).
- Кодек файлов — **H.264 + AAC** (`avc1`/`mp4a`). Chromium из Playwright H.264 не поддерживает, поэтому реальное воспроизведение проверяет человек (или прогон с `PW_CHANNEL=chrome`). См. [урок](../solutions/2026-09-26-playwright-chromium-no-h264.md).

## Как добавить видео
1. Сжать до 720p H.264 + AAC, `+faststart`, **≤ 8 МБ** (проверяет тест). ffmpeg в облаке: `pip install imageio-ffmpeg` → `python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"`. Рецепт — [урок](../solutions/2026-10-02-bulk-portfolio-upload.md).
2. Обложка `assets/<имя>-poster.jpg` — кадр ~1,5 с, ширина 480. **Проверить глазами**: у некоторых роликов первые секунды белые/чёрные — тогда брать 6 с.
3. Скопировать любой видео-блок `.scroll-item`, поменять `data-video-src`, `data-video-alt`, `src` постера, `aria-label`, подпись; горизонтальное — `aspect-ratio: 16/9` + класс `scroll-item-wide`.

## Тесты
- `page-load.spec.ts`: файлы из `data-video-src` существуют и отдаются как `video/mp4`.
- `lightbox.spec.ts`: видео открывается, картинка скрыта, после закрытия — пауза и сброс `src`; воспроизведение проверяется, если браузер умеет H.264 (иначе пометка `human-check`).
- Ручные: HR-VIDEO-1.

## История
- 2026-10-02 — добавлено 13 видео автора (было 2). Обложки «Нейрофотосессий» (`video-1/2`) заменены кадрами с людьми (6,5 с и 31 с): первые ~5 с этих роликов — заставка с логотипом, старые обложки показывали её.
