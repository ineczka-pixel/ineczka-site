# CLAUDE.md — Ineczka site

Одностраничный статический сайт-портфолио **Ineczka — AI-CREATOR и Handmade** (Инна Войтюк).
Без фреймворков и сборки: один `index.html` (HTML + inline-стили + `<style>` + `<script>`) и папка `assets/`.
Работаем по методологии **Compound Engineering**: план → работа → тесты → ревью → *закрепить знание*,
чтобы каждая следующая задача была проще предыдущей.

> Всегда отвечай пользователю по-русски. Пользователь — автор сайта, не программист:
> объясняй результат простыми словами и показывай, что ей нужно проверить глазами.

## С чего начать любую задачу

1. Прочитай этот файл целиком.
2. Прочитай файл(ы) фич, которые затрагиваешь (индекс ниже) и [known-issues](docs/known-issues.md).
3. Поищи похожие уроки в [docs/solutions/](docs/solutions/README.md).
4. Новая функция или правка → скилл **`add-feature`** ([.claude/skills/add-feature/SKILL.md](.claude/skills/add-feature/SKILL.md)).
5. Нужно только проверить сайт → скилл **`site-testing`** ([.claude/skills/site-testing/SKILL.md](.claude/skills/site-testing/SKILL.md)).

## Команды

| Команда | Что делает |
|---|---|
| `npm ci` | установить Playwright и axe (браузер уже есть в облачной среде) |
| `npm run serve` | локальный сервер `http://localhost:4173` |
| `npm test` | функциональные e2e-тесты, desktop + mobile (**обязательно зелёные**) |
| `npm run test:visual` | сравнение со скриншотами-эталонами |
| `npm run test:visual:update` | обновить эталоны — **только после одобрения человеком** |
| `npm run test:audit` | аудит качества → `review/audit.json` (не блокирует) |
| `npm run review` | скриншоты + страница для человека `review/index.html` |
| `npm run verify` | **всё сразу** — единая команда перед коммитом, в CI и в ralphex |

## Архитектура и дизайн

- [docs/architecture.md](docs/architecture.md) — устройство файла, соглашения, как редактировать.
- [docs/design-system.md](docs/design-system.md) — цвета, шрифты, отступы, кнопки, классы.
- [docs/known-issues.md](docs/known-issues.md) — известные баги и долги (KI-xxx).

## Фичи (по файлу на каждую функцию)

Индекс: [docs/features/README.md](docs/features/README.md)

| Фича | Файл | Где в index.html |
|---|---|---|
| Каркас страницы, мета, шрифты | [page-structure.md](docs/features/page-structure.md) | 1–56, 562 |
| Шапка и меню | [header-navigation.md](docs/features/header-navigation.md) | 58–71 |
| Первый экран (герой) | [hero.md](docs/features/hero.md) | 73–85 |
| Декоративные кляксы | [decorative-splashes.md](docs/features/decorative-splashes.md) | CSS 30–31, секции |
| AI-CREATOR: карточки услуг | [ai-services.md](docs/features/ai-services.md) | 87–157 |
| Портфолио-ленты по направлениям | [portfolio-galleries.md](docs/features/portfolio-galleries.md) | 159–465 |
| Раскадровки (contact sheet) | [storyboards.md](docs/features/storyboards.md) | 191–314 |
| Видео-работы | [video-works.md](docs/features/video-works.md) | 317–341 |
| Handmade: картины из CD | [handmade.md](docs/features/handmade.md) | 477–523 |
| CTA-блоки «Стоимость» | [cta-blocks.md](docs/features/cta-blocks.md) | 467–473, 515–521 |
| Обо мне | [about.md](docs/features/about.md) | 525–531 |
| Контакты и футер | [contacts.md](docs/features/contacts.md) | 531–548 |
| Лайтбокс (просмотрщик) | [lightbox.md](docs/features/lightbox.md) | 553–560, JS 563–697 |
| Медиафайлы (assets) | [assets.md](docs/features/assets.md) | `assets/` |

## Тестирование

- [docs/testing/strategy.md](docs/testing/strategy.md) — полная система: 4 слоя проверок.
- [docs/testing/automation-matrix.md](docs/testing/automation-matrix.md) — **что Claude проверяет сам, а что может только человек**.
- [docs/testing/human-review.md](docs/testing/human-review.md) — как устроена страница ручной проверки.
- [docs/testing/human-checklist.json](docs/testing/human-checklist.json) — список ручных проверок (источник для страницы).

## Рабочий процесс

- [docs/workflow/adding-a-feature.md](docs/workflow/adding-a-feature.md) — цикл Compound Engineering для этого сайта.
- [docs/workflow/ralphex.md](docs/workflow/ralphex.md) — автономное выполнение планов через ralphex.
- [docs/plans/](docs/plans/README.md) — планы задач (формат совместим с ralphex).
- [docs/solutions/](docs/solutions/README.md) — накопленные уроки («compound»).

## Жёсткие правила

1. **Не ломай единый файл.** Весь сайт — `index.html`; не вводи сборщики, фреймворки, npm-зависимости для самого сайта. Dev-зависимости (Playwright) — только для тестов.
2. **Следуй существующему стилю:** inline-`style` на элементах, общие hover-эффекты — классами в `<style>`, JS — ES5 (`var`, `function`), без библиотек. Цвета — только из [design-system](docs/design-system.md).
3. **Любая новая интерактивность → e2e-тест** в `tests/e2e/`, любой новый визуальный блок → строка в `human-checklist.json`.
4. **`npm run verify` зелёный** перед каждым коммитом. Тест нельзя удалять или ослаблять, чтобы стало зелёным. Известный баг помечается `test.fail(true, 'KI-xxx: ...')` и заносится в known-issues.
5. **Эталоны скриншотов** (`tests/visual/__snapshots__`) обновляются только после того, как человек одобрил новый вид.
6. **Контакты, тексты о себе, выбор работ** — меняются только по прямой просьбе автора.
7. После задачи — **compound**: урок в `docs/solutions/`, обновить файл фичи и этот индекс, если появилась новая фича.
8. Коммиты — маленькие и осмысленные, по-английски или по-русски, в повелительном наклонении.
