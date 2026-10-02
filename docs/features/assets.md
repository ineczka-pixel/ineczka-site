# Медиафайлы (`assets/`)

| Группа | Файлы | Где используются |
|---|---|---|
| Логотипы | `logo.jpg`, `logo-white.png` | шапка, герой; контакты |
| Превью ссылки | `og-image.jpg` (1200×630, логотип на белом) | `og:image` |
| Кляксы | `splash-purple.png`, `splash-olive.png` | CSS-классы `.deco-*` |
| Заглушка | `placeholder.png` | в лентах не используется (запас для новых мест) |
| Раскадровки | `storyboard1-frame-01..15.jpg`, `storyboard2-frame-01..22.jpg` | [storyboards](storyboards.md) |
| Видео | `video-1.mp4` (6.6 МБ), `video-2.mp4` (4.6 МБ), `video-N-poster.jpg` | [video-works](video-works.md) |
| Портфолио: картинки | `illustration-*.webp`, `brand-*.webp`, `logo-*.jpg/webp`, `brandbook-trubadur.jpg`, `dj-ineczka-1/2.webp`, `design-*.webp` | [portfolio-galleries](portfolio-galleries.md) |
| Портфолио: видео | `serial-*`, `avatar-*`, `video-ai-klip`, `video-animation`, `video-reels`, `artist-*`, `design-presentation` (`.mp4` 2–7 МБ + `-poster.jpg`) | [video-works](video-works.md) |
| Handmade | `handmade-1-motorcycle.jpg … handmade-12-butterfly-kiss.jpg` | [handmade](handmade.md) |

## Правила
- Имена: латиница, строчные, через дефис: `<раздел>-<тема>.<ext>` (портфолио) или `<раздел>-<N>-<тема>.jpg` (Handmade), кадры — `storyboardN-frame-NN.jpg`. WebP от автора оставляем как есть (не пережимать через ffmpeg `-q:v` — для webp это шкала 0–100, `3` = мусор).
- Фото/арт — JPEG качество ~80, длинная сторона ≤ 1600px; прозрачность — PNG; видео — MP4 H.264 + AAC.
- Всегда `alt` на русском, описывающий работу.

## Тесты
`page-load.spec.ts` (нет 404, все картинки загрузились, видео отдаются), аудит `PERF-WEIGHT` (первая загрузка ≈ 9 МБ — [KI-004](../known-issues.md#ki-004)). Ручная HR-RIGHTS-1.
