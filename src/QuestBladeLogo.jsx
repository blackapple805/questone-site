/**
 * QuestBladeLogo — Inline SVG, theme-aware via currentColor.
 *
 * Usage in nav:
 *   import QuestBladeLogo from "./QuestBladeLogo";
 *   <div className="nav-logo" onClick={() => scrollTo("home")}>
 *     <QuestBladeLogo size={36} />
 *   </div>
 *
 * The SVG uses currentColor so it inherits from the parent's
 * CSS color property — meaning it automatically matches your
 * neon green (dark) or ice cyan (light) theme.
 */

export default function QuestBladeLogo({ size = 36, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="QuestOne logo"
      role="img"
    >
      {/* Q ring */}
      <circle
        cx="50" cy="42" r="24"
        stroke="currentColor" strokeWidth="4.5"
        fill="none" opacity="0.75"
      />
      {/* Sword blade */}
      <path
        d="M50 2 L54 12 L53.5 85 L50 96 L46.5 85 L46 12 Z"
        fill="currentColor" opacity="0.92"
      />
      {/* Blade highlight */}
      <path
        d="M50 4 L51.5 14 L51 82 L50 92 L49 82 L48.5 14 Z"
        fill="currentColor" opacity="0.12"
      />
      {/* Crossguard left */}
      <path
        d="M32 40 L46 43 L46 46 L32 44 Z"
        fill="currentColor" opacity="0.6"
      />
      {/* Crossguard right */}
      <path
        d="M68 40 L54 43 L54 46 L68 44 Z"
        fill="currentColor" opacity="0.6"
      />
      {/* Pommel */}
      <circle cx="50" cy="96" r="2.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
