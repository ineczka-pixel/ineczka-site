---
title: Google Fonts делают тесты медленными и визуальные сравнения нестабильными
date: 2026-09-26
tags: [fonts, testing, visual, performance]
features: [docs/features/page-structure.md]
---
## Симптом
Каждый тест ждёт 5–10 с; скриншоты отличаются на 2–3% от прогона к прогону; в песочнице `ERR_CERT_AUTHORITY_INVALID` для fonts.googleapis.com.

## Причина
Шрифты грузятся по сети (через прокси с собственным CA); иногда успевают, иногда нет — текст рисуется то запасным, то веб-шрифтом.

## Решение
`openSite(page)` в e2e подменяет Google Fonts пустым CSS. `openSite(page, { fonts: true })` (visual/review) отдаёт шрифты
из закоммиченного кэша `tests/fixtures/fonts/` (при промахе — скачивает и сохраняет) и ждёт `document.fonts.ready`.
`ignoreHTTPSErrors: true` в конфиге. Итог: e2e 78 тестов ≈ 1 мин, visual стабилен.

## Как не наступить снова
Новые шрифты → удалить `tests/fixtures/fonts/*`, прогнать `npm run test:visual:update` один раз с сетью, закоммитить кэш.
