import { useState, useEffect, useRef, useMemo } from "react";
// ═══════════════════════════════════════════════════════
//  ERIC — Creative Resume Site
//  Theme: Dark / Light toggle
//  Fonts: Sora (display) + Crimson Pro (body) + IBM Plex Mono
//  Enhanced: 3D Sword, Aurora Background, SVG Icons
// ═══════════════════════════════════════════════════════

const SECTIONS = ["home", "about", "skills", "projects", "education", "contact"];

// ── SVG Icon Components ──
const Icons = {
  Bolt: ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={color} fillOpacity="0.15" />
    </svg>
  ),
  Shield: ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={color} fillOpacity="0.1" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  Code: ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" strokeOpacity="0.5" />
    </svg>
  ),
  Terminal: ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="3" fill={color} fillOpacity="0.08" />
      <polyline points="7 10 10 13 7 16" />
      <line x1="13" y1="16" x2="17" y2="16" />
    </svg>
  ),
  Network: ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2.5" fill={color} fillOpacity="0.15" />
      <circle cx="5" cy="19" r="2.5" fill={color} fillOpacity="0.15" />
      <circle cx="19" cy="19" r="2.5" fill={color} fillOpacity="0.15" />
      <line x1="12" y1="7.5" x2="5" y2="16.5" />
      <line x1="12" y1="7.5" x2="19" y2="16.5" />
    </svg>
  ),
  Gear: ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" fill={color} fillOpacity="0.15" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  Mail: ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="3" fill={color} fillOpacity="0.08" />
      <polyline points="22 7 12 13 2 7" />
    </svg>
  ),
  GitHub: ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  Phone: ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  ),
  Instagram: ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill={color} />
    </svg>
  ),
  LinkedIn: ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  MapPin: ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" fill={color} fillOpacity="0.1" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Sun: ({ size = 22, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Moon: ({ size = 22, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill={color} fillOpacity="0.1" />
    </svg>
  ),
};

// ── Aurora Background ──
function AuroraBackground({ theme }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const isDark = theme === "dark";

    const blobs = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 300 + 200,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      hue: isDark ? [160, 180, 270, 320, 30][i] : [150, 170, 260, 340, 40][i],
      saturation: isDark ? 80 : 50,
      lightness: isDark ? 50 : 60,
      alpha: isDark ? 0.06 : 0.04,
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      timeRef.current += 0.003;
      ctx.clearRect(0, 0, w, h);

      for (const blob of blobs) {
        blob.x += blob.vx + Math.sin(timeRef.current + blob.phase) * 0.5;
        blob.y += blob.vy + Math.cos(timeRef.current * 0.7 + blob.phase) * 0.3;

        if (blob.x < -blob.radius) blob.x = w + blob.radius;
        if (blob.x > w + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = h + blob.radius;
        if (blob.y > h + blob.radius) blob.y = -blob.radius;

        const pulsingRadius = blob.radius + Math.sin(timeRef.current * 2 + blob.phase) * 40;

        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, pulsingRadius
        );
        gradient.addColorStop(0, `hsla(${blob.hue}, ${blob.saturation}%, ${blob.lightness}%, ${blob.alpha * 1.5})`);
        gradient.addColorStop(0.5, `hsla(${blob.hue}, ${blob.saturation}%, ${blob.lightness}%, ${blob.alpha * 0.5})`);
        gradient.addColorStop(1, `hsla(${blob.hue}, ${blob.saturation}%, ${blob.lightness}%, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

// ── Node Network Mesh (connecting/disconnecting nodes) ──
function ParticleMesh({ theme }) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: -1000, y: -1000 });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const isDark = theme === "dark";
    const COUNT = 80;
    const CONNECTION_DIST = 150;
    const MOUSE_RADIUS = 200;

    const neonR = isDark ? 0 : 13;
    const neonG = isDark ? 255 : 138;
    const neonB = isDark ? 200 : 106;

    particles.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      baseR: Math.random() * 2 + 1,
      r: Math.random() * 2 + 1,
      pulse: Math.random() * Math.PI * 2, // phase offset for pulsing
      connections: 0, // track active connections
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const pts = particles.current;
      const time = performance.now() * 0.001;

      // Update positions
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges instead of bounce for smoother flow
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // Mouse repulsion
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.x += dx * force * 0.03;
          p.y += dy * force * 0.03;
        }

        // Pulse node size based on connections
        p.r = p.baseR + Math.sin(time * 1.5 + p.pulse) * 0.4;
        p.connections = 0;
      }

      // Draw connections first (behind nodes)
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const p1 = pts[i];
          const p2 = pts[j];
          const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (d < CONNECTION_DIST) {
            p1.connections++;
            p2.connections++;

            // Fade based on distance — smooth connect/disconnect
            const strength = 1 - (d / CONNECTION_DIST);
            const alpha = strength * strength * (isDark ? 0.15 : 0.1);

            // Draw connection line
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${neonR},${neonG},${neonB},${alpha})`;
            ctx.lineWidth = strength * 1.2;
            ctx.stroke();

            // Draw a bright dot at midpoint for very close connections
            if (d < CONNECTION_DIST * 0.3) {
              const mx = (p1.x + p2.x) / 2;
              const my = (p1.y + p2.y) / 2;
              const dotAlpha = (1 - d / (CONNECTION_DIST * 0.3)) * 0.3;
              ctx.beginPath();
              ctx.arc(mx, my, 1, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${neonR},${neonG},${neonB},${dotAlpha})`;
              ctx.fill();
            }
          }
        }
      }

      // Draw nodes on top
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        // Nodes glow brighter when they have more connections
        const connectGlow = Math.min(p.connections / 4, 1);
        const baseAlpha = isDark ? 0.25 : 0.12;
        const alpha = baseAlpha + connectGlow * (isDark ? 0.35 : 0.2);

        // Outer glow for connected nodes
        if (p.connections > 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${neonR},${neonG},${neonB},${connectGlow * 0.08})`;
          ctx.fill();
        }

        // Core node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${neonR},${neonG},${neonB},${alpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    const handleResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    const handleMouse = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse);
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}
    />
  );
}

// ── Floating Sword — Scroll-Driven with Mobile Fix + Theme Colors ──
function FloatingSword({ theme }) {
  const isDark = theme === "dark";
  const swordRef = useRef(null);
  const scrollData = useRef({ y: 0, docHeight: 1 });
  const smooth = useRef({ x: 92, yOffset: 0, spin: 0, rotation: 0, topPercent: 50 });
  const runningRef = useRef(true);
  const loopStarted = useRef(false);

  // Detect where Education and Contact sections are on the page
  const sectionPositions = useRef({ eduEnd: 0.85, contactStart: 0.9 });

  useEffect(() => {
    const updateSectionPositions = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight || 1;
      const eduEl = document.getElementById("education");
      const contactEl = document.getElementById("contact");
      if (eduEl && contactEl) {
        const eduBottom = eduEl.offsetTop + eduEl.offsetHeight;
        const contactTop = contactEl.offsetTop;
        sectionPositions.current.eduEnd = eduBottom / (docH + window.innerHeight);
        sectionPositions.current.contactStart = contactTop / (docH + window.innerHeight);
      }
    };
    // Run after layout settles
    setTimeout(updateSectionPositions, 1000);
    window.addEventListener("resize", updateSectionPositions);
    return () => window.removeEventListener("resize", updateSectionPositions);
  }, []);

  // Update scroll data without triggering re-render
  useEffect(() => {
    const onScroll = () => {
      scrollData.current.y = window.scrollY;
      scrollData.current.docHeight = document.documentElement.scrollHeight - window.innerHeight || 1;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Single animation loop — runs once, never restarts
  useEffect(() => {
    const el = swordRef.current;
    if (!el) return;
    loopStarted.current = true;
    runningRef.current = true;

    let frameCount = 0;

    let rafId = null;
    const tick = () => {
      if (!runningRef.current) return;
      frameCount++;

      const { y, docHeight } = scrollData.current;
      const progress = Math.min(y / docHeight, 1);
      const isMobile = window.innerWidth <= 768;

      const eased = 1 - Math.pow(1 - progress, 2);
      const spinEased = 1 - Math.pow(1 - progress, 3);

      // Calculate landing zone — between education end and contact start
      const { eduEnd, contactStart } = sectionPositions.current;
      const landingMidpoint = (eduEnd + contactStart) / 2;

      // Determine how close we are to the landing zone
      const landingProximity = Math.max(0, Math.min(1,
        (progress - (landingMidpoint - 0.15)) / 0.15
      ));

      // Ease landing proximity for smooth transition
      const landingEase = landingProximity * landingProximity * (3 - 2 * landingProximity); // smoothstep

      let targetX, targetY, targetSpin, targetRotation;

      if (isMobile) {
        // MOBILE: Sword moves across screen like desktop, then lands horizontally
        const baseX = 85 - eased * 70; // 85 → 15
        const wave = Math.sin(progress * Math.PI * 4) * 12;
        targetX = baseX + wave * (1 - landingEase);

        // When landing, center horizontally
        targetX = targetX * (1 - landingEase) + 50 * landingEase;
        targetY = Math.sin(progress * Math.PI * 3) * 10 * (1 - landingEase);
        targetSpin = spinEased * 720 * (1 - landingEase);
        targetRotation = landingEase * 90;
      } else {
        // DESKTOP: Start far right, sweep left across the page
        targetX = 92 - eased * 80; // 92vw → 12vw
        const wave = Math.sin(progress * Math.PI * 3) * 15;
        targetY = wave * (1 - landingEase);

        // When near landing zone, move to center and go horizontal
        targetX = targetX * (1 - landingEase) + 50 * landingEase;
        targetSpin = spinEased * 720 * (1 - landingEase);
        targetRotation = landingEase * 90;
      }

      // As sword approaches landing, shift it up so it sits above the contact cards
      const targetTopPercent = 50 - landingEase * 32; // 50% → 18%

      // FADE OUT: Once past the landing zone, fade sword to avoid overlapping contact cards
      // Mobile needs to fade earlier since cards take up more vertical space
      const fadeStart = isMobile ? 0.4 : 0.7;
      const fadeOut = Math.max(0, 1 - Math.max(0, (landingProximity - fadeStart) / (1 - fadeStart)));

      // Use faster lerp for first 60 frames so sword snaps to correct position on load
      const lerpSpeed = frameCount < 60 ? 0.4 : 0.1;
      smooth.current.x += (targetX - smooth.current.x) * lerpSpeed;
      smooth.current.yOffset += (targetY - smooth.current.yOffset) * lerpSpeed;
      smooth.current.spin += (targetSpin - smooth.current.spin) * lerpSpeed;
      smooth.current.rotation += (targetRotation - smooth.current.rotation) * lerpSpeed;
      smooth.current.topPercent += (targetTopPercent - smooth.current.topPercent) * lerpSpeed;

      const time = performance.now() * 0.001;
      // Dampen idle bob when landing
      const idleBob = Math.sin(time * 0.6) * 3 * (1 - landingEase * 0.7);

      // Clamp: never let the sword go below 30% of viewport (stays in upper half)
      const clampedTop = Math.min(smooth.current.topPercent, 30);

      el.style.top = `${clampedTop}%`;
      el.style.left = `${smooth.current.x}vw`;
      el.style.opacity = `${(isMobile ? 0.5 : 0.8) * fadeOut}`;
      el.style.transform = `translateX(-50%) translateY(${smooth.current.yOffset + idleBob}px) rotate(${smooth.current.spin + smooth.current.rotation}deg)`;

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
    runningRef.current = false;
    if (rafId) cancelAnimationFrame(rafId);
    loopStarted.current = false; // allow restart in StrictMode dev
  };
  }, []);

  // ── Theme-aware Fireblade colors ──
  // Dark mode: Heated energy blade (cyan/green glow) with gold guard
  // Light mode: Molten fire blade (orange/yellow glow) with steel guard
  const bladeBase = isDark ? "#2a3a4a" : "#4a4a52";
  const bladeEdge = isDark ? "#1a2a38" : "#3a3a42";
  const bladeGlow = isDark ? "#00ffc8" : "#ff8c00";
  const bladeGlowMid = isDark ? "#00cc9e" : "#ffaa22";
  const bladeGlowEnd = isDark ? "#005544" : "#cc4400";
  const guardYellow = isDark ? "#d4a020" : "#c89018";
  const guardYellowLight = isDark ? "#f0c040" : "#e0a830";
  const guardDark = isDark ? "#8a6a10" : "#7a5a08";
  const reactorColor = isDark ? "#7090a0" : "#606870";
  const reactorGlow = isDark ? "rgba(0,255,200,0.6)" : "rgba(255,140,0,0.6)";
  const handleColor = isDark ? "#3a3a3a" : "#2a2a2e";
  const handleLight = isDark ? "#5a5a5a" : "#4a4a50";
  const crossbarColor = isDark ? "#606060" : "#505058";
  const glowColor1 = isDark ? "rgba(0,255,200,0.5)" : "rgba(255,140,0,0.5)";
  const glowColor2 = isDark ? "rgba(0,255,200,0.25)" : "rgba(255,140,0,0.25)";
  const glowColor3 = isDark ? "rgba(0,255,200,0.1)" : "rgba(255,100,0,0.1)";
  const ventGlow = isDark ? "#00ffc8" : "#ff6600";
  const edgeHighlight = isDark ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.2)";

  return (
    <div className="floating-sword" ref={swordRef}>
      <svg
        width="90"
        height="340"
        viewBox="0 0 90 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: `drop-shadow(0 0 8px ${glowColor1}) drop-shadow(0 0 25px ${glowColor2}) drop-shadow(0 0 50px ${glowColor3})`,
        }}
      >
        <defs>
          {/* Blade body gradient — steel to dark */}
          <linearGradient id="fbBlade" x1="45" y1="0" x2="45" y2="195" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={bladeBase} />
            <stop offset="40%" stopColor={bladeBase} stopOpacity="0.95" />
            <stop offset="100%" stopColor={bladeEdge} />
          </linearGradient>
          {/* Blade inner glow — the heated energy line */}
          <linearGradient id="fbGlow" x1="45" y1="0" x2="45" y2="195" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={bladeGlow} stopOpacity="0.9" />
            <stop offset="50%" stopColor={bladeGlowMid} stopOpacity="0.7" />
            <stop offset="100%" stopColor={bladeGlowEnd} stopOpacity="0.4" />
          </linearGradient>
          {/* Guard gradient */}
          <linearGradient id="fbGuard" x1="0" y1="195" x2="90" y2="195" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={guardDark} />
            <stop offset="30%" stopColor={guardYellow} />
            <stop offset="70%" stopColor={guardYellowLight} />
            <stop offset="100%" stopColor={guardDark} />
          </linearGradient>
          {/* Glow filter for the energy line */}
          <filter id="energyGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
          {/* Stronger glow for reactor */}
          <filter id="reactorGlowF" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
          {/* Blade edge shimmer */}
          <filter id="bladeShimmer">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ══ BLADE — Angular cleaver shape ══ */}
        {/* Main blade body */}
        <polygon
          points="45,2 22,8 18,30 16,180 22,192 45,198 52,192 54,180 52,30 48,8"
          fill="url(#fbBlade)"
          filter="url(#bladeShimmer)"
        />
        {/* Blade spine (top edge highlight) */}
        <line x1="48" y1="8" x2="52" y2="180" stroke={edgeHighlight} strokeWidth="1" />
        {/* Blade cutting edge (bottom) */}
        <line x1="22" y1="8" x2="16" y2="180" stroke={edgeHighlight} strokeWidth="0.5" opacity="0.5" />

        {/* ══ ENERGY LINE — The heated glow running through the blade ══ */}
        {/* Outer glow (wide, diffuse) */}
        <polygon
          points="45,15 32,20 30,180 38,193 45,196 48,193 50,180 48,20"
          fill="url(#fbGlow)"
          opacity="0.25"
          filter="url(#energyGlow)"
        />
        {/* Core energy line (bright, narrow) */}
        <polygon
          points="44,18 36,22 34,178 40,191 44,194 46,191 48,178 46,22"
          fill="url(#fbGlow)"
          opacity="0.6"
        />
        {/* Hot center strip */}
        <line x1="43" y1="25" x2="42" y2="185" stroke={bladeGlow} strokeWidth="2" opacity="0.8" filter="url(#energyGlow)" />
        {/* Energy flicker lines */}
        <line x1="38" y1="40" x2="37" y2="80" stroke={bladeGlow} strokeWidth="0.5" opacity="0.4" />
        <line x1="48" y1="60" x2="47" y2="100" stroke={bladeGlow} strokeWidth="0.5" opacity="0.3" />
        <line x1="36" y1="110" x2="35" y2="150" stroke={bladeGlow} strokeWidth="0.5" opacity="0.35" />

        {/* ══ COOLING VENTS — Small slots near the guard ══ */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`vent-${i}`}>
            <rect x="30" y={158 + i * 6} width="12" height="2" rx="0.5" fill={handleColor} opacity="0.7" />
            <rect x="31" y={158.5 + i * 6} width="10" height="1" rx="0.5" fill={ventGlow} opacity="0.3" />
          </g>
        ))}

        {/* ══ GUARD / TACTICAL HOUSING ══ */}
        {/* Main guard block */}
        <rect x="8" y="196" width="74" height="18" rx="3" fill="url(#fbGuard)" />
        {/* Guard top detail line */}
        <rect x="10" y="196" width="70" height="2" rx="1" fill={guardYellowLight} opacity="0.5" />
        {/* Guard rail grooves */}
        <rect x="14" y="201" width="3" height="8" rx="1" fill={guardDark} opacity="0.6" />
        <rect x="20" y="201" width="3" height="8" rx="1" fill={guardDark} opacity="0.6" />
        <rect x="26" y="201" width="3" height="8" rx="1" fill={guardDark} opacity="0.6" />
        {/* "EX-01" text on guard */}
        <text x="38" y="209" textAnchor="middle" fill={guardDark} fontSize="5" fontFamily="monospace" fontWeight="bold" opacity="0.7">EX-01</text>

        {/* ══ REACTOR RING — Mini reactor built into guard ══ */}
        {/* Reactor housing */}
        <circle cx="68" cy="205" r="9" fill={reactorColor} stroke={handleLight} strokeWidth="1" />
        <circle cx="68" cy="205" r="7" fill={handleColor} />
        {/* Reactor glow */}
        <circle cx="68" cy="205" r="5" fill={bladeGlow} opacity="0.15" filter="url(#reactorGlowF)" />
        <circle cx="68" cy="205" r="3.5" fill={bladeGlow} opacity="0.4" />
        <circle cx="68" cy="205" r="2" fill="white" opacity="0.5" />
        {/* Reactor ring detail */}
        <circle cx="68" cy="205" r="7" fill="none" stroke={bladeGlow} strokeWidth="0.5" opacity="0.6" />

        {/* ══ HANDLE — Crossbar style ══ */}
        {/* Main grip */}
        <rect x="34" y="214" width="14" height="55" rx="3" fill={handleColor} />
        {/* Grip texture lines */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <line
            key={`grip-${i}`}
            x1="35"
            y1={218 + i * 5}
            x2="47"
            y2={219.5 + i * 5}
            stroke={handleLight}
            strokeWidth="1"
            opacity="0.4"
          />
        ))}
        {/* Grip side rails */}
        <rect x="33" y="218" width="1.5" height="46" rx="0.5" fill={handleLight} opacity="0.3" />
        <rect x="47.5" y="218" width="1.5" height="46" rx="0.5" fill={handleLight} opacity="0.3" />

        {/* ══ CROSSBAR / POMMEL ══ */}
        {/* Horizontal crossbar */}
        <rect x="22" y="269" width="38" height="5" rx="2" fill={crossbarColor} />
        <rect x="24" y="270" width="34" height="3" rx="1" fill={handleLight} opacity="0.3" />
        {/* Crossbar end caps */}
        <circle cx="22" cy="271.5" r="4" fill={crossbarColor} />
        <circle cx="60" cy="271.5" r="4" fill={crossbarColor} />
        <circle cx="22" cy="271.5" r="2.5" fill={handleLight} opacity="0.3" />
        <circle cx="60" cy="271.5" r="2.5" fill={handleLight} opacity="0.3" />

        {/* ══ POMMEL RING ══ */}
        <circle cx="41" cy="282" r="6" fill={crossbarColor} />
        <circle cx="41" cy="282" r="4" fill={handleColor} />
        <circle cx="41" cy="282" r="2" fill={bladeGlow} opacity="0.2" />
      </svg>
    </div>
  );
}


// ── Typewriter Effect ──
function Typewriter({ text, speed = 50, delay = 0 }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length < text.length) {
      const t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed);
      return () => clearTimeout(t);
    }
  }, [displayed, started, text, speed]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && started && (
        <span style={{ animation: "blink 0.8s step-end infinite", color: "var(--neon)" }}>▌</span>
      )}
    </span>
  );
}

// ── Scroll Reveal Hook ──
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

// ── Animated Counter ──
function Counter({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useScrollReveal();

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = target / (duration / 16);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [visible, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Glitch Text ──
function GlitchText({ children }) {
  return (
    <span className="glitch" data-text={children}>
      {children}
    </span>
  );
}

// ── Magnetic Button ──
function MagneticButton({ children, href, className = "" }) {
  const btnRef = useRef(null);

  const handleMove = (e) => {
    const btn = btnRef.current;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };
  const handleLeave = () => {
    btnRef.current.style.transform = "translate(0,0)";
  };

  const Tag = href ? "a" : "button";
  return (
    <Tag
      ref={btnRef}
      href={href}
      className={`magnetic-btn ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transition: "transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)" }}
    >
      {children}
    </Tag>
  );
}

// ── Reveal Wrapper ──
function Reveal({ children, delay = 0, direction = "up" }) {
  const [ref, visible] = useScrollReveal();
  const transforms = {
    up: "translateY(60px)",
    down: "translateY(-60px)",
    left: "translateX(60px)",
    right: "translateX(-60px)",
    scale: "scale(0.9)",
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0) scale(1)" : transforms[direction],
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Skill Bar ──
function SkillBar({ label, level, color, delay = 0 }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div ref={ref} style={{ marginBottom: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text)" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color }}>{level}%</span>
      </div>
      <div style={{ height: "6px", background: "var(--proficiency-track)", borderRadius: "3px", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: visible ? `${level}%` : "0%",
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            borderRadius: "3px",
            transition: `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
            boxShadow: visible ? `0 0 12px ${color}44` : "none",
          }}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [heroReady, setHeroReady] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const sections = SECTIONS.map((id) => {
        const el = document.getElementById(id);
        if (!el) return { id, top: 0 };
        return { id, top: el.getBoundingClientRect().top };
      });
      const current = sections.reduce((prev, curr) =>
        Math.abs(curr.top - 100) < Math.abs(prev.top - 100) ? curr : prev
      );
      setActiveSection(current.id);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileNav(false);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // ── Data ──
  const skillCategories = [
    { title: "Electrical", Icon: Icons.Bolt, color: "var(--yellow)", items: ["NEC Code", "Circuit Analysis", "Conduit Bending", "Load Calculations", "Residential Wiring", "Panel Layout"] },
    { title: "Cybersecurity", Icon: Icons.Shield, color: "var(--neon)", items: ["Network Hardening", "Firewall Config", "Intrusion Detection", "SSH Security", "DNS Filtering", "System Auditing"] },
    { title: "Development", Icon: Icons.Code, color: "var(--orange)", items: ["React", "JavaScript", "HTML/CSS", "Supabase", "REST APIs", "Git"] },
    { title: "Linux & Systems", Icon: Icons.Terminal, color: "var(--purple)", items: ["Kali Linux", "Ubuntu", "Bash Scripting", "Raspberry Pi", "Server Admin", "Docker Basics"] },
    { title: "Networking", Icon: Icons.Network, color: "var(--blue)", items: ["DNS Config", "AdGuard Home", "Firewall Rules", "VPN", "Port Security", "Traffic Analysis"] },
    { title: "Hardware", Icon: Icons.Gear, color: "var(--pink)", items: ["PC Building", "GPU Tuning", "Motorcycle Builds", "Soldering", "Raspberry Pi", "LCD Integration"] },
  ];

  const projects = [
    { title: "NoteStream", tag: "FEATURED", tagColor: "var(--neon)", desc: "Full-featured React note-taking app with AI-powered features, subscription tiers, custom training, and a responsive dashboard. Supabase backend with RLS policies and edge functions.", tech: ["React", "Supabase", "AI", "Edge Functions", "RLS"], featured: true },
    { title: "Pi Security Dashboard", tag: "SECURITY", tagColor: "var(--orange)", desc: "Web monitoring dashboard for a Raspberry Pi 4 running Kali Linux. SSH key auth, fail2ban, UFW, portsentry, and external storage integration.", tech: ["Kali", "Fail2ban", "UFW", "SSH", "Python"] },
    { title: "AdGuard DNS Filter", tag: "NETWORK", tagColor: "var(--purple)", desc: "Network-wide DNS filtering with AdGuard Home on Raspberry Pi. Blocks ads and trackers across every device on the home network.", tech: ["AdGuard", "DNS", "Raspberry Pi", "DHCP"] },
    { title: "Pixel 6 Pro Hardening", tag: "MOBILE", tagColor: "var(--blue)", desc: "Rooted and hardened a Pixel 6 Pro with AFWall+ firewall, custom security policies, and network-level protections for maximum privacy.", tech: ["Android", "AFWall+", "Root", "Magisk"] },
    { title: "Custom Bobber Build", tag: "HARDWARE", tagColor: "var(--pink)", desc: "Designing and fabricating a custom bobber motorcycle from a Suzuki Intruder — engine work, frame mods, and custom electrical wiring.", tech: ["Fabrication", "Wiring", "Engine", "Design"] },
  ];

  const education = [
    { status: "In Progress", title: "Electrical Apprenticeship Prep", desc: "Independent study of NEC code, circuit theory, conduit bending, and load calculations using Ugly's Electrical References and Siemens catalogs. Preparing for formal apprenticeship entry." },
    { status: "Ongoing", title: "Cybersecurity — Self-Directed", desc: "Hands-on learning through building intrusion detection systems, configuring firewalls and fail2ban, hardening Linux servers, and creating security monitoring dashboards on Raspberry Pi." },
    { status: "Ongoing", title: "Full-Stack Web Development", desc: "Learning React, JavaScript, database design with Supabase, API integration, and deployment through building real applications like NoteStream with auth, subscriptions, and AI features." },
    { status: "Ongoing", title: "Linux & System Administration", desc: "Deep-diving into Kali Linux, Ubuntu server management, shell scripting, service configuration, and embedded systems through Raspberry Pi projects and home lab setups." },
  ];

  const contactIcons = {
    Email: Icons.Mail,
    GitHub: Icons.GitHub,
    WhatsApp: Icons.Phone,
    Instagram: Icons.Instagram,
    LinkedIn: Icons.LinkedIn,
    Location: Icons.MapPin,
  };

  const contacts = [
    { iconKey: "Email", label: "Email", value: "eric.dangel.dev@gmail.com", href: "mailto:eric.dangel.dev@gmail.com" },
    { iconKey: "GitHub", label: "GitHub", value: "github.com/blackapple805", href: "https://github.com/blackapple805" },
    { iconKey: "WhatsApp", label: "WhatsApp", value: "(805) 676-8875", href: "https://wa.me/18056768875" },
    { iconKey: "Instagram", label: "Instagram", value: "@quest.on.a.dream", href: "https://instagram.com/quest.on.a.dream" },
    { iconKey: "LinkedIn", label: "LinkedIn", value: "Connect with me", href: "https://linkedin.com" },
    { iconKey: "Location", label: "Location", value: "United States", href: null },
  ];

  return (
    <>
      {/* LOADING SCREEN */}
      <div className={`loader ${loaded ? "done" : ""}`}>
        <div className="loader-text">INITIALIZING</div>
        <div className="loader-bar"><div className="loader-fill" /></div>
      </div>

      {/* OVERLAYS & BACKGROUNDS */}
      <div className="noise" />
      <div className="scanline-overlay" />
      <AuroraBackground theme={theme} />
      <ParticleMesh theme={theme} />

      {/* 3D FLOATING SWORD */}
      <FloatingSword theme={theme} />

      {/* NAV */}
      <nav className={`nav ${scrollY > 50 ? "scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => scrollTo("home")}>
          <svg width="42" height="42" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
            <g transform="translate(256, 250)">
              <path d="M 0 -190 L 60 80 L 30 50 L 15 160 L 0 120 L -15 160 L -30 50 L -60 80 Z" fill="var(--neon)" />
              <path d="M -95 -20 C -60 -50, -20 -30, 0 0 C 25 35, 55 70, 100 60 C 120 55, 130 35, 115 20 C 100 5, 70 25, 50 50 C 30 75, -5 80, -35 60 C -55 45, -70 15, -50 -5 Z" fill="var(--bg)" />
              <path d="M -80 -15 C -50 -40, -15 -25, 10 0 C 35 30, 65 55, 100 48 L 95 58 C 55 68, 25 40, 0 10 C -20 -15, -50 -30, -75 -5 Z" fill="var(--neon)" />
            </g>
          </svg>
        </div>
        <button className="mobile-toggle" onClick={() => setMobileNav(!mobileNav)}>
          {mobileNav ? "✕" : "☰"}
        </button>
        <div className={`nav-links ${mobileNav ? "open" : ""}`}>
          {SECTIONS.filter((s) => s !== "home").map((s) => (
            <button key={s} className={`nav-link ${activeSection === s ? "active" : ""}`} onClick={() => scrollTo(s)}>
              {s}
            </button>
          ))}
          <button className="nav-cta" onClick={() => scrollTo("contact")}>Let's Talk</button>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Icons.Sun size={18} /> : <Icons.Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-inner">
          <div style={{ opacity: heroReady ? 1 : 0, transform: heroReady ? "translateY(0)" : "translateY(30px)", transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            <div className="hero-badge">
              <span className="dot" />
              <Typewriter text="OPEN TO OPPORTUNITIES" speed={40} delay={1200} />
            </div>
          </div>

          <h1 style={{ opacity: heroReady ? 1 : 0, transform: heroReady ? "translateY(0)" : "translateY(40px)", transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s" }}>
            <GlitchText>Circuits,</GlitchText><br />
            <span className="line2">Code &amp;</span>{" "}
            <span className="accent">Craft.</span>
          </h1>

          <p className="hero-sub" style={{ opacity: heroReady ? 1 : 0, transform: heroReady ? "translateY(0)" : "translateY(30px)", transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s" }}>
            Aspiring electrician blending hands-on trade skills with cybersecurity expertise, web development, and a love for building things that work — from panels to pixels.
          </p>

          <div className="hero-actions" style={{ opacity: heroReady ? 1 : 0, transform: heroReady ? "translateY(0)" : "translateY(30px)", transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s" }}>
            <MagneticButton href="#projects" className="btn-neon">
              <span>View My Work</span>
              <span>→</span>
            </MagneticButton>
            <MagneticButton href="#contact" className="btn-ghost">
              <span>Get in Touch</span>
            </MagneticButton>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="about">
        <Reveal>
          <p className="section-label">01 — About</p>
          <h2 className="section-title">Who I Am</h2>
        </Reveal>
        <div className="about-grid">
          <Reveal delay={100}>
            <div className="about-text">
              <p>I'm <strong>Eric</strong> — a hands-on builder with a drive to understand how things work at every level. I'm currently preparing for an <strong>electrical apprenticeship</strong>, studying NEC code, circuit theory, and conduit bending through technical references and real-world practice.</p>
              <p>But my curiosity doesn't stop at the breaker panel. I'm deep into <strong>cybersecurity</strong> — hardening Linux servers, configuring firewalls, and building monitoring dashboards. I also build <strong>web applications</strong> from scratch with React, Supabase, and modern tooling.</p>
              <p>Outside of work, I'm building a <strong>custom bobber motorcycle</strong> from a Suzuki Intruder and playing guitar. I believe the best way to learn anything is to get your hands dirty and figure it out.</p>
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="about-stats">
              <div className="stat-card">
                <div className="stat-number"><Counter target={5} suffix="+" /></div>
                <div className="stat-label">Projects Built</div>
              </div>
              <div className="stat-card">
                <div className="stat-number"><Counter target={6} /></div>
                <div className="stat-label">Skill Domains</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" style={{ fontSize: "1.75rem" }}>∞</div>
                <div className="stat-label">Curiosity</div>
              </div>
              <div className="stat-card">
                <div className="stat-number" style={{ fontSize: "1.5rem" }}>24/7</div>
                <div className="stat-label">Always Learning</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SKILLS */}
      <section className="section" id="skills">
        <Reveal>
          <p className="section-label">02 — Skills</p>
          <h2 className="section-title">My Toolkit</h2>
          <p className="section-desc">A cross-disciplinary toolkit forged through real projects — from pulling wire to writing code to locking down networks.</p>
        </Reveal>
        <div className="skills-grid">
          {skillCategories.map((cat, i) => (
            <Reveal key={cat.title} delay={i * 80}>
              <div className="skill-card">
                <div className="skill-icon" style={{ background: `rgba(var(--neon-rgb), 0.1)`, color: cat.color }}>
                  <cat.Icon size={24} color={cat.color} />
                </div>
                <h3>{cat.title}</h3>
                <div className="skill-tags">
                  {cat.items.map((item) => (
                    <span key={item} className="skill-tag">{item}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="proficiency">
            <h3>// Proficiency Levels</h3>
            <div className="prof-grid">
              <SkillBar label="Electrical Theory" level={70} color="var(--yellow)" delay={0} />
              <SkillBar label="React / JavaScript" level={65} color="var(--orange)" delay={100} />
              <SkillBar label="Linux Administration" level={75} color="var(--purple)" delay={200} />
              <SkillBar label="Network Security" level={72} color="var(--neon)" delay={300} />
              <SkillBar label="HTML / CSS" level={80} color="var(--blue)" delay={400} />
              <SkillBar label="Hardware / Builds" level={78} color="var(--pink)" delay={500} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* PROJECTS */}
      <section className="section" id="projects">
        <Reveal>
          <p className="section-label">03 — Projects</p>
          <h2 className="section-title">Things I've Built</h2>
          <p className="section-desc">Real projects that solve real problems — from full-stack apps to hardened servers to hand-built motorcycles.</p>
        </Reveal>
        <div className="projects-grid">
          {projects.map((proj, i) => (
            <Reveal key={proj.title} delay={i * 80}>
              <div className={`project-card ${proj.featured ? "featured" : ""}`}>
                <div>
                  <span className="project-tag" style={{ background: `rgba(var(--neon-rgb), 0.1)`, color: proj.tagColor }}>
                    {proj.tag}
                  </span>
                  <h3>{proj.title}</h3>
                  <p>{proj.desc}</p>
                  <div className="project-tech">
                    {proj.tech.map((t) => (
                      <span key={t} className="skill-tag">{t}</span>
                    ))}
                  </div>
                </div>
                {proj.featured && (
                  <div className="project-preview">
                    <span className="project-preview-text">&lt;NoteStream /&gt;</span>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EDUCATION */}
      <section className="section" id="education">
        <Reveal>
          <p className="section-label">04 — Education</p>
          <h2 className="section-title">Never Stop Learning</h2>
          <p className="section-desc">A mix of structured study and relentless self-teaching across electrical, security, and development.</p>
        </Reveal>
        <div className="edu-timeline">
          {education.map((edu, i) => (
            <Reveal key={edu.title} delay={i * 120}>
              <div className="edu-item">
                <div className="edu-dot"><div className="edu-dot-inner" /></div>
                <div className="edu-meta">{edu.status}</div>
                <h3>{edu.title}</h3>
                <p>{edu.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" id="contact">
        <Reveal>
          <p className="section-label">05 — Contact</p>
          <h2 className="section-title">Let's Connect</h2>
          <p className="section-desc">Open to apprenticeship opportunities, freelance work, or just talking tech. Reach out anytime.</p>
        </Reveal>
        <div className="contact-grid">
          {contacts.map((c, i) => {
            const IconComp = contactIcons[c.iconKey];
            return (
              <Reveal key={c.label} delay={i * 80}>
                <a href={c.href || "#"} className="contact-card" target={c.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  <div className="contact-icon">
                    <IconComp size={22} color="var(--neon)" />
                  </div>
                  <div>
                    <div className="contact-label">{c.label}</div>
                    <div className="contact-value">{c.value}</div>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 Eric. Built from scratch with React.</p>
        <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo("home"); }}>
          Back to top ↑
        </a>
      </footer>
    </>
  );
}