import "./index.css";
import { useState, useEffect, useRef } from "react";
// ═══════════════════════════════════════════════════════
//  ERIC — Creative Resume Site
//  Theme: Dark / Light toggle
//  Fonts: Sora (display) + Crimson Pro (body) + IBM Plex Mono
// ═══════════════════════════════════════════════════════

const SECTIONS = ["home", "about", "skills", "projects", "education", "contact"];

// ── Particle Canvas Background ──
function ParticleField({ theme }) {
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
    particles.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      color: isDark
        ? (Math.random() > 0.7 ? "#00ffc8" : Math.random() > 0.5 ? "#ff6b35" : "#334455")
        : (Math.random() > 0.7 ? "#0d8a6a" : Math.random() > 0.5 ? "#d4541e" : "#c8c5bc"),
    }));

    const lineColor = isDark ? [0, 255, 200] : [13, 138, 106];

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const pts = particles.current;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

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

        for (let j = i + 1; j < pts.length; j++) {
          const p2 = pts[j];
          const d = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (isDark ? 0.08 : 0.12) * (1 - d / 120);
            ctx.strokeStyle = `rgba(${lineColor[0]},${lineColor[1]},${lineColor[2]},${alpha})`;
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
  }, [theme]);

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

  // Set theme on document
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
    { title: "Electrical", icon: "⚡", color: "var(--yellow)", items: ["NEC Code", "Circuit Analysis", "Conduit Bending", "Load Calculations", "Residential Wiring", "Panel Layout"] },
    { title: "Cybersecurity", icon: "🛡️", color: "var(--neon)", items: ["Network Hardening", "Firewall Config", "Intrusion Detection", "SSH Security", "DNS Filtering", "System Auditing"] },
    { title: "Development", icon: "{ }", color: "var(--orange)", items: ["React", "JavaScript", "HTML/CSS", "Supabase", "REST APIs", "Git"] },
    { title: "Linux & Systems", icon: "▸_", color: "var(--purple)", items: ["Kali Linux", "Ubuntu", "Bash Scripting", "Raspberry Pi", "Server Admin", "Docker Basics"] },
    { title: "Networking", icon: "◉", color: "var(--blue)", items: ["DNS Config", "AdGuard Home", "Firewall Rules", "VPN", "Port Security", "Traffic Analysis"] },
    { title: "Hardware", icon: "⚙", color: "var(--pink)", items: ["PC Building", "GPU Tuning", "Motorcycle Builds", "Soldering", "Raspberry Pi", "LCD Integration"] },
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

  const contacts = [
    { icon: "✉", label: "Email", value: "eric.dangel.dev@gmail.com", href: "mailto:eric.dangel.dev@gmail.com" },
    { icon: "◈", label: "GitHub", value: "github.com/blackapple805", href: "https://github.com/blackapple805" },
    { icon: "✆", label: "WhatsApp", value: "(805) 676-8875", href: "https://wa.me/18056768875" },
    { icon: "◎", label: "Instagram", value: "@quest.on.a.dream", href: "https://instagram.com/quest.on.a.dream" },
    { icon: "◉", label: "LinkedIn", value: "Connect with me", href: "https://linkedin.com" },
    { icon: "⌘", label: "Location", value: "United States", href: null },
  ];

  return (
    <>
      {/* LOADING SCREEN */}
      <div className={`loader ${loaded ? "done" : ""}`}>
        <div className="loader-text">INITIALIZING</div>
        <div className="loader-bar"><div className="loader-fill" /></div>
      </div>

      {/* OVERLAYS */}
      <div className="noise" />
      <div className="scanline-overlay" />
      <ParticleField theme={theme} />

      {/* NAV */}
      <nav className={`nav ${scrollY > 50 ? "scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => scrollTo("home")}>
          eric<span>.dev</span>
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
            {theme === "dark" ? "☀" : "☾"}
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
              <div
                className="skill-card"
                onMouseEnter={(e) => {
                  const c = getComputedStyle(e.currentTarget).getPropertyValue("--hover-color") || cat.color;
                  e.currentTarget.style.borderColor = `rgba(var(--neon-rgb), 0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "";
                }}
              >
                <div className="skill-icon" style={{ background: `rgba(var(--neon-rgb), 0.1)`, color: cat.color }}>
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
          {contacts.map((c, i) => (
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