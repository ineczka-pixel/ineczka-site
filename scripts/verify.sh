#!/usr/bin/env bash
# Полная автономная проверка сайта. Одна команда для Claude, CI и ralphex:
#   npm run verify
# Код выхода != 0 только если упали ФУНКЦИОНАЛЬНЫЕ (e2e) или визуальные тесты.
# Аудит и ревью-страница собираются всегда и не блокируют.
set -uo pipefail
cd "$(dirname "$0")/.."

[ -d node_modules ] || npm ci --silent

echo "▶ 1/4 Функциональные тесты (desktop + mobile)"
PW_JSON=test-results/e2e.json npx playwright test --project=e2e-desktop --project=e2e-mobile
E2E=$?

echo "▶ 2/4 Визуальная регрессия"
if ls tests/visual/__snapshots__/*.png >/dev/null 2>&1; then
  npx playwright test --project=visual
  VIS=$?
else
  echo "  эталонов нет — пропуск (создать: npm run test:visual:update)"; VIS=0
fi

echo "▶ 3/4 Аудит качества (не блокирует)"
npx playwright test --project=audit --reporter=line >/dev/null 2>&1 || true

echo "▶ 4/4 Скриншоты и страница для ручной проверки"
npx playwright test --project=review --reporter=line >/dev/null 2>&1 || true
node scripts/build-review.mjs

echo
if [ $E2E -eq 0 ] && [ $VIS -eq 0 ]; then
  echo "✅ Автотесты зелёные. Ручная проверка: review/index.html"
else
  echo "❌ Упали тесты (e2e=$E2E visual=$VIS). Отчёт: npx playwright show-report test-results/html"
fi
exit $(( E2E || VIS ))
