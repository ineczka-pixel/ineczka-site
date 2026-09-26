# Дизайн-система

## Цвета
| Токен | HEX | Где |
|---|---|---|
| Фиолетовый (бренд, AI) | `#782182` (hover `#631a6c`) | заголовки AI-CREATOR, `.btn-purple`, hover ссылок |
| Оливковый | `#768330` (hover `#667129`) | `h1`, большая карточка, `.btn-olive` |
| Синий (Handmade) | `#46509E` (hover `#3b4585`) | Handmade, `.btn-blue` |
| Бирюзовый | `#00A6A6` (hover `#00898f`) | `.btn-teal` |
| Текст | `#29292B` | основной текст, тёмные плашки |
| Вторичный текст | `#4A4A4D`, `#6C6B71` | абзацы, подписи |
| Светлый текст на тёмном | `#C9C9CD`, `#8C8C90` | CTA, футер |
| Фоны | `#FFFFFF`, `#FAFAFA`, `#F4F6FA`, `#363639` | секции, карточки, кнопки контактов |
| Линии | `#ECECEE`, `#3E3E41` | рамки, разделители |

## Шрифты
- **Manrope** 500/700/800 — `h1–h3`, `.font-display`.
- **Inter** 400/500/600 — основной текст.
- Размеры: `h1` 50px; `h2` `clamp(26px, 3vw, 36px)`; `h3` 16–20px; текст 14–19px; подписи 12–13px.

## Компоненты и классы
| Класс | Назначение |
|---|---|
| `.nav-link` | пункт меню, hover фиолетовый |
| `.btn-purple`, `.btn-olive`, `.btn-blue`, `.btn-teal` | кнопки (hover темнее); стиль кнопки inline: `padding:14–16px 28–32px; border-radius:8px; font-weight:700` |
| `.btn-outline-purple`, `.btn-outline-blue` | объявлены, пока не используются |
| `.card-hover` | подъём карточки при наведении (не используется) |
| `.deco-purple-splash`, `.deco-olive-splash` | кляксы |
| `.service-link`, `.service-link-light` | ссылки услуг |
| `.scroll-row`, `.scroll-item` | горизонтальная лента портфолио |
| `.gallery-btn` | кликабельное превью работы (обязателен `aria-label`) |
| `.contact-sheet` | сетка кадров раскадровки |
| `.contact-link`, `.lightbox-close` | кнопки контактов, закрыть лайтбокс |
| `.services-grid` | сетка услуг AI-CREATOR (2 колонки на телефоне) |
| `.masonry` | «кирпичная кладка» галереи Handmade (CSS columns) |
| `.hero-indent`, `.hero-space`, `.hero-gap` | отступы подзаголовка героя: на компьютере / на телефоне |

## Телефонная версия
Одна точка перелома: `@media (max-width: 640px)` в конце `<style>`. Inline-стили перебиваются через `!important`.

## Радиусы и отступы
Карточки 18px, CTA 16px, превью 12px, кнопки 8px. Секции `padding: 100px 24px`, контейнер 1180px.
