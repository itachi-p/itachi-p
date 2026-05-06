> summary: Claude Code CLIのキーバインド変更検証・4時間かけて「Enter以外での送信設定は不可能」と判明

# Claude Code CLIキーバインド変更検証：結論「変更不可」

## 日付
2026-05-06

## 実施内容

実装なし。Claude Code CLIのキーバインド設定の変更検証のみ。

## 発端

Claude Codeへの入力途中での誤送信が多発。Enterキーによる即送信をCmd+Enterまたはその他のキーに変更しようとした。

## 検証記録

| 試行 | 結果 |
|---|---|
| Cmd+Enter → 送信に変更 | 改行のみ、送信不可 |
| ~/.claude.json の enter-to-steer-in-realtime を 0 に変更 | 変化なし |
| tengu_keybinding_customization_release を false に変更 | 変化なし |
| editorMode を normal に変更 | 変化なし |
| keybindings.jsonでenter→newline, shift+enter→submit | shift+enterも改行のみ |
| keybindings.jsonでenter→newline, meta+enter→submit | meta+enterも改行のみ |
| Warpのキーバインド設定でcontrol+j, option+Enter | いずれも無効 |
| デフォルト（bindings: []）に戻す | Enter送信に復帰 |

## 判断

| 項目 | 判断 | 根拠 |
|---|---|---|
| CLI版Claude CodeのEnter以外での送信設定 | 不可能 | 4時間の検証で確認。どの設定を変更しても改行のみになり送信手段が失われる |
| Enterキーによる即送信 | 受け入れ | 変更手段が存在しない。誤送信は入力の工夫で対処するしかない |

## 気づき

- Vimモードが有効になっていたことが発端。`/config`からEditorModeをnormalに戻すべきだったが、送信できない状態では`/config`自体が打てないという詰み状態が発生
- WarpのAIはClaude Codeが解決できなかった問題を解決するケースが複数あった（タイマーアプリのPythonエラー、今回のキーバインド調査途中）。ターミナルの実行結果をリアルタイムで読める点が優位性の可能性。ただし無料枠に上限あり、今回は途中で切れた
- 公式ドキュメントには`chat:newline`と`chat:submit`のremapが可能と記載があるが、実際には機能しない
- CLIツールの設定変更は「送信できなくなる前に戻す手段を確保してから行う」べきだった

## 何が間違っていたか（自戒ログ）

- 「誤送信が多い」という軽微な問題に対して、送信手段そのものを失うリスクのある設定変更を行った
- 一手ずつ戻せる状態を確認しながら進めるべきだった
- 4時間を費やした割に得られたのは「できない」という事実のみ。ただしこれも記録として価値がある

## 次のアクション

- 気力が回復したら朝引き鶏仮説の着手
- 長文入力の回避策（いずれか）：
  - Ctrl+eで外部エディタを起動して書いてから送信
  - 音声入力モードで文字起こし→多少の誤変換は許容してそのまま送信
  - 短文に分割して送信する習慣をつける
