import { useState, useEffect, useRef } from "react";

// near the top of DragonRig.jsx
const DARK_SRC = `${import.meta.env.BASE_URL}dragon_gold.png`;
const LIGHT_SRC = `${import.meta.env.BASE_URL}dragon_ice.png`;

/**
 * KEY FIX for “wrong polygons / double parts”:
 * - The base image should NOT include head/wing/tail (or you’ll see a ghost copy behind the moving part).
 * - So we clip the BASE to a “core/body” region only.
 *   You will fine-tune this polygon once and it fixes most bleed instantly.
 */
// ✅ Slightly safer core base (still avoids wing/head/tail ghosting)
const BASE_CORE_CLIP =
  "polygon(14% 22%, 52% 16%, 64% 30%, 66% 58%, 58% 88%, 34% 94%, 18% 88%, 10% 62%, 12% 36%)";
const RIG_CYCLE = 6;
const PARTS = [
  { id: "rearLegs",  clipPath: "polygon(24% 50%, 66% 48%, 82% 100%, 26% 100%, 20% 72%)",
    transformOrigin: "50% 78%", animation: "rigRearLegShift", zIndex: 4, phase: 0.10 },

  { id: "frontLegs", clipPath: "polygon(-6% 50%, 46% 48%, 66% 100%, -6% 100%, -10% 70%)",
    transformOrigin: "24% 80%", animation: "rigFrontLegShift", zIndex: 5, phase: 0.10 },

  { id: "body",      clipPath: "polygon(22% 30%, 44% 24%, 62% 32%, 66% 52%, 60% 78%, 38% 84%, 24% 66%, 18% 46%)",
    transformOrigin: "42% 56%", animation: "rigBodyBreathe", zIndex: 2, phase: 0.00 },

  { id: "tail",      clipPath: "polygon(52% 48%, 70% 46%, 88% 50%, 100% 58%, 98% 80%, 86% 86%, 66% 76%, 54% 66%)",
    transformOrigin: "60% 62%", animation: "rigTailSway", zIndex: 6, phase: 0.06 },

  { id: "wing",      clipPath: "polygon(50% 10%, 76% 7%, 100% 20%, 98% 46%, 74% 56%, 58% 40%)",
    transformOrigin: "56% 34%", animation: "rigWingFlap", zIndex: 6, phase: 0.05 },

  { id: "neck",      clipPath: "polygon(12% 10%, 30% 7%, 52% 14%, 56% 28%, 48% 48%, 30% 60%, 12% 44%)",
    transformOrigin: "30% 44%", animation: "rigHeadBob", zIndex: 7, phase: 0.06 },

  { id: "head",      clipPath: "polygon(0% 6%, 20% 4%, 36% 14%, 38% 30%, 30% 50%, 16% 58%, 2% 50%, 0% 28%)",
    transformOrigin: "22% 34%", animation: "rigHeadBob", zIndex: 8, phase: 0.06 },
];

const KEYFRAMES = `
@keyframes rigHeadBob {
  0%, 100% { transform: rotate(0deg) translateY(0px); }
  25%  { transform: rotate(-1.8deg) translateY(-3px); }
  50%  { transform: rotate(0.5deg) translateY(-1px); }
  75%  { transform: rotate(-1deg) translateY(-2px); }
}
@keyframes rigWingFlap {
  0%, 100% { transform: rotate(0deg) scaleY(1); }
  15%  { transform: rotate(-5deg) scaleY(1.03); }
  30%  { transform: rotate(2deg) scaleY(0.97); }
  50%  { transform: rotate(-7deg) scaleY(1.05); }
  70%  { transform: rotate(1deg) scaleY(0.99); }
  85%  { transform: rotate(-3deg) scaleY(1.01); }
}
@keyframes rigBodyBreathe {
  0%, 100% { transform: scale(1) translateY(0px); }
  35%  { transform: scale(1.01) translateY(-1.5px); }
  65%  { transform: scale(0.995) translateY(1px); }
}
@keyframes rigFrontLegShift {
  0%, 100% { transform: translateX(0px) translateY(0px); }
  30%  { transform: translateX(-1.5px) translateY(-1.5px); }
  60%  { transform: translateX(1px) translateY(0px); }
}
@keyframes rigRearLegShift {
  0%, 100% { transform: translateX(0px) translateY(0px); }
  40%  { transform: translateX(1.5px) translateY(-1px); }
  70%  { transform: translateX(-1px) translateY(0.5px); }
}
@keyframes rigTailSway {
  0%, 100% { transform: rotate(0deg); }
  25%      { transform: rotate(2.2deg); }
  50%      { transform: rotate(-2.8deg); }
  75%      { transform: rotate(2.0deg); }
}
@keyframes rigFloat {
  0%, 100% { transform: translateY(0px); }
  50%  { transform: translateY(-10px); }
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

  // Shared image styles
  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
    userSelect: "none",
    WebkitUserDrag: "none",
    // IMPORTANT: keep images unfiltered; apply glow once to the whole layer
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
        // IMPORTANT: apply glow after compositing to reduce “cut seams”
        filter: glowFilter,
      }}
    >
      {/* 1) BASE (clipped to core only) — prevents double head/wing/tail behind animation */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          clipPath: BASE_CORE_CLIP,
          WebkitClipPath: BASE_CORE_CLIP,
        }}
      >
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

      {/* 2) Animated clipped parts on top */}
      {PARTS.map((part) => (
        <div
          key={part.id}
          style={{
            position: "absolute",
            inset: 0,
            clipPath: part.clipPath,
            WebkitClipPath: part.clipPath,
            transformOrigin: part.transformOrigin,
            zIndex: part.zIndex,
            animation: animate
            ? `${part.animation} ${RIG_CYCLE}s ease-in-out ${-(part.phase || 0) * RIG_CYCLE}s infinite`
            : "none",
            animationPlayState: animate ? "running" : "paused",
            willChange: animate ? "transform" : "auto",

            // Debug: show the polygon regions so you can tweak points fast
            outline: debug ? "1px solid rgba(255,0,0,0.55)" : "none",
            background: debug ? "rgba(255,0,0,0.06)" : "transparent",
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

  useEffect(() => {
    injectKeyframes();
  }, []);

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
          animation: animate ? "rigFloat 6s ease-in-out infinite" : "none",
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