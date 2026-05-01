## ディレクトリ構成

itachi-p/
├── README.md          # Why・根本目的・現在地
├── POLICY.md          # AIへの指示仕様・運用ルール
├── REPO_STRUCTURE.md  # 本ファイル（構成定義）
├── INDEX.md           # docs/の索引（自動更新）
├── docs/              # 判断・思考ログ（随時追加）
│   ├── app-ideas.md   # アプリアイデア一元管理（日付なし・INDEX対象外）
│   └── YYYY-MM-DD_[slug].md
└── projects/          # 仮説検証プロジェクトの成果物置き場
└── YYYY-MM-DD_[name]/
├── assets/    # 非言語入力（Draw画像等）
└── exports/   # 成果物（HTML・PDF等）

## 各ファイルの役割

- `process-log.md`：廃止。役割はdocs/に統合。
- `projects/`はINDEX管理対象外。docs/からリンクで参照する。

## 命名規則

- docs：`YYYY-MM-DD_内容を表す英小文字ケバブ.md`
- 同日複数：`_01` `_02` サフィックス
- projects：`YYYY-MM-DD_プロジェクト名/`

## INDEX.mdの自動更新

GitHub Actionsで管理。docs/へのpush時にトリガー。
各mdファイル先頭の `> summary: 1行説明` を自動抽出してINDEX.mdに追記。
`app-ideas.md`はINDEX対象外。

## ローカル環境

- リポジトリ：`~/repos/itachi-p`
- エディタ：VSCode
- ターミナル：Warp
