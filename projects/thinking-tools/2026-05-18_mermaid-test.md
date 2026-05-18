# Mermaid レンダリング確認用サンプル

GitHubでこのファイルを開いた時に、以下の各ブロックが図としてレンダリングされるかを確認する。

---

## 1. flowchart TD(上から下)

ATTやロジックブランチに向く。

```mermaid
flowchart TD
    A["野心的目標\n行動習慣を意図通りにデザインできる"] 
    B["障害1\n衝動性が強く\n方針より衝動を優先してしまう"]
    C["障害2\n環境の強制力が弱く\n自分で破れてしまう"]
    D["障害3\n動機がhave toに留まり\nwant toになっていない"]
    E["中間目標1\n破れない構造を\n環境側に作る"]
    F["中間目標2\nwant toとなる\n動機を特定する"]
    G["中間目標3\n最初の成功体験を\n1つ作る"]
    
    A --> B
    A --> C
    A --> D
    B --> E
    C --> E
    D --> F
    E --> G
    F --> G
```

---

## 2. flowchart LR(左から右)

因果関係や処理フローに向く。

```mermaid
flowchart LR
    A["衝動が発生"] --> B{"23:30を\n過ぎているか?"}
    B -->|Yes| C["PC前から\n物理的に離れる"]
    B -->|No| D["作業を継続"]
    C --> E["入浴 → 就寝"]
    D --> F{"0:00を\n過ぎたか?"}
    F -->|Yes| G["作業を\n翌朝リストへ移す"]
    F -->|No| D
    G --> E
```

---

## 3. mindmap(放射状)

簡易な階層構造に向く。複雑なものはPNG静画の方が良い。

```mermaid
mindmap
  root((行動習慣\nデザイン))
    動機
      自己コントロールの実感
      わかってるのにできない自分からの解放
      成功体験の獲得
    障害
      衝動性
      環境の強制力不足
      動機がhave to止まり
    手段
      環境デザイン
      If-then ルール
      紙とペンによる自己対話
```

---

## 4. TOCfEクラウド図の代替表現(flowchart LR)

本来のクラウド図の構造を完全再現はできないが、参考として。

```mermaid
flowchart LR
    A["A\n共通目的\n社会的信用の\n維持"] --> B
    A --> C
    B["B\n要求\n身体・社会的\nリズムの安定"] --> D["D\n行動\n決めた時間に\n寝始める"]
    C["C\n要求\n今やりたいことを\n気が済むまで続ける"] --> DP["D'\n行動\n深夜まで\n活動継続(現状)"]
    D <-->|対立| DP
    
    style A fill:#2C3E50,color:#fff
    style B fill:#27AE60,color:#fff
    style C fill:#E67E22,color:#fff
    style D fill:#16A085,color:#fff
    style DP fill:#D35400,color:#fff
```

---

## 確認事項

- [ ] flowchart TD がレンダリングされるか
- [ ] flowchart LR がレンダリングされるか
- [ ] mindmap がレンダリングされるか
- [ ] クラウド代替表現でどこまで構造が伝わるか
- [ ] 日本語テキストが文字化けしないか

---

*このファイルは確認後、削除またはprojects/thinking-tools/配下に移動する*
