import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════
//  ERIC — Creative Resume Site v3
//  Aesthetic: Cyberpunk Dragon / Acid Yellow-Black
//  Hero: Mech Dragon image with parallax + glow
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
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" strokeOpacity="0.5" />
    </svg>
  ),
  Terminal: ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="3" fill={color} fillOpacity="0.08" />
      <polyline points="7 10 10 13 7 16" /><line x1="13" y1="16" x2="17" y2="16" />
    </svg>
  ),
  Network: ({ size = 24, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2.5" fill={color} fillOpacity="0.15" />
      <circle cx="5" cy="19" r="2.5" fill={color} fillOpacity="0.15" />
      <circle cx="19" cy="19" r="2.5" fill={color} fillOpacity="0.15" />
      <line x1="12" y1="7.5" x2="5" y2="16.5" /><line x1="12" y1="7.5" x2="19" y2="16.5" />
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
      <rect x="2" y="4" width="20" height="16" rx="3" fill={color} fillOpacity="0.08" /><polyline points="22 7 12 13 2 7" />
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
      <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" />
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
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" fill={color} fillOpacity="0.1" /><circle cx="12" cy="10" r="3" />
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
  ExternalLink: ({ size = 18, color = "currentColor" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 3h7v7" />
      <path d="M10 14L21 3" />
      <path d="M21 14v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
    </svg>
  ),
  Check: ({ size = 18, color = "currentColor" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ), 
};

// ── Dragon Hero Image with parallax mouse tracking ──
function DragonHero({ theme }) {
  return (
    <div className="dragon-container" aria-label="Cyberpunk Mech Dragon">
      <div className="dragon-glow" />
      <div className="dragon-stack">
        <object
          data="/dragon.svg"
          type="image/svg+xml"
          aria-hidden="true"
          className={`dragon-img dragon-layer ${theme === "dark" ? "is-on" : ""}`}
          style={{ pointerEvents: "none" }}
        />
        <object
          data="/lightdragon.svg"
          type="image/svg+xml"
          aria-hidden="true"
          className={`dragon-img dragon-layer ${theme === "light" ? "is-on" : ""}`}
          style={{ pointerEvents: "none" }}
        />
      </div>
    </div>
  );
}

// ── Particle Field Background ──
function ParticleField({ theme }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const isDark = theme === "dark";
    const COUNT = 50;
    const nR = isDark ? 230 : 13;
    const nG = isDark ? 210 : 138;
    const nB = isDark ? 0 : 106;

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nR},${nG},${nB},${isDark ? 0.12 : 0.07})`;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${nR},${nG},${nB},${(1 - d / 110) * (isDark ? 0.05 : 0.03)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", onResize); };
  }, [theme]);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

// ── Typewriter ──
function Typewriter({ text, speed = 50, delay = 0 }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStarted(true), delay); return () => clearTimeout(t); }, [delay]);
  useEffect(() => {
    if (!started || displayed.length >= text.length) return;
    const t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed);
    return () => clearTimeout(t);
  }, [displayed, started, text, speed]);
  return <span>{displayed}{displayed.length < text.length && started && <span className="cursor-blink">▌</span>}</span>;
}

// ── Scroll Reveal ──
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold, rootMargin: "0px 0px -60px 0px" });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = 0, direction = "up" }) {
  const [ref, visible] = useScrollReveal();
  const transforms = { up: "translateY(60px)", down: "translateY(-60px)", left: "translateX(60px)", right: "translateX(-60px)", scale: "scale(0.9)" };
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : transforms[direction], transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`, willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}

// ── Counter ──
function Counter({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useScrollReveal();
  useEffect(() => {
    if (!visible) return;
    let start = 0; const step = target / (duration / 16);
    const iv = setInterval(() => { start += step; if (start >= target) { setCount(target); clearInterval(iv); } else setCount(Math.floor(start)); }, 16);
    return () => clearInterval(iv);
  }, [visible, target, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Skill Bar ──
function SkillBar({ label, level, rgbVar = "var(--neon-rgb)", delay = 0 }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div ref={ref} style={{ marginBottom: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--text)" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: `rgb(${rgbVar})` }}>{level}%</span>
      </div>
      <div style={{ height: "6px", background: "var(--proficiency-track)", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: visible ? `${level}%` : "0%", background: `linear-gradient(90deg, rgba(${rgbVar}, 1), rgba(${rgbVar}, 0.55))`, borderRadius: "3px", transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${delay}ms`, boxShadow: visible ? `0 0 12px rgba(${rgbVar}, 0.35)` : "none" }} />
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

  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 300); return () => clearTimeout(t); }, []);
  useEffect(() => { const t = setTimeout(() => setHeroReady(true), 800); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const sections = SECTIONS.map((id) => {
        const el = document.getElementById(id);
        return { id, top: el ? el.getBoundingClientRect().top : 0 };
      });
      const current = sections.reduce((prev, curr) => Math.abs(curr.top - 100) < Math.abs(prev.top - 100) ? curr : prev);
      setActiveSection(current.id);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileNav(false); };
  const toggleTheme = () => setTheme(p => p === "dark" ? "light" : "dark");

  const skillCategories = [
    { title: "DevOps & CI/CD", Icon: Icons.Gear, color: "var(--neon)", items: ["Jenkins", "GitHub Actions", "CI/CD Pipelines", "Automation", "Prometheus", "Monitoring"] },
    { title: "Cloud & IaC", Icon: Icons.Network, color: "var(--blue)", items: ["Terraform", "AWS VPC", "Infrastructure as Code", "Cloud Deployments", "Docker", "Scalable Systems"] },
    { title: "Development", Icon: Icons.Code, color: "var(--orange)", items: ["React", "JavaScript", "Python", "HTML/CSS", "Supabase", "REST APIs"] },
    { title: "Linux & Systems", Icon: Icons.Terminal, color: "var(--purple)", items: ["Kali Linux", "Ubuntu", "Bash Scripting", "Raspberry Pi", "Server Admin", "Docker"] },
    { title: "Cybersecurity", Icon: Icons.Shield, color: "var(--yellow)", items: ["Network Hardening", "Firewall Config", "SSH Security", "DNS Filtering", "Fail2ban", "System Auditing"] },
    { title: "Electrical & IoT", Icon: Icons.Bolt, color: "var(--pink)", items: ["NEC Code", "Circuit Analysis", "Conduit Bending", "ESP8266", "IoT Sensors", "Panel Layout"] },
  ];

  const projects = [
    { title: "NoteStream", tag: "FEATURED", tagColor: "var(--neon)", desc: "Full-featured React note-taking app with AI-powered features, subscription tiers, custom training, and a responsive dashboard. Supabase backend with RLS policies and edge functions.", tech: ["React", "Supabase", "AI", "Edge Functions"], featured: true, href: "https://github.com/blackapple805/notestream-site" },
    { title: "QuestOne Site", tag: "WEB", tagColor: "var(--orange)", desc: "Personal portfolio and cloud landing page at questone.cloud. Built to showcase DevOps projects, infrastructure work, and professional presence.", tech: ["React", "JavaScript", "CSS", "Deployment"], href: "https://github.com/blackapple805/questone-site" },
    { title: "IoT Log", tag: "IOT", tagColor: "var(--pink)", desc: "ESP8266-based IoT data pipeline that uploads JSON sensor data directly to GitHub. Hardware meets version control for lightweight cloud logging.", tech: ["ESP8266", "JavaScript", "JSON", "GitHub API"], href: "https://github.com/blackapple805/iot-log" },
    { title: "Terraform AWS VPC", tag: "CLOUD", tagColor: "var(--blue)", desc: "Forked and customized Terraform module for provisioning AWS VPC resources. Infrastructure as code for scalable, repeatable cloud networking.", tech: ["Terraform", "AWS", "HCL", "IaC"], href: "https://github.com/blackapple805/terraform-aws-vpc" },
    { title: "Prometheus", tag: "MONITORING", tagColor: "var(--neon)", desc: "Working with the Prometheus monitoring and alerting toolkit. Metrics collection, dashboards, and infrastructure observability at scale.", tech: ["Prometheus", "Monitoring", "Metrics", "Alerting"], href: "https://github.com/blackapple805/prometheus" },
    { title: "Jenkins", tag: "CI/CD", tagColor: "var(--purple)", desc: "Forked Jenkins automation server — exploring pipeline configuration, plugin development, and continuous integration/deployment workflows.", tech: ["Jenkins", "Java", "CI/CD", "Automation"], href: "https://github.com/blackapple805/jenkins" },
    { title: "JUnit Plugin", tag: "TESTING", tagColor: "var(--yellow)", desc: "Jenkins JUnit plugin for test result reporting. Understanding plugin architecture and integrating automated testing into CI pipelines.", tech: ["Java", "Jenkins", "JUnit", "Plugins"], href: "https://github.com/blackapple805/junit-plugin" },
    { title: "Projects & Portfolio", tag: "COLLECTION", tagColor: "var(--orange)", desc: "A collection of projects and prototypes in Python — showcasing scripting, automation, and problem-solving across different domains.", tech: ["Python", "Scripting", "Automation"], href: "https://github.com/blackapple805/Projects" },
  ];

  const education = [
    {
      status: "In Progress",
      title: "Electrical Apprenticeship Prep",
      desc: "Independent study of NEC code, circuit theory, conduit bending, and load calculations using Ugly's Electrical References and Siemens catalogs. Preparing for formal apprenticeship entry.",
      Icon: Icons.Bolt,
      iconColor: "var(--pink)",
    },
    {
      status: "Ongoing",
      title: "DevOps & Cloud Infrastructure",
      desc: "Hands-on learning through Terraform AWS VPC provisioning, Jenkins CI/CD pipeline configuration, Prometheus monitoring, and Docker containerization.",
      Icon: Icons.Gear,
      iconColor: "var(--neon)",
    },
    {
      status: "Ongoing",
      title: "Full-Stack Web Development",
      desc: "Building React applications with Supabase backends, deploying sites like NoteStream and QuestOne. Learning auth, subscriptions, AI integration, and modern deployment workflows.",
      Icon: Icons.Code,
      iconColor: "var(--orange)",
    },
    {
      status: "Ongoing",
      title: "Linux, Security & IoT",
      desc: "Deep-diving into Kali Linux, server hardening, shell scripting, and embedded systems. Building ESP8266 IoT data pipelines and Raspberry Pi security monitoring dashboards.",
      Icon: Icons.Terminal,
      iconColor: "var(--purple)",
    },
  ];

  const contactIcons = { Email: Icons.Mail, GitHub: Icons.GitHub, WhatsApp: Icons.Phone, Instagram: Icons.Instagram, LinkedIn: Icons.LinkedIn, Location: Icons.MapPin };

  const contacts = [
    { iconKey: "Email", label: "Email", value: "eric.dangel.dev@gmail.com", href: "mailto:eric.dangel.dev@gmail.com" },
    { iconKey: "GitHub", label: "GitHub", value: "github.com/blackapple805", href: "https://github.com/blackapple805" },
    { iconKey: "WhatsApp", label: "WhatsApp", value: "(805) 676-8875", href: "https://wa.me/18056768875" },
    { iconKey: "Instagram", label: "Instagram", value: "@quest.on.a.dream", href: "https://instagram.com/quest.on.a.dream" },
    { iconKey: "LinkedIn", label: "LinkedIn", value: "in/eric-del-angel", href: "https://www.linkedin.com/in/eric-del-angel/" },
    { iconKey: "Location", label: "Location", value: "United States", href: null },
  ];

  const heroAnim = (d) => ({ opacity: heroReady ? 1 : 0, transform: heroReady ? "translateY(0)" : "translateY(30px)", transition: `all 1s cubic-bezier(0.16,1,0.3,1) ${d}s` });

  return (
    <>
      {/* LOADER */}
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
          <span className="logo-mark">E<span className="logo-dot">.</span></span>
        </div>
        <button className={`mobile-toggle ${mobileNav ? "open" : ""}`} onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle menu">
          <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
            <line className="ham-line ham-top" x1="1" y1="2" x2="21" y2="2" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" />
            <line className="ham-line ham-mid" x1="1" y1="9" x2="21" y2="9" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" />
            <line className="ham-line ham-bot" x1="1" y1="16" x2="21" y2="16" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className={`nav-links ${mobileNav ? "open" : ""}`}>
          {SECTIONS.filter(s => s !== "home").map(s => (
            <button key={s} className={`nav-link ${activeSection === s ? "active" : ""}`} onClick={() => scrollTo(s)}>{s}</button>
          ))}
          <button className="nav-cta" onClick={() => scrollTo("contact")}>Let's Talk</button>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Icons.Sun size={18} /> : <Icons.Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-card">
          <div className="hero-layout">
            <div className="hero-content">
              <div style={heroAnim(0)}>
                <div className="hero-badge">
                  <span className="dot" />
                  <Typewriter text="OPEN TO OPPORTUNITIES" speed={40} delay={1200} />
                </div>
              </div>
              <h1 style={heroAnim(0.2)}>
                <span className="hero-line1">CIRCUITS,</span>
                <span className="hero-line2">CODE &</span>
                <span className="hero-line3">CRAFT<span className="accent">.</span></span>
              </h1>
              <p className="hero-sub" style={heroAnim(0.4)}>
                Aspiring electrician and DevOps engineer blending hands-on trade skills with cloud infrastructure, CI/CD automation, and a love for building things that work.
              </p>
              <div className="hero-tags" style={heroAnim(0.5)}>
                {["DEVOPS", "CLOUD", "REACT", "LINUX", "SECURITY", "ELECTRICAL"].map(t => (
                  <span key={t} className="hero-tag">{t}</span>
                ))}
              </div>
              <div className="hero-actions" style={heroAnim(0.6)}>
                <a href="#projects" className="btn-neon" onClick={(e) => { e.preventDefault(); scrollTo("projects"); }}>
                  <span>View My Work</span><span>→</span>
                </a>
                <a href="#contact" className="btn-ghost" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>
                  <span>Get in Touch</span>
                </a>
              </div>
            </div>
            <div className="hero-visual" style={heroAnim(0.3)}>
              <DragonHero theme={theme} />
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="about">
        <Reveal><p className="section-label">01 — About</p><h2 className="section-title">Who I Am</h2></Reveal>
        <div className="about-grid">
          <Reveal delay={100}>
            <div className="about-text">
              <p>I'm <strong>Eric</strong> — a DevOps and IT Infrastructure Engineer with a drive to understand how things work at every level. I'm focused on <strong>automation, monitoring, and secure cloud deployments</strong>, building efficient CI/CD pipelines and scalable systems. I'm also preparing for an <strong>electrical apprenticeship</strong>, studying NEC code, circuit theory, and conduit bending.</p>
              <p>My work spans <strong>infrastructure as code</strong> with Terraform, container orchestration, Jenkins automation, and Prometheus monitoring. I build <strong>web applications</strong> from scratch with React and Supabase, and I'm deep into <strong>IoT</strong> — shipping ESP8266 sensor data directly to GitHub.</p>
              <p>Outside of work, I'm building a <strong>custom bobber motorcycle</strong> from a Suzuki Intruder and playing guitar. I believe the best way to learn anything is to get your hands dirty and figure it out.</p>
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="about-stats">
              {[
                { number: <Counter target={10} />, label: "Repositories" },
                { number: <Counter target={6} />, label: "Skill Domains" },
                { number: "∞", label: "Curiosity", style: { fontSize: "1.75rem" } },
                { number: "24/7", label: "Always Learning", style: { fontSize: "1.5rem" } },
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-number" style={s.style}>{s.number}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SKILLS */}
      <section className="section" id="skills">
        <Reveal>
          <p className="section-label">02 — Skills</p>
          <h2 className="section-title">My Toolkit</h2>
          <p className="section-desc">A cross-disciplinary toolkit forged through real projects — from provisioning cloud infrastructure to writing code to wiring panels.</p>
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
                  {cat.items.map(item => <span key={item} className="skill-tag">{item}</span>)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <div className="proficiency">
            <h3>// Proficiency Levels</h3>
            <div className="prof-grid">
              <SkillBar label="Terraform / IaC" level={68} rgbVar="var(--blue-rgb)" delay={0} />
              <SkillBar label="CI/CD (Jenkins)" level={70} rgbVar="var(--neon-rgb)" delay={100} />
              <SkillBar label="React / JavaScript" level={65} rgbVar="var(--orange-rgb)" delay={200} />
              <SkillBar label="Linux Administration" level={75} rgbVar="var(--purple-rgb)" delay={300} />
              <SkillBar label="Network Security" level={72} rgbVar="var(--yellow-rgb)" delay={400} />
              <SkillBar label="Electrical Theory" level={70} rgbVar="var(--pink-rgb)" delay={500} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* PROJECTS */}
      <section className="section is-centered" id="projects">
        <Reveal>
          <p className="section-label">03 — Projects</p>
          <h2 className="section-title">Things I've Built</h2>
          <p className="section-desc">Real projects solving real problems — from cloud infrastructure and CI/CD pipelines to full-stack apps and IoT data systems.</p>
        </Reveal>
        <div className="projects-grid">
          {projects.map((proj, i) => (
            <Reveal key={proj.title} delay={i * 80}>
              <a href={proj.href} target="_blank" rel="noopener noreferrer" className={`project-card ${proj.featured ? "featured" : ""}`}>
                <div>
                  <span className="project-tag" style={{ background: `rgba(var(--neon-rgb), 0.1)`, color: proj.tagColor }}>{proj.tag}</span>
                 <h3 className="project-title">
                  <span>{proj.title}</span>
                  <span className="arrow-icon" aria-hidden="true">
                    <Icons.ExternalLink size={16} color="currentColor" />
                  </span>
                 </h3>
                  <p>{proj.desc}</p>
                  <div className="project-tech">{proj.tech.map(t => <span key={t} className="skill-tag">{t}</span>)}</div>
                </div>
                {proj.featured && <div className="project-preview"><span className="project-preview-text">&lt;NoteStream /&gt;</span></div>}
              </a>
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
            A mix of structured study and relentless self-teaching across electrical,
            security, and development.
          </p>
        </Reveal>
          <div className="edu-timeline">
            {education.map((edu, i) => (
              <Reveal key={edu.title} delay={i * 120}>
                <div className="edu-item">
                  <div className="edu-rail" aria-hidden="true">
                    <div className="edu-dot">
                      <div className="edu-dot-inner">
                        {edu.Icon ? <edu.Icon size={14} color={edu.iconColor || "var(--neon)"} /> : null}
                      </div>
                    </div>
                  </div>

                  <div className="edu-card">
                    <div className="edu-meta">{edu.status}</div>
                    <h3>{edu.title}</h3>
                    <p>{edu.desc}</p>
                  </div>
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
                  <div className="contact-icon"><IconComp size={22} color="var(--neon)" /></div>
                  <div><div className="contact-label">{c.label}</div><div className="contact-value">{c.value}</div></div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 Eric. Built from scratch with React.</p>
        <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo("home"); }}>Back to top ↑</a>
      </footer>
    </>
  );
}