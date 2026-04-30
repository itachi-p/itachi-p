// postcards.jsx — 3 variations of an osteopathic clinic re-engagement DM postcard
// Each artboard contains FRONT (通信面/デザイン面) and BACK (宛名面)
// Postcard size: 100×148mm rendered at ~3.78px/mm = approx 378×559px

const MM = 3.78; // px per mm
const PC_W = Math.round(100 * MM); // 378
const PC_H = Math.round(148 * MM); // 559

// ───────────────────────────────────────────────
// Shared bits
// ───────────────────────────────────────────────
const QRPlaceholder = ({ size = 78, label = "キャンペーンページ" }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
    <div style={{
      width: size, height: size,
      background: '#fff',
      border: '1px solid #1a1a1a',
      position: 'relative',
      display: 'grid',
      placeItems: 'center',
    }}>
      {/* corner squares */}
      {[[6,6],[6,'auto',6],[6,'auto','auto',6]].map((p, i) => {
        const [s, t, r, b] = p;
        return (
          <div key={i} style={{
            position:'absolute',
            top: t==='auto'?'auto':6, right: r===6?6:'auto',
            bottom: b===6?6:'auto', left: t==='auto'?'auto':(r===6?'auto':6),
            width: 16, height: 16,
            border: '3px solid #1a1a1a',
          }} />
        );
      })}
      <div style={{ fontSize: 8, color: '#888', fontFamily: 'ui-monospace, monospace' }}>QR</div>
    </div>
    {label && <div style={{ fontSize: 8, color: '#444', letterSpacing: '0.05em' }}>{label}</div>}
  </div>
);

const StampBox = () => (
  <div style={{
    position: 'absolute', top: 14, right: 14,
    width: 56, height: 70,
    border: '1px solid #1a1a1a',
    display: 'grid', placeItems: 'center',
    fontSize: 8, color: '#666', textAlign: 'center', lineHeight: 1.4,
  }}>
    切手<br/>または<br/>料金別納
  </div>
);

const PostcardFrame = ({ children, label, bg = '#fefcf7' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{
      fontSize: 10, color: 'rgba(60,50,40,.55)',
      letterSpacing: '0.12em', fontFamily: 'ui-monospace, monospace',
      textTransform: 'uppercase',
    }}>{label}</div>
    <div style={{
      width: PC_W, height: PC_H,
      background: bg,
      boxShadow: '0 2px 8px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.06)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  </div>
);

// Standard 宛名面 (Japanese postcard back) — same template across variations,
// but we tint subtly per variation's palette.
const AddressSide = ({ accent = '#1a1a1a', wordmark, tagline, address, phone, hours, holiday }) => (
  <>
    {/* 郵便番号枠 (top-right convention) */}
    <div style={{
      position: 'absolute', top: 26, left: 100,
      display: 'flex', gap: 4,
    }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} style={{
          width: 22, height: 28,
          border: `1px solid ${i < 3 ? '#d44' : '#d44'}`,
          borderColor: i < 3 ? '#c33' : '#c33',
        }} />
      ))}
    </div>
    {/* "郵便はがき" header */}
    <div style={{
      position: 'absolute', top: 18, left: 26,
      fontSize: 11, letterSpacing: '0.4em', color: '#1a1a1a',
      writingMode: 'horizontal-tb',
    }}>郵便はがき</div>

    <StampBox />

    {/* 宛名スペース (recipient area) — placeholder vertical lines */}
    <div style={{
      position: 'absolute', top: 80, left: 60, right: 60,
      height: 240,
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      <div style={{ fontSize: 9, color: '#999', fontFamily: 'ui-monospace, monospace' }}>〒___-____</div>
      <div style={{ borderBottom: '1px dashed #ccc', height: 24 }} />
      <div style={{ borderBottom: '1px dashed #ccc', height: 24 }} />
      <div style={{ borderBottom: '1px dashed #ccc', height: 24 }} />
      <div style={{ marginTop: 12, fontSize: 22, fontFamily: 'serif', color: '#222' }}>
        　　　　　　　様
      </div>
    </div>

    {/* 差出人 (sender block, lower-left) */}
    <div style={{
      position: 'absolute', bottom: 18, left: 18, right: 18,
      borderTop: `1.5px solid ${accent}`,
      paddingTop: 10,
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      fontSize: 9, color: '#222', lineHeight: 1.6,
    }}>
      <div>
        <div style={{
          fontSize: 14, fontWeight: 700, letterSpacing: '0.08em',
          color: accent, marginBottom: 4,
        }}>{wordmark}</div>
        <div style={{ fontSize: 8, color: '#666' }}>{tagline}</div>
        <div style={{ marginTop: 6 }}>{address}</div>
        <div>TEL {phone}</div>
      </div>
      <div style={{ textAlign: 'right', fontSize: 8, color: '#444' }}>
        <div>営業 {hours}</div>
        <div>定休 {holiday}</div>
      </div>
    </div>
  </>
);

const COMMON_INFO = {
  wordmark: 'いろは整体院',
  tagline: 'IROHA Seitai',
  address: '〒000-0000 東京都〇〇区〇〇1-2-3',
  phone: '03-0000-0000',
  hours: '10:00–20:00',
  holiday: '日曜・祝日',
};

// ════════════════════════════════════════════════
// Variation A — 和モダン・信頼系
// 紺 × 生成り × 朱の差し色。落ち着いた縦組み。
// ════════════════════════════════════════════════
const A_NAVY = '#1f2c44';
const A_VERMIL = '#b94a3a';
const A_CREAM = '#f4ede0';
const A_INK = '#211a14';

const VariationA_Front = () => (
  <PostcardFrame label="A — 通信面 / Front" bg={A_CREAM}>
    {/* 縦組みヘッダー: 院長挨拶 */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      height: 80,
      background: A_NAVY,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 22px',
    }}>
      <div>
        <div style={{
          fontSize: 9, color: 'rgba(244,237,224,.7)',
          letterSpacing: '0.3em', marginBottom: 4,
        }}>IROHA SEITAI · SINCE 2012</div>
        <div style={{
          fontSize: 22, fontWeight: 700, color: A_CREAM,
          fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
          letterSpacing: '0.06em',
        }}>いろは整体院</div>
      </div>
      <div style={{
        width: 38, height: 38,
        border: `1.5px solid ${A_CREAM}`,
        display: 'grid', placeItems: 'center',
        color: A_CREAM, fontFamily: 'serif', fontSize: 16,
      }}>整</div>
    </div>

    {/* メインメッセージ */}
    <div style={{
      position: 'absolute', top: 100, left: 24, right: 24,
      fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", serif',
    }}>
      <div style={{
        fontSize: 26, color: A_INK, lineHeight: 1.45,
        letterSpacing: '0.04em', fontWeight: 600,
      }}>
        お変わり<br/>ございませんか。
      </div>
      <div style={{
        marginTop: 14, fontSize: 11, color: '#3a322a', lineHeight: 1.85,
        fontFamily: '"Hiragino Sans", sans-serif', letterSpacing: '0.02em',
      }}>
        季節の変わり目、お身体の調子はいかがでしょうか。<br/>
        最後のご来院から少しお時間が経ちましたので、感謝の気持ちを込めて、ささやかなご案内をお送りいたします。
      </div>
    </div>

    {/* オファーカード */}
    <div style={{
      position: 'absolute', top: 256, left: 24, right: 24,
      background: '#fff',
      border: `1px solid ${A_NAVY}`,
      padding: '14px 16px',
    }}>
      <div style={{
        display: 'inline-block',
        background: A_VERMIL, color: '#fff',
        fontSize: 9, padding: '3px 8px',
        letterSpacing: '0.15em',
      }}>RETURN & REFER</div>
      <div style={{
        marginTop: 8,
        fontSize: 13, color: A_INK, lineHeight: 1.5,
        fontFamily: '"Noto Serif JP", serif',
      }}>あなたとご紹介の方、<br/>お二人とも初回施術が</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
        <div style={{
          fontSize: 11, color: '#888',
          textDecoration: 'line-through',
        }}>通常 6,000円</div>
        <div style={{
          fontSize: 32, color: A_VERMIL, fontWeight: 800,
          fontFamily: 'Georgia, serif', lineHeight: 1,
        }}>半額</div>
        <div style={{
          fontSize: 16, color: A_INK, fontWeight: 700,
        }}>3,000円</div>
      </div>
      <div style={{
        marginTop: 8, fontSize: 8, color: '#666', lineHeight: 1.5,
      }}>
        ※ご来院時にこのハガキをご提示ください。<br/>
        ※有効期限：2026年6月30日まで
      </div>
    </div>

    {/* QR & 院長サイン */}
    <div style={{
      position: 'absolute', bottom: 16, left: 24, right: 24,
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    }}>
      <div style={{
        fontFamily: '"Caveat", cursive, serif',
        fontSize: 11, color: '#3a322a', lineHeight: 1.6,
        maxWidth: 180,
      }}>
        またお会いできる日を<br/>
        楽しみにしております。<br/>
        <span style={{ fontSize: 14, color: A_NAVY }}>院長　佐藤</span>
      </div>
      <QRPlaceholder size={72} label="ご紹介ページ" />
    </div>
  </PostcardFrame>
);

const VariationA_Back = () => (
  <PostcardFrame label="A — 宛名面 / Back" bg={A_CREAM}>
    <AddressSide accent={A_NAVY} {...COMMON_INFO} />
  </PostcardFrame>
);

// ════════════════════════════════════════════════
// Variation B — 手紙・温かみ系
// 生成り × 木炭 × 山吹。手書き風メッセージが主役。
// ════════════════════════════════════════════════
const B_PAPER = '#faf6ee';
const B_INK = '#2c2620';
const B_GOLD = '#c8932a';
const B_OLIVE = '#76704a';

const VariationB_Front = () => (
  <PostcardFrame label="B — 通信面 / Front" bg={B_PAPER}>
    {/* 罫線（便箋風） */}
    <div style={{
      position: 'absolute', inset: '52px 28px 130px 28px',
      backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 23px, rgba(118,112,74,.18) 23px, rgba(118,112,74,.18) 24px)`,
    }} />

    {/* 切手風スタンプ */}
    <div style={{
      position: 'absolute', top: 18, right: 18,
      width: 48, height: 56,
      border: `1.5px dashed ${B_OLIVE}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"Noto Serif JP", serif', color: B_OLIVE,
      fontSize: 8, letterSpacing: '0.1em', lineHeight: 1.3,
    }}>
      <div style={{ fontSize: 18, fontWeight: 700 }}>整</div>
      <div>御挨拶</div>
    </div>

    {/* 院名 */}
    <div style={{
      position: 'absolute', top: 22, left: 28,
      fontFamily: '"Noto Serif JP", serif',
    }}>
      <div style={{ fontSize: 9, color: B_OLIVE, letterSpacing: '0.25em' }}>IROHA SEITAI</div>
      <div style={{ fontSize: 14, color: B_INK, fontWeight: 600, marginTop: 2 }}>いろは整体院 より</div>
    </div>

    {/* 手書き風メッセージ */}
    <div style={{
      position: 'absolute', top: 64, left: 32, right: 32,
      fontFamily: '"Caveat", "Yuji Syuku", cursive, serif',
      color: B_INK,
      lineHeight: '24px',
    }}>
      <div style={{ fontSize: 17, marginBottom: 4 }}>　〇〇 様</div>
      <div style={{ fontSize: 14, letterSpacing: '0.02em' }}>
        ご無沙汰しております。<br/>
        季節の変わり目、いかがお過ごしですか。<br/>
        最後にいらしてからお身体の調子が<br/>
        気になり、筆を執りました。<br/>
        もしよろしければ、<br/>
        またお気軽にお立ち寄りください。<br/>
        ご友人を誘っていらしていただけたら、<br/>
        お二人とも初回半額でご案内します。
      </div>
      <div style={{
        textAlign: 'right', marginTop: 10,
        fontSize: 14, color: B_GOLD,
      }}>院長　佐藤 健一</div>
    </div>

    {/* 下部: オファー帯 */}
    <div style={{
      position: 'absolute', bottom: 16, left: 16, right: 16,
      background: B_INK, color: B_PAPER,
      padding: '12px 14px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div>
        <div style={{
          fontSize: 8, color: B_GOLD, letterSpacing: '0.2em',
          fontFamily: 'ui-monospace, monospace',
        }}>RETURN + REFER · 半額キャンペーン</div>
        <div style={{
          fontSize: 11, marginTop: 4,
          fontFamily: '"Noto Serif JP", serif', lineHeight: 1.5,
        }}>
          あなたも、お連れの方も<br/>
          初回 <span style={{ fontSize: 18, color: B_GOLD, fontWeight: 700 }}>3,000円</span>
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

const VariationB_Back = () => (
  <PostcardFrame label="B — 宛名面 / Back" bg={B_PAPER}>
    <AddressSide accent={B_OLIVE} {...COMMON_INFO} />
  </PostcardFrame>
);

// ════════════════════════════════════════════════
// Variation C — オファー前面・視認性重視
// 大きな数字。40-50代でも一目で分かる強コントラスト。
// ════════════════════════════════════════════════
const C_BG = '#f7f3ec';
const C_DEEP = '#0f3b3a';
const C_ACCENT = '#d96a3a';
const C_INK = '#1a1a1a';

const VariationC_Front = () => (
  <PostcardFrame label="C — 通信面 / Front" bg={C_BG}>
    {/* 上部バー */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      height: 28, background: C_DEEP,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px',
      color: '#fff', fontSize: 9, letterSpacing: '0.2em',
    }}>
      <div>いろは整体院 · 大切なお客様へ</div>
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 8 }}>2026 SPRING</div>
    </div>

    {/* 大きいオファー */}
    <div style={{
      position: 'absolute', top: 44, left: 24, right: 24,
    }}>
      <div style={{
        fontSize: 11, color: C_DEEP, letterSpacing: '0.15em',
        fontFamily: '"Hiragino Sans", sans-serif', fontWeight: 600,
      }}>──── お久しぶりです ────</div>
      <div style={{
        marginTop: 8,
        fontFamily: '"Noto Serif JP", serif',
        fontSize: 18, color: C_INK, fontWeight: 700, lineHeight: 1.4,
      }}>
        ご紹介の方も、あなたも<br/>初回施術が<span style={{ color: C_ACCENT }}>半額</span>。
      </div>
    </div>

    {/* 価格ブロック */}
    <div style={{
      position: 'absolute', top: 142, left: 24, right: 24,
      background: '#fff',
      border: `2px solid ${C_DEEP}`,
      padding: '18px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <div style={{
          fontSize: 9, color: '#666', letterSpacing: '0.1em',
          textDecoration: 'line-through',
        }}>通常 初回 6,000円</div>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4,
        }}>
          <div style={{
            fontSize: 56, color: C_ACCENT, fontWeight: 900,
            fontFamily: 'Georgia, "Noto Serif JP", serif', lineHeight: 0.9,
            letterSpacing: '-0.02em',
          }}>3,000</div>
          <div style={{ fontSize: 14, color: C_INK, fontWeight: 700 }}>円</div>
        </div>
        <div style={{
          fontSize: 8, color: '#666', marginTop: 6, lineHeight: 1.5,
        }}>
          ※税込・初回お一人様一回限り<br/>
          ※有効期限：2026年6月30日
        </div>
      </div>
      <div style={{
        width: 78, height: 78,
        borderRadius: '50%',
        background: C_ACCENT, color: '#fff',
        display: 'grid', placeItems: 'center', textAlign: 'center',
        fontFamily: '"Noto Serif JP", serif',
        transform: 'rotate(-8deg)',
        boxShadow: '0 4px 0 rgba(0,0,0,.12)',
      }}>
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: 9, fontWeight: 600 }}>2人とも</div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>50<span style={{ fontSize: 11 }}>%</span></div>
          <div style={{ fontSize: 8 }}>OFF</div>
        </div>
      </div>
    </div>

    {/* ステップ案内 */}
    <div style={{
      position: 'absolute', top: 290, left: 24, right: 24,
    }}>
      <div style={{
        fontSize: 9, color: C_DEEP, letterSpacing: '0.15em',
        fontWeight: 700, marginBottom: 8,
      }}>HOW TO USE · ご利用方法</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { n: '1', t: 'QRから登録', s: 'お友達と共有' },
          { n: '2', t: 'ご予約', s: 'お電話 or LINE' },
          { n: '3', t: 'ご来院', s: 'ハガキをご提示' },
        ].map(s => (
          <div key={s.n} style={{
            flex: 1,
            background: '#fff',
            border: '1px solid rgba(15,59,58,.18)',
            padding: '8px 6px',
            textAlign: 'center',
          }}>
            <div style={{
              width: 22, height: 22, margin: '0 auto 4px',
              borderRadius: '50%', background: C_DEEP, color: '#fff',
              display: 'grid', placeItems: 'center',
              fontSize: 11, fontWeight: 700,
            }}>{s.n}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: C_INK }}>{s.t}</div>
            <div style={{ fontSize: 8, color: '#666', marginTop: 2 }}>{s.s}</div>
          </div>
        ))}
      </div>
    </div>

    {/* 下部: QR + 連絡先 */}
    <div style={{
      position: 'absolute', bottom: 14, left: 24, right: 24,
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    }}>
      <div style={{ fontSize: 9, color: C_INK, lineHeight: 1.6 }}>
        <div style={{ fontWeight: 700, fontSize: 11, color: C_DEEP }}>いろは整体院</div>
        <div>東京都〇〇区〇〇 1-2-3</div>
        <div>TEL 03-0000-0000</div>
        <div style={{ color: '#666' }}>10:00–20:00 / 日祝休</div>
      </div>
      <QRPlaceholder size={70} label="キャンペーンページ" />
    </div>
  </PostcardFrame>
);

const VariationC_Back = () => (
  <PostcardFrame label="C — 宛名面 / Back" bg={C_BG}>
    <AddressSide accent={C_DEEP} {...COMMON_INFO} />
  </PostcardFrame>
);

// ════════════════════════════════════════════════
// Notes panel
// ════════════════════════════════════════════════
const DesignNotes = () => (
  <div style={{
    width: 760,
    padding: '20px 24px',
    background: 'rgba(255,255,255,.6)',
    border: '1px dashed rgba(60,50,40,.25)',
    fontFamily: '"Hiragino Sans", -apple-system, sans-serif',
    color: '#3a322a',
    lineHeight: 1.7,
    fontSize: 13,
  }}>
    <div style={{ fontSize: 11, letterSpacing: '0.2em', color: '#8a7a6a', marginBottom: 8 }}>
      DESIGNER NOTES — お任せ初稿（深夜）
    </div>
    <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>
      40〜50代向け・既存顧客への再来店&紹介DM／3案
    </div>
    <p style={{ margin: '0 0 10px' }}>
      <b>仮置き設定：</b>院名「いろは整体院（仮）」／通常初回6,000円→3,000円／有効期限2026年6月30日／通常ハガキ縦100×148mm／両面。
    </p>
    <p style={{ margin: '0 0 10px' }}>
      <b>共通の設計判断：</b>
      ①宛名面は別の顧客名を差し込む前提で「〇〇 様」表記、
      ②通信面は「再来店メイン×紹介サブ」が読み解ける構成、
      ③QRはキャンペーンLP用に右下定位置、
      ④40-50代を意識し本文11pt以上・コントラスト確保、
      ⑤初回半額の数字は最大級のジャンプ率で配置。
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 14 }}>
      <div>
        <div style={{ color: '#1f2c44', fontWeight: 700 }}>A · 和モダン信頼</div>
        <div style={{ fontSize: 12, color: '#555' }}>
          紺×生成×朱。落ち着いた挨拶トーンで「お変わりございませんか」。長く通われている層に。
        </div>
      </div>
      <div>
        <div style={{ color: '#76704a', fontWeight: 700 }}>B · 手紙・温かみ</div>
        <div style={{ fontSize: 12, color: '#555' }}>
          便箋風の罫線＋手書き風院長メッセージが主役。「個人宛て感」最強。離反期間が長い顧客に。
        </div>
      </div>
      <div>
        <div style={{ color: '#d96a3a', fontWeight: 700 }}>C · オファー前面</div>
        <div style={{ fontSize: 12, color: '#555' }}>
          価格を最大化、3ステップ案内付き。反応率重視。チラシ的だが意思決定が速い。
        </div>
      </div>
    </div>
    <div style={{
      marginTop: 14, padding: '10px 12px',
      background: 'rgba(217,106,58,.08)',
      borderLeft: '3px solid #d96a3a',
      fontSize: 12,
    }}>
      <b>次に決めたいこと：</b>院名／実際の料金／有効期限／院長名／写真の有無／院の住所と電話番号／トーンの最終判断（A/B/Cの折衷も可）。
    </div>
  </div>
);

// ════════════════════════════════════════════════
// Mount
// ════════════════════════════════════════════════
const App = () => (
  <DesignCanvas>
    <DCSection id="notes" title="design brief" subtitle="今回の前提と3案の方針">
      <div style={{ padding: '8px 0' }}><DesignNotes /></div>
    </DCSection>

    <DCSection id="A" title="A — 和モダン信頼系" subtitle="紺×生成×朱、落ち着いた挨拶">
      <DCArtboard id="A-front" label="A · 通信面" width={PC_W + 0} height={PC_H + 36}>
        <VariationA_Front />
      </DCArtboard>
      <DCArtboard id="A-back" label="A · 宛名面" width={PC_W + 0} height={PC_H + 36}>
        <VariationA_Back />
      </DCArtboard>
    </DCSection>

    <DCSection id="B" title="B — 手紙・温かみ系" subtitle="便箋＋手書き、個人宛て感">
      <DCArtboard id="B-front" label="B · 通信面" width={PC_W + 0} height={PC_H + 36}>
        <VariationB_Front />
      </DCArtboard>
      <DCArtboard id="B-back" label="B · 宛名面" width={PC_W + 0} height={PC_H + 36}>
        <VariationB_Back />
      </DCArtboard>
    </DCSection>

    <DCSection id="C" title="C — オファー前面" subtitle="数字最大化、3ステップ案内">
      <DCArtboard id="C-front" label="C · 通信面" width={PC_W + 0} height={PC_H + 36}>
        <VariationC_Front />
      </DCArtboard>
      <DCArtboard id="C-back" label="C · 宛名面" width={PC_W + 0} height={PC_H + 36}>
        <VariationC_Back />
      </DCArtboard>
    </DCSection>
  </DesignCanvas>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
