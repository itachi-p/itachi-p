// postcards.jsx — 整体院DMハガキ 3案
// パステル × ワーキングマザー × 紹介キャンペーン主役 × 金額表示なし
//
// レイアウト戦略：
//   - 全案、絶対配置をやめてflexの縦積みに変更（重なり防止）
//   - 各カードは [余白16px → header → spacer → 主役 → spacer → 期間 → footer (QR)] の順
//   - QRはfooter内に配置し、必ず下端から離す
//   - 金額・割引数字（50% OFF / 3,000円 等）は全削除。「半額」の語のみで表現

const MM = 3.78;
const PC_W = Math.round(100 * MM); // 378
const PC_H = Math.round(148 * MM); // 559

// ─────────────────────────────────────────────────────────────
// TWEAK DEFAULTS
// ─────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "rosemint",
  "mood": "soft",
  "duoEmphasis": "balanced",
  "sendMonth": 4
}/*EDITMODE-END*/;

// ─────────────────────────────────────────────────────────────
// CAMPAIGN PERIOD — 送付月の翌月1日 〜 さらに +3ヶ月後の1日
// ─────────────────────────────────────────────────────────────
function campaignPeriod(sendMonth) {
  const wrap = (m) => ((m - 1) % 12) + 1;
  const f = wrap(sendMonth + 1);
  const t = wrap(sendMonth + 4);
  return {
    short: `${f}月1日 → ${t}月1日`,
    fromLabel: `${f}月1日`,
    toLabel: `${t}月1日`,
  };
}

// ─────────────────────────────────────────────────────────────
// PALETTES
// ─────────────────────────────────────────────────────────────
const PALETTES = {
  rosemint: {
    label: "Rose & Mint", sub: "ペールピンク × ミント",
    paper: "#fdf6f3", primary: "#e8a8b3", secondary: "#a8d4c4",
    accent: "#c47a85", ink: "#5a3d44", inkSoft: "#8a6e74",
    line: "#e8d2d6", chip: "#fce8ea", chip2: "#dff0ea",
  },
  creamlavender: {
    label: "Cream & Lavender", sub: "クリーム × ラベンダー",
    paper: "#fbf9f3", primary: "#c8b8dc", secondary: "#f0d9a8",
    accent: "#8e6fb8", ink: "#3f3a52", inkSoft: "#6b6378",
    line: "#e2dceb", chip: "#ece4f3", chip2: "#faecc9",
  },
  yellowsage: {
    label: "Yellow & Sage", sub: "ペールイエロー × セージ",
    paper: "#fbf8ed", primary: "#c5d4a8", secondary: "#f3dca0",
    accent: "#7a9357", ink: "#3e4a30", inkSoft: "#6b7560",
    line: "#dde3cf", chip: "#e8eed8", chip2: "#fbeec5",
  },
};

const MOODS = {
  soft:    { label: "ふんわり",     decorOpacity: 1,    radius: 18, decorScale: 1 },
  clean:   { label: "すっきり",     decorOpacity: 0.5,  radius: 10, decorScale: 0.7 },
  playful: { label: "ぷち華やか",   decorOpacity: 1,    radius: 22, decorScale: 1.2 },
};

const DUO_EMPHASIS = {
  subtle:    { label: "控えめ",   showBadge: false, headlineWeight: 500, mainSize: 22 },
  balanced:  { label: "バランス", showBadge: true,  headlineWeight: 600, mainSize: 26 },
  strong:    { label: "しっかり", showBadge: true,  headlineWeight: 700, mainSize: 30 },
};

const CLINIC = {
  name: "いろは整体院",
  nameEn: "IROHA Seitai",
  tagline: "毎日がんばる、あなたの背中に。",
  address: "〒000-0000 東京都〇〇区〇〇1-2-3",
  phone: "03-0000-0000",
  hours: "平日 10:00–20:00 / 土 10:00–18:00",
  holiday: "日曜・祝日",
};

// ─────────────────────────────────────────────────────────────
// Reusable
// ─────────────────────────────────────────────────────────────
const QRBlock = ({ size = 78, palette, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
    <div style={{
      width: size, height: size,
      background: "#fff",
      border: `1.5px solid ${palette.ink}`,
      borderRadius: 4,
      position: "relative",
      display: "grid", placeItems: "center",
      flexShrink: 0,
    }}>
      {[
        { top: 6, left: 6 }, { top: 6, right: 6 }, { bottom: 6, left: 6 }
      ].map((p, i) => (
        <div key={i} style={{
          position: "absolute", ...p,
          width: 14, height: 14,
          border: `2.5px solid ${palette.ink}`,
          borderRadius: 2,
        }} />
      ))}
      <div style={{ fontSize: 8, color: palette.inkSoft, fontFamily: "ui-monospace, monospace" }}>QR</div>
    </div>
    {label && (
      <div style={{
        fontSize: 8, color: palette.ink, letterSpacing: "0.06em",
        fontWeight: 600, textAlign: "center", lineHeight: 1.4,
      }}>{label}</div>
    )}
  </div>
);

const StampBox = ({ palette }) => (
  <div style={{
    position: "absolute", top: 14, right: 14,
    width: 56, height: 70,
    border: `1px dashed ${palette.line}`,
    borderRadius: 4,
    display: "grid", placeItems: "center",
    fontSize: 8, color: palette.inkSoft, textAlign: "center", lineHeight: 1.4,
  }}>切手<br />または<br />料金別納</div>
);

const PostcardFrame = ({ children, label, bg }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    <div style={{
      fontSize: 10, color: "rgba(60,50,40,.55)",
      letterSpacing: "0.12em", fontFamily: "ui-monospace, monospace",
      textTransform: "uppercase",
    }}>{label}</div>
    <div style={{
      width: PC_W, height: PC_H,
      background: bg,
      boxShadow: "0 2px 12px rgba(60,40,40,.08), 0 0 0 1px rgba(0,0,0,.04)",
      position: "relative",
      overflow: "hidden",
      borderRadius: 2,
    }}>{children}</div>
  </div>
);

// 「あなた」+「お友だち」二重マーク（金額なし版）
const DuoMark = ({ palette, size = 56 }) => (
  <div style={{ display: "inline-flex", alignItems: "center" }}>
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: palette.chip,
      border: `1.5px solid ${palette.primary}`,
      display: "grid", placeItems: "center",
      fontSize: size * 0.22, fontWeight: 700, color: palette.accent,
      fontFamily: '"Noto Sans JP", sans-serif',
      letterSpacing: "0.04em",
    }}>あなた</div>
    <div style={{
      width: size * 0.5, height: 1,
      background: palette.line,
      margin: `0 ${size * -0.06}px`,
    }} />
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: palette.chip2,
      border: `1.5px solid ${palette.secondary}`,
      display: "grid", placeItems: "center",
      fontSize: size * 0.18, fontWeight: 700, color: palette.ink,
      fontFamily: '"Noto Sans JP", sans-serif',
      letterSpacing: "0.04em",
      marginLeft: -size * 0.12,
    }}>お友だち</div>
  </div>
);

// 5弁の小さな野花（パステルパレットに馴染む単弁花）
const Flower5 = ({ x, y, size = 6, fill, accent, rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${size / 6})`}>
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx="0" cy="-3" rx="2.2" ry="3.2" fill={fill}
        transform={`rotate(${a})`} opacity="0.85" />
    ))}
    <circle cx="0" cy="0" r="1.4" fill={accent} />
  </g>
);

// 小さな葉
const Leaf = ({ x, y, size = 5, fill, rotate = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${size / 5})`}>
    <ellipse cx="0" cy="0" rx="4" ry="2" fill={fill} opacity="0.7" />
  </g>
);

// 花リース枠 — 親要素の実寸に追従するSVG。ResizeObserverで親サイズを取得し、
// 実際のカードのborder-radius/角に沿って花と葉を配置する。
const FloralBorder = ({ palette, density = 1, radius = 18 }) => {
  const ref = React.useRef(null);
  const [size, setSize] = React.useState({ w: 0, h: 0 });

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !el.parentElement) return;
    const update = () => {
      const r = el.parentElement.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  if (w < 10 || h < 10) {
    return <div ref={ref} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
  }

  // 各辺で花と葉を均等配置（角の丸みを避けて、両端から margin 分だけ内側）
  const margin = radius + 6;
  const step = Math.max(16, 22 / density);
  const items = [];

  // 上辺・下辺
  const topCount = Math.max(2, Math.floor((w - margin * 2) / step));
  for (let i = 0; i <= topCount; i++) {
    const x = margin + ((w - margin * 2) * i) / topCount;
    items.push({ x, y: 4, kind: i % 2 === 0 ? "flower" : "leaf", rot: ((x * 13) % 60) - 30 });
    items.push({ x, y: h - 4, kind: i % 2 === 0 ? "leaf" : "flower", rot: ((x * 17) % 60) - 30 });
  }
  // 左辺・右辺
  const sideCount = Math.max(2, Math.floor((h - margin * 2) / step));
  for (let i = 0; i <= sideCount; i++) {
    const y = margin + ((h - margin * 2) * i) / sideCount;
    items.push({ x: 4, y, kind: i % 2 === 0 ? "flower" : "leaf", rot: ((y * 11) % 60) - 30 });
    items.push({ x: w - 4, y, kind: i % 2 === 0 ? "leaf" : "flower", rot: ((y * 19) % 60) - 30 });
  }
  // 4隅 — 角の内側、border-radiusの円弧上に少し置く
  const cornerOffset = radius * 0.55;
  const corners = [
    { x: cornerOffset + 2, y: cornerOffset + 2, side: "tl" },
    { x: w - cornerOffset - 2, y: cornerOffset + 2, side: "tr" },
    { x: cornerOffset + 2, y: h - cornerOffset - 2, side: "bl" },
    { x: w - cornerOffset - 2, y: h - cornerOffset - 2, side: "br" },
  ];
  corners.forEach((c, i) => {
    items.push({ x: c.x, y: c.y, kind: "flower", rot: i * 30, big: true });
  });

  return (
    <>
      <div ref={ref} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {/* カード実体の border-radius と一致した、内側のうすい補助枠 */}
        <rect x="2" y="2" width={w - 4} height={h - 4} rx={radius - 2}
          fill="none" stroke={palette.line} strokeWidth="1" opacity="0.55" />
        {items.map((it, i) =>
          it.kind === "flower" ? (
            <Flower5 key={i} x={it.x} y={it.y}
              size={it.big ? 7.5 : 6}
              fill={i % 3 === 0 ? palette.secondary : palette.primary}
              accent={palette.accent} rotate={it.rot} />
          ) : (
            <Leaf key={i} x={it.x} y={it.y} size={5}
              fill={i % 2 === 0 ? palette.secondary : palette.primary}
              rotate={it.rot} />
          )
        )}
      </svg>
    </>
  );
};

// 期間バー（共通パーツ）
const PeriodBar = ({ palette, period, variant = "ghost" }) => {
  if (variant === "filled") {
    return (
      <div style={{
        background: palette.ink, color: palette.paper,
        borderRadius: 6,
        padding: "7px 14px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 8, letterSpacing: "0.18em", fontWeight: 700, opacity: 0.7 }}>
          有効期間
        </span>
        <span style={{
          fontSize: 11, fontWeight: 700,
          fontFamily: '"Noto Serif JP", serif',
        }}>
          {period.fromLabel} <span style={{ opacity: .5, margin: "0 4px" }}>〜</span> {period.toLabel}
        </span>
      </div>
    );
  }
  return (
    <div style={{
      borderTop: `1px dashed ${palette.line}`,
      borderBottom: `1px dashed ${palette.line}`,
      padding: "7px 0",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <span style={{
        fontSize: 8, letterSpacing: "0.18em", color: palette.inkSoft,
        fontWeight: 700,
      }}>CAMPAIGN PERIOD</span>
      <span style={{
        fontSize: 11, color: palette.ink, fontWeight: 600,
        fontFamily: '"Noto Serif JP", serif',
      }}>
        {period.fromLabel} <span style={{ color: palette.primary, margin: "0 4px" }}>〜</span> {period.toLabel}
      </span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// Variation A — ふんわり手紙
// 縦flow: header → headline → DuoMark → message → period → QR footer
// ═══════════════════════════════════════════════════════════════
const VariationA_Front = ({ palette, mood, duo, period }) => (
  <PostcardFrame label="A — 通信面 / Front" bg={palette.paper}>
    {/* 装飾SVG (背景レイヤー、コンテンツとは重ならない) */}
    <svg width={PC_W} height={PC_H} viewBox={`0 0 ${PC_W} ${PC_H}`}
      style={{ position: "absolute", inset: 0, opacity: mood.decorOpacity, pointerEvents: "none" }}>
      <circle cx="32" cy="34" r="5" fill={palette.primary} opacity="0.45" />
      <circle cx={PC_W - 36} cy="38" r="7" fill={palette.secondary} opacity="0.5" />
      <circle cx={PC_W - 18} cy="78" r="3" fill={palette.primary} opacity="0.55" />
      <circle cx="22" cy="92" r="3" fill={palette.secondary} opacity="0.55" />
      <ellipse cx={PC_W - 26} cy={PC_H - 200} rx="10" ry="4" fill={palette.primary} opacity="0.3" transform={`rotate(20 ${PC_W - 26} ${PC_H - 200})`} />
      <ellipse cx="20" cy={PC_H - 240} rx="10" ry="4" fill={palette.secondary} opacity="0.35" transform={`rotate(-20 20 ${PC_H - 240})`} />
    </svg>

    {/* 縦flow */}
    <div style={{
      position: "relative", zIndex: 1,
      width: "100%", height: "100%",
      padding: "20px 22px 18px",
      display: "flex", flexDirection: "column",
      boxSizing: "border-box",
    }}>
      {/* header: 院名 */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: 8, letterSpacing: "0.4em", color: palette.inkSoft,
          fontFamily: "ui-monospace, monospace",
        }}>{CLINIC.nameEn.toUpperCase()}</div>
        <div style={{
          fontSize: 15, color: palette.ink, fontWeight: 600,
          fontFamily: '"Noto Serif JP", serif',
          letterSpacing: "0.18em", marginTop: 3,
        }}>{CLINIC.name}</div>
      </div>

      {/* headline */}
      <div style={{ textAlign: "center", marginTop: 22 }}>
        <div style={{
          fontSize: duo.mainSize - 2, color: palette.ink,
          fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
          fontWeight: duo.headlineWeight, lineHeight: 1.5,
          letterSpacing: "0.04em",
        }}>
          お友だちと、<br />
          <span style={{ color: palette.accent }}>ふたりで通う</span>春。
        </div>
      </div>

      {/* オファーカード — 花リース枠 */}
      <div style={{
        marginTop: 22,
        background: "#fff",
        borderRadius: mood.radius,
        padding: "26px 22px 22px",
        position: "relative",
        boxShadow: `0 3px 0 ${palette.line}`,
      }}>
        {/* 花リース枠（カード実寸に追従） */}
        <FloralBorder palette={palette} density={mood.decorScale} radius={mood.radius} />

        {duo.showBadge && (
          <div style={{
            position: "absolute", top: -10, left: "50%",
            transform: "translateX(-50%)",
            background: palette.accent, color: "#fff",
            padding: "3px 12px", borderRadius: 999,
            fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
            whiteSpace: "nowrap",
            zIndex: 2,
          }}>ご紹介キャンペーン</div>
        )}
        <div style={{
          display: "flex", justifyContent: "center", marginBottom: 10,
          position: "relative", zIndex: 1,
        }}>
          <DuoMark palette={palette} size={42} />
        </div>
        <div style={{
          textAlign: "center",
          fontSize: 13, color: palette.ink, lineHeight: 1.65,
          fontFamily: '"Noto Serif JP", serif',
          fontWeight: 600,
          position: "relative", zIndex: 1,
        }}>
          ご紹介者さまも、お友だちも<br />
          <span style={{ color: palette.accent, fontSize: 16, fontWeight: 700 }}>
            どちらも初回が半額に。
          </span>
        </div>
      </div>

      {/* やわらかいリード */}
      <div style={{
        textAlign: "center",
        fontSize: 10, color: palette.inkSoft,
        marginTop: 12, lineHeight: 1.85,
      }}>
        最後にお会いしてから少し経ちました。<br />
        毎日がんばるあなたへ、ささやかなご案内です。
      </div>

      {/* spacer */}
      <div style={{ flex: 1 }} />

      {/* period */}
      <PeriodBar palette={palette} period={period} variant="ghost" />

      {/* footer: 説明 + QR */}
      <div style={{
        marginTop: 12,
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        gap: 12,
      }}>
        <div style={{ flex: 1, fontSize: 9, color: palette.inkSoft, lineHeight: 1.6 }}>
          <div style={{ fontWeight: 700, color: palette.ink, fontSize: 10, marginBottom: 3 }}>
            お申込みはこちら
          </div>
          ハガキご持参または<br />QRコードからのご予約で適用
        </div>
        <QRBlock size={72} palette={palette} label="キャンペーン詳細" />
      </div>
    </div>
  </PostcardFrame>
);

// ═══════════════════════════════════════════════════════════════
// Variation B — ふたり並列 / 便箋仕立て
// ═══════════════════════════════════════════════════════════════
const VariationB_Front = ({ palette, mood, duo, period }) => (
  <PostcardFrame label="B — 通信面 / Front" bg={palette.paper}>
    <div style={{
      width: "100%", height: "100%",
      padding: "22px 24px 18px",
      display: "flex", flexDirection: "column",
      boxSizing: "border-box",
    }}>
      {/* ヘッダー罫線 */}
      <div style={{
        paddingBottom: 10,
        borderBottom: `1px solid ${palette.line}`,
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
      }}>
        <div style={{
          fontSize: 12, color: palette.ink, fontWeight: 600,
          fontFamily: '"Noto Serif JP", serif',
          letterSpacing: "0.12em",
        }}>{CLINIC.name}</div>
        <div style={{
          fontSize: 7.5, letterSpacing: "0.25em", color: palette.inkSoft,
          fontFamily: "ui-monospace, monospace",
        }}>FOR YOU & A FRIEND</div>
      </div>

      {/* 大見出し */}
      <div style={{ marginTop: 24 }}>
        <div style={{
          fontSize: duo.mainSize - 2, color: palette.ink, lineHeight: 1.45,
          fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
          fontWeight: duo.headlineWeight, letterSpacing: "0.04em",
        }}>
          いつもの<span style={{ color: palette.accent }}>がんばり</span>に、<br />
          ご褒美を、<br />
          ふたりぶん。
        </div>
        <div style={{
          marginTop: 14,
          fontSize: 10, color: palette.inkSoft, lineHeight: 1.85,
        }}>
          お友だちを誘って一緒にいらしていただけたら、<br />
          ご紹介者さまも、お友だちも、初回が半額になります。
        </div>
      </div>

      {/* ふたりカード */}
      <div style={{
        marginTop: 16,
        background: palette.chip,
        borderRadius: mood.radius,
        padding: "16px 16px",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <DuoMark palette={palette} size={50} />
        <div style={{ flex: 1, borderLeft: `1px solid ${palette.line}`, paddingLeft: 14 }}>
          <div style={{
            fontSize: 8.5, color: palette.inkSoft, letterSpacing: "0.12em",
            fontWeight: 700, marginBottom: 4,
          }}>BOTH HALF OFF</div>
          <div style={{
            fontSize: 14, fontWeight: 700, color: palette.ink, lineHeight: 1.5,
            fontFamily: '"Noto Serif JP", serif',
          }}>
            お二人とも<br />
            <span style={{ color: palette.accent }}>初回半額</span>でご案内
          </div>
        </div>
      </div>

      {/* spacer */}
      <div style={{ flex: 1 }} />

      {/* 期間 */}
      <PeriodBar palette={palette} period={period} variant="ghost" />

      {/* footer: 院長メモ + QR */}
      <div style={{
        marginTop: 12,
        display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12,
      }}>
        <div style={{
          flex: 1,
          fontSize: 11, color: palette.ink, lineHeight: 1.65,
          fontFamily: '"Yuji Syuku", "Noto Serif JP", serif',
        }}>
          またお会いできる日を、<br />
          楽しみにしております。<br />
          <span style={{ fontSize: 10, color: palette.accent, fontWeight: 700, letterSpacing: "0.1em" }}>
            院長より
          </span>
        </div>
        <QRBlock size={72} palette={palette} label="QRからご予約" />
      </div>
    </div>
  </PostcardFrame>
);

// ═══════════════════════════════════════════════════════════════
// Variation C — ふたりメダル
// ═══════════════════════════════════════════════════════════════
const VariationC_Front = ({ palette, mood, duo, period }) => (
  <PostcardFrame label="C — 通信面 / Front" bg={palette.paper}>
    {/* 上部の色帯 */}
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 70,
      background: `linear-gradient(180deg, ${palette.chip} 0%, ${palette.paper} 100%)`,
      pointerEvents: "none",
    }} />

    {/* 装飾円 */}
    <svg width={PC_W} height={PC_H} viewBox={`0 0 ${PC_W} ${PC_H}`}
      style={{ position: "absolute", inset: 0, opacity: mood.decorOpacity, pointerEvents: "none" }}>
      <circle cx={20} cy={150} r="12" fill={palette.secondary} opacity="0.35" />
      <circle cx={PC_W - 22} cy={250} r="9" fill={palette.primary} opacity="0.4" />
      <circle cx={28} cy={PC_H - 180} r="5" fill={palette.primary} opacity="0.5" />
      <circle cx={PC_W - 30} cy={PC_H - 220} r="4" fill={palette.secondary} opacity="0.5" />
    </svg>

    <div style={{
      position: "relative", zIndex: 1,
      width: "100%", height: "100%",
      padding: "18px 22px 16px",
      display: "flex", flexDirection: "column",
      boxSizing: "border-box",
    }}>
      {/* header */}
      <div>
        <div style={{
          fontSize: 7.5, letterSpacing: "0.3em", color: palette.inkSoft,
          fontWeight: 700, fontFamily: "ui-monospace, monospace",
        }}>FOR OUR DEAR GUEST</div>
        <div style={{
          fontSize: 13, color: palette.ink, fontWeight: 600, marginTop: 4,
          fontFamily: '"Noto Serif JP", serif', letterSpacing: "0.1em",
        }}>{CLINIC.name}</div>
      </div>

      {/* メダル */}
      <div style={{
        marginTop: 18,
        display: "flex", justifyContent: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            width: 78, height: 78, borderRadius: "50%",
            background: palette.chip,
            border: `2px solid ${palette.primary}`,
            display: "grid", placeItems: "center", textAlign: "center",
          }}>
            <div>
              <div style={{ fontSize: 8, color: palette.inkSoft, fontWeight: 600, letterSpacing: "0.12em" }}>YOU</div>
              <div style={{ fontSize: 13, color: palette.ink, fontWeight: 700, marginTop: 2 }}>あなた</div>
              <div style={{ fontSize: 10, color: palette.accent, fontWeight: 700, marginTop: 4 }}>初回半額</div>
            </div>
          </div>
          <div style={{
            margin: "0 -8px", zIndex: 2,
            width: 28, height: 28, borderRadius: "50%",
            background: "#fff",
            border: `1.5px solid ${palette.line}`,
            display: "grid", placeItems: "center",
            fontSize: 16, color: palette.accent, fontWeight: 700,
          }}>＋</div>
          <div style={{
            width: 78, height: 78, borderRadius: "50%",
            background: palette.chip2,
            border: `2px solid ${palette.secondary}`,
            display: "grid", placeItems: "center", textAlign: "center",
          }}>
            <div>
              <div style={{ fontSize: 8, color: palette.inkSoft, fontWeight: 600, letterSpacing: "0.12em" }}>FRIEND</div>
              <div style={{ fontSize: 13, color: palette.ink, fontWeight: 700, marginTop: 2 }}>お友だち</div>
              <div style={{ fontSize: 10, color: palette.accent, fontWeight: 700, marginTop: 4 }}>初回半額</div>
            </div>
          </div>
        </div>
      </div>

      {/* キャッチコピー */}
      <div style={{ textAlign: "center", marginTop: 22 }}>
        <div style={{
          fontSize: duo.mainSize - 6, color: palette.ink, lineHeight: 1.5,
          fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
          fontWeight: duo.headlineWeight, letterSpacing: "0.05em",
        }}>
          ふたりで通うと、<br />
          <span style={{ color: palette.accent }}>ふたりとも、初回半額。</span>
        </div>
        <div style={{
          fontSize: 10, color: palette.inkSoft, marginTop: 10, lineHeight: 1.85,
        }}>
          毎日のがんばりに、いつもの友人と。<br />
          週末のささやかな寄り道にいかがですか。
        </div>
      </div>

      {/* spacer */}
      <div style={{ flex: 1 }} />

      {/* period */}
      <PeriodBar palette={palette} period={period} variant="filled" />

      {/* footer: 連絡先 + QR */}
      <div style={{
        marginTop: 12,
        display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12,
      }}>
        <div style={{ flex: 1, fontSize: 9, color: palette.ink, lineHeight: 1.65 }}>
          <div style={{ fontWeight: 700, fontSize: 10, color: palette.accent, marginBottom: 2 }}>
            WEB予約はこちらから →
          </div>
          <div style={{ color: palette.inkSoft }}>{CLINIC.phone}</div>
          <div style={{ color: palette.inkSoft, fontSize: 8 }}>{CLINIC.hours}</div>
        </div>
        <QRBlock size={74} palette={palette} label="キャンペーン詳細" />
      </div>
    </div>
  </PostcardFrame>
);

// ═══════════════════════════════════════════════════════════════
// 宛名面（共通）
// ═══════════════════════════════════════════════════════════════
const AddressSide = ({ palette, label }) => (
  <PostcardFrame label={label} bg={palette.paper}>
    <div style={{ position: "absolute", top: 26, left: 100, display: "flex", gap: 4 }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} style={{
          width: 22, height: 28,
          border: `1px solid ${palette.primary}`,
          borderRadius: 2,
        }} />
      ))}
    </div>
    <div style={{
      position: "absolute", top: 18, left: 26,
      fontSize: 11, letterSpacing: "0.4em", color: palette.ink,
    }}>郵便はがき</div>

    <StampBox palette={palette} />

    <div style={{
      position: "absolute", top: 80, left: 60, right: 60,
      display: "flex", flexDirection: "column", gap: 16,
    }}>
      <div style={{ fontSize: 9, color: palette.inkSoft, fontFamily: "ui-monospace, monospace" }}>〒___-____</div>
      <div style={{ borderBottom: `1px dashed ${palette.line}`, height: 24 }} />
      <div style={{ borderBottom: `1px dashed ${palette.line}`, height: 24 }} />
      <div style={{ borderBottom: `1px dashed ${palette.line}`, height: 24 }} />
      <div style={{ marginTop: 12, fontSize: 22, fontFamily: "serif", color: palette.ink }}>
        　　　　　　　様
      </div>
    </div>

    <svg width={PC_W - 36} height={12}
      style={{ position: "absolute", bottom: 96, left: 18 }}
      preserveAspectRatio="none" viewBox={`0 0 ${PC_W - 36} 12`}>
      <path d={`M 0 6 Q ${(PC_W - 36) / 8} 0, ${(PC_W - 36) / 4} 6 T ${(PC_W - 36) / 2} 6 T ${(3 * (PC_W - 36)) / 4} 6 T ${PC_W - 36} 6`}
        fill="none" stroke={palette.primary} strokeWidth="1.5" opacity="0.6" />
    </svg>

    <div style={{
      position: "absolute", bottom: 14, left: 18, right: 18,
      display: "flex", justifyContent: "space-between", alignItems: "flex-end",
      fontSize: 9, color: palette.ink, lineHeight: 1.6,
    }}>
      <div>
        <div style={{
          fontSize: 13, fontWeight: 700, letterSpacing: "0.08em",
          color: palette.accent, marginBottom: 4,
        }}>{CLINIC.name}</div>
        <div style={{ fontSize: 8, color: palette.inkSoft }}>{CLINIC.nameEn}</div>
        <div style={{ marginTop: 4 }}>{CLINIC.address}</div>
        <div>TEL {CLINIC.phone}</div>
      </div>
      <div style={{ textAlign: "right", fontSize: 8, color: palette.inkSoft }}>
        <div>{CLINIC.hours}</div>
        <div>定休 {CLINIC.holiday}</div>
      </div>
    </div>
  </PostcardFrame>
);

// ═══════════════════════════════════════════════════════════════
// Notes
// ═══════════════════════════════════════════════════════════════
const DesignNotes = ({ palette, mood, duo, period, sendMonth }) => (
  <div style={{
    width: 760,
    padding: "22px 26px",
    background: "rgba(255,255,255,.7)",
    border: `1px dashed ${palette.line}`,
    borderRadius: 14,
    fontFamily: '"Hiragino Sans", -apple-system, sans-serif',
    color: palette.ink,
    lineHeight: 1.7,
    fontSize: 13,
  }}>
    <div style={{ fontSize: 11, letterSpacing: "0.2em", color: palette.inkSoft, marginBottom: 8 }}>
      DESIGNER NOTES — 3rd round
    </div>
    <div style={{ fontSize: 18, fontWeight: 700, color: palette.ink, marginBottom: 12 }}>
      余白整理＋金額表示なし版
    </div>
    <p style={{ margin: "0 0 10px" }}>
      <b>修正点：</b>絶対配置による要素の重なりを解消するため、3案ともflex縦積みレイアウトに再構築。QR枠と他要素の距離を確保し、下端から十分な余白を取りました。具体的な金額（6,000円→3,000円、50% OFF など）は全削除し、「初回半額」の語のみで表現しています。
    </p>
    <p style={{ margin: "0 0 10px" }}>
      <b>Tweaks（全案に同時適用）：</b>
      <br />① <b>Palette</b> — 現在: <code>{palette.label}</code>
      <br />② <b>Mood</b> — 現在: <code>{mood.label}</code>
      <br />③ <b>Duo Emphasis</b> — 「ふたり半額」の主役感を調整。現在: <code>{duo.label}</code>
      <br />④ <b>送付月</b> — <code>{sendMonth}月</code>送付 → <code>{period.short}</code>
    </p>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 14 }}>
      <div>
        <div style={{ color: palette.accent, fontWeight: 700 }}>A · ふんわり手紙</div>
        <div style={{ fontSize: 12, color: palette.inkSoft }}>
          上部に幾何モチーフ、中央にオファーカード（バッジ＋DuoMark＋メッセージ）。読み進めやすい縦動線。
        </div>
      </div>
      <div>
        <div style={{ color: palette.accent, fontWeight: 700 }}>B · ふたり並列</div>
        <div style={{ fontSize: 12, color: palette.inkSoft }}>
          コピー主導。便箋の罫線で落ち着き、院長手書き調メッセージで個人宛感を演出。
        </div>
      </div>
      <div>
        <div style={{ color: palette.accent, fontWeight: 700 }}>C · ふたりメダル</div>
        <div style={{ fontSize: 12, color: palette.inkSoft }}>
          You + Friend を視覚的に並列表示。ともに「初回半額」を内包し、ひと目で意図が伝わる。
        </div>
      </div>
    </div>
    <div style={{
      marginTop: 14, padding: "10px 12px",
      background: palette.chip,
      borderRadius: 8,
      fontSize: 12, color: palette.ink,
    }}>
      <b>次に決めたいこと：</b>院名／院長名／住所・電話／QR遷移先のURL／印刷会社／送付月確定。
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// App
// ═══════════════════════════════════════════════════════════════
const App = () => {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const palette = PALETTES[t.palette] || PALETTES.rosemint;
  const mood = MOODS[t.mood] || MOODS.soft;
  const duo = DUO_EMPHASIS[t.duoEmphasis] || DUO_EMPHASIS.balanced;
  const period = campaignPeriod(t.sendMonth || 4);

  return (
    <>
      <DesignCanvas>
        <DCSection id="notes" title="design brief" subtitle="3rd round — 余白整理 / 金額削除">
          <div style={{ padding: "8px 0" }}>
            <DesignNotes palette={palette} mood={mood} duo={duo} period={period} sendMonth={t.sendMonth || 4} />
          </div>
        </DCSection>

        <DCSection id="A" title="A — ふんわり手紙" subtitle="幾何モチーフ × オファーカード">
          <DCArtboard id="A-front" label="A · 通信面" width={PC_W} height={PC_H + 36}>
            <VariationA_Front palette={palette} mood={mood} duo={duo} period={period} />
          </DCArtboard>
          <DCArtboard id="A-back" label="A · 宛名面" width={PC_W} height={PC_H + 36}>
            <AddressSide palette={palette} label="A — 宛名面 / Back" />
          </DCArtboard>
        </DCSection>

        <DCSection id="B" title="B — ふたり並列" subtitle="便箋仕立て / コピー主導">
          <DCArtboard id="B-front" label="B · 通信面" width={PC_W} height={PC_H + 36}>
            <VariationB_Front palette={palette} mood={mood} duo={duo} period={period} />
          </DCArtboard>
          <DCArtboard id="B-back" label="B · 宛名面" width={PC_W} height={PC_H + 36}>
            <AddressSide palette={palette} label="B — 宛名面 / Back" />
          </DCArtboard>
        </DCSection>

        <DCSection id="C" title="C — ふたりメダル" subtitle="You + Friend のグラフィック">
          <DCArtboard id="C-front" label="C · 通信面" width={PC_W} height={PC_H + 36}>
            <VariationC_Front palette={palette} mood={mood} duo={duo} period={period} />
          </DCArtboard>
          <DCArtboard id="C-back" label="C · 宛名面" width={PC_W} height={PC_H + 36}>
            <AddressSide palette={palette} label="C — 宛名面 / Back" />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette · パレット" />
        <TweakSelect
          label="3つのパステル"
          value={t.palette}
          options={[
            { value: "rosemint", label: "Rose & Mint（ピンク × ミント）" },
            { value: "creamlavender", label: "Cream & Lavender（クリーム × ラベンダー）" },
            { value: "yellowsage", label: "Yellow & Sage（イエロー × セージ）" },
          ]}
          onChange={(v) => setTweak("palette", v)}
        />

        <TweakSection label="Mood · 気分" />
        <TweakRadio
          label="装飾の強さ"
          value={t.mood}
          options={[
            { value: "clean", label: "すっきり" },
            { value: "soft", label: "ふんわり" },
            { value: "playful", label: "ぷち華やか" },
          ]}
          onChange={(v) => setTweak("mood", v)}
        />

        <TweakSection label="Duo Emphasis · ふたり半額" />
        <TweakRadio
          label="強調の上品さ"
          value={t.duoEmphasis}
          options={[
            { value: "subtle", label: "控えめ" },
            { value: "balanced", label: "バランス" },
            { value: "strong", label: "しっかり" },
          ]}
          onChange={(v) => setTweak("duoEmphasis", v)}
        />

        <TweakSection label="Period · 送付月" />
        <TweakSlider
          label="送付月（1〜12）"
          value={t.sendMonth || 4}
          min={1} max={12} step={1}
          unit="月"
          onChange={(v) => setTweak("sendMonth", v)}
        />
      </TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
