// src/NoteStreamPreview.jsx — v2 with content rotation
import { useState, useEffect, useRef } from "react";

const VARIANTS = [
  {
    greeting: "Good morning 👋", sub: "3 notes created today",
    stats: [{ l: "NOTES", v: "23", d: "+5" }, { l: "SUMMARIES", v: "12", d: "+3" }, { l: "STREAK", v: "7d", d: "🔥" }],
    notes: [{ t: "Team Meeting Notes", time: "Just now", ai: true }, { t: "Project Roadmap Ideas", time: "2h ago", hl: true }, { t: "Research Summary", time: "Yesterday", ai: true }],
    insights: [{ i: "✓", t: "3 action items identified" }, { i: "📈", t: "Productivity up 23%" }, { i: "⏰", t: "Review due: Tomorrow 3 PM" }],
  },
  {
    greeting: "Good afternoon ☀️", sub: "5 notes created today",
    stats: [{ l: "NOTES", v: "47", d: "+8" }, { l: "SUMMARIES", v: "21", d: "+5" }, { l: "STREAK", v: "14d", d: "🔥" }],
    notes: [{ t: "Sprint Retro Recap", time: "10m ago", ai: true }, { t: "API Design Draft", time: "1h ago", hl: true }, { t: "Standup Notes", time: "3h ago" }],
    insights: [{ i: "✓", t: "5 tasks completed today" }, { i: "📈", t: "Focus time up 31%" }, { i: "⏰", t: "Deploy review: 4 PM" }],
  },
  {
    greeting: "Welcome back 🌙", sub: "2 notes synced",
    stats: [{ l: "NOTES", v: "31", d: "+2" }, { l: "SUMMARIES", v: "16", d: "+1" }, { l: "STREAK", v: "10d", d: "🔥" }],
    notes: [{ t: "Client Call Debrief", time: "Just now", ai: true }, { t: "Architecture Decision", time: "4h ago", hl: true }, { t: "Bug Triage Notes", time: "Yesterday", ai: true }],
    insights: [{ i: "✓", t: "2 blockers resolved" }, { i: "📈", t: "Velocity up 18%" }, { i: "⏰", t: "Release: Friday 9 AM" }],
  },
];

export default function NoteStreamPreview() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const [step, setStep] = useState(0);
  const [data] = useState(() => VARIANTS[Math.floor(Math.random() * VARIANTS.length)]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!vis) return;
    let i = 0;
    const iv = setInterval(() => { i++; if (i > 4) { clearInterval(iv); return; } setStep(i); }, 350);
    return () => clearInterval(iv);
  }, [vis]);

  const f = (s, d = 0) => ({
    opacity: step >= s ? 1 : 0,
    transform: step >= s ? "translateY(0)" : "translateY(8px)",
    transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${d}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${d}ms`,
  });

  return (
    <div ref={ref} style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg2)", height: "100%", minHeight: "280px", display: "flex", flexDirection: "column", fontSize: "0.7rem", fontFamily: "var(--font-body)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "var(--text3)" }}>app.notestream.ai</span>
      </div>
      <div style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: "10px", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", ...f(0) }}>
          <div style={{ width: 24, height: 24, borderRadius: "6px", background: "linear-gradient(135deg, rgba(var(--neon-rgb), 0.2), rgba(var(--neon-rgb), 0.05))", display: "grid", placeItems: "center", fontSize: "0.6rem" }}>📝</div>
          <div>
            <div style={{ fontWeight: 600, color: "var(--text)", fontSize: "0.75rem" }}>{data.greeting}</div>
            <div style={{ fontSize: "0.55rem", color: "var(--text3)" }}>{data.sub}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", ...f(1) }}>
          {data.stats.map(s => (
            <div key={s.l} style={{ padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg3)" }}>
              <div style={{ fontSize: "0.48rem", color: "var(--text3)", letterSpacing: "0.06em", marginBottom: "2px" }}>{s.l}</div>
              <span style={{ fontSize: "1.05rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text)" }}>{s.v}</span>
              <span style={{ fontSize: "0.5rem", color: "var(--neon)", marginLeft: "3px", fontFamily: "var(--font-mono)" }}>{s.d}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 0.7fr", gap: "8px", flex: 1, minHeight: 0, ...f(2) }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
              <span style={{ fontSize: "0.6rem", fontWeight: 600, color: "var(--text)" }}>Recent Notes</span>
              <span style={{ fontSize: "0.48rem", color: "var(--neon)" }}>View all →</span>
            </div>
            {data.notes.map((n, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 8px", borderRadius: "6px", border: n.hl ? "1px solid rgba(var(--neon-rgb), 0.3)" : "1px solid var(--border)", background: n.hl ? "rgba(var(--neon-rgb), 0.04)" : "var(--bg3)", ...f(2, i * 120) }}>
                <div style={{ width: 18, height: 18, borderRadius: "4px", background: "rgba(var(--neon-rgb), 0.1)", display: "grid", placeItems: "center", fontSize: "0.45rem", color: "var(--neon)", flexShrink: 0 }}>📄</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.58rem", fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.t}</div>
                  <div style={{ fontSize: "0.45rem", color: "var(--text3)" }}>{n.time}</div>
                </div>
                {n.ai && <span style={{ fontSize: "0.4rem", padding: "1px 4px", borderRadius: "3px", background: "rgba(var(--neon-rgb), 0.12)", color: "var(--neon)", fontWeight: 600, flexShrink: 0 }}>✦ AI</span>}
              </div>
            ))}
          </div>
          <div style={{ borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg3)", padding: "10px", display: "flex", flexDirection: "column", gap: "6px", ...f(3) }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: 18, height: 18, borderRadius: "5px", background: "linear-gradient(135deg, #7c3aed, #a855f7)", display: "grid", placeItems: "center", fontSize: "0.5rem", color: "#fff" }}>✦</div>
              <div>
                <div style={{ fontSize: "0.62rem", fontWeight: 600, color: "var(--text)" }}>AI Insights</div>
                <div style={{ fontSize: "0.42rem", color: "var(--text3)" }}>Updated just now</div>
              </div>
            </div>
            {data.insights.map((ins, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.52rem", color: "var(--text2)", ...f(3, i * 100) }}>
                <span style={{ fontSize: "0.5rem", width: "14px", textAlign: "center", flexShrink: 0 }}>{ins.i}</span>
                <span>{ins.t}</span>
              </div>
            ))}
            <div style={{ marginTop: "auto", padding: "5px 0", borderRadius: "5px", background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", fontSize: "0.5rem", fontWeight: 600, textAlign: "center" }}>✦ Generate Full Report</div>
          </div>
        </div>
      </div>
    </div>
  );
}