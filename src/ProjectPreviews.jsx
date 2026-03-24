// src/ProjectPreviews.jsx — v2 with content rotation
import { useState, useEffect, useRef } from "react";

function useVisible(threshold = 0.25) {
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

function useStepper(visible, max, interval = 300) {
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
  transform: step >= t ? "translateY(0)" : "translateY(6px)",
  transition: `opacity 0.45s cubic-bezier(0.16,1,0.3,1) ${d}ms, transform 0.45s cubic-bezier(0.16,1,0.3,1) ${d}ms`,
});

function Chrome({ url }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 11px", borderBottom: "1px solid var(--border)", background: "var(--bg2)", borderRadius: "10px 10px 0 0" }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff5f57" }} />
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#febc2e" }} />
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#28c840" }} />
      <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.5rem", color: "var(--text3)" }}>{url}</span>
    </div>
  );
}

const SHELL = { borderRadius: "10px", overflow: "hidden", border: "1px solid var(--border)", background: "var(--bg2)", height: "240px", display: "flex", flexDirection: "column", fontSize: "0.65rem", fontFamily: "var(--font-body)" };

// ═══════════════════════════════════════════════════════
//  QUESTONE SITE
// ═══════════════════════════════════════════════════════

const QUEST_VARIANTS = [
  { tags: ["DEVOPS", "CLOUD", "REACT", "LINUX"], blurb: "DevOps engineer blending trade skills with cloud infrastructure." },
  { tags: ["TERRAFORM", "CI/CD", "SECURITY", "IOT"], blurb: "Building reliable systems from code to conduit." },
  { tags: ["AWS", "DOCKER", "PYTHON", "ELECTRICAL"], blurb: "Cross-disciplinary builder. Circuits to containers." },
];

export function QuestOnePreview() {
  const [ref, vis] = useVisible();
  const step = useStepper(vis, 4, 280);
  const [data] = useState(() => QUEST_VARIANTS[Math.floor(Math.random() * QUEST_VARIANTS.length)]);

  return (
    <div ref={ref} style={SHELL}>
      <Chrome url="questone.cloud" />
      <div style={{ flex: 1, padding: "10px", display: "flex", flexDirection: "column", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
        {[{ top: "12%", left: "80%", s: 2, o: 0.15 }, { top: "35%", left: "90%", s: 1.5, o: 0.1 }, { top: "60%", left: "75%", s: 2.5, o: 0.12 }, { top: "20%", left: "15%", s: 1.5, o: 0.08 }].map((d, i) => (
          <div key={i} style={{ position: "absolute", top: d.top, left: d.left, width: d.s, height: d.s, borderRadius: "50%", background: "var(--neon)", opacity: d.o }} />
        ))}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", ...fade(step, 0) }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", fontWeight: 700, color: "var(--neon)", letterSpacing: "0.05em" }}>⚔ QUESTONE</div>
          <div style={{ display: "flex", gap: "8px" }}>
            {["About", "Skills", "Projects"].map(n => <span key={n} style={{ fontSize: "0.42rem", color: "var(--text3)" }}>{n}</span>)}
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ flex: 1, ...fade(step, 1) }}>
            <div style={{ fontSize: "0.42rem", color: "var(--neon)", marginBottom: "4px", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>● OPEN TO OPPORTUNITIES</div>
            <div style={{ fontSize: "1rem", fontWeight: 800, lineHeight: 1.15, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "6px" }}>
              CIRCUITS,<br />CODE &<br />CRAFT<span style={{ color: "var(--neon)" }}>.</span>
            </div>
            <div style={{ fontSize: "0.42rem", color: "var(--text3)", lineHeight: 1.5, maxWidth: "140px" }}>{data.blurb}</div>
          </div>
          <div style={{ width: "80px", height: "80px", display: "grid", placeItems: "center", ...fade(step, 2) }}>
            <div style={{ fontSize: "2.5rem", opacity: 0.6, filter: "drop-shadow(0 0 8px rgba(var(--neon-rgb), 0.3))" }}>🐉</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "6px", ...fade(step, 3) }}>
          {data.tags.map(t => (
            <span key={t} style={{ fontSize: "0.38rem", padding: "2px 5px", borderRadius: "3px", border: "1px solid rgba(var(--neon-rgb), 0.2)", color: "var(--neon)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  IOT LOG
// ═══════════════════════════════════════════════════════

const IOT_VARIANTS = [
  { temp: "72.4", hum: "45", device: "esp-01", ago: "2s ago" },
  { temp: "68.1", hum: "52", device: "esp-02", ago: "5s ago" },
  { temp: "77.8", hum: "38", device: "esp-01", ago: "1s ago" },
];

export function IoTLogPreview() {
  const [ref, vis] = useVisible();
  const step = useStepper(vis, 4, 320);
  const [data] = useState(() => IOT_VARIANTS[Math.floor(Math.random() * IOT_VARIANTS.length)]);

  const spark1 = "M0,20 L8,18 L16,22 L24,15 L32,17 L40,12 L48,14 L56,8 L64,10 L72,6 L80,9";
  const spark2 = "M0,14 L8,12 L16,16 L24,13 L32,11 L40,15 L48,10 L56,12 L64,8 L72,11 L80,9";

  return (
    <div ref={ref} style={SHELL}>
      <Chrome url="iot-log/dashboard" />
      <div style={{ flex: 1, padding: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", ...fade(step, 0) }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#28c840", boxShadow: "0 0 4px rgba(40,200,64,0.5)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", fontWeight: 600, color: "var(--text)" }}>ESP8266 — Online</span>
          </div>
          <span style={{ fontSize: "0.42rem", color: "var(--text3)", fontFamily: "var(--font-mono)" }}>Last push: {data.ago}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", ...fade(step, 1) }}>
          <div style={{ padding: "8px", borderRadius: "7px", border: "1px solid var(--border)", background: "var(--bg3)" }}>
            <div style={{ fontSize: "0.42rem", color: "var(--text3)", letterSpacing: "0.05em", marginBottom: "2px" }}>TEMPERATURE</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--orange)" }}>{data.temp}</span>
              <span style={{ fontSize: "0.5rem", color: "var(--text3)" }}>°F</span>
            </div>
            <svg width="80" height="24" viewBox="0 0 80 24" style={{ marginTop: "3px", display: "block" }}><path d={spark1} fill="none" stroke="var(--orange)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" /></svg>
          </div>
          <div style={{ padding: "8px", borderRadius: "7px", border: "1px solid var(--border)", background: "var(--bg3)" }}>
            <div style={{ fontSize: "0.42rem", color: "var(--text3)", letterSpacing: "0.05em", marginBottom: "2px" }}>HUMIDITY</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--blue)" }}>{data.hum}</span>
              <span style={{ fontSize: "0.5rem", color: "var(--text3)" }}>%</span>
            </div>
            <svg width="80" height="24" viewBox="0 0 80 24" style={{ marginTop: "3px", display: "block" }}><path d={spark2} fill="none" stroke="var(--blue)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" /></svg>
          </div>
        </div>
        <div style={{ padding: "7px 9px", borderRadius: "6px", background: "var(--bg3)", border: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: "0.48rem", lineHeight: 1.7, color: "var(--text2)", ...fade(step, 2) }}>
          <span style={{ color: "var(--text3)" }}>// latest payload</span><br />
          {"{"}<br />
          &nbsp;&nbsp;<span style={{ color: "var(--orange)" }}>"temp"</span>: <span style={{ color: "var(--neon)" }}>{data.temp}</span>,<br />
          &nbsp;&nbsp;<span style={{ color: "var(--blue)" }}>"humidity"</span>: <span style={{ color: "var(--neon)" }}>{data.hum}</span>,<br />
          &nbsp;&nbsp;<span style={{ color: "var(--text3)" }}>"device"</span>: <span style={{ color: "var(--pink)" }}>"{data.device}"</span><br />
          {"}"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 8px", borderRadius: "5px", background: "rgba(var(--neon-rgb), 0.06)", border: "1px solid rgba(var(--neon-rgb), 0.15)", ...fade(step, 3) }}>
          <span style={{ fontSize: "0.5rem", color: "var(--neon)" }}>✓</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.45rem", color: "var(--neon)" }}>git push origin main — sensor_data.json committed</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  TERRAFORM AWS VPC
// ═══════════════════════════════════════════════════════

const TF_VARIANTS = [
  { vpc: "10.0.0.0/16", pub: "10.0.1.0/24", priv: "10.0.2.0/24", created: 12, changed: 0, pubRes: ["Internet GW", "NAT GW", "Route Table"], privRes: ["Security GRP", "NACL", "Route Table"] },
  { vpc: "172.16.0.0/16", pub: "172.16.1.0/24", priv: "172.16.2.0/24", created: 15, changed: 2, pubRes: ["Internet GW", "ELB", "Route Table"], privRes: ["Security GRP", "RDS Subnet", "NACL"] },
  { vpc: "10.1.0.0/16", pub: "10.1.10.0/24", priv: "10.1.20.0/24", created: 9, changed: 0, pubRes: ["Internet GW", "NAT GW", "S3 Endpoint"], privRes: ["Security GRP", "NACL", "VPN GW"] },
];

export function TerraformPreview() {
  const [ref, vis] = useVisible();
  const step = useStepper(vis, 4, 300);
  const [data] = useState(() => TF_VARIANTS[Math.floor(Math.random() * TF_VARIANTS.length)]);

  return (
    <div ref={ref} style={SHELL}>
      <Chrome url="terraform-aws-vpc" />
      <div style={{ flex: 1, padding: "10px", display: "flex", flexDirection: "column", gap: "7px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", ...fade(step, 0) }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", fontWeight: 600, color: "var(--text)" }}>Infrastructure Overview</span>
          <span style={{ fontSize: "0.42rem", padding: "2px 6px", borderRadius: "3px", background: "rgba(var(--neon-rgb), 0.1)", color: "var(--neon)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>✓ APPLIED</span>
        </div>
        <div style={{ flex: 1, borderRadius: "7px", border: "1px dashed rgba(var(--blue-rgb), 0.35)", background: "rgba(var(--blue-rgb), 0.04)", padding: "8px", position: "relative", display: "flex", flexDirection: "column", gap: "5px", ...fade(step, 1) }}>
          <div style={{ position: "absolute", top: "-1px", left: "8px", background: "var(--bg2)", padding: "0 5px", fontSize: "0.42rem", fontFamily: "var(--font-mono)", color: "var(--blue)", fontWeight: 600, transform: "translateY(-50%)" }}>AWS VPC — {data.vpc}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px", flex: 1 }}>
            <div style={{ borderRadius: "5px", border: "1px solid rgba(var(--neon-rgb), 0.2)", background: "rgba(var(--neon-rgb), 0.04)", padding: "6px", display: "flex", flexDirection: "column", gap: "3px", ...fade(step, 2) }}>
              <div style={{ fontSize: "0.4rem", fontFamily: "var(--font-mono)", color: "var(--neon)", fontWeight: 600, letterSpacing: "0.03em" }}>PUBLIC SUBNET</div>
              <div style={{ fontSize: "0.38rem", color: "var(--text3)", fontFamily: "var(--font-mono)" }}>{data.pub}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "2px" }}>
                {data.pubRes.map((r, i) => (
                  <div key={r} style={{ fontSize: "0.38rem", padding: "2px 4px", borderRadius: "3px", background: "rgba(var(--neon-rgb), 0.08)", color: "var(--text2)", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: "3px", ...fade(step, 2, i * 60) }}>
                    <span style={{ color: "var(--neon)", fontSize: "0.35rem" }}>▸</span>{r}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: "5px", border: "1px solid rgba(var(--purple-rgb), 0.2)", background: "rgba(var(--purple-rgb), 0.04)", padding: "6px", display: "flex", flexDirection: "column", gap: "3px", ...fade(step, 2, 80) }}>
              <div style={{ fontSize: "0.4rem", fontFamily: "var(--font-mono)", color: "var(--purple)", fontWeight: 600, letterSpacing: "0.03em" }}>PRIVATE SUBNET</div>
              <div style={{ fontSize: "0.38rem", color: "var(--text3)", fontFamily: "var(--font-mono)" }}>{data.priv}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "2px" }}>
                {data.privRes.map((r, i) => (
                  <div key={r} style={{ fontSize: "0.38rem", padding: "2px 4px", borderRadius: "3px", background: "rgba(var(--purple-rgb), 0.08)", color: "var(--text2)", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: "3px", ...fade(step, 2, 80 + i * 60) }}>
                    <span style={{ color: "var(--purple)", fontSize: "0.35rem" }}>▸</span>{r}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", ...fade(step, 3) }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 7px", borderRadius: "4px", background: "rgba(var(--neon-rgb), 0.06)", border: "1px solid rgba(var(--neon-rgb), 0.15)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.42rem", color: "var(--neon)" }}>+ {data.created} created</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 7px", borderRadius: "4px", background: "rgba(var(--blue-rgb), 0.06)", border: "1px solid rgba(var(--blue-rgb), 0.15)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.42rem", color: "var(--blue)" }}>~ {data.changed} changed</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 7px", borderRadius: "4px", background: "var(--bg3)", border: "1px solid var(--border)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.42rem", color: "var(--text3)" }}>- 0 destroyed</span>
          </div>
        </div>
      </div>
    </div>
  );
}