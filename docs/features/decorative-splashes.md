# Декоративные кляксы

**Назначение:** фирменные акварельные пятна — фиолетовое и оливковое.
**Где:** CSS-классы `.deco-purple-splash`, `.deco-olive-splash` (`index.html` 21–22); используются в `#top` (57–58), `#ai-creator` (71), `#contacts` (514–515).

## Как устроено
Пустой `div` с классом (фон `assets/splash-*.png`, `background-size: contain`) + inline: `position:absolute`, размеры, `opacity`, `transform: rotate(...)`. Родительская секция имеет `position:relative; overflow:hidden`, поэтому пятна обрезаются по краю секции.

## Как изменить
Скопировать существующий `div`, поменять `top/left/right/bottom`, `width/height`, `opacity`, угол. Контент секции должен быть в `position: relative` контейнере, чтобы быть над пятном.

## Тесты
- `page-load.spec.ts`: файлы `splash-*.png` отдаются.
- Визуальные эталоны всех секций.
- Ручные: HR-VISUAL-3 (не перекрывают ли текст, гармоничны ли).
