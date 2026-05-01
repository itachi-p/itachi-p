## ディレクトリ構成

itachi-p/
├── README.md          # Why・根本目的・現在地
├── POLICY.md          # AIへの指示仕様・運用ルール
├── REPO_STRUCTURE.md  # 本ファイル（構成定義）
├── INDEX.md           # 全ドキュメント索引（自動更新）
├── docs/              # 日付つき判断・思考ログ
│   ├── app-ideas.md   # アプリアイデア一元管理（日付なし）
│   └── YYYY-MM-DD_[slug].md
└── projects/          # 仮説検証プロジェクト
└── YYYY-MM-DD_[name]/
├── process-log.md   # AIとの対話記録
├── assets/          # 非言語入力（Draw画像等）
└── exports/         # 成果物

## 命名規則

- docs：`YYYY-MM-DD_内容を表す英小文字ケバブ.md`
- app-ideas.mdは例外（日付なし・追記型）
- projects：`YYYY-MM-DD_プロジェクト名/`
- 同日複数：`_01` `_02` サフィックス

## INDEX.mdの自動更新

GitHub Actionsで管理。docs/またはprojects/へのpush時にトリガー。
各mdファイル先頭の `> summary: 1行説明` を自動抽出してINDEX.mdに追記。
app-ideas.mdはINDEX自動更新の対象外とする。

## ローカル環境

- リポジトリ：`~/repos/itachi-p`
- エディタ：VSCode
- ターミナル：Warp
