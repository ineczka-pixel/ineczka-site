---
title: Chromium из Playwright не воспроизводит H.264 mp4
date: 2026-09-26
tags: [video, testing, playwright]
features: [docs/features/video-works.md]
---
## Симптом
Тест видео: `readyState` остаётся 0, хотя файл отдаётся с кодом 200.

## Причина
Сборка Chromium, которую ставит Playwright, без проприетарных кодеков: `canPlayType('video/mp4; codecs="avc1.42E01E"') === ''`.
Видео сайта — H.264 + AAC.

## Решение
Тест проверяет то, что можно (открытие, `src`, остановка при закрытии), а воспроизведение — только если браузер умеет H.264;
иначе добавляет аннотацию `human-check` → пункт HR-VIDEO-1 на странице ревью. Полная автоматическая проверка:
`PW_CHANNEL=chrome npm test` на машине с Google Chrome.

## Как не наступить снова
Не считать «видео не играет в тесте» багом сайта, пока не проверен `canPlayType`.
