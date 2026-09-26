# Лайтбокс (просмотрщик работ)

**Назначение:** открыть работу/видео/кадр раскадровки на весь экран.
**Где:** разметка `index.html` 535–542; JS 545–662.

## Разметка
`#lightbox-overlay` (fixed, `display:none`, клик по фону закрывает) → кнопка `.lightbox-close` ×, `<video id="lightbox-video">`, `<img id="lightbox-image">`, кнопки `#lightbox-prev` / `#lightbox-next`, `#lightbox-counter`.

## JS-функции
| Функция | Что делает |
|---|---|
| `openMedia(evt)` (583) | Кнопка с `data-video-src` → видео; иначе ищет внутри `<video>` или `<img>` и показывает. Сбрасывает `sequence = null`. |
| `openStoryboardFrame(evt)` (623) | Собирает все `.gallery-btn` ближайшего `.contact-sheet`, запоминает `sequence = {items, index}` |
| `render()` (548) | Если есть `sequence` — показывает текущий кадр, стрелки и «Кадр N из M»; иначе прячет стрелки/счётчик |
| `prevFrame` / `nextFrame` (639/647) | Листают в пределах последовательности (без зацикливания), `stopPropagation`, чтобы не закрыть оверлей |
| `closeLightbox()` (573) | Прячет оверлей, останавливает видео и снимает `src`, сбрасывает `sequence` |
| `keydown` (655) | Только при открытом оверлее: Esc — закрыть, ← → — листать |

Глобальное состояние одно: `var sequence`. Все обработчики — inline `onclick`, поэтому функции должны оставаться глобальными.

## Как изменить
- Новый тип медиа — ветка в `openMedia` + скрытый элемент в оверлее + сброс в `closeLightbox`.
- Не забудь: клик по картинке всплывает до оверлея и закрывает его (сейчас так задумано).

## Тесты
`tests/e2e/lightbox.spec.ts` (15 сценариев × desktop/mobile), `accessibility.spec.ts` (Enter на кнопке открывает).
Аудит `A11Y-LIGHTBOX`. Ручные HR-IMAGES-3, HR-VIDEO-1.

## Известные проблемы
[KI-008](../known-issues.md#ki-008) (фокус и role=dialog), [KI-009](../known-issues.md#ki-009) (нет свайпа).
