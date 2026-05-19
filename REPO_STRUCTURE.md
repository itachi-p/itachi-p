# REPO_STRUCTURE.md

> 本ファイルはリポジトリの構成と命名規則を定義する。
> 構造変化があった際は本ファイルを更新する。最終更新: 2026-05-19

## ディレクトリ構成

```
itachi-p/
├── README.md           # Why・根本目的・現在地
├── POLICY.md           # AIへの指示仕様・運用ルール
├── REPO_STRUCTURE.md   # 本ファイル（構成定義）
├── INDEX.md            # docs/の索引（GitHub Actionsで自動更新）
├── REVIEW_STATUS.md    # docs内容確認・棚卸し作業の進捗管理（INDEX対象外）
├── CLAUDE.md           # Claude Code向けの指示
├── icon-192x192.png    # PWA用アイコン（旧Nagi SNS関連）
├── icon_1024.png       # 同上
│
├── docs/               # 判断・思考ログ
│   ├── app-ideas.md                          # アプリアイデア一元管理（日付なし・INDEX対象外）
│   └── YYYY-MM-DD_[slug].md                  # 個別ログ
│
├── projects/           # 仮説検証プロジェクトの成果物置き場
│   ├── YYYY-MM-DD_[name]/                    # 個別プロジェクト
│   │   ├── assets/                           # 非言語入力・素材
│   │   │   ├── uploads/                      # 外部からのアップロード
│   │   │   └── screenshots/                  # スクリーンショット
│   │   ├── exports/                          # 成果物（HTML・PDF・JSX等）
│   │   └── process-log.md（任意）            # プロジェクト固有のログ
│   │
│   └── thinking-tools/                       # 思考ツール成果物の横断置き場
│       ├── mindmaps/                         # マインドマップ（PNG/MD/.xmind等）
│       ├── mermaids/                         # Mermaid記法ファイル（.mmd）
│       └── TOCfE/                            # TOC for Education系
│           ├── clouds/                       # クラウド図（PNG）
│           ├── ambitious-target-trees/       # ATT（Mermaid記法MD等）
│           └── logic-branches/               # ロジックブランチ
│
└── tools/              # 自作ツール・スクリプト
    ├── HypothesisTimer.app/                  # macOSアプリ
    ├── timer.html                            # ブラウザ版タイマー
    ├── timer_app.py                          # Pythonタイマー実装
    └── button_preview.html                   # UI試作
```

## 各ファイル・ディレクトリの役割

### ルート直下のファイル

| ファイル | 役割 | INDEX対象 |
|---|---|---|
| README.md | Why・根本目的 | - |
| POLICY.md | How・運用ルール | - |
| REPO_STRUCTURE.md | 構成定義（本ファイル） | - |
| INDEX.md | docs/索引（自動更新） | - |
| REVIEW_STATUS.md | 棚卸し作業の進捗管理 | 対象外 |
| CLAUDE.md | Claude Code向け指示 | - |

### docs/

- 判断・思考ログを蓄積。日次更新が主。
- INDEX.mdに自動集約される（app-ideas.mdは例外）。
- `process-log.md` は廃止済み。役割はdocs/に統合。

### projects/

- 仮説検証プロジェクトの成果物置き場。
- INDEX管理対象外。docs/からリンクで参照する。
- 個別プロジェクト（`YYYY-MM-DD_[name]/`）と、横断的な思考ツール置き場（`thinking-tools/`）の2系統。

### projects/thinking-tools/

- マインドマップ、Mermaid、TOCfE系の図など、特定プロジェクトに属さない思考ツール成果物の横断置き場。
- `docs/2026-05-14_tool-selection-note.md` および `docs/2026-05-17_mindmap-tool-policy.md` での判断に基づき、ツール種別ごとにサブディレクトリを切る運用。

### tools/

- 自作の小規模ツール・スクリプト類。
- 現状は HypothesisTimer 関連のみ。今後の自作物もここに集約。

## 命名規則

### ファイル名の日付

**実生成日（または実取得日）とする**。

- 元データの日付ではなく、そのファイル自体が作られた日を使う
- 理由：「いつ何をしたか」が正確に追える方が、後からの再構成・LLM再投入に有利
- 並び順の見やすさよりも実態との一致を優先

### 関連する複数ファイルの命名

同一テーマで関連する成果物が複数日にまたがる場合、**slug（日付・拡張子以外の部分）を揃える**。

例：
```
projects/thinking-tools/mindmaps/2026-05-17_disability-employment-current-state.png
projects/thinking-tools/mindmaps/2026-05-18_disability-employment-current-state.md
projects/thinking-tools/mindmaps/2026-05-18_disability-employment-current-state.xmind
```

slugが同一であることから「同じテーマの異なる成果物」と一覧で識別可能になる。

### docs/ のファイル名

- 形式：`YYYY-MM-DD_kebab-slug.md`
- 同日複数：`_01` `_02` サフィックス
- slugは英小文字・ハイフン区切り（kebab-case）を基本とする
- 例外：日本語タイトルが意味的に重要な場合は許容（例：`2026-05-15_ボーダレス・ジャパン応募案.md`）

### projects/ のディレクトリ名

- 形式：`YYYY-MM-DD_project-name/`
- 横断的な思考ツール置き場（`thinking-tools/`）は日付なし

### `> summary:` 行

- docs/配下の各ファイル先頭に `> summary: 1行説明` を記載
- GitHub Actions が抽出して INDEX.md に反映
- `app-ideas.md` は INDEX 対象外なので不要

## INDEX.mdの自動更新

- GitHub Actions で管理。`docs/` への push 時にトリガー。
- 各mdファイル先頭の `> summary: 1行説明` を自動抽出してINDEX.mdに追記。
- `app-ideas.md` および `projects/` 配下はINDEX対象外。

## ローカル環境

- リポジトリ：`~/repos/itachi-p`
- エディタ：VSCode
- ターミナル：Warp

## 更新履歴

| 日付 | 変更内容 |
|---|---|
| 2026-04-30 | 初版作成 |
| 2026-05-01 | POLICY分離 |
| 2026-05-19 | tree結果反映で全面更新。`projects/thinking-tools/` 配下・`tools/` 配下・`REVIEW_STATUS.md` を追加。日付ルール（実生成日）とslug共有ルールを明文化 |
