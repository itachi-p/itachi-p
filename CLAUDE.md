# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A personal knowledge repository for structured hypothesis-validation cycles. The primary output is **decision logs**, not software artifacts. Everything is designed to be re-fed into LLMs later, so structure matters more than prose.

Read `README.md` for the "Why", `POLICY.md` for operating rules, and `REPO_STRUCTURE.md` for directory conventions.

## AI interaction rules (from POLICY.md)

- No encouragement, moral evaluation, or emotional commentary
- Every judgment must come with a rationale: 採用 / 保留 / 破棄 + reason
- Prefer structure (tables, bullets, headings) over long-form text
- Don't produce outputs that only simulate verification

## Repository conventions

**docs/** — timestamped decision/thinking logs  
- Filename: `YYYY-MM-DD_kebab-slug.md` (multiple same day: `_01`, `_02`)  
- First line must be: `> summary: 1行の説明` — this is extracted by GitHub Actions into INDEX.md  
- `app-ideas.md` is exempt from INDEX and has no date prefix

**projects/** — hypothesis validation artifacts  
- Directory: `YYYY-MM-DD_project-name/`  
- `assets/` for images/uploads, `exports/` for HTML/PDF/JSX outputs  
- Not managed by INDEX.md; referenced from docs/ via links

**INDEX.md** — auto-generated, never edit manually. Rebuilt by GitHub Actions on every push that touches `docs/**/*.md` or `projects/**/*.md`.

## Git

- Branch: `main` only
- Commit messages: Conventional Commits format (`feat:`, `chore:`, `docs:`, etc.)
- Push at end of day or when a meaningful record is complete

## Hypothesis validation cycle (from POLICY.md)

When structuring new docs, follow this sequence:
1. 視点設定（顧客 / 現場 / 経営）
2. 不便・違和感の言語化
3. 仮説整理（Why / Who / What）
4. 最小構成で試作
5. 検証
6. 判断（採用/保留/破棄）＋根拠
7. 次の仮説への接続

## Claude Code operation rules

- 変更前に差分を提示し、明示的な承認を得てから実行する
- パッケージの自動インストールは行わない（提案のみ、実行は人間が判断）
- 外部URLへのアクセスが必要な場合は事前に確認する
- 「わかりました」と返答してから即実行しない（承認を待つ）
- ファイル削除・上書きは特に慎重に。差分確認なしでは実行しない
