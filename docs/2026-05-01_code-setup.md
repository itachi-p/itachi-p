> summary: Claude Code導入——ターミナルCLI優先・VSCode拡張併用の構成を確定、Cursor無課金時との差異なしと判断

# Claude Codeセットアップと環境選定の記録

**日付**：2026-05-01
**判断**：Claude CodeはTerminal CLI + VSCode拡張の2本立てで運用確定。5/1〜5/5のメイン環境とする。

## 選定プロセス

選択肢は5通りあった：Terminal / VSCode / Desktop app / Web / JetBrains

**優先順位の判断根拠**

| 選択肢 | 判断 | 理由 |
|---|---|---|
| Terminal CLI | 採用・最優先 | git操作・リポジトリ連携が主作業のため |
| VSCode拡張 | 採用・併用 | 既に開きっぱなしの環境、追加コストゼロ |
| Desktop app | 保留 | このClaudeアプリのCodeタブと同一と判断、後回し |
| Web版 | 保留 | 貸与PC等インストール制限環境向け、現状不要 |
| JetBrains | 除外 | 現状の作業に不要、別途課金の可能性あり |

**VSCode vs Cursor**

無課金状態ではCursorとVSCodeに実質的な差異なしと判断。VSCodeを採用。

## 実施内容

- Terminal：Native Install完了（`claude --version` → 2.1.123確認）
- VSCode：拡張機能インストール完了
- GitHub連携：Claude Code経由で実施

## 判断

- **5/1〜5/5：Claude Codeをメイン環境として使用**
- 運用構成：ターミナル(Warp)上でのCLI（主）+ VSCode拡張（表示・編集補助）
- デスクトップアプリのCodeタブはCLI・VSCodeで完結するため基本不要
- Designは5/6(水)11:00リセットまで利用停止(残7%)

## 今日やったこと（リポジトリ整備）

Codeそのものの使用より、リポジトリ構造の整備に時間を割いた。

- README.md最適化（根本目的の明文化、不要セクション削除）
- POLICY.md整理（AIへの指示仕様に特化）
- REPO_STRUCTURE.md整理（構成定義に特化）
- GitHub Actions動作確認・INDEX.md自動更新確認
- docs/既存3ファイルのsummary記入
- v3・v4ファイル配置完了
- .gitignore追加（.claude/除外）

## 次のアクション

- [ ] Claude Codeで最初の仮説検証（仮説未定）
- [ ] 5/6以降：Design再開またはCowork試用
