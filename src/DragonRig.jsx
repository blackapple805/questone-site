import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════
//  DragonRig v5 — Seam-free edition
//
//  Identical to v4 except:
//  1. clip-path polygons → mask-image radial-gradients
//     (soft elliptical edges instead of hard geometric cuts)
//  2. Static base layer is FULL FRAME (no BASE_CORE_CLIP)
//     so any gap between animated parts reveals the complete
//     static image, not empty space
//
//  All keyframes, durations, delays, and transform-origins
//  are UNCHANGED from v4.
// ═══════════════════════════════════════════════════════

const DARK_SRC = `${import.meta.env.BASE_URL}dragon_gold.png`;
const LIGHT_SRC = `${import.meta.env.BASE_URL}dragon_ice.png`;

// Head + neck + wing all at 3.8s — they sync at loop boundary
// Body/tail/legs keep their own durations for polyrhythm
//
// v4 clip-path → v5 mask-image mapping:
//   Each polygon was converted to a radial-gradient ellipse
//   centered on the polygon's centroid, sized to cover the
//   same region with ~12% soft fade at edges.

const PARTS = [
  {
    id: "rearLegs",
    // v4: polygon(24% 50%, 66% 48%, 82% 100%, 26% 100%, 20% 72%)
    mask: "radial-gradient(ellipse 24% 30% at 48% 72%, black 0%, black 46%, transparent 88%)",
    transformOrigin: "50% 78%",
    animation: "rigRearLegShift",
    duration: 5.2,
    delay: -0.8,
    zIndex: 4,
  },
  {
    id: "frontLegs",
    // v4: polygon(-6% 50%, 46% 48%, 66% 100%, -6% 100%, -10% 70%)
    mask: "radial-gradient(ellipse 28% 32% at 24% 72%, black 0%, black 46%, transparent 88%)",
    transformOrigin: "24% 80%",
    animation: "rigFrontLegShift",
    duration: 5.0,
    delay: -0.4,
    zIndex: 5,
  },
  {
    id: "body",
    // v4: polygon(22% 30%, 44% 24%, 62% 32%, 66% 52%, 60% 78%, 38% 84%, 24% 66%, 18% 46%)
    mask: "radial-gradient(ellipse 28% 32% at 42% 52%, black 0%, black 48%, transparent 88%)",
    transformOrigin: "42% 56%",
    animation: "rigBodyBreathe",
    duration: 5.4,
    delay: 0,
    zIndex: 2,
  },
  {
    id: "tail",
    // v4: polygon(52% 48%, 70% 46%, 88% 50%, 100% 58%, 98% 80%, 86% 86%, 66% 76%, 54% 66%)
    mask: "radial-gradient(ellipse 28% 22% at 76% 64%, black 0%, black 44%, transparent 86%)",
    transformOrigin: "60% 62%",
    animation: "rigTailSway",
    duration: 4.6,
    delay: -1.2,
    zIndex: 6,
  },
  {
    id: "wing",
    // v4: polygon(50% 10%, 76% 7%, 100% 20%, 98% 46%, 74% 56%, 58% 40%)
    mask: "radial-gradient(ellipse 28% 26% at 76% 30%, black 0%, black 44%, transparent 86%)",
    transformOrigin: "56% 34%",
    animation: "rigWingFlap",
    duration: 3.8,
    delay: 0,
    zIndex: 6,
  },
  {
    id: "neck",
    // v4: polygon(12% 10%, 30% 7%, 52% 14%, 56% 28%, 48% 48%, 30% 60%, 12% 44%)
    mask: "radial-gradient(ellipse 24% 28% at 32% 32%, black 0%, black 46%, transparent 88%)",
    transformOrigin: "30% 44%",
    animation: "rigNeckFollow",
    duration: 3.8,
    delay: 0,
    zIndex: 7,
  },
  {
    id: "head",
    // v4: polygon(0% 6%, 20% 4%, 36% 14%, 38% 30%, 30% 50%, 16% 58%, 2% 50%, 0% 28%)
    mask: "radial-gradient(ellipse 20% 24% at 18% 30%, black 0%, black 46%, transparent 88%)",
    transformOrigin: "22% 34%",
    animation: "rigHeadBob",
    duration: 3.8,
    delay: 0,
    zIndex: 8,
  },
];

// ── KEYFRAMES — identical to v4, zero changes ──

const KEYFRAMES = `
@keyframes rigHeadBob {
  0%   { transform: rotate(0deg) translateY(0px); }
  12%  { transform: rotate(-2deg) translateY(-3px); }
  28%  { transform: rotate(-0.5deg) translateY(-1px); }
  45%  { transform: rotate(1deg) translateY(0px); }
  65%  { transform: rotate(-1.2deg) translateY(-2px); }
  80%  { transform: rotate(0.3deg) translateY(-0.5px); }
  92%  { transform: rotate(-0.1deg) translateY(-0.2px); }
  100% { transform: rotate(0deg) translateY(0px); }
}

@keyframes rigNeckFollow {
  0%   { transform: rotate(0deg) translateY(0px); }
  15%  { transform: rotate(-1.2deg) translateY(-1.5px); }
  35%  { transform: rotate(-0.3deg) translateY(-0.5px); }
  55%  { transform: rotate(0.6deg) translateY(0px); }
  75%  { transform: rotate(-0.7deg) translateY(-1px); }
  90%  { transform: rotate(-0.1deg) translateY(-0.2px); }
  100% { transform: rotate(0deg) translateY(0px); }
}

@keyframes rigWingFlap {
  0%   { transform: rotate(0deg) scaleY(1); }
  14%  { transform: rotate(-4deg) scaleY(1.03); }
  30%  { transform: rotate(-1deg) scaleY(1.01); }
  48%  { transform: rotate(2deg) scaleY(0.97); }
  62%  { transform: rotate(-5deg) scaleY(1.04); }
  76%  { transform: rotate(-1.5deg) scaleY(1.01); }
  88%  { transform: rotate(0.5deg) scaleY(1.005); }
  100% { transform: rotate(0deg) scaleY(1); }
}

@keyframes rigBodyBreathe {
  0%   { transform: scale(1) translateY(0px); }
  30%  { transform: scale(1.008) translateY(-1px); }
  50%  { transform: scale(1.012) translateY(-1.5px); }
  70%  { transform: scale(1.005) translateY(-0.5px); }
  100% { transform: scale(1) translateY(0px); }
}

@keyframes rigFrontLegShift {
  0%   { transform: translateX(0px) translateY(0px); }
  20%  { transform: translateX(-0.8px) translateY(-0.5px); }
  45%  { transform: translateX(-1.5px) translateY(-1.2px); }
  65%  { transform: translateX(0.5px) translateY(-0.3px); }
  85%  { transform: translateX(1px) translateY(0px); }
  100% { transform: translateX(0px) translateY(0px); }
}

@keyframes rigRearLegShift {
  0%   { transform: translateX(0px) translateY(0px); }
  25%  { transform: translateX(0.5px) translateY(-0.3px); }
  50%  { transform: translateX(1.2px) translateY(-1px); }
  75%  { transform: translateX(-0.8px) translateY(-0.5px); }
  100% { transform: translateX(0px) translateY(0px); }
}

@keyframes rigTailSway {
  0%   { transform: rotate(0deg); }
  15%  { transform: rotate(1.8deg); }
  35%  { transform: rotate(-1.5deg); }
  55%  { transform: rotate(2.8deg); }
  70%  { transform: rotate(-0.8deg); }
  85%  { transform: rotate(1.2deg); }
  100% { transform: rotate(0deg); }
}

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
      {/* v5 CHANGE: Static base is now FULL FRAME — no clip-path.
          Any gap between animated parts reveals this complete image.
          Dark-on-dark = invisible seam. */}
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

      {/* v5 CHANGE: clip-path → mask-image with soft elliptical edges.
          Each part fades smoothly into the static base at its borders
          instead of having a hard geometric cut line. */}
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