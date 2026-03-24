import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════
//  DragonRig v6 — Natural motion refinement
//
//  Changes from v5:
//  1. Wing flap: smoother sinusoidal arc, eliminated the
//     jarring +2°→-5° jump. Downstroke slightly faster than
//     upstroke (mimics real wing aerodynamics).
//  2. Head bob: gentler curves with micro-pauses at rest
//     positions — living things hold briefly, not bounce.
//  3. Neck follow: better phase-lag behind head, softer
//     amplitude so the chain reads as connected tissue.
//  4. Body breathe: asymmetric inhale/exhale (inhale slower,
//     exhale quicker) for organic rhythm.
//  5. Tail sway: weighted pendulum feel — gravity pulls it
//     through center faster, slows at extremes.
//  6. Leg shifts: reduced amplitude, added subtle rotation
//     so weight transfer reads more naturally.
//
//  All masks, durations, delays, and structure unchanged.
// ═══════════════════════════════════════════════════════

const DARK_SRC = `${import.meta.env.BASE_URL}dragon_gold.png`;
const LIGHT_SRC = `${import.meta.env.BASE_URL}dragon_ice.png`;

const PARTS = [
  {
    id: "rearLegs",
    mask: "radial-gradient(ellipse 24% 30% at 48% 72%, black 0%, black 46%, transparent 88%)",
    transformOrigin: "50% 78%",
    animation: "rigRearLegShift",
    duration: 5.2,
    delay: -0.8,
    zIndex: 4,
  },
  {
    id: "frontLegs",
    mask: "radial-gradient(ellipse 28% 32% at 24% 72%, black 0%, black 46%, transparent 88%)",
    transformOrigin: "24% 80%",
    animation: "rigFrontLegShift",
    duration: 5.0,
    delay: -0.4,
    zIndex: 5,
  },
  {
    id: "body",
    mask: "radial-gradient(ellipse 28% 32% at 42% 52%, black 0%, black 48%, transparent 88%)",
    transformOrigin: "42% 56%",
    animation: "rigBodyBreathe",
    duration: 5.4,
    delay: 0,
    zIndex: 2,
  },
  {
    id: "tail",
    mask: "radial-gradient(ellipse 28% 22% at 76% 64%, black 0%, black 44%, transparent 86%)",
    transformOrigin: "60% 62%",
    animation: "rigTailSway",
    duration: 4.6,
    delay: -1.2,
    zIndex: 6,
  },
  {
    id: "wing",
    mask: "radial-gradient(ellipse 28% 26% at 76% 30%, black 0%, black 44%, transparent 86%)",
    transformOrigin: "56% 34%",
    animation: "rigWingFlap",
    duration: 3.8,
    delay: 0,
    zIndex: 6,
  },
  {
    id: "neck",
    mask: "radial-gradient(ellipse 24% 28% at 32% 32%, black 0%, black 46%, transparent 88%)",
    transformOrigin: "30% 44%",
    animation: "rigNeckFollow",
    duration: 3.8,
    delay: 0,
    zIndex: 7,
  },
  {
    id: "head",
    mask: "radial-gradient(ellipse 20% 24% at 18% 30%, black 0%, black 46%, transparent 88%)",
    transformOrigin: "22% 34%",
    animation: "rigHeadBob",
    duration: 3.8,
    delay: 0,
    zIndex: 8,
  },
];

// ── KEYFRAMES v6 — Natural motion refinement ──

const KEYFRAMES = `
/* ═══════════════════════════════════════════════════════
   DRAGON RIG v6 — Organic idle motion
   ═══════════════════════════════════════════════════════ */

/* ── HEAD — gentle predatory sway with micro-pauses ──
   Living creatures hold position briefly at extremes
   before reversing — not a continuous bounce. The head
   leads the chain: neck and body follow with lag. */
@keyframes rigHeadBob {
  0%   { transform: rotate(0deg) translateY(0px); }
  8%   { transform: rotate(-0.8deg) translateY(-1.2px); }
  18%  { transform: rotate(-1.8deg) translateY(-2.6px); }
  26%  { transform: rotate(-1.6deg) translateY(-2.2px); }
  36%  { transform: rotate(-0.3deg) translateY(-0.4px); }
  46%  { transform: rotate(0.6deg) translateY(0.2px); }
  54%  { transform: rotate(0.5deg) translateY(0.1px); }
  64%  { transform: rotate(-0.4deg) translateY(-0.8px); }
  76%  { transform: rotate(-1.0deg) translateY(-1.4px); }
  86%  { transform: rotate(-0.5deg) translateY(-0.6px); }
  94%  { transform: rotate(-0.1deg) translateY(-0.1px); }
  100% { transform: rotate(0deg) translateY(0px); }
}

/* ── NECK — damped follow of head, ~60% amplitude ──
   Tissue absorbs some of the head's motion. Slightly
   smoother, fewer direction changes. */
@keyframes rigNeckFollow {
  0%   { transform: rotate(0deg) translateY(0px); }
  10%  { transform: rotate(-0.4deg) translateY(-0.6px); }
  22%  { transform: rotate(-1.0deg) translateY(-1.4px); }
  32%  { transform: rotate(-0.8deg) translateY(-1.0px); }
  44%  { transform: rotate(-0.1deg) translateY(-0.2px); }
  56%  { transform: rotate(0.3deg) translateY(0.1px); }
  68%  { transform: rotate(-0.2deg) translateY(-0.5px); }
  80%  { transform: rotate(-0.5deg) translateY(-0.7px); }
  92%  { transform: rotate(-0.1deg) translateY(-0.1px); }
  100% { transform: rotate(0deg) translateY(0px); }
}

/* ── WING — single smooth arc ──
   ONE downstroke (0%→35%), brief hold at peak (35%→45%),
   ONE slow upstroke recovery (45%→90%), settle (90%→100%).
   No double-pump, no mid-cycle reversal.
   Minimal scaleY — just enough to hint at membrane flex. */
@keyframes rigWingFlap {
  0%   { transform: rotate(0deg) scaleY(1); }
  12%  { transform: rotate(-1.4deg) scaleY(1.008); }
  24%  { transform: rotate(-3.2deg) scaleY(1.018); }
  35%  { transform: rotate(-4.0deg) scaleY(1.025); }
  45%  { transform: rotate(-3.6deg) scaleY(1.02); }
  58%  { transform: rotate(-2.2deg) scaleY(1.012); }
  72%  { transform: rotate(-0.8deg) scaleY(1.004); }
  85%  { transform: rotate(-0.15deg) scaleY(1.001); }
  94%  { transform: rotate(0.1deg) scaleY(0.999); }
  100% { transform: rotate(0deg) scaleY(1); }
}

/* ── BODY — asymmetric breathing ──
   Inhale (0%→40%) is slower and gradual.
   Exhale (40%→85%) is quicker release.
   Brief hold at peak gives it a living pause. */
@keyframes rigBodyBreathe {
  0%   { transform: scale(1) translateY(0px); }
  15%  { transform: scale(1.003) translateY(-0.4px); }
  30%  { transform: scale(1.008) translateY(-0.9px); }
  42%  { transform: scale(1.012) translateY(-1.4px); }
  50%  { transform: scale(1.011) translateY(-1.3px); }
  62%  { transform: scale(1.007) translateY(-0.8px); }
  76%  { transform: scale(1.002) translateY(-0.2px); }
  88%  { transform: scale(1.0005) translateY(-0.05px); }
  100% { transform: scale(1) translateY(0px); }
}

/* ── FRONT LEGS — subtle weight shift with rotation ──
   The slight rotate makes it look like the shoulder
   joint is absorbing the body's breathing motion. */
@keyframes rigFrontLegShift {
  0%   { transform: translateX(0px) translateY(0px) rotate(0deg); }
  16%  { transform: translateX(-0.4px) translateY(-0.2px) rotate(-0.2deg); }
  34%  { transform: translateX(-1.0px) translateY(-0.8px) rotate(-0.5deg); }
  50%  { transform: translateX(-1.2px) translateY(-1.0px) rotate(-0.6deg); }
  66%  { transform: translateX(-0.3px) translateY(-0.2px) rotate(-0.1deg); }
  80%  { transform: translateX(0.4px) translateY(0px) rotate(0.15deg); }
  92%  { transform: translateX(0.1px) translateY(0px) rotate(0.03deg); }
  100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
}

/* ── REAR LEGS — counter-phase to front, hip-driven ── */
@keyframes rigRearLegShift {
  0%   { transform: translateX(0px) translateY(0px) rotate(0deg); }
  18%  { transform: translateX(0.3px) translateY(-0.15px) rotate(0.15deg); }
  36%  { transform: translateX(0.8px) translateY(-0.6px) rotate(0.4deg); }
  52%  { transform: translateX(1.0px) translateY(-0.8px) rotate(0.5deg); }
  68%  { transform: translateX(0.3px) translateY(-0.2px) rotate(0.1deg); }
  82%  { transform: translateX(-0.3px) translateY(0px) rotate(-0.12deg); }
  94%  { transform: translateX(-0.08px) translateY(0px) rotate(-0.02deg); }
  100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
}

/* ── TAIL — weighted pendulum sway ──
   Moves fastest through center (gravity acceleration),
   decelerates at extremes (fighting gravity).
   Asymmetric: doesn't swing equally both ways. */
@keyframes rigTailSway {
  0%   { transform: rotate(0deg); }
  10%  { transform: rotate(0.8deg); }
  20%  { transform: rotate(1.6deg); }
  28%  { transform: rotate(1.4deg); }
  38%  { transform: rotate(-0.2deg); }
  48%  { transform: rotate(-1.4deg); }
  56%  { transform: rotate(-1.2deg); }
  65%  { transform: rotate(0.3deg); }
  74%  { transform: rotate(2.0deg); }
  82%  { transform: rotate(2.4deg); }
  90%  { transform: rotate(1.6deg); }
  96%  { transform: rotate(0.4deg); }
  100% { transform: rotate(0deg); }
}

/* ── FLOAT — unchanged ── */
@keyframes rigFloat {
  0%   { transform: translateY(0px); }
  40%  { transform: translateY(-8px); }
  60%  { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}
`;

let keyframesInjected = false;
function injectKeyframes() {
  if (keyframesInjected) return;
  const style = document.createElement("style");
  style.textContent = KEYFRAMES;
  document.head.appendChild(style);
  keyframesInjected = true;
}

function DragonLayer({ src, active, loaded, onLoad, variant, animate, debug = false }) {
  const glowFilter =
    variant === "dark"
      ? "drop-shadow(0 0 12px rgba(255, 200, 0, 0.40)) drop-shadow(0 0 26px rgba(255, 170, 0, 0.20))"
      : "drop-shadow(0 0 12px rgba(0, 200, 255, 0.35)) drop-shadow(0 0 26px rgba(100, 220, 255, 0.18))";

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
    userSelect: "none",
    WebkitUserDrag: "none",
    filter: "none",
  };

  return (
    <div
      aria-hidden={!active}
      style={{
        position: "absolute",
        inset: 0,
        opacity: active && loaded ? 1 : 0,
        transition: "opacity 0.6s ease",
        pointerEvents: debug ? "auto" : "none",
        filter: active ? glowFilter : "none",
      }}
    >
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <img
          src={src}
          alt=""
          onLoad={onLoad}
          draggable={false}
          loading="eager"
          decoding="async"
          style={imgStyle}
        />
      </div>

      {PARTS.map((part) => (
        <div
          key={part.id}
          style={{
            position: "absolute",
            inset: 0,
            WebkitMaskImage: part.mask,
            maskImage: part.mask,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            transformOrigin: part.transformOrigin,
            zIndex: part.zIndex,
            animation: animate
              ? `${part.animation} ${part.duration}s ease-in-out ${part.delay}s infinite`
              : "none",
            animationPlayState: animate ? "running" : "paused",
            willChange: animate ? "transform" : "auto",
            ...(debug && {
              background: `hsla(${part.zIndex * 40}, 80%, 50%, 0.12)`,
              outline: "1px solid rgba(255,0,0,0.4)",
            }),
          }}
        >
          <img
            src={src}
            alt=""
            draggable={false}
            loading="lazy"
            decoding="async"
            style={imgStyle}
          />
        </div>
      ))}
    </div>
  );
}

export default function DragonRig({ theme = "dark", className = "", debug = false }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [darkLoaded, setDarkLoaded] = useState(false);
  const [lightLoaded, setLightLoaded] = useState(false);

  useEffect(() => { injectKeyframes(); }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isDark = theme === "dark";
  const animate = isVisible;

  return (
    <div
      ref={containerRef}
      className={`dragon-container ${className}`}
      aria-label="Cyberpunk Mech Dragon"
      style={{
        width: "100%",
        display: "grid",
        placeItems: "center",
        marginInline: "auto",
      }}
    >
      <div className="dragon-glow" />

      <div
        className="dragon-stack"
        style={{
          position: "relative",
          marginInline: "auto",
          animation: animate ? "rigFloat 7s ease-in-out infinite" : "none",
          animationPlayState: animate ? "running" : "paused",
          maxWidth: "100%",
          display: "grid",
          placeItems: "center",
        }}
      >
        <DragonLayer
          src={DARK_SRC}
          variant="dark"
          active={isDark}
          loaded={darkLoaded}
          onLoad={() => setDarkLoaded(true)}
          animate={animate && isDark}
          debug={debug}
        />
        <DragonLayer
          src={LIGHT_SRC}
          variant="light"
          active={!isDark}
          loaded={lightLoaded}
          onLoad={() => setLightLoaded(true)}
          animate={animate && !isDark}
          debug={debug}
        />
      </div>
    </div>
  );
}