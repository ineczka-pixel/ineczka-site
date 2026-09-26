# Фичи сайта — индекс

Каждый файл описывает одну функцию: **назначение → где в коде → как устроено → как менять → тесты → ручная проверка → известные проблемы**.
Шаблон для новой фичи: [_template.md](_template.md). Главный индекс — [CLAUDE.md](../../CLAUDE.md).

| Фича | Автотесты | Ручные проверки |
|---|---|---|
| [page-structure](page-structure.md) | `tests/e2e/page-load.spec.ts` | HR-SHARE-1 |
| [header-navigation](header-navigation.md) | `tests/e2e/navigation.spec.ts` | HR-DEVICES-1 |
| [hero](hero.md) | `navigation.spec.ts`, visual `top-*` | HR-VISUAL-1, HR-TEXT-2 |
| [decorative-splashes](decorative-splashes.md) | `page-load.spec.ts`, visual | HR-VISUAL-3 |
| [ai-services](ai-services.md) | `navigation.spec.ts`, audit LAYOUT-* | HR-VISUAL-2 |
| [portfolio-galleries](portfolio-galleries.md) | `lightbox.spec.ts`, audit CONTENT-PLACEHOLDERS | HR-IMAGES-2 |
| [storyboards](storyboards.md) | `lightbox.spec.ts` (раскадровки) | HR-IMAGES-3 |
| [video-works](video-works.md) | `lightbox.spec.ts` (видео), `page-load.spec.ts` | HR-VIDEO-1 |
| [handmade](handmade.md) | `lightbox.spec.ts` | HR-IMAGES-1 |
| [cta-blocks](cta-blocks.md) | `navigation.spec.ts` | — |
| [about](about.md) | visual `about-*` | HR-TEXT-1 |
| [contacts](contacts.md) | `tests/e2e/contacts.spec.ts` | HR-CONTACTS-1 |
| [lightbox](lightbox.md) | `tests/e2e/lightbox.spec.ts`, `accessibility.spec.ts` | HR-IMAGES-3, HR-VIDEO-1 |
| [assets](assets.md) | `page-load.spec.ts`, audit PERF-WEIGHT | HR-RIGHTS-1 |
