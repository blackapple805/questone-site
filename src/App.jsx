import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════
//  ERIC — Creative Resume Site
//  Aesthetic: Industrial Neon / Circuit Board meets Terminal
// ═══════════════════════════════════════════════════════

const SECTIONS = ["home", "about", "skills", "projects", "education", "contact"];

// ── Particle Canvas Background ──
function ParticleField() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: -1000, y: -1000 });
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const COUNT = 80;
    particles.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      color: Math.random() > 0.7 ? "#00ffc8" : Math.random() > 0.5 ? "#ff6b35" : "#334455",
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const pts = particles.current;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // mouse repulsion
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.x += dx * 0.02;
          p.y += dy * 0.02;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // draw connections
        for (let j = i + 1; j < pts.length; j++) {
          const p2 = pts[j];
          const d = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 255, 200, ${0.08 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    const handleMouse = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse);
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

// ── Typewriter Effect ──
function Typewriter({ text, speed = 50, delay = 0, className = "", onDone }) {
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
    } else if (onDone) {
      onDone();
    }
  }, [displayed, started, text, speed, onDone]);

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && started && (
        <span style={{ animation: "blink 0.8s step-end infinite", color: "#00ffc8" }}>▌</span>
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
function GlitchText({ children, tag: Tag = "span" }) {
  return (
    <Tag className="glitch" data-text={children}>
      {children}
    </Tag>
  );
}

// ── Magnetic Button ──
function MagneticButton({ children, href, className = "", onClick }) {
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
      onClick={onClick}
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
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "#c8d6e5" }}>{label}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color }}>{level}%</span>
      </div>
      <div style={{ height: "6px", background: "#1a2332", borderRadius: "3px", overflow: "hidden" }}>
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

  // ── Skills Data ──
  const skillCategories = [
    {
      title: "Electrical",
      icon: "⚡",
      color: "#ffd93d",
      items: ["NEC Code", "Circuit Analysis", "Conduit Bending", "Load Calculations", "Residential Wiring", "Panel Layout"],
    },
    {
      title: "Cybersecurity",
      icon: "🛡️",
      color: "#00ffc8",
      items: ["Network Hardening", "Firewall Config", "Intrusion Detection", "SSH Security", "DNS Filtering", "System Auditing"],
    },
    {
      title: "Development",
      icon: "{ }",
      color: "#ff6b35",
      items: ["React", "JavaScript", "HTML/CSS", "Supabase", "REST APIs", "Git"],
    },
    {
      title: "Linux & Systems",
      icon: "▸_",
      color: "#a29bfe",
      items: ["Kali Linux", "Ubuntu", "Bash Scripting", "Raspberry Pi", "Server Admin", "Docker Basics"],
    },
    {
      title: "Networking",
      icon: "◉",
      color: "#74b9ff",
      items: ["DNS Config", "AdGuard Home", "Firewall Rules", "VPN", "Port Security", "Traffic Analysis"],
    },
    {
      title: "Hardware",
      icon: "⚙",
      color: "#fd79a8",
      items: ["PC Building", "GPU Tuning", "Motorcycle Builds", "Soldering", "Raspberry Pi", "LCD Integration"],
    },
  ];

  const projects = [
    {
      title: "NoteStream",
      tag: "FEATURED",
      tagColor: "#00ffc8",
      desc: "Full-featured React note-taking app with AI-powered features, subscription tiers, custom training, and a responsive dashboard. Supabase backend with RLS policies and edge functions.",
      tech: ["React", "Supabase", "AI", "Edge Functions", "RLS"],
      featured: true,
    },
    {
      title: "Pi Security Dashboard",
      tag: "SECURITY",
      tagColor: "#ff6b35",
      desc: "Web monitoring dashboard for a Raspberry Pi 4 running Kali Linux. SSH key auth, fail2ban, UFW, portsentry, and external storage integration.",
      tech: ["Kali", "Fail2ban", "UFW", "SSH", "Python"],
    },
    {
      title: "AdGuard DNS Filter",
      tag: "NETWORK",
      tagColor: "#a29bfe",
      desc: "Network-wide DNS filtering with AdGuard Home on Raspberry Pi. Blocks ads and trackers across every device on the home network.",
      tech: ["AdGuard", "DNS", "Raspberry Pi", "DHCP"],
    },
    {
      title: "Pixel 6 Pro Hardening",
      tag: "MOBILE",
      tagColor: "#74b9ff",
      desc: "Rooted and hardened a Pixel 6 Pro with AFWall+ firewall, custom security policies, and network-level protections for maximum privacy.",
      tech: ["Android", "AFWall+", "Root", "Magisk"],
    },
    {
      title: "Custom Bobber Build",
      tag: "HARDWARE",
      tagColor: "#fd79a8",
      desc: "Designing and fabricating a custom bobber motorcycle from a Suzuki Intruder — engine work, frame mods, and custom electrical wiring.",
      tech: ["Fabrication", "Wiring", "Engine", "Design"],
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');

        :root {
          --bg: #0a0e17;
          --bg2: #0f1520;
          --bg3: #141c2b;
          --surface: #1a2332;
          --border: #243044;
          --text: #e8edf5;
          --text2: #8899aa;
          --neon: #00ffc8;
          --orange: #ff6b35;
          --purple: #a29bfe;
          --blue: #74b9ff;
          --pink: #fd79a8;
          --yellow: #ffd93d;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'Outfit', sans-serif;
          background: var(--bg);
          color: var(--text);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--neon); }

        /* BLINK CURSOR */
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* GLITCH */
        .glitch {
          position: relative;
          display: inline-block;
        }
        .glitch::before, .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
        }
        .glitch::before {
          animation: glitch1 3s infinite;
          color: var(--neon);
          z-index: -1;
        }
        .glitch::after {
          animation: glitch2 3s infinite;
          color: var(--orange);
          z-index: -1;
        }
        @keyframes glitch1 {
          0%,93%,100%{transform:translate(0)} 94%{transform:translate(-3px,-1px)} 95%{transform:translate(2px,1px)} 96%{transform:translate(-1px,2px)}
        }
        @keyframes glitch2 {
          0%,93%,100%{transform:translate(0)} 94%{transform:translate(3px,1px)} 95%{transform:translate(-2px,-1px)} 96%{transform:translate(1px,-2px)}
        }

        /* GLOW PULSE */
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 20px rgba(0,255,200,0.1), inset 0 0 20px rgba(0,255,200,0.05); }
          50% { box-shadow: 0 0 40px rgba(0,255,200,0.2), inset 0 0 40px rgba(0,255,200,0.1); }
        }

        /* SCAN LINE */
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        /* FLOAT */
        @keyframes float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        /* GRADIENT SHIFT */
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* NAV */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 0 2rem;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(10, 14, 23, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid transparent;
          transition: all 0.3s;
        }
        .nav.scrolled {
          border-bottom-color: var(--border);
          background: rgba(10, 14, 23, 0.95);
        }
        .nav-logo {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--neon);
          cursor: pointer;
          letter-spacing: -0.02em;
        }
        .nav-logo span { color: var(--text2); }
        .nav-links {
          display: flex;
          gap: 0.25rem;
          align-items: center;
        }
        .nav-link {
          background: none;
          border: none;
          color: var(--text2);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          padding: 0.5rem 1rem;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .nav-link:hover { color: var(--text); background: var(--surface); }
        .nav-link.active { color: var(--neon); background: rgba(0,255,200,0.08); }
        .nav-cta {
          background: var(--neon);
          color: var(--bg);
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 0.8rem;
          padding: 0.55rem 1.25rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          margin-left: 0.75rem;
          transition: all 0.2s;
        }
        .nav-cta:hover { opacity: 0.85; transform: translateY(-1px); }

        /* MOBILE NAV */
        .mobile-toggle {
          display: none;
          background: none;
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 0.5rem;
          cursor: pointer;
          color: var(--text);
          font-size: 1.2rem;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 768px) {
          .mobile-toggle { display: flex; }
          .nav-links {
            display: none;
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            background: rgba(10, 14, 23, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 1rem;
            border-bottom: 1px solid var(--border);
          }
          .nav-links.open { display: flex; }
          .nav-cta { margin-left: 0; margin-top: 0.5rem; }
        }

        /* MAGNETIC BTN */
        .magnetic-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.85rem 2rem;
          border-radius: 8px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          border: none;
          transition: all 0.25s;
        }
        .btn-neon {
          background: var(--neon);
          color: var(--bg);
          box-shadow: 0 0 30px rgba(0,255,200,0.2);
        }
        .btn-neon:hover { box-shadow: 0 0 50px rgba(0,255,200,0.35); }
        .btn-ghost {
          background: transparent;
          color: var(--text);
          border: 1.5px solid var(--border);
        }
        .btn-ghost:hover { border-color: var(--neon); color: var(--neon); }

        /* SECTION */
        .section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 7rem 2rem;
          position: relative;
          z-index: 1;
        }
        .section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--neon);
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .section-label::before {
          content: '';
          width: 30px;
          height: 1px;
          background: var(--neon);
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 1rem;
        }
        .section-desc {
          color: var(--text2);
          font-size: 1.05rem;
          max-width: 550px;
          line-height: 1.7;
          margin-bottom: 3rem;
        }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
        .hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          width: 100%;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--neon);
          background: rgba(0,255,200,0.08);
          border: 1px solid rgba(0,255,200,0.2);
          padding: 0.4rem 1rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          animation: glowPulse 3s ease infinite;
        }
        .hero-badge .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--neon);
          animation: blink 1.5s ease infinite;
        }
        .hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
        }
        .hero h1 .line2 {
          color: transparent;
          -webkit-text-stroke: 1.5px var(--text2);
        }
        .hero h1 .accent {
          color: var(--neon);
          -webkit-text-stroke: 0;
          font-style: italic;
        }
        .hero-sub {
          font-size: 1.15rem;
          color: var(--text2);
          max-width: 500px;
          line-height: 1.8;
          margin-bottom: 2.5rem;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .hero-scroll {
          position: absolute;
          bottom: 3rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: var(--text2);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          animation: float 2.5s ease infinite;
        }
        .scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, var(--neon), transparent);
        }

        /* ABOUT GRID */
        .about-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        .about-text p {
          color: var(--text2);
          line-height: 1.8;
          margin-bottom: 1.25rem;
          font-size: 1rem;
        }
        .about-text p strong { color: var(--text); font-weight: 600; }
        .about-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .stat-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.75rem;
          text-align: center;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--neon), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .stat-card:hover { border-color: rgba(0,255,200,0.3); transform: translateY(-4px); }
        .stat-card:hover::before { opacity: 1; }
        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 2.25rem;
          font-weight: 900;
          color: var(--neon);
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .stat-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: var(--text2);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* SKILLS */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .skill-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 2rem 1.75rem;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .skill-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 14px;
          opacity: 0;
          transition: opacity 0.35s;
        }
        .skill-card:hover {
          transform: translateY(-6px);
          border-color: transparent;
        }
        .skill-card:hover::after { opacity: 1; }
        .skill-icon {
          font-size: 1.5rem;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
        }
        .skill-card h3 {
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 1rem;
          font-family: 'Outfit', sans-serif;
        }
        .skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .skill-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          background: rgba(255,255,255,0.05);
          color: var(--text2);
          border: 1px solid var(--border);
          transition: all 0.2s;
        }
        .skill-card:hover .skill-tag {
          border-color: rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.08);
        }

        /* PROFICIENCY */
        .proficiency {
          margin-top: 4rem;
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 2.5rem;
        }
        .proficiency h3 {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: var(--neon);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 2rem;
        }
        .prof-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 3rem;
        }

        /* PROJECTS */
        .projects-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .project-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 2rem;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          cursor: default;
        }
        .project-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .project-card.featured {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 2.5rem;
          align-items: center;
          padding: 2.5rem;
        }
        .project-tag {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.3rem 0.7rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }
        .project-card h3 {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }
        .project-card p {
          font-size: 0.9rem;
          color: var(--text2);
          line-height: 1.7;
        }
        .project-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 1.25rem;
        }
        .project-preview {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .project-preview-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          color: var(--neon);
        }
        .project-preview::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg, transparent, rgba(0,255,200,0.05), transparent, rgba(255,107,53,0.05), transparent);
          animation: gradientShift 8s linear infinite;
        }

        /* EDUCATION */
        .edu-timeline {
          position: relative;
          padding-left: 3rem;
        }
        .edu-timeline::before {
          content: '';
          position: absolute;
          top: 0;
          left: 11px;
          bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, var(--neon), var(--border), transparent);
        }
        .edu-item {
          position: relative;
          margin-bottom: 2.5rem;
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 2rem;
          transition: all 0.3s;
        }
        .edu-item:hover {
          border-color: rgba(0,255,200,0.3);
          transform: translateX(8px);
        }
        .edu-dot {
          position: absolute;
          left: -3rem;
          top: 2rem;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--bg);
          border: 2px solid var(--neon);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transform: translateX(0px);
        }
        .edu-dot-inner {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--neon);
        }
        .edu-meta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: var(--neon);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.5rem;
        }
        .edu-item h3 {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .edu-item p {
          font-size: 0.9rem;
          color: var(--text2);
          line-height: 1.7;
        }

        /* CONTACT */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .contact-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          text-decoration: none;
          color: inherit;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .contact-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0,255,200,0.3);
          box-shadow: 0 16px 48px rgba(0,0,0,0.25);
        }
        .contact-icon {
          width: 52px;
          height: 52px;
          min-width: 52px;
          border-radius: 14px;
          background: rgba(0,255,200,0.08);
          border: 1px solid rgba(0,255,200,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.3s;
        }
        .contact-card:hover .contact-icon {
          background: rgba(0,255,200,0.15);
          box-shadow: 0 0 20px rgba(0,255,200,0.15);
        }
        .contact-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          color: var(--text2);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.2rem;
        }
        .contact-value {
          font-size: 1rem;
          font-weight: 600;
        }

        /* FOOTER */
        .footer {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .footer p {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--text2);
        }
        .footer a {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--text2);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer a:hover { color: var(--neon); }

        /* SCAN LINE OVERLAY */
        .scanline-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
        }
        .scanline-overlay::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, transparent, rgba(0,255,200,0.06), transparent);
          animation: scanline 6s linear infinite;
        }

        /* NOISE OVERLAY */
        .noise {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none;
          z-index: 9998;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 256px;
        }

        /* LOADING SCREEN */
        .loader {
          position: fixed;
          inset: 0;
          background: var(--bg);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 1.5rem;
          transition: opacity 0.6s, visibility 0.6s;
        }
        .loader.done { opacity: 0; visibility: hidden; pointer-events: none; }
        .loader-bar {
          width: 120px;
          height: 2px;
          background: var(--border);
          border-radius: 1px;
          overflow: hidden;
        }
        .loader-fill {
          height: 100%;
          background: var(--neon);
          border-radius: 1px;
          animation: loadFill 1s ease forwards;
          box-shadow: 0 0 10px var(--neon);
        }
        @keyframes loadFill { 0%{width:0} 100%{width:100%} }
        .loader-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: var(--text2);
          letter-spacing: 0.1em;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .skills-grid { grid-template-columns: 1fr 1fr; }
          .prof-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .section { padding: 5rem 1.5rem; }
          .hero-inner { padding: 0 1.5rem; }
          .about-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .skills-grid { grid-template-columns: 1fr; }
          .projects-grid { grid-template-columns: 1fr; }
          .project-card.featured { grid-template-columns: 1fr; }
          .contact-grid { grid-template-columns: 1fr; }
          .footer { flex-direction: column; gap: 1rem; text-align: center; }
          .hero-scroll { display: none; }
        }
      `}</style>

      {/* LOADING SCREEN */}
      <div className={`loader ${loaded ? "done" : ""}`}>
        <div className="loader-text">INITIALIZING</div>
        <div className="loader-bar"><div className="loader-fill" /></div>
      </div>

      {/* OVERLAYS */}
      <div className="noise" />
      <div className="scanline-overlay" />
      <ParticleField />

      {/* NAV */}
      <nav className={`nav ${scrollY > 50 ? "scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => scrollTo("home")}>
          eric<span>.dev</span>
        </div>
        <button className="mobile-toggle" onClick={() => setMobileNav(!mobileNav)}>
          {mobileNav ? "✕" : "☰"}
        </button>
        <div className={`nav-links ${mobileNav ? "open" : ""}`}>
          {SECTIONS.filter(s => s !== "home").map((s) => (
            <button
              key={s}
              className={`nav-link ${activeSection === s ? "active" : ""}`}
              onClick={() => scrollTo(s)}
            >
              {s}
            </button>
          ))}
          <button className="nav-cta" onClick={() => scrollTo("contact")}>Let's Talk</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-inner">
          <div style={{
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? "translateY(0)" : "translateY(30px)",
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>
            <div className="hero-badge">
              <span className="dot" />
              <Typewriter text="OPEN TO OPPORTUNITIES" speed={40} delay={1200} />
            </div>
          </div>

          <h1 style={{
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? "translateY(0)" : "translateY(40px)",
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}>
            <GlitchText>Circuits,</GlitchText><br />
            <span className="line2">Code &amp;</span>{" "}
            <span className="accent">Craft.</span>
          </h1>

          <p className="hero-sub" style={{
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? "translateY(0)" : "translateY(30px)",
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
          }}>
            Aspiring electrician blending hands-on trade skills with
            cybersecurity expertise, web development, and a love for
            building things that work — from panels to pixels.
          </p>

          <div className="hero-actions" style={{
            opacity: heroReady ? 1 : 0,
            transform: heroReady ? "translateY(0)" : "translateY(30px)",
            transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
          }}>
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
              <p>
                I'm <strong>Eric</strong> — a hands-on builder with a drive to understand how things work at every level. I'm currently preparing for an <strong>electrical apprenticeship</strong>, studying NEC code, circuit theory, and conduit bending through technical references and real-world practice.
              </p>
              <p>
                But my curiosity doesn't stop at the breaker panel. I'm deep into <strong>cybersecurity</strong> — hardening Linux servers, configuring firewalls, and building monitoring dashboards. I also build <strong>web applications</strong> from scratch with React, Supabase, and modern tooling.
              </p>
              <p>
                Outside of work, I'm building a <strong>custom bobber motorcycle</strong> from a Suzuki Intruder and playing guitar. I believe the best way to learn anything is to get your hands dirty and figure it out.
              </p>
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="about-stats">
              <div className="stat-card">
                <div className="stat-number"><Counter target={5} suffix="+" /></div>
                <div className="stat-label">Projects Built</div>
              </div>
              <div className="stat-card">
                <div className="stat-number"><Counter target={6} suffix="" /></div>
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
          <p className="section-desc">
            A cross-disciplinary toolkit forged through real projects — from pulling wire to writing code to locking down networks.
          </p>
        </Reveal>
        <div className="skills-grid">
          {skillCategories.map((cat, i) => (
            <Reveal key={cat.title} delay={i * 80}>
              <div
                className="skill-card"
                style={{
                  "--hover-color": cat.color,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = cat.color + "44";
                  e.currentTarget.style.boxShadow = `0 20px 60px ${cat.color}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="skill-icon" style={{ background: cat.color + "15", color: cat.color }}>
                  {cat.icon}
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
              <SkillBar label="Electrical Theory" level={70} color="#ffd93d" delay={0} />
              <SkillBar label="React / JavaScript" level={65} color="#ff6b35" delay={100} />
              <SkillBar label="Linux Administration" level={75} color="#a29bfe" delay={200} />
              <SkillBar label="Network Security" level={72} color="#00ffc8" delay={300} />
              <SkillBar label="HTML / CSS" level={80} color="#74b9ff" delay={400} />
              <SkillBar label="Hardware / Builds" level={78} color="#fd79a8" delay={500} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* PROJECTS */}
      <section className="section" id="projects">
        <Reveal>
          <p className="section-label">03 — Projects</p>
          <h2 className="section-title">Things I've Built</h2>
          <p className="section-desc">
            Real projects that solve real problems — from full-stack apps to hardened servers to hand-built motorcycles.
          </p>
        </Reveal>
        <div className="projects-grid">
          {projects.map((proj, i) => (
            <Reveal key={proj.title} delay={i * 80}>
              <div className={`project-card ${proj.featured ? "featured" : ""}`}>
                <div>
                  <span
                    className="project-tag"
                    style={{ background: proj.tagColor + "18", color: proj.tagColor }}
                  >
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
          <p className="section-desc">
            A mix of structured study and relentless self-teaching across electrical, security, and development.
          </p>
        </Reveal>
        <div className="edu-timeline">
          {[
            {
              status: "In Progress",
              title: "Electrical Apprenticeship Prep",
              desc: "Independent study of NEC code, circuit theory, conduit bending, and load calculations using Ugly's Electrical References and Siemens catalogs. Preparing for formal apprenticeship entry.",
            },
            {
              status: "Ongoing",
              title: "Cybersecurity — Self-Directed",
              desc: "Hands-on learning through building intrusion detection systems, configuring firewalls and fail2ban, hardening Linux servers, and creating security monitoring dashboards on Raspberry Pi.",
            },
            {
              status: "Ongoing",
              title: "Full-Stack Web Development",
              desc: "Learning React, JavaScript, database design with Supabase, API integration, and deployment through building real applications like NoteStream with auth, subscriptions, and AI features.",
            },
            {
              status: "Ongoing",
              title: "Linux & System Administration",
              desc: "Deep-diving into Kali Linux, Ubuntu server management, shell scripting, service configuration, and embedded systems through Raspberry Pi projects and home lab setups.",
            },
          ].map((edu, i) => (
            <Reveal key={edu.title} delay={i * 120}>
              <div className="edu-item">
                <div className="edu-dot">
                  <div className="edu-dot-inner" />
                </div>
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
          <p className="section-desc">
            Open to apprenticeship opportunities, freelance work, or just talking tech. Reach out anytime.
          </p>
        </Reveal>
        <div className="contact-grid">
          {[
            { icon: "✉", label: "Email", value: "your.email@example.com", href: "mailto:your.email@example.com" },
            { icon: "◈", label: "GitHub", value: "github.com/yourusername", href: "https://github.com" },
            { icon: "◉", label: "LinkedIn", value: "Connect with me", href: "https://linkedin.com" },
            { icon: "⌘", label: "Location", value: "United States", href: null },
          ].map((c, i) => (
            <Reveal key={c.label} delay={i * 80}>
              <a href={c.href || "#"} className="contact-card" target={c.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                <div className="contact-icon">{c.icon}</div>
                <div>
                  <div className="contact-label">{c.label}</div>
                  <div className="contact-value">{c.value}</div>
                </div>
              </a>
            </Reveal>
          ))}
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