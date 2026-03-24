// src/SecondaryPreviews.jsx
// Compact mini-previews for the 4 secondary project cards.
// ~130px tall, no chrome bar — just content.

import { useState, useEffect, useRef } from "react";

function useVisible(threshold = 0.3) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

function useStepper(visible, max, interval = 250) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let i = 0;
    const iv = setInterval(() => { i++; if (i > max) { clearInterval(iv); return; } setStep(i); }, interval);
    return () => clearInterval(iv);
  }, [visible, max, interval]);
  return step;
}

const fade = (step, t, d = 0) => ({
  opacity: step >= t ? 1 : 0,
  transform: step >= t ? "translateY(0)" : "translateY(4px)",
  transition: `opacity 0.4s cubic-bezier(0.16,1,0.3,1) ${d}ms, transform 0.4s cubic-bezier(0.16,1,0.3,1) ${d}ms`,
});

const MINI = {
  borderRadius: "8px",
  border: "1px solid var(--border)",
  background: "var(--bg3)",
  padding: "10px",
  fontFamily: "var(--font-mono)",
  fontSize: "0.45rem",
  overflow: "hidden",
};

// ═══════════════════════════════════════════════════════
//  PROMETHEUS — mini metrics dashboard
// ═══════════════════════════════════════════════════════

const PROM_VARIANTS = [
  { cpu: "34%", mem: "2.1 GB", up: "99.97%", alerts: 0 },
  { cpu: "61%", mem: "3.8 GB", up: "99.91%", alerts: 2 },
  { cpu: "18%", mem: "1.4 GB", up: "100%", alerts: 0 },
];

export function PrometheusPreview() {
  const [ref, vis] = useVisible();
  const step = useStepper(vis, 3);
  const [data] = useState(() => PROM_VARIANTS[Math.floor(Math.random() * PROM_VARIANTS.length)]);

  return (
    <div ref={ref} style={MINI}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", ...fade(step, 0) }}>
        <span style={{ color: "var(--neon)", fontWeight: 600, fontSize: "0.48rem", letterSpacing: "0.04em" }}>METRICS</span>
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: data.alerts > 0 ? "var(--orange)" : "#28c840" }} />
          <span style={{ color: "var(--text3)", fontSize: "0.4rem" }}>{data.alerts > 0 ? `${data.alerts} alerts` : "healthy"}</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px", ...fade(step, 1) }}>
        {[
          { label: "CPU", value: data.cpu, color: "var(--neon)" },
          { label: "MEM", value: data.mem, color: "var(--blue)" },
          { label: "UPTIME", value: data.up, color: "var(--neon)" },
          { label: "TARGETS", value: "4/4", color: "var(--purple)" },
        ].map((m, i) => (
          <div key={m.label} style={{
            padding: "5px 6px",
            borderRadius: "5px",
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            ...fade(step, 1, i * 60),
          }}>
            <div style={{ fontSize: "0.36rem", color: "var(--text3)", letterSpacing: "0.05em", marginBottom: "1px" }}>{m.label}</div>
            <div style={{ fontSize: "0.6rem", fontWeight: 700, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>
      {/* Mini sparkline */}
      <svg width="100%" height="20" viewBox="0 0 120 20" style={{ marginTop: "6px", display: "block", ...fade(step, 2) }}>
        <path d="M0,15 L10,12 L20,14 L30,8 L40,10 L50,6 L60,9 L70,5 L80,7 L90,4 L100,6 L110,3 L120,5" fill="none" stroke="var(--neon)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        <path d="M0,18 L10,16 L20,17 L30,13 L40,15 L50,11 L60,14 L70,10 L80,12 L90,9 L100,11 L110,8 L120,10" fill="none" stroke="var(--blue)" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  JENKINS — pipeline stages
// ═══════════════════════════════════════════════════════

const JENKINS_VARIANTS = [
  { stages: [{ n: "Build", s: "✓", c: "var(--neon)" }, { n: "Test", s: "✓", c: "var(--neon)" }, { n: "Deploy", s: "✓", c: "var(--neon)" }, { n: "Verify", s: "✓", c: "var(--neon)" }], build: "#142", time: "2m 34s" },
  { stages: [{ n: "Compile", s: "✓", c: "var(--neon)" }, { n: "Lint", s: "✓", c: "var(--neon)" }, { n: "Test", s: "✓", c: "var(--neon)" }, { n: "Package", s: "▸", c: "var(--blue)" }], build: "#287", time: "1m 12s" },
  { stages: [{ n: "Build", s: "✓", c: "var(--neon)" }, { n: "Test", s: "✓", c: "var(--neon)" }, { n: "Staging", s: "✗", c: "var(--orange)" }, { n: "Prod", s: "—", c: "var(--text3)" }], build: "#203", time: "4m 08s" },
];

export function JenkinsPreview() {
  const [ref, vis] = useVisible();
  const step = useStepper(vis, 3);
  const [data] = useState(() => JENKINS_VARIANTS[Math.floor(Math.random() * JENKINS_VARIANTS.length)]);

  return (
    <div ref={ref} style={MINI}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", ...fade(step, 0) }}>
        <span style={{ color: "var(--purple)", fontWeight: 600, fontSize: "0.48rem", letterSpacing: "0.04em" }}>PIPELINE</span>
        <span style={{ color: "var(--text3)", fontSize: "0.4rem" }}>{data.build} · {data.time}</span>
      </div>
      {/* Pipeline stages */}
      <div style={{ display: "flex", alignItems: "center", gap: "3px", ...fade(step, 1) }}>
        {data.stages.map((st, i) => (
          <div key={st.n} style={{ display: "flex", alignItems: "center", gap: "3px", flex: 1, ...fade(step, 1, i * 80) }}>
            <div style={{
              flex: 1,
              padding: "6px 4px",
              borderRadius: "4px",
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "0.52rem", color: st.c, fontWeight: 700, marginBottom: "1px" }}>{st.s}</div>
              <div style={{ fontSize: "0.36rem", color: "var(--text3)" }}>{st.n}</div>
            </div>
            {i < data.stages.length - 1 && (
              <span style={{ color: "var(--text3)", fontSize: "0.35rem", flexShrink: 0 }}>→</span>
            )}
          </div>
        ))}
      </div>
      {/* Console snippet */}
      <div style={{
        marginTop: "8px",
        padding: "5px 6px",
        borderRadius: "4px",
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        fontSize: "0.4rem",
        lineHeight: 1.6,
        color: "var(--text3)",
        ...fade(step, 2),
      }}>
        <div><span style={{ color: "var(--neon)" }}>$</span> mvn clean install</div>
        <div style={{ color: "var(--text2)" }}>BUILD SUCCESS</div>
        <div><span style={{ color: "var(--neon)" }}>$</span> deploy --env staging</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  JUNIT PLUGIN — test results
// ═══════════════════════════════════════════════════════

const JUNIT_VARIANTS = [
  { passed: 47, failed: 0, skipped: 3, total: 50, suite: "CoreTests" },
  { passed: 124, failed: 2, skipped: 5, total: 131, suite: "IntegrationSuite" },
  { passed: 89, failed: 0, skipped: 1, total: 90, suite: "PluginTests" },
];

export function JUnitPreview() {
  const [ref, vis] = useVisible();
  const step = useStepper(vis, 3);
  const [data] = useState(() => JUNIT_VARIANTS[Math.floor(Math.random() * JUNIT_VARIANTS.length)]);

  const pct = Math.round((data.passed / data.total) * 100);

  return (
    <div ref={ref} style={MINI}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", ...fade(step, 0) }}>
        <span style={{ color: "var(--yellow)", fontWeight: 600, fontSize: "0.48rem", letterSpacing: "0.04em" }}>TEST RESULTS</span>
        <span style={{ color: "var(--text3)", fontSize: "0.4rem" }}>{data.suite}</span>
      </div>
      {/* Pass rate bar */}
      <div style={{ marginBottom: "8px", ...fade(step, 1) }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
          <span style={{ fontSize: "0.4rem", color: "var(--text3)" }}>Pass Rate</span>
          <span style={{ fontSize: "0.48rem", fontWeight: 700, color: data.failed > 0 ? "var(--orange)" : "var(--neon)" }}>{pct}%</span>
        </div>
        <div style={{ height: "4px", background: "var(--bg2)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: vis ? `${pct}%` : "0%",
            background: data.failed > 0 ? "var(--orange)" : "var(--neon)",
            borderRadius: "2px",
            transition: "width 1s cubic-bezier(0.16,1,0.3,1) 400ms",
          }} />
        </div>
      </div>
      {/* Results grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px", ...fade(step, 2) }}>
        {[
          { label: "PASSED", value: data.passed, color: "var(--neon)" },
          { label: "FAILED", value: data.failed, color: data.failed > 0 ? "var(--orange)" : "var(--text3)" },
          { label: "SKIPPED", value: data.skipped, color: "var(--yellow)" },
        ].map((r, i) => (
          <div key={r.label} style={{
            padding: "5px",
            borderRadius: "4px",
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            textAlign: "center",
            ...fade(step, 2, i * 60),
          }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: r.color }}>{r.value}</div>
            <div style={{ fontSize: "0.34rem", color: "var(--text3)", letterSpacing: "0.04em" }}>{r.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  PROJECTS & PORTFOLIO — code/file snippets
// ═══════════════════════════════════════════════════════

const PROJ_VARIANTS = [
  { files: ["automate.py", "scraper.py", "utils.py", "config.yml"], snippet: ["def automate(tasks):", "  for t in tasks:", "    run(t.command)", "    log(t.status)"] },
  { files: ["deploy.py", "monitor.py", "backup.sh", "setup.cfg"], snippet: ["#!/bin/bash", "rsync -avz ./build/", "  user@prod:/var/www/", "echo 'Deployed ✓'"] },
  { files: ["analyze.py", "clean.py", "report.py", "data.json"], snippet: ["import pandas as pd", "df = pd.read_json(src)", "summary = df.describe()", "export(summary)"] },
];

export function ProjectsPreview() {
  const [ref, vis] = useVisible();
  const step = useStepper(vis, 3);
  const [data] = useState(() => PROJ_VARIANTS[Math.floor(Math.random() * PROJ_VARIANTS.length)]);

  return (
    <div ref={ref} style={MINI}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", ...fade(step, 0) }}>
        <span style={{ color: "var(--orange)", fontWeight: 600, fontSize: "0.48rem", letterSpacing: "0.04em" }}>FILES</span>
        <span style={{ color: "var(--text3)", fontSize: "0.4rem" }}>{data.files.length} scripts</span>
      </div>
      {/* File list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginBottom: "8px", ...fade(step, 1) }}>
        {data.files.map((f, i) => (
          <div key={f} style={{
            display: "flex", alignItems: "center", gap: "5px",
            padding: "3px 5px", borderRadius: "3px",
            background: i === 0 ? "rgba(var(--orange-rgb), 0.06)" : "transparent",
            border: i === 0 ? "1px solid rgba(var(--orange-rgb), 0.15)" : "1px solid transparent",
            ...fade(step, 1, i * 50),
          }}>
            <span style={{ fontSize: "0.38rem", color: f.endsWith(".py") ? "var(--orange)" : f.endsWith(".sh") ? "var(--neon)" : "var(--blue)" }}>
              {f.endsWith(".py") ? "🐍" : f.endsWith(".sh") ? "⚡" : "📄"}
            </span>
            <span style={{ fontSize: "0.42rem", color: i === 0 ? "var(--text)" : "var(--text3)" }}>{f}</span>
          </div>
        ))}
      </div>
      {/* Code snippet */}
      <div style={{
        padding: "5px 6px",
        borderRadius: "4px",
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        fontSize: "0.4rem",
        lineHeight: 1.6,
        ...fade(step, 2),
      }}>
        {data.snippet.map((line, i) => (
          <div key={i} style={{ color: line.startsWith("#") || line.startsWith("//") ? "var(--text3)" : line.startsWith("  ") ? "var(--text2)" : "var(--orange)" }}>{line}</div>
        ))}
      </div>
    </div>
  );
}