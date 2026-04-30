# Repository Structure & Rules

このドキュメントは `/Users/itachi-p/repos/itachi-p` の構成と運用ルールを定義する。
変更が生じた場合はこのファイルを更新し、コミットする。

---

## ローカル環境の全体像

```
/Users/itachi-p/
├── heiwa-sns/                        # Nagi SNS（現状維持、別管理）
├── repos/                            # 全リポジトリの親
│   ├── itachi-p/                     # 本リポジトリ（ドキュメント・判断ログ）
│   └── [仮説名-appname]/             # 検証用ミニアプリ（都度新規リポジトリ）
└── dev/                              # ローカル限定の作業場（Git管理外）
    └── scratch/                      # 使い捨て検証・一時ファイル
```

---

## 本リポジトリ（itachi-p）の構成

```
itachi-p/
├── README.md                         # 戦略・方針・自戒ルール
├── REPO_STRUCTURE.md                 # 本ファイル（構成と運用ルール）
├── INDEX.md                          # 全ドキュメントの索引（自動更新）
│
├── docs/                             # 日付横断の思考・判断ログ
│   ├── YYYY-MM-DD_[slug].md          # 1日1ファイル原則
│   └── ...
│
└── projects/                         # プロジェクト単位の記録
    └── YYYY-MM-DD_[project-name]/
        ├── process-log.md            # AIとの対話プロセス記録
        ├── decision.md               # 採用／保留／破棄の判断（人間が書く）
        ├── assets/                   # Draw画像・スクショなど非言語入力
        └── exports/                  # Claude DesignのHTML等、成果物
```

---

## 各ディレクトリの役割

### docs/
- 日付つきの思考・判断ログ
- プロジェクト横断の気づき、戦略メモ、ツール評価など
- 1日に複数書く場合は `_01` `_02` でサフィックス
- **slugの命名規則**：`YYYY-MM-DD_[内容を表す英小文字ケバブ].md`
  - 例：`2026-04-26_preference-extraction_01.md`
  - 例：`2026-04-30_claude-design-first-session.md`

### projects/
- プロジェクト単位で1ディレクトリ
- `process-log.md`：AIが生成する部分（対話・推論の記録）
- `decision.md`：**人間が書く部分**（評価・判断・次への接続）
- assets/、exports/ はファイルを置くだけ、特別な操作不要

### ミニアプリ・検証アプリ
- `itachi-p/` のサブディレクトリには**入れない**
- `~/repos/[仮説名-appname]/` として独立したリポジトリで管理
- `itachi-p/projects/` には記録（process-log.md等）だけを残す

---

## 運用ルール

### ファイル編集
- エディタ：VSCode（`~/repos/itachi-p` を開きっぱなし）
- 基本操作：マークダウン編集のみ、コードは触らない
- 音声入力を標準とし、誤変換はAIに文脈補完させる

### Git操作
- コミットメッセージ：VSCode or WarpのAIに生成させる（英文、手書きしない）
- pushのタイミング：1日の作業終了時、またはまとまった記録が完成した時点
- ブランチ：mainのみ、ブランチ運用は行わない

### インデックス更新（INDEX.md）
- GitHub Actionsで自動更新（後述）
- `docs/` または `projects/` に新規ファイルがpushされた時点でトリガー
- INDEX.mdに追記される内容：ファイルへのリンク＋ファイル先頭のサマリ1行

---

## GitHub Actions（自動インデックス更新）

設定ファイル：`.github/workflows/update-index.yml`

**動作：**
1. `docs/` または `projects/` へのpushを検知
2. 各MarkdownファイルのH1見出しと、ファイル内の `> summary:` タグの1行を抽出
3. INDEX.mdを自動再生成してコミット＆push

**summaryの書き方（各mdファイルの先頭に1行）：**
```
> summary: このファイルを1行で表す日本語の説明
```
この1行がINDEX.mdに自動で転記される。書かない場合はリンクのみ。

---

## コミットメッセージの規則（AIへの指示用）

AIにコミットメッセージを生成させる際の指示テンプレート：

```
以下の変更内容に対して、Conventional Commits形式で英文コミットメッセージを1行で生成してください。
- [変更内容を日本語で書く]
```

**Conventional Commits形式の例：**
- `docs: add process-log for seitai-dm-hagaki project`
- `docs: update preference-extraction notes`
- `chore: add REPO_STRUCTURE and INDEX files`
