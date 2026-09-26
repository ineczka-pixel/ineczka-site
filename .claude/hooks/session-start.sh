#!/usr/bin/env bash
# Готовит облачную сессию Claude Code: ставит dev-зависимости для тестов.
set -e
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"
[ -d node_modules/@playwright/test ] || npm ci --silent --no-audit --no-fund
