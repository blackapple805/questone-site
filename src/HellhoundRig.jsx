// src/HellhoundRig.jsx  — v10
import { useEffect, useRef, useState } from "react";

const DARK_SRC = `${import.meta.env.BASE_URL}hellhound.png`;
const LIGHT_SRC = `${import.meta.env.BASE_URL}hellhound_ice.png`;

/**
 * v10 — Natural motion refinement
 *
 * Changes from v9:
 * - Head: smoother arc with micro-hold at extremes
 * - Jaw: gentler open/close, less snapping
 * - Neck: better damped follow of head (~55% amplitude)
 * - Body/Chest/Haunch: asymmetric breathing (slow inhale, quicker exhale)
 * - Tail: weighted pendulum feel, faster through center
 * - Legs/Paws: subtler weight-bearing shifts with rotation
 * - Mouth fire: softer flicker, less mechanical oscillation
 * - Horns: reduced amplitude, reads as vibration not bounce
 * - All parts: more keyframe stops for smoother interpolation
 *
 * Structure, masks, durations, delays unchanged.
 */

const MASTER = 5.4;
const FLOAT_CYCLE = MASTER * 2;
const d = (frac) => -(MASTER * frac);

const PARTS = [
  // ═══ CORE ═══
  {
    id: "body",
    mask: "radial-gradient(ellipse 28% 24% at 52% 44%, black 0%, black 50%, transparent 90%)",
    origin: "52% 44%",
    anim: "houndBody",
    dur: MASTER,
    delay: 0,
    z: 2,
  },
  {
    id: "chest",
    mask: "radial-gradient(ellipse 22% 28% at 42% 30%, black 0%, black 48%, transparent 88%)",
    origin: "48% 40%",
    anim: "houndChest",
    dur: MASTER,
    delay: d(0.03),
    z: 3,
  },
  {
    id: "haunch",
    mask: "radial-gradient(ellipse 22% 24% at 70% 50%, black 0%, black 48%, transparent 88%)",
    origin: "62% 48%",
    anim: "houndHaunch",
    dur: MASTER,
    delay: d(0.04),
    z: 3,
  },
  {
    id: "spine",
    mask: "radial-gradient(ellipse 30% 14% at 44% 14%, black 0%, black 45%, transparent 86%)",
    origin: "44% 20%",
    anim: "houndSpine",
    dur: MASTER,
    delay: d(0.03),
    z: 4,
  },

  // ═══ SPIRAL GLOWS ═══
  {
    id: "shoulderSpiral",
    mask: "radial-gradient(ellipse 12% 14% at 41% 38%, black 0%, black 40%, transparent 82%)",
    origin: "41% 38%",
    anim: "houndSpiralPulse",
    dur: MASTER,
    delay: d(0.02),
    z: 4,
  },
  {
    id: "hipSpiral",
    mask: "radial-gradient(ellipse 12% 14% at 69% 47%, black 0%, black 40%, transparent 82%)",
    origin: "69% 47%",
    anim: "houndSpiralPulse",
    dur: MASTER,
    delay: d(0.06),
    z: 4,
  },

  // ═══ NECK → HEAD → JAW chain ═══
  {
    id: "neck",
    mask: "radial-gradient(ellipse 18% 22% at 28% 28%, black 0%, black 48%, transparent 88%)",
    origin: "36% 36%",
    anim: "houndNeck",
    dur: MASTER,
    delay: d(0.06),
    z: 5,
  },
  {
    id: "head",
    mask: "radial-gradient(ellipse 20% 20% at 20% 20%, black 0%, black 48%, transparent 88%)",
    origin: "28% 28%",
    anim: "houndHead",
    dur: MASTER,
    delay: d(0.08),
    z: 7,
  },
  {
    id: "jaw",
    mask: "radial-gradient(ellipse 16% 18% at 14% 40%, black 0%, black 44%, transparent 86%)",
    origin: "20% 30%",
    anim: "houndJaw",
    dur: MASTER,
    delay: d(0.145),
    z: 8,
  },

  // ═══ DETAIL ═══
  {
    id: "horns",
    mask: "radial-gradient(ellipse 16% 10% at 20% 7%, black 0%, black 40%, transparent 84%)",
    origin: "22% 16%",
    anim: "houndHorns",
    dur: MASTER,
    delay: d(0.09),
    z: 9,
  },
  {
    id: "mouthFire",
    mask: "radial-gradient(ellipse 12% 14% at 12% 44%, black 0%, black 38%, transparent 82%)",
    origin: "18% 36%",
    anim: "houndMouthFire",
    dur: MASTER * 0.6,
    delay: d(0.15),
    z: 9,
  },

  // ═══ LEGS ═══
  {
    id: "frontLegs",
    mask: "radial-gradient(ellipse 20% 26% at 28% 70%, black 0%, black 46%, transparent 88%)",
    origin: "28% 50%",
    anim: "houndFrontLeg",
    dur: MASTER,
    delay: d(0.05),
    z: 6,
  },
  {
    id: "rearLegs",
    mask: "radial-gradient(ellipse 20% 26% at 72% 70%, black 0%, black 46%, transparent 88%)",
    origin: "72% 48%",
    anim: "houndRearLeg",
    dur: MASTER,
    delay: d(0.38),
    z: 6,
  },

  // ═══ PAWS ═══
  {
    id: "frontPaws",
    mask: "radial-gradient(ellipse 16% 12% at 28% 90%, black 0%, black 42%, transparent 84%)",
    origin: "28% 82%",
    anim: "houndFrontPaw",
    dur: MASTER,
    delay: d(0.07),
    z: 7,
  },
  {
    id: "rearPaws",
    mask: "radial-gradient(ellipse 18% 12% at 76% 88%, black 0%, black 42%, transparent 84%)",
    origin: "76% 80%",
    anim: "houndRearPaw",
    dur: MASTER,
    delay: d(0.40),
    z: 7,
  },

  // ═══ TAIL ═══
  {
    id: "tail",
    mask: "radial-gradient(ellipse 26% 28% at 82% 28%, black 0%, black 38%, transparent 85%)",
    origin: "68% 35%",
    anim: "houndTail",
    dur: MASTER * 0.68,
    delay: d(0.02),
    z: 4,
  },

  // ═══ GROUND GLOW ═══
  {
    id: "ground",
    mask: "radial-gradient(ellipse 42% 8% at 45% 94%, black 0%, black 40%, transparent 85%)",
    origin: "45% 94%",
    anim: "houndGround",
    dur: MASTER,
    delay: d(0.01),
    z: 2,
  },
];

const KEYFRAMES = `
/* ═══════════════════════════════════════════════════════
   HELLHOUND v10 — Natural motion refinement
   ═══════════════════════════════════════════════════════ */

/* ── CORE BREATHING ──
   Asymmetric cycle: slow inhale (0%→42%), brief hold (42%→50%),
   quicker exhale (50%→88%), settle (88%→100%).
   This is the master rhythm — everything else follows. */

@keyframes houndBody {
  0%   { transform: scale(1) translateY(0) translateX(0); }
  10%  { transform: scale(1.002) translateY(-0.15px) translateX(0.1px); }
  22%  { transform: scale(1.007) translateY(-0.45px) translateX(0.2px); }
  34%  { transform: scale(1.012) translateY(-0.8px) translateX(0.25px); }
  42%  { transform: scale(1.014) translateY(-1.0px) translateX(0.15px); }
  50%  { transform: scale(1.013) translateY(-0.95px) translateX(0.05px); }
  62%  { transform: scale(1.008) translateY(-0.55px) translateX(-0.1px); }
  74%  { transform: scale(1.003) translateY(-0.2px) translateX(-0.15px); }
  86%  { transform: scale(1.001) translateY(-0.05px) translateX(-0.05px); }
  100% { transform: scale(1) translateY(0) translateX(0); }
}

@keyframes houndChest {
  0%   { transform: rotate(0deg) translateY(0) scale(1); }
  12%  { transform: rotate(-0.1deg) translateY(-0.15px) scale(1.002); }
  26%  { transform: rotate(-0.3deg) translateY(-0.45px) scale(1.007); }
  38%  { transform: rotate(-0.5deg) translateY(-0.7px) scale(1.012); }
  46%  { transform: rotate(-0.5deg) translateY(-0.7px) scale(1.011); }
  58%  { transform: rotate(-0.3deg) translateY(-0.4px) scale(1.007); }
  70%  { transform: rotate(-0.12deg) translateY(-0.15px) scale(1.003); }
  84%  { transform: rotate(-0.03deg) translateY(-0.03px) scale(1.001); }
  100% { transform: rotate(0deg) translateY(0) scale(1); }
}

@keyframes houndHaunch {
  0%   { transform: rotate(0deg) translateY(0) scale(1); }
  14%  { transform: rotate(0.06deg) translateY(-0.04px) scale(1.001); }
  28%  { transform: rotate(0.2deg) translateY(-0.15px) scale(1.004); }
  40%  { transform: rotate(0.35deg) translateY(-0.3px) scale(1.008); }
  50%  { transform: rotate(0.34deg) translateY(-0.28px) scale(1.007); }
  64%  { transform: rotate(0.18deg) translateY(-0.12px) scale(1.004); }
  78%  { transform: rotate(0.06deg) translateY(-0.03px) scale(1.001); }
  100% { transform: rotate(0deg) translateY(0) scale(1); }
}

@keyframes houndSpine {
  0%   { transform: rotate(0deg) translateY(0) scaleY(1); }
  14%  { transform: rotate(-0.06deg) translateY(-0.2px) scaleY(1.002); }
  28%  { transform: rotate(-0.2deg) translateY(-0.5px) scaleY(1.005); }
  40%  { transform: rotate(-0.35deg) translateY(-0.8px) scaleY(1.008); }
  50%  { transform: rotate(-0.3deg) translateY(-0.7px) scaleY(1.007); }
  64%  { transform: rotate(-0.15deg) translateY(-0.35px) scaleY(1.003); }
  80%  { transform: rotate(-0.04deg) translateY(-0.08px) scaleY(1.001); }
  100% { transform: rotate(0deg) translateY(0) scaleY(1); }
}

/* ── SPIRAL GLOWS — breathe-synced pulse ── */
@keyframes houndSpiralPulse {
  0%   { transform: scale(1) rotate(0deg); }
  16%  { transform: scale(1.004) rotate(0.2deg); }
  34%  { transform: scale(1.012) rotate(0.6deg); }
  46%  { transform: scale(1.018) rotate(0.8deg); }
  56%  { transform: scale(1.014) rotate(0.6deg); }
  70%  { transform: scale(1.006) rotate(0.25deg); }
  86%  { transform: scale(1.001) rotate(0.05deg); }
  100% { transform: scale(1) rotate(0deg); }
}

/* ── UPPER CHAIN — head leads, neck follows at ~55% amplitude ──
   
   Head: predatory micro-sway. Key change from v9: the old
   -2.5° snap at 16% is replaced by a gradual arc with a
   brief hold at extremes. Living things decelerate before
   reversing direction — they don't bounce like a spring. */

@keyframes houndNeck {
  0%   { transform: rotate(0deg) translateY(0) scale(1); }
  10%  { transform: rotate(-0.12deg) translateY(-0.2px) scale(1.001); }
  22%  { transform: rotate(-0.4deg) translateY(-0.55px) scale(1.004); }
  34%  { transform: rotate(-0.7deg) translateY(-0.9px) scale(1.006); }
  44%  { transform: rotate(-0.65deg) translateY(-0.8px) scale(1.005); }
  56%  { transform: rotate(-0.3deg) translateY(-0.4px) scale(1.003); }
  68%  { transform: rotate(-0.08deg) translateY(-0.1px) scale(1.001); }
  80%  { transform: rotate(0.04deg) translateY(0px) scale(1); }
  92%  { transform: rotate(0.01deg) translateY(0px) scale(1); }
  100% { transform: rotate(0deg) translateY(0) scale(1); }
}

@keyframes houndHead {
  0%   { transform: rotate(0deg) translateY(0); }
  6%   { transform: rotate(-0.4deg) translateY(-0.4px); }
  14%  { transform: rotate(-1.2deg) translateY(-1.4px); }
  22%  { transform: rotate(-1.8deg) translateY(-2.2px); }
  30%  { transform: rotate(-1.6deg) translateY(-1.8px); }
  40%  { transform: rotate(-0.5deg) translateY(-0.4px); }
  50%  { transform: rotate(0.2deg) translateY(0.1px); }
  58%  { transform: rotate(0.15deg) translateY(0.05px); }
  68%  { transform: rotate(-0.2deg) translateY(-0.2px); }
  78%  { transform: rotate(-0.1deg) translateY(-0.08px); }
  90%  { transform: rotate(-0.02deg) translateY(-0.01px); }
  100% { transform: rotate(0deg) translateY(0); }
}

/* ── JAW — gentler open/close ──
   v9 had a harsh snap from -1.6° to +3.2° (4.8° swing in 20%
   of cycle). Now the jaw drifts open gradually, holds slightly
   at max open, then eases shut. Reads as slow breathing, not
   snapping at prey. */

@keyframes houndJaw {
  0%   { transform: rotate(0deg) translateY(0); }
  8%   { transform: rotate(-0.3deg) translateY(-0.2px); }
  18%  { transform: rotate(-0.8deg) translateY(-0.6px); }
  28%  { transform: rotate(-0.2deg) translateY(-0.1px); }
  38%  { transform: rotate(1.0deg) translateY(0.3px); }
  48%  { transform: rotate(2.2deg) translateY(0.6px); }
  56%  { transform: rotate(2.0deg) translateY(0.5px); }
  66%  { transform: rotate(1.0deg) translateY(0.2px); }
  78%  { transform: rotate(0.2deg) translateY(0.02px); }
  90%  { transform: rotate(0.03deg) translateY(0); }
  100% { transform: rotate(0deg) translateY(0); }
}

/* ── DETAIL PARTS ── */

/* Horns: reduced amplitude from v9. These are rigid bone —
   they should barely move, just transmitting the head's
   motion as a faint vibration at the tips. */
@keyframes houndHorns {
  0%   { transform: rotate(0deg) translateY(0); }
  8%   { transform: rotate(-0.25deg) translateY(-0.2px); }
  18%  { transform: rotate(-0.8deg) translateY(-0.8px); }
  28%  { transform: rotate(-1.2deg) translateY(-1.2px); }
  36%  { transform: rotate(-1.0deg) translateY(-0.9px); }
  46%  { transform: rotate(-0.3deg) translateY(-0.2px); }
  56%  { transform: rotate(0.1deg) translateY(0.05px); }
  68%  { transform: rotate(-0.1deg) translateY(-0.06px); }
  80%  { transform: rotate(-0.03deg) translateY(-0.02px); }
  100% { transform: rotate(0deg) translateY(0); }
}

/* Mouth fire: softer flicker. v9 had rigid oscillation — now
   it drifts like actual flame: irregular, organic sway with
   scale breathing. */
@keyframes houndMouthFire {
  0%   { transform: rotate(0deg) scale(1) translateY(0); }
  12%  { transform: rotate(0.6deg) scale(1.01) translateY(0.2px); }
  24%  { transform: rotate(-0.4deg) scale(0.985) translateY(-0.1px); }
  36%  { transform: rotate(1.0deg) scale(1.02) translateY(0.4px); }
  48%  { transform: rotate(0.2deg) scale(1.005) translateY(0.15px); }
  58%  { transform: rotate(-0.6deg) scale(0.99) translateY(-0.05px); }
  70%  { transform: rotate(0.8deg) scale(1.015) translateY(0.3px); }
  82%  { transform: rotate(-0.2deg) scale(0.995) translateY(0.05px); }
  92%  { transform: rotate(0.15deg) scale(1.003) translateY(0.08px); }
  100% { transform: rotate(0deg) scale(1) translateY(0); }
}

/* ── LEGS — prowl coil ──
   Added subtle rotation so the shoulder/hip joint reads
   as absorbing the body's breathing motion. Reduced
   overall translation for more grounded feel. */

@keyframes houndFrontLeg {
  0%   { transform: translateX(0) translateY(0) rotate(0deg); }
  10%  { transform: translateX(-0.4px) translateY(0.15px) rotate(-0.2deg); }
  24%  { transform: translateX(-1.2px) translateY(0.6px) rotate(-0.7deg); }
  38%  { transform: translateX(-1.8px) translateY(1.0px) rotate(-1.1deg); }
  48%  { transform: translateX(-1.6px) translateY(0.85px) rotate(-0.9deg); }
  60%  { transform: translateX(-0.7px) translateY(0.3px) rotate(-0.4deg); }
  72%  { transform: translateX(0.1px) translateY(-0.05px) rotate(0.06deg); }
  84%  { transform: translateX(0.3px) translateY(-0.1px) rotate(0.15deg); }
  94%  { transform: translateX(0.08px) translateY(-0.02px) rotate(0.03deg); }
  100% { transform: translateX(0) translateY(0) rotate(0deg); }
}

@keyframes houndRearLeg {
  0%   { transform: translateX(0) translateY(0) rotate(0deg); }
  10%  { transform: translateX(0.3px) translateY(0.1px) rotate(0.15deg); }
  24%  { transform: translateX(0.9px) translateY(0.5px) rotate(0.6deg); }
  38%  { transform: translateX(1.4px) translateY(0.85px) rotate(1.0deg); }
  48%  { transform: translateX(1.2px) translateY(0.7px) rotate(0.8deg); }
  60%  { transform: translateX(0.5px) translateY(0.25px) rotate(0.3deg); }
  72%  { transform: translateX(-0.1px) translateY(-0.04px) rotate(-0.06deg); }
  84%  { transform: translateX(-0.25px) translateY(-0.08px) rotate(-0.12deg); }
  94%  { transform: translateX(-0.06px) translateY(-0.01px) rotate(-0.02deg); }
  100% { transform: translateX(0) translateY(0) rotate(0deg); }
}

/* ── PAWS — weight-bearing grip ──
   Paws press harder into the ground during inhale peak
   (body rises slightly, weight shifts forward/back).
   The scaleX "toe spread" is more gradual now. */

@keyframes houndFrontPaw {
  0%   { transform: rotate(0deg) scaleX(1) translateY(0); }
  12%  { transform: rotate(-0.3deg) scaleX(1.004) translateY(0.1px); }
  26%  { transform: rotate(-1.0deg) scaleX(1.012) translateY(0.4px); }
  40%  { transform: rotate(-1.6deg) scaleX(1.022) translateY(0.7px); }
  50%  { transform: rotate(-1.4deg) scaleX(1.018) translateY(0.6px); }
  64%  { transform: rotate(-0.6deg) scaleX(1.008) translateY(0.25px); }
  78%  { transform: rotate(-0.1deg) scaleX(1.001) translateY(0.04px); }
  90%  { transform: rotate(0.1deg) scaleX(0.999) translateY(-0.02px); }
  100% { transform: rotate(0deg) scaleX(1) translateY(0); }
}

@keyframes houndRearPaw {
  0%   { transform: rotate(0deg) scaleX(1) translateY(0); }
  12%  { transform: rotate(0.2deg) scaleX(1.003) translateY(0.08px); }
  26%  { transform: rotate(0.7deg) scaleX(1.01) translateY(0.35px); }
  40%  { transform: rotate(1.2deg) scaleX(1.018) translateY(0.6px); }
  50%  { transform: rotate(1.1deg) scaleX(1.014) translateY(0.5px); }
  64%  { transform: rotate(0.5deg) scaleX(1.006) translateY(0.2px); }
  78%  { transform: rotate(0.1deg) scaleX(1.001) translateY(0.03px); }
  90%  { transform: rotate(-0.08deg) scaleX(0.999) translateY(-0.02px); }
  100% { transform: rotate(0deg) scaleX(1) translateY(0); }
}

/* ── TAIL — single lazy sway ──
   ONE smooth arc to one side (0%→38%), brief hold at peak,
   slow drift back (50%→90%), settle (90%→100%).
   Removed scale — it was adding visual noise on a part
   this thin. Just rotation + minimal translateX. */

@keyframes houndTail {
  0%   { transform: rotate(0deg) translateX(0); }
  10%  { transform: rotate(0.4deg) translateX(0.3px); }
  22%  { transform: rotate(1.0deg) translateX(0.7px); }
  34%  { transform: rotate(1.4deg) translateX(0.9px); }
  44%  { transform: rotate(1.3deg) translateX(0.8px); }
  56%  { transform: rotate(0.8deg) translateX(0.5px); }
  68%  { transform: rotate(0.3deg) translateX(0.2px); }
  80%  { transform: rotate(0.05deg) translateX(0.03px); }
  92%  { transform: rotate(-0.05deg) translateX(-0.02px); }
  100% { transform: rotate(0deg) translateX(0); }
}

/* ── GROUND GLOW — breathe-synced ambient pulse ── */

@keyframes houndGround {
  0%   { transform: scaleX(1) scaleY(1); opacity: 1; }
  16%  { transform: scaleX(1.004) scaleY(1.02); opacity: 1; }
  34%  { transform: scaleX(1.01) scaleY(1.05); opacity: 1; }
  46%  { transform: scaleX(1.015) scaleY(1.08); opacity: 1; }
  56%  { transform: scaleX(1.012) scaleY(1.06); opacity: 1; }
  70%  { transform: scaleX(1.005) scaleY(1.03); opacity: 1; }
  86%  { transform: scaleX(1.001) scaleY(1.005); opacity: 1; }
  100% { transform: scaleX(1) scaleY(1); opacity: 1; }
}

/* ── FLOAT ── */

@keyframes houndFloat {
  0%   { transform: translateY(0); }
  40%  { transform: translateY(-2px); }
  60%  { transform: translateY(-2.5px); }
  100% { transform: translateY(0); }
}
`;

let injected = false;
function inject() {
  if (injected) return;
  const s = document.createElement("style");
  s.textContent = KEYFRAMES;
  document.head.appendChild(s);
  injected = true;
}

function HoundLayer({ src, active, loaded, onLoad, variant, animate, debug }) {
  const glow =
    variant === "dark"
      ? "drop-shadow(0 0 10px rgba(255,200,0,0.32)) drop-shadow(0 0 20px rgba(255,170,0,0.14))"
      : "drop-shadow(0 0 10px rgba(0,200,255,0.28)) drop-shadow(0 0 20px rgba(120,230,255,0.12))";

  const imgCss = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
    userSelect: "none",
    WebkitUserDrag: "none",
  };

  return (
    <div
      aria-hidden={!active}
      style={{
        position: "absolute",
        inset: 0,
        opacity: active && loaded ? 1 : 0,
        transition: "opacity 0.6s ease",
        pointerEvents: "none",
        filter: active ? glow : "none",
      }}
    >
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <img
          src={src} alt="" onLoad={onLoad} draggable={false}
          loading="eager" decoding="async" style={imgCss}
        />
      </div>

      {PARTS.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            inset: 0,
            WebkitMaskImage: p.mask,
            maskImage: p.mask,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            transformOrigin: p.origin,
            zIndex: p.z,
            animation: animate
              ? `${p.anim} ${p.dur}s ease-in-out ${p.delay}s infinite`
              : "none",
            animationPlayState: animate ? "running" : "paused",
            willChange: animate ? "transform" : "auto",
            ...(debug && {
              background: `hsla(${p.z * 40}, 80%, 50%, 0.12)`,
              outline: "1px solid rgba(255,0,0,0.4)",
            }),
          }}
        >
          <img src={src} alt="" draggable={false} loading="lazy" decoding="async" style={imgCss} />
        </div>
      ))}
    </div>
  );
}

export default function HellhoundRig({ theme = "dark", className = "", debug = false }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(true);
  const [dkOk, setDkOk] = useState(false);
  const [ltOk, setLtOk] = useState(false);

  useEffect(() => { inject(); }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setVis(e.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const dark = theme === "dark";

  return (
    <div
      ref={ref}
      className={`hellhound-container ${className}`}
      aria-label="Cyberpunk Hellhound"
      style={{ width: "100%", display: "grid", placeItems: "center", marginInline: "auto" }}
    >
      <div className="hellhound-glow" />
      <div
        className="hellhound-stack"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          aspectRatio: "3 / 2",
          animation: vis ? `houndFloat ${FLOAT_CYCLE}s ease-in-out infinite` : "none",
          animationPlayState: vis ? "running" : "paused",
          display: "grid",
          placeItems: "center",
        }}
      >
        <HoundLayer
          src={DARK_SRC} variant="dark" active={dark}
          loaded={dkOk} onLoad={() => setDkOk(true)}
          animate={vis && dark} debug={debug}
        />
        <HoundLayer
          src={LIGHT_SRC} variant="light" active={!dark}
          loaded={ltOk} onLoad={() => setLtOk(true)}
          animate={vis && !dark} debug={debug}
        />
      </div>
    </div>
  );
}