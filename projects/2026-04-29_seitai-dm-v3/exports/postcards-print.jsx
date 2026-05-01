// postcards.jsx — 3 variations of an osteopathic clinic re-engagement DM postcard
// + Tweaks panel with 3 expressive controls (voice / warmth / emphasis)

const MM = 3.78;
const PC_W = Math.round(100 * MM); // 378
const PC_H = Math.round(148 * MM); // 559

// ─────────────────────────────────────────────────────────────
// TWEAK DEFAULTS (host-editable JSON block)
// ─────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "voice": "kokoroduki",
  "warmth": 0.55,
  "emphasis": "balance"
}/*EDITMODE-END*/;

// ─────────────────────────────────────────────────────────────
// VOICE — message archetype. Reshapes headline + body across all 3.
// ─────────────────────────────────────────────────────────────
const VOICES = {
  goaisatsu: {
    label: "ご挨拶",
    headline: "ご無沙汰\nしております。",
    body:
      "いかがお過ごしでしょうか。\n" +
      "いつもご愛顧いただき、誠にありがとうございます。",
    sigOff: "またお目にかかれますことを\n楽しみにしております。",
    badge: "RETURN & REFER",
    offerLead: "あなたとご紹介の方、お二人とも初回が",
    cTitle: "ご紹介の方も、あなたも、初回が半額。",
    cKicker: "──── お久しぶりです ────",
    letterBody:
      "ご無沙汰しております。\n" +
      "季節の変わり目、いかがお過ごしですか。\n" +
      "ご愛顧への感謝の気持ちを込めて、\n" +
      "ささやかなご案内をお送りいたします。\n" +
      "ご友人とご一緒にいらしていただけたら、\n" +
      "お二人とも初回半額でご案内いたします。",
  },
  kokoroduki: {
    label: "心配り",
    headline: "お変わり\nございませんか。",
    body:
      "季節の変わり目、お身体の調子はいかがでしょうか。\n" +
      "最後のご来院から少しお時間が経ちましたので、ふと気になりました。",
    sigOff: "またお会いできる日を\n楽しみにしております。",
    badge: "RETURN & REFER",
    offerLead: "あなたとご紹介の方、お二人とも初回施術が",
    cTitle: "ご紹介の方も、あなたも、初回施術が半額。",
    cKicker: "──── お変わりありませんか ────",
    letterBody:
      "ご無沙汰しております。\n" +
      "季節の変わり目、いかがお過ごしですか。\n" +
      "最後にいらしてからお身体の調子が\n" +
      "気になり、筆を執りました。\n" +
      "もしよろしければ、\n" +
      "またお気軽にお立ち寄りください。\n" +
      "ご友人を誘っていらしていただけたら、\n" +
      "お二人とも初回半額でご案内します。",
  },
  kansha: {
    label: "感謝",
    headline: "いつも\nありがとうございます。",
    body:
      "日頃のご愛顧に、心より感謝申し上げます。\n" +
      "感謝の気持ちを、ささやかなご案内に込めて。",
    sigOff: "心よりお待ち申し上げております。",
    badge: "THANK YOU · 感謝特典",
    offerLead: "感謝を込めて、お二人とも初回が",
    cTitle: "感謝を込めて、初回半額のご案内。",
    cKicker: "──── 日頃の感謝を込めて ────",
    letterBody:
      "いつも当院をご愛顧いただき、\n" +
      "心より感謝申し上げます。\n" +
      "ささやかではございますが、\n" +
      "感謝の気持ちをお伝えしたく、\n" +
      "ご案内をお送りいたしました。\n" +
      "ご友人とご一緒にいらしていただけたら、\n" +
      "お二人とも初回半額でお迎えいたします。",
  },
  offer: {
    label: "オファー前面",
    headline: "初回半額。\nそしてお連れの方も。",
    body:
      "再来店と、ご紹介を心よりお待ちしています。\n" +
      "あなたもお友達も、初回半額のキャンペーン中。",
    sigOff: "またのご来院を\nお待ちしております。",
    badge: "50% OFF · 期間限定",
    offerLead: "あなたとお連れの方、お二人とも初回が",
    cTitle: "お二人とも、初回半額。",
    cKicker: "──── 期間限定キャンペーン ────",
    letterBody:
      "再来店と、ご紹介のキャンペーンを\n" +
      "実施しております。\n" +
      "あなたもお連れの方も、\n" +
      "初回が半額。\n" +
      "この機会にぜひ、\n" +
      "お友達を誘ってお越しください。",
  },
};

// ─────────────────────────────────────────────────────────────
// WARMTH — 0=formal/restrained, 1=intimate/warm.
// Mixes paper tone, accent saturation, and softness.
// ─────────────────────────────────────────────────────────────
function warmthPalette(w) {
  // Per-variation accent + paper, interpolated A_FORMAL → A_WARM by w.
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (c1, c2, t) => {
    // c1, c2 as [r,g,b]
    return `rgb(${Math.round(lerp(c1[0], c2[0], t))}, ${Math.round(lerp(c1[1], c2[1], t))}, ${Math.round(lerp(c1[2], c2[2], t))})`;
  };
  return {
    A: {
      paper: mix([238, 235, 228], [248, 239, 220], w),       // cream cool → cream warm
      ink:   mix([18, 22, 38],   [33, 26, 20],   w),         // navy → near-black warm
      navy:  mix([28, 42, 72],   [55, 50, 75],   w),         // strict navy → softer plum-navy
      accent: mix([170, 70, 60], [205, 95, 70],  w),         // muted brick → warm vermilion
      cream: mix([238, 235, 228], [250, 242, 224], w),
    },
    B: {
      paper: mix([245, 244, 238], [251, 245, 230], w),
      ink:   mix([35, 33, 28],    [44, 38, 30],    w),
      olive: mix([110, 108, 92],  [142, 124, 78],  w),
      gold:  mix([170, 140, 70],  [212, 158, 66],  w),
    },
    C: {
      bg:    mix([240, 238, 232], [250, 242, 226], w),
      deep:  mix([28, 50, 56],    [40, 70, 70],    w),
      ink:   mix([18, 18, 22],    [30, 26, 22],    w),
      accent: mix([180, 95, 60],  [222, 110, 64],  w),
    },
  };
}

// ─────────────────────────────────────────────────────────────
// EMPHASIS — what dominates the card.
// ─────────────────────────────────────────────────────────────
const EMPHASIS = {
  word: {
    label: "言葉が主役",
    headlineSize: 32,         // bigger headline
    bodySize: 12,
    offerNumberSize: 26,      // smaller number
    badgeWeight: 600,
    cNumberSize: 44,
    cMedalScale: 0.85,
    bodyLines: 4,             // more body
    showSteps: false,         // hide 3-step block on C
  },
  balance: {
    label: "バランス",
    headlineSize: 26,
    bodySize: 11,
    offerNumberSize: 32,
    badgeWeight: 600,
    cNumberSize: 56,
    cMedalScale: 1,
    bodyLines: 3,
    showSteps: true,
  },
  number: {
    label: "数字が主役",
    headlineSize: 20,
    bodySize: 10,
    offerNumberSize: 44,
    badgeWeight: 700,
    cNumberSize: 78,
    cMedalScale: 1.18,
    bodyLines: 2,
    showSteps: true,
  },
};

// ─────────────────────────────────────────────────────────────
// Shared bits
// ─────────────────────────────────────────────────────────────
const QRPlaceholder = ({ size = 78, label = "キャンペーンページ" }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
    <div style={{
      width: size, height: size,
      background: "#fff",
      border: "1px solid #1a1a1a",
      position: "relative",
      display: "grid",
      placeItems: "center",
    }}>
      {[
        { top: 6, left: 6 },
        { top: 6, right: 6 },
        { bottom: 6, left: 6 },
      ].map((p, i) => (
        <div key={i} style={{
          position: "absolute", ...p,
          width: 16, height: 16, border: "3px solid #1a1a1a",
        }} />
      ))}
      <div style={{ fontSize: 8, color: "#888", fontFamily: "ui-monospace, monospace" }}>QR</div>
    </div>
    {label && <div style={{ fontSize: 8, color: "#444", letterSpacing: "0.05em" }}>{label}</div>}
  </div>
);

const StampBox = () => (
  <div style={{
    position: "absolute", top: 14, right: 14,
    width: 56, height: 70,
    border: "1px solid #1a1a1a",
    display: "grid", placeItems: "center",
    fontSize: 8, color: "#666", textAlign: "center", lineHeight: 1.4,
  }}>
    切手<br />または<br />料金別納
  </div>
);

const PostcardFrame = ({ children, label, bg }) => (
  <div className="page" style={{
    background: bg,
    position: "relative",
    overflow: "hidden",
  }}>
    <div style={{
      width: PC_W, height: PC_H,
      position: "relative",
      overflow: "hidden",
      transformOrigin: "top left",
    }}>
      {children}
    </div>
  </div>
);

const AddressSide = ({ accent, wordmark, tagline, address, phone, hours, holiday }) => (
  <>
    <div style={{ position: "absolute", top: 26, left: 100, display: "flex", gap: 4 }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} style={{
          width: 22, height: 28,
          border: "1px solid #c33",
        }} />
      ))}
    </div>
    <div style={{
      position: "absolute", top: 18, left: 26,
      fontSize: 11, letterSpacing: "0.4em", color: "#1a1a1a",
    }}>郵便はがき</div>

    <StampBox />

    <div style={{
      position: "absolute", top: 80, left: 60, right: 60,
      height: 240,
      display: "flex", flexDirection: "column", gap: 16,
    }}>
      <div style={{ fontSize: 9, color: "#999", fontFamily: "ui-monospace, monospace" }}>〒___-____</div>
      <div style={{ borderBottom: "1px dashed #ccc", height: 24 }} />
      <div style={{ borderBottom: "1px dashed #ccc", height: 24 }} />
      <div style={{ borderBottom: "1px dashed #ccc", height: 24 }} />
      <div style={{ marginTop: 12, fontSize: 22, fontFamily: "serif", color: "#222" }}>
        　　　　　　　様
      </div>
    </div>

    <div style={{
      position: "absolute", bottom: 18, left: 18, right: 18,
      borderTop: `1.5px solid ${accent}`,
      paddingTop: 10,
      display: "flex", justifyContent: "space-between", alignItems: "flex-end",
      fontSize: 9, color: "#222", lineHeight: 1.6,
    }}>
      <div>
        <div style={{
          fontSize: 14, fontWeight: 700, letterSpacing: "0.08em",
          color: accent, marginBottom: 4,
        }}>{wordmark}</div>
        <div style={{ fontSize: 8, color: "#666" }}>{tagline}</div>
        <div style={{ marginTop: 6 }}>{address}</div>
        <div>TEL {phone}</div>
      </div>
      <div style={{ textAlign: "right", fontSize: 8, color: "#444" }}>
        <div>営業 {hours}</div>
        <div>定休 {holiday}</div>
      </div>
    </div>
  </>
);

const COMMON_INFO = {
  wordmark: "いろは整体院",
  tagline: "IROHA Seitai",
  address: "〒000-0000 東京都〇〇区〇〇1-2-3",
  phone: "03-0000-0000",
  hours: "10:00–20:00",
  holiday: "日曜・祝日",
};

const renderMultiline = (text) =>
  text.split("\n").map((line, i, arr) => (
    <React.Fragment key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </React.Fragment>
  ));

// ════════════════════════════════════════════════
// Variation A — 和モダン信頼系
// ════════════════════════════════════════════════
const VariationA_Front = ({ voice, pal, emph }) => (
  <PostcardFrame label="A — 通信面 / Front" bg={pal.A.cream}>
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0,
      height: 80,
      background: pal.A.navy,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 22px",
    }}>
      <div>
        <div style={{
          fontSize: 9, color: "rgba(244,237,224,.7)",
          letterSpacing: "0.3em", marginBottom: 4,
        }}>IROHA SEITAI · SINCE 2012</div>
        <div style={{
          fontSize: 22, fontWeight: 700, color: pal.A.cream,
          fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
          letterSpacing: "0.06em",
        }}>いろは整体院</div>
      </div>
      <div style={{
        width: 38, height: 38,
        border: `1.5px solid ${pal.A.cream}`,
        display: "grid", placeItems: "center",
        color: pal.A.cream, fontFamily: "serif", fontSize: 16,
      }}>整</div>
    </div>

    <div style={{
      position: "absolute", top: 100, left: 24, right: 24,
      fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
    }}>
      <div style={{
        fontSize: emph.headlineSize, color: pal.A.ink, lineHeight: 1.4,
        letterSpacing: "0.04em", fontWeight: 600,
      }}>
        {renderMultiline(voice.headline)}
      </div>
      <div style={{
        marginTop: 14, fontSize: emph.bodySize, color: "#3a322a", lineHeight: 1.85,
        fontFamily: '"Hiragino Sans", sans-serif', letterSpacing: "0.02em",
      }}>
        {renderMultiline(voice.body)}
      </div>
    </div>

    <div style={{
      position: "absolute", top: 270, left: 24, right: 24,
      background: "#fff",
      border: `1px solid ${pal.A.navy}`,
      padding: "14px 16px",
    }}>
      <div style={{
        display: "inline-block",
        background: pal.A.accent, color: "#fff",
        fontSize: 9, padding: "3px 8px",
        letterSpacing: "0.15em", fontWeight: emph.badgeWeight,
      }}>{voice.badge}</div>
      <div style={{
        marginTop: 8,
        fontSize: 12, color: pal.A.ink, lineHeight: 1.5,
        fontFamily: '"Noto Serif JP", serif',
      }}>{voice.offerLead}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
        <div style={{
          fontSize: 11, color: "#888",
          textDecoration: "line-through",
        }}>通常 6,000円</div>
        <div style={{
          fontSize: emph.offerNumberSize, color: pal.A.accent, fontWeight: 800,
          fontFamily: 'Georgia, serif', lineHeight: 1,
        }}>半額</div>
        <div style={{
          fontSize: 16, color: pal.A.ink, fontWeight: 700,
        }}>3,000円</div>
      </div>
      <div style={{
        marginTop: 8, fontSize: 8, color: "#666", lineHeight: 1.5,
      }}>
        ※ご来院時にこのハガキをご提示ください。<br />
        ※有効期限：2026年6月30日まで
      </div>
    </div>

    <div style={{
      position: "absolute", bottom: 16, left: 24, right: 24,
      display: "flex", justifyContent: "space-between", alignItems: "flex-end",
    }}>
      <div style={{
        fontFamily: '"Caveat", cursive, serif',
        fontSize: 11, color: "#3a322a", lineHeight: 1.6,
        maxWidth: 180,
      }}>
        {renderMultiline(voice.sigOff)}<br />
        <span style={{ fontSize: 14, color: pal.A.navy }}>院長　佐藤</span>
      </div>
      <QRPlaceholder size={72} label="ご紹介ページ" />
    </div>
  </PostcardFrame>
);

const VariationA_Back = ({ pal }) => (
  <PostcardFrame label="A — 宛名面 / Back" bg={pal.A.cream}>
    <AddressSide accent={pal.A.navy} {...COMMON_INFO} />
  </PostcardFrame>
);

// ════════════════════════════════════════════════
// Variation B — 手紙・温かみ系
// ════════════════════════════════════════════════
const VariationB_Front = ({ voice, pal, emph }) => (
  <PostcardFrame label="B — 通信面 / Front" bg={pal.B.paper}>
    <div style={{
      position: "absolute", inset: "52px 28px 130px 28px",
      backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 23px, rgba(118,112,74,.18) 23px, rgba(118,112,74,.18) 24px)`,
    }} />

    <div style={{
      position: "absolute", top: 18, right: 18,
      width: 48, height: 56,
      border: `1.5px dashed ${pal.B.olive}`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: '"Noto Serif JP", serif', color: pal.B.olive,
      fontSize: 8, letterSpacing: "0.1em", lineHeight: 1.3,
    }}>
      <div style={{ fontSize: 18, fontWeight: 700 }}>整</div>
      <div>御挨拶</div>
    </div>

    <div style={{
      position: "absolute", top: 22, left: 28,
      fontFamily: '"Noto Serif JP", serif',
    }}>
      <div style={{ fontSize: 9, color: pal.B.olive, letterSpacing: "0.25em" }}>IROHA SEITAI</div>
      <div style={{ fontSize: 14, color: pal.B.ink, fontWeight: 600, marginTop: 2 }}>いろは整体院 より</div>
    </div>

    <div style={{
      position: "absolute", top: 64, left: 32, right: 32,
      fontFamily: '"Caveat", "Yuji Syuku", cursive, serif',
      color: pal.B.ink,
      lineHeight: "24px",
    }}>
      <div style={{ fontSize: 17, marginBottom: 4 }}>　〇〇 様</div>
      <div style={{ fontSize: 14, letterSpacing: "0.02em" }}>
        {renderMultiline(voice.letterBody)}
      </div>
      <div style={{
        textAlign: "right", marginTop: 10,
        fontSize: 14, color: pal.B.gold,
      }}>院長　佐藤 健一</div>
    </div>

    <div style={{
      position: "absolute", bottom: 16, left: 16, right: 16,
      background: pal.B.ink, color: pal.B.paper,
      padding: "12px 14px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <div>
        <div style={{
          fontSize: 8, color: pal.B.gold, letterSpacing: "0.2em",
          fontFamily: "ui-monospace, monospace", fontWeight: emph.badgeWeight,
        }}>{voice.badge}</div>
        <div style={{
          fontSize: 11, marginTop: 4,
          fontFamily: '"Noto Serif JP", serif', lineHeight: 1.5,
        }}>
          あなたも、お連れの方も<br />
          初回 <span style={{ fontSize: emph.offerNumberSize * 0.6, color: pal.B.gold, fontWeight: 700 }}>3,000円</span>
          <span style={{ fontSize: 9, opacity: .7, marginLeft: 6 }}>（通常6,000円）</span>
        </div>
        <div style={{ fontSize: 7, opacity: .6, marginTop: 4 }}>
          有効期限 2026年6月30日／ハガキご提示
        </div>
      </div>
      <QRPlaceholder size={64} label="" />
    </div>
  </PostcardFrame>
);

const VariationB_Back = ({ pal }) => (
  <PostcardFrame label="B — 宛名面 / Back" bg={pal.B.paper}>
    <AddressSide accent={pal.B.olive} {...COMMON_INFO} />
  </PostcardFrame>
);

// ════════════════════════════════════════════════
// Variation C — オファー前面
// ════════════════════════════════════════════════
const VariationC_Front = ({ voice, pal, emph }) => (
  <PostcardFrame label="C — 通信面 / Front" bg={pal.C.bg}>
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0,
      height: 28, background: pal.C.deep,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 16px",
      color: "#fff", fontSize: 9, letterSpacing: "0.2em",
    }}>
      <div>いろは整体院 · 大切なお客様へ</div>
      <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 8 }}>2026 SPRING</div>
    </div>

    <div style={{
      position: "absolute", top: 44, left: 24, right: 24,
    }}>
      <div style={{
        fontSize: 11, color: pal.C.deep, letterSpacing: "0.15em",
        fontFamily: '"Hiragino Sans", sans-serif', fontWeight: 600,
      }}>{voice.cKicker}</div>
      <div style={{
        marginTop: 8,
        fontFamily: '"Noto Serif JP", serif',
        fontSize: emph.headlineSize * 0.7, color: pal.C.ink, fontWeight: 700, lineHeight: 1.4,
      }}>
        {voice.cTitle.split("半額").map((piece, i, arr) =>
          i < arr.length - 1 ? (
            <React.Fragment key={i}>
              {piece}
              <span style={{ color: pal.C.accent }}>半額</span>
            </React.Fragment>
          ) : (
            <React.Fragment key={i}>{piece}</React.Fragment>
          )
        )}
      </div>
    </div>

    <div style={{
      position: "absolute", top: 142, left: 24, right: 24,
      background: "#fff",
      border: `2px solid ${pal.C.deep}`,
      padding: "18px 16px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div>
        <div style={{
          fontSize: 9, color: "#666", letterSpacing: "0.1em",
          textDecoration: "line-through",
        }}>通常 初回 6,000円</div>
        <div style={{
          display: "flex", alignItems: "baseline", gap: 4, marginTop: 4,
        }}>
          <div style={{
            fontSize: emph.cNumberSize, color: pal.C.accent, fontWeight: 900,
            fontFamily: 'Georgia, "Noto Serif JP", serif', lineHeight: 0.9,
            letterSpacing: "-0.02em",
          }}>3,000</div>
          <div style={{ fontSize: 14, color: pal.C.ink, fontWeight: 700 }}>円</div>
        </div>
        <div style={{
          fontSize: 8, color: "#666", marginTop: 6, lineHeight: 1.5,
        }}>
          ※税込・初回お一人様一回限り<br />
          ※有効期限：2026年6月30日
        </div>
      </div>
      <div style={{
        width: 78 * emph.cMedalScale, height: 78 * emph.cMedalScale,
        borderRadius: "50%",
        background: pal.C.accent, color: "#fff",
        display: "grid", placeItems: "center", textAlign: "center",
        fontFamily: '"Noto Serif JP", serif',
        transform: "rotate(-8deg)",
        boxShadow: "0 4px 0 rgba(0,0,0,.12)",
      }}>
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: 9, fontWeight: 600 }}>2人とも</div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>50<span style={{ fontSize: 11 }}>%</span></div>
          <div style={{ fontSize: 8 }}>OFF</div>
        </div>
      </div>
    </div>

    {emph.showSteps && (
      <div style={{
        position: "absolute", top: 290, left: 24, right: 24,
      }}>
        <div style={{
          fontSize: 9, color: pal.C.deep, letterSpacing: "0.15em",
          fontWeight: 700, marginBottom: 8,
        }}>HOW TO USE · ご利用方法</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { n: "1", t: "QRから登録", s: "お友達と共有" },
            { n: "2", t: "ご予約", s: "お電話 or LINE" },
            { n: "3", t: "ご来院", s: "ハガキをご提示" },
          ].map(s => (
            <div key={s.n} style={{
              flex: 1,
              background: "#fff",
              border: "1px solid rgba(15,59,58,.18)",
              padding: "8px 6px",
              textAlign: "center",
            }}>
              <div style={{
                width: 22, height: 22, margin: "0 auto 4px",
                borderRadius: "50%", background: pal.C.deep, color: "#fff",
                display: "grid", placeItems: "center",
                fontSize: 11, fontWeight: 700,
              }}>{s.n}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: pal.C.ink }}>{s.t}</div>
              <div style={{ fontSize: 8, color: "#666", marginTop: 2 }}>{s.s}</div>
            </div>
          ))}
        </div>
      </div>
    )}

    {!emph.showSteps && (
      <div style={{
        position: "absolute", top: 290, left: 24, right: 24,
        fontFamily: '"Noto Serif JP", serif',
        fontSize: 12, color: pal.C.ink, lineHeight: 1.85,
      }}>
        {renderMultiline(voice.body)}
      </div>
    )}

    <div style={{
      position: "absolute", bottom: 14, left: 24, right: 24,
      display: "flex", justifyContent: "space-between", alignItems: "flex-end",
    }}>
      <div style={{ fontSize: 9, color: pal.C.ink, lineHeight: 1.6 }}>
        <div style={{ fontWeight: 700, fontSize: 11, color: pal.C.deep }}>いろは整体院</div>
        <div>東京都〇〇区〇〇 1-2-3</div>
        <div>TEL 03-0000-0000</div>
        <div style={{ color: "#666" }}>10:00–20:00 / 日祝休</div>
      </div>
      <QRPlaceholder size={70} label="キャンペーンページ" />
    </div>
  </PostcardFrame>
);

const VariationC_Back = ({ pal }) => (
  <PostcardFrame label="C — 宛名面 / Back" bg={pal.C.bg}>
    <AddressSide accent={pal.C.deep} {...COMMON_INFO} />
  </PostcardFrame>
);

// ════════════════════════════════════════════════
// Notes panel
// ════════════════════════════════════════════════
const DesignNotes = ({ voice, emph, w }) => (
  <div style={{
    width: 760,
    padding: "20px 24px",
    background: "rgba(255,255,255,.6)",
    border: "1px dashed rgba(60,50,40,.25)",
    fontFamily: '"Hiragino Sans", -apple-system, sans-serif',
    color: "#3a322a",
    lineHeight: 1.7,
    fontSize: 13,
  }}>
    <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#8a7a6a", marginBottom: 8 }}>
      DESIGNER NOTES — お任せ初稿（深夜）
    </div>
    <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
      40〜50代向け・既存顧客への再来店&紹介DM／3案
    </div>
    <p style={{ margin: "0 0 10px" }}>
      <b>仮置き設定：</b>院名「いろは整体院（仮）」／通常初回6,000円→3,000円／有効期限2026年6月30日／通常ハガキ縦100×148mm／両面。
    </p>
    <p style={{ margin: "0 0 10px" }}>
      <b>3つのTweakで全案を同時に試せます：</b>
      <br />① <b>Voice 声色</b> — メインコピーの人格を切替（現在: <code>{voice.label}</code>）。
      <br />② <b>Warmth 距離感</b> — 紙色とアクセント彩度をフォーマル↔親密へ（現在: <code>{Math.round(w * 100)}%</code>）。
      <br />③ <b>Emphasis 主役</b> — 言葉/バランス/数字のジャンプ率を再設計（現在: <code>{emph.label}</code>）。
    </p>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 14 }}>
      <div>
        <div style={{ color: "#1f2c44", fontWeight: 700 }}>A · 和モダン信頼</div>
        <div style={{ fontSize: 12, color: "#555" }}>
          紺×生成×朱。長く通われている層に。
        </div>
      </div>
      <div>
        <div style={{ color: "#76704a", fontWeight: 700 }}>B · 手紙・温かみ</div>
        <div style={{ fontSize: 12, color: "#555" }}>
          便箋＋手書き風。離反期間が長い顧客に。
        </div>
      </div>
      <div>
        <div style={{ color: "#d96a3a", fontWeight: 700 }}>C · オファー前面</div>
        <div style={{ fontSize: 12, color: "#555" }}>
          価格最大化、3ステップ案内付き。反応率重視。
        </div>
      </div>
    </div>
  </div>
);

// ════════════════════════════════════════════════
// App — print version
// ════════════════════════════════════════════════
const App = () => {
  const voice = VOICES[TWEAK_DEFAULTS.voice];
  const emph = EMPHASIS[TWEAK_DEFAULTS.emphasis];
  const pal = warmthPalette(TWEAK_DEFAULTS.warmth);

  return (
    <div className="stack">
      <VariationA_Front voice={voice} pal={pal} emph={emph} />
      <VariationA_Back pal={pal} />
      <VariationB_Front voice={voice} pal={pal} emph={emph} />
      <VariationB_Back pal={pal} />
      <VariationC_Front voice={voice} pal={pal} emph={emph} />
      <VariationC_Back pal={pal} />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

// Auto-print when fonts are ready
document.fonts.ready.then(() => {
  setTimeout(() => window.print(), 500);
});
