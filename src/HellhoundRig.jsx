// src/HellhoundRig.jsx  — v9
import { useEffect, useRef, useState } from "react";

const DARK_SRC = `${import.meta.env.BASE_URL}hellhound.png`;
const LIGHT_SRC = `${import.meta.env.BASE_URL}hellhound_ice.png`;

/**
 * v9 — Full-body skeleton, 15 animated regions
 *
 * UPPER CHAIN: body → chest → neck → head → jaw
 * LOWER CHAIN: body → frontLegs → frontPaws
 *              body → haunch → rearLegs → rearPaws
 * DETAIL:      horns (micro-tremor from head)
 *              mouthFire (flicker, follows jaw)
 *              shoulderSpiral + hipSpiral (breathe-pulse)
 *              tail (independent fast flicker)
 *              spine (follows chest)
 *              groundGlow (pulses with breathing)
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

  // ═══ SPIRAL GLOWS — the two big swirl marks pulse with breath ═══
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

  // ═══ DETAIL — horns, mouth fire ═══
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

  // ═══ PAWS — separate from legs, grip and flex ═══
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

  // ═══ TAIL — fast independent flicker ═══
  {
    id: "tail",
    mask: "radial-gradient(ellipse 26% 28% at 82% 28%, black 0%, black 38%, transparent 85%)",
    origin: "68% 35%",
    anim: "houndTail",
    dur: MASTER * 0.68,
    delay: d(0.02),
    z: 4,
  },

  // ═══ GROUND GLOW — pulses with breathing ═══
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
   HELLHOUND v9 — 15-part skeleton idle
   ═══════════════════════════════════════════════════════ */

/* ── CORE BREATHING ── */

@keyframes houndBody {
  0%   { transform: scale(1) translateY(0) translateX(0); }
  12%  { transform: scale(1.005) translateY(-0.3px) translateX(0.2px); }
  28%  { transform: scale(1.012) translateY(-0.8px) translateX(0.3px); }
  40%  { transform: scale(1.014) translateY(-1.0px) translateX(0); }
  52%  { transform: scale(1.010) translateY(-0.7px) translateX(-0.2px); }
  68%  { transform: scale(1.004) translateY(-0.3px) translateX(-0.1px); }
  82%  { transform: scale(1.001) translateY(-0.1px) translateX(0.1px); }
  100% { transform: scale(1) translateY(0) translateX(0); }
}

@keyframes houndChest {
  0%   { transform: rotate(0deg) translateY(0) scale(1); }
  15%  { transform: rotate(-0.2deg) translateY(-0.3px) scale(1.005); }
  32%  { transform: rotate(-0.5deg) translateY(-0.7px) scale(1.012); }
  42%  { transform: rotate(-0.5deg) translateY(-0.7px) scale(1.010); }
  58%  { transform: rotate(-0.2deg) translateY(-0.3px) scale(1.005); }
  75%  { transform: rotate(-0.05deg) translateY(-0.1px) scale(1.001); }
  100% { transform: rotate(0deg) translateY(0) scale(1); }
}

@keyframes houndHaunch {
  0%   { transform: rotate(0deg) translateY(0) scale(1); }
  18%  { transform: rotate(0.15deg) translateY(-0.1px) scale(1.003); }
  38%  { transform: rotate(0.35deg) translateY(-0.3px) scale(1.008); }
  50%  { transform: rotate(0.35deg) translateY(-0.3px) scale(1.007); }
  65%  { transform: rotate(0.15deg) translateY(-0.1px) scale(1.003); }
  82%  { transform: rotate(0.03deg) translateY(0) scale(1.001); }
  100% { transform: rotate(0deg) translateY(0) scale(1); }
}

@keyframes houndSpine {
  0%   { transform: rotate(0deg) translateY(0) scaleY(1); }
  20%  { transform: rotate(-0.15deg) translateY(-0.4px) scaleY(1.004); }
  38%  { transform: rotate(-0.35deg) translateY(-0.8px) scaleY(1.008); }
  50%  { transform: rotate(-0.3deg) translateY(-0.7px) scaleY(1.006); }
  68%  { transform: rotate(-0.1deg) translateY(-0.2px) scaleY(1.002); }
  100% { transform: rotate(0deg) translateY(0) scaleY(1); }
}

/* ── SPIRAL GLOWS — breathe-pulse on the two swirl marks ── */
@keyframes houndSpiralPulse {
  0%   { transform: scale(1) rotate(0deg); }
  20%  { transform: scale(1.008) rotate(0.4deg); }
  40%  { transform: scale(1.018) rotate(0.8deg); }
  55%  { transform: scale(1.012) rotate(0.5deg); }
  72%  { transform: scale(1.003) rotate(0.15deg); }
  100% { transform: scale(1) rotate(0deg); }
}

/* ── UPPER CHAIN ── */

@keyframes houndNeck {
  0%   { transform: rotate(0deg) translateY(0) scale(1); }
  15%  { transform: rotate(-0.3deg) translateY(-0.5px) scale(1.003); }
  32%  { transform: rotate(-0.8deg) translateY(-1.1px) scale(1.006); }
  42%  { transform: rotate(-0.7deg) translateY(-0.9px) scale(1.005); }
  58%  { transform: rotate(-0.2deg) translateY(-0.3px) scale(1.002); }
  75%  { transform: rotate(0.08deg) translateY(0) scale(1); }
  100% { transform: rotate(0deg) translateY(0) scale(1); }
}

@keyframes houndHead {
  0%   { transform: rotate(0deg) translateY(0); }
  7%   { transform: rotate(-1.0deg) translateY(-1.0px); }
  16%  { transform: rotate(-2.5deg) translateY(-2.8px); }
  30%  { transform: rotate(-0.5deg) translateY(-0.4px); }
  42%  { transform: rotate(0.4deg) translateY(0.2px); }
  58%  { transform: rotate(0deg) translateY(0); }
  78%  { transform: rotate(-0.1deg) translateY(-0.08px); }
  100% { transform: rotate(0deg) translateY(0); }
}

@keyframes houndJaw {
  0%   { transform: rotate(0deg) translateY(0); }
  12%  { transform: rotate(-0.6deg) translateY(-0.5px); }
  22%  { transform: rotate(-1.6deg) translateY(-1.4px); }
  30%  { transform: rotate(0.8deg) translateY(0); }
  42%  { transform: rotate(3.2deg) translateY(0.8px); }
  54%  { transform: rotate(1.4deg) translateY(0.3px); }
  68%  { transform: rotate(0.1deg) translateY(0); }
  100% { transform: rotate(0deg) translateY(0); }
}

/* ── DETAIL PARTS ── */

/* Horns: micro-tremor from head motion, faster frequency.
   Amplifies the head's movement at the tips. */
@keyframes houndHorns {
  0%   { transform: rotate(0deg) translateY(0); }
  6%   { transform: rotate(-0.6deg) translateY(-0.5px); }
  14%  { transform: rotate(-1.8deg) translateY(-1.6px); }
  22%  { transform: rotate(-0.8deg) translateY(-0.6px); }
  32%  { transform: rotate(0.5deg) translateY(0.3px); }
  44%  { transform: rotate(-0.2deg) translateY(-0.1px); }
  56%  { transform: rotate(0.3deg) translateY(0.1px); }
  68%  { transform: rotate(-0.1deg) translateY(-0.05px); }
  100% { transform: rotate(0deg) translateY(0); }
}

/* Mouth fire: rapid flicker + drip sway. Independent fast cycle. */
@keyframes houndMouthFire {
  0%   { transform: rotate(0deg) scale(1) translateY(0); }
  10%  { transform: rotate(1.2deg) scale(1.02) translateY(0.4px); }
  22%  { transform: rotate(-0.8deg) scale(0.97) translateY(-0.2px); }
  35%  { transform: rotate(1.8deg) scale(1.03) translateY(0.6px); }
  48%  { transform: rotate(-0.5deg) scale(0.99) translateY(0.1px); }
  62%  { transform: rotate(1.0deg) scale(1.015) translateY(0.3px); }
  78%  { transform: rotate(-0.3deg) scale(0.985) translateY(-0.1px); }
  100% { transform: rotate(0deg) scale(1) translateY(0); }
}

/* ── LEGS — prowl coil ── */

@keyframes houndFrontLeg {
  0%   { transform: translateX(0) translateY(0) rotate(0deg); }
  12%  { transform: translateX(-1.0px) translateY(0.4px) rotate(-0.6deg); }
  28%  { transform: translateX(-2.0px) translateY(1.2px) rotate(-1.4deg); }
  40%  { transform: translateX(-1.8px) translateY(1.0px) rotate(-1.2deg); }
  55%  { transform: translateX(-0.5px) translateY(0.2px) rotate(-0.3deg); }
  70%  { transform: translateX(0.6px) translateY(-0.3px) rotate(0.3deg); }
  85%  { transform: translateX(0.2px) translateY(-0.1px) rotate(0.1deg); }
  100% { transform: translateX(0) translateY(0) rotate(0deg); }
}

@keyframes houndRearLeg {
  0%   { transform: translateX(0) translateY(0) rotate(0deg); }
  12%  { transform: translateX(0.8px) translateY(0.3px) rotate(0.5deg); }
  28%  { transform: translateX(1.6px) translateY(1.0px) rotate(1.2deg); }
  40%  { transform: translateX(1.4px) translateY(0.8px) rotate(1.0deg); }
  55%  { transform: translateX(0.4px) translateY(0.2px) rotate(0.25deg); }
  70%  { transform: translateX(-0.5px) translateY(-0.2px) rotate(-0.25deg); }
  85%  { transform: translateX(-0.15px) translateY(-0.05px) rotate(-0.08deg); }
  100% { transform: translateX(0) translateY(0) rotate(0deg); }
}

/* ── PAWS — grip and flex ── */

/* Front paws: claws dig in on the forward lean, spread on settle.
   Slight scale = toes spreading. Rotation = wrist flex. */
@keyframes houndFrontPaw {
  0%   { transform: rotate(0deg) scaleX(1) translateY(0); }
  15%  { transform: rotate(-0.8deg) scaleX(1.01) translateY(0.3px); }
  30%  { transform: rotate(-1.8deg) scaleX(1.025) translateY(0.8px); }
  42%  { transform: rotate(-1.4deg) scaleX(1.02) translateY(0.6px); }
  58%  { transform: rotate(-0.4deg) scaleX(1.005) translateY(0.2px); }
  75%  { transform: rotate(0.3deg) scaleX(0.998) translateY(-0.1px); }
  100% { transform: rotate(0deg) scaleX(1) translateY(0); }
}

/* Rear paws: push off on the crouch, claws grip ground. */
@keyframes houndRearPaw {
  0%   { transform: rotate(0deg) scaleX(1) translateY(0); }
  15%  { transform: rotate(0.6deg) scaleX(1.008) translateY(0.2px); }
  30%  { transform: rotate(1.4deg) scaleX(1.02) translateY(0.7px); }
  42%  { transform: rotate(1.1deg) scaleX(1.015) translateY(0.5px); }
  58%  { transform: rotate(0.3deg) scaleX(1.003) translateY(0.15px); }
  75%  { transform: rotate(-0.2deg) scaleX(0.998) translateY(-0.1px); }
  100% { transform: rotate(0deg) scaleX(1) translateY(0); }
}

/* ── TAIL — chaotic fire flicker ── */

@keyframes houndTail {
  0%   { transform: rotate(0deg) scale(1) translateX(0); }
  12%  { transform: rotate(1.0deg) scale(1.008) translateX(0.8px); }
  26%  { transform: rotate(-0.6deg) scale(0.996) translateX(-0.4px); }
  40%  { transform: rotate(1.4deg) scale(1.012) translateX(1.0px); }
  56%  { transform: rotate(-0.4deg) scale(1.002) translateX(-0.3px); }
  72%  { transform: rotate(0.8deg) scale(1.006) translateX(0.6px); }
  86%  { transform: rotate(-0.2deg) scale(0.998) translateX(-0.2px); }
  100% { transform: rotate(0deg) scale(1) translateX(0); }
}

/* ── GROUND GLOW — breathe-synced ambient pulse ── */

@keyframes houndGround {
  0%   { transform: scaleX(1) scaleY(1); opacity: 1; }
  20%  { transform: scaleX(1.008) scaleY(1.04); opacity: 1; }
  40%  { transform: scaleX(1.015) scaleY(1.08); opacity: 1; }
  55%  { transform: scaleX(1.012) scaleY(1.06); opacity: 1; }
  75%  { transform: scaleX(1.003) scaleY(1.02); opacity: 1; }
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
      {/* Static base */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <img
          src={src} alt="" onLoad={onLoad} draggable={false}
          loading="eager" decoding="async" style={imgCss}
        />
      </div>

      {/* Animated skeleton */}
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