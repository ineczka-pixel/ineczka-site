# Plan: <Название фичи>

**Цель:** что увидит/сможет посетитель.
**Запрос автора:** цитата или пересказ.
**Затрагиваемые фичи:** [docs/features/<x>.md](../features/<x>.md), …
**Уроки из docs/solutions:** ссылки или «не найдено».
**Известные проблемы рядом:** KI-xxx.

## Validation Commands
- `npm run verify`

### Task 1: Тест на новое поведение
- [ ] Прочитать docs/features/<x>.md
- [ ] Добавить сценарии в tests/e2e/<x>.spec.ts (сейчас падают)
- [ ] Добавить ручные проверки HR-xxx в docs/testing/human-checklist.json

### Task 2: Реализация
- [ ] Изменить index.html (строки …), следуя docs/design-system.md
- [ ] Проверить мобильную ширину 375px (аудит LAYOUT-*)
- [ ] npm test зелёный

### Task 3: Compound
- [ ] Урок в docs/solutions/YYYY-MM-DD-<slug>.md (если было что-то неочевидное)
- [ ] Обновить docs/features/<x>.md (строки, «Как изменить», «История»), CLAUDE.md и docs/features/README.md при новой фиче
- [ ] Обновить docs/known-issues.md, если что-то исправлено или найдено

## Ручная проверка (после выполнения)
- HR-xxx — что должен посмотреть человек
