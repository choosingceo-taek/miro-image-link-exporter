#!/bin/bash
set -euo pipefail

# Only relevant for Claude Code on the web: each session runs in a fresh
# container, so user-scope (~/.claude) state doesn't persist across sessions
# and must be reinstalled every time.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

SKILL_REPO="https://github.com/multica-ai/andrej-karpathy-skills.git"
SKILL_NAME="karpathy-guidelines"
SKILLS_DIR="$HOME/.claude/skills"
TARGET_DIR="$SKILLS_DIR/$SKILL_NAME"

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

git clone --depth 1 --quiet "$SKILL_REPO" "$TMP_DIR"

mkdir -p "$SKILLS_DIR"
rm -rf "$TARGET_DIR"
cp -r "$TMP_DIR/skills/$SKILL_NAME" "$TARGET_DIR"

echo "Installed $SKILL_NAME skill to $TARGET_DIR (user scope)"
