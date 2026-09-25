import React, { useState, useId } from "react";

export function LogoReveal({
  word = "IS",
  end = "ync",
  size = 46,
  textColor = "#0B1E36",
  showReplay = false,
  showText = true,
}) {
  const [playKey, setPlayKey] = useState(0);
  const reactId = useId();
  const filterId = `lra-filter-${reactId.replace(/[^a-zA-Z0-9]/g, '')}`;
  const ringD = "M5,95 A90,32 0 1,0 185,95 A90,32 0 1,0 5,95";
  const textSize = Math.max(16, Math.round(size * 0.38));

  return (
    <div className="lra-root" style={{ "--ink": textColor }}>
      <style>{`
        .lra-root {
          --cyan: #A0522D;
          --cyan-soft: #D08B5D;
          display: inline-flex;
          align-items: center;
          background: transparent;
        }

        .lra-stage {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        /* ---------- icon: nucleus + orbit rings ---------- */
        .lra-orbit-wrap {
          position: relative;
          flex: 0 0 auto;
        }
        .lra-orbit-svg { display: block; overflow: visible; }

        .lra-boundary {
          fill: none;
          stroke: rgba(160, 82, 45, 0.75);
          stroke-width: 1.6;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          filter: drop-shadow(0 0 2px rgba(160, 82, 45, 0.6));
          animation: lra-draw 0.5s ease-out 0s forwards;
        }

        .lra-ring-path {
          fill: none;
          stroke: var(--cyan);
          stroke-width: 1.6;
          stroke-linecap: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          filter: drop-shadow(0 0 3px rgba(160, 82, 45, 0.85));
        }
        .lra-ring-a {
          animation:
            lra-draw 0.9s ease-out 0.3s forwards,
            lra-spin 7s linear 1.2s infinite;
          transform-origin: 95px 95px;
        }
        .lra-ring-b {
          animation:
            lra-draw 0.95s ease-out 0.45s forwards,
            lra-spin-rev 9s linear 1.4s infinite;
          transform-origin: 95px 95px;
        }
        .lra-ring-c {
          animation:
            lra-draw 1s ease-out 0.6s forwards,
            lra-spin 11s linear 1.6s infinite;
          transform-origin: 95px 95px;
        }

        /* ---------- "IS" nucleus text ---------- */
        .lra-is-wrap {
          position: absolute;
          inset: 0;
        }
        .lra-is-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
          clip-path: inset(0 100% 0 0);
          animation: lra-wipe 0.9s steps(36) 0.15s forwards;
        }
        .lra-is-text {
          font-size: 84px;
          font-weight: 800;
          fill: rgba(160, 82, 45, 0.12);
          stroke: var(--cyan);
          stroke-width: 1.8;
          filter: url(#${filterId}) drop-shadow(0 0 4px var(--cyan)) drop-shadow(0 0 10px var(--cyan-soft));
          animation: lra-pulse-stroke 3.2s ease-in-out 1.6s infinite;
        }

        /* ---------- "ISync" wordmark — glides out, no fade ---------- */
        .lra-word-mask {
          overflow: hidden;
          flex: 0 0 auto;
          margin-left: 4px;
          display: inline-flex;
          align-items: center;
          padding: 8px 6px 8px 1px;
          margin-top: -8px;
          margin-bottom: -8px;
        }
        .lra-end {
          display: inline-block;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--ink);
          transform: translateX(-100%);
          animation: lra-end-glide 1.3s cubic-bezier(.22,.61,.36,1) 2.2s forwards;
          line-height: 1.3;
          padding-bottom: 2px;
        }

        .lra-replay {
          margin-left: 14px;
          border: 1px solid rgba(15, 23, 42, 0.2);
          background: transparent;
          color: rgba(15, 23, 42, 0.55);
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 999px;
          cursor: pointer;
          transition: border-color 0.15s ease, color 0.15s ease;
        }
        .lra-replay:hover {
          border-color: var(--cyan);
          color: #7C3F22;
        }
        .lra-replay:focus-visible {
          outline: 2px solid var(--cyan);
          outline-offset: 2px;
        }

        @keyframes lra-draw { to { stroke-dashoffset: 0; } }

        @keyframes lra-wipe { to { clip-path: inset(0 0% 0 0); } }

        @keyframes lra-pulse-stroke {
          0%, 100% { filter: url(#${filterId}) drop-shadow(0 0 4px var(--cyan)) drop-shadow(0 0 10px var(--cyan-soft)); }
          50%      { filter: url(#${filterId}) drop-shadow(0 0 6px var(--cyan)) drop-shadow(0 0 16px var(--cyan-soft)); }
        }

        @keyframes lra-end-glide { to { transform: translateX(0); } }

        @keyframes lra-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes lra-spin-rev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .lra-root [class*="lra-"] {
            animation: none !important;
          }
          .lra-boundary, .lra-ring-path { stroke-dashoffset: 0; }
          .lra-is-svg { clip-path: inset(0 0% 0 0); }
          .lra-end { transform: translateX(0); }
        }
      `}</style>

      <div className="lra-stage" key={playKey}>
        <div className="lra-orbit-wrap" style={{ width: size, height: size }}>
          <svg className="lra-orbit-svg" viewBox="0 0 190 190" width={size} height={size}>
            <circle className="lra-boundary" cx="95" cy="95" r="88" pathLength="1" />

            <g transform="rotate(-20 95 95)">
              <path id="lra-ring-a-path" className="lra-ring-path lra-ring-a" d={ringD} pathLength="1" />
            </g>

            <g transform="rotate(40 95 95)">
              <path id="lra-ring-b-path" className="lra-ring-path lra-ring-b" d={ringD} pathLength="1" />
            </g>

            <g transform="rotate(80 95 95)">
              <path id="lra-ring-c-path" className="lra-ring-path lra-ring-c" d={ringD} pathLength="1" />
            </g>
          </svg>

          <span className="lra-is-wrap">
            <svg className="lra-is-svg" viewBox="0 0 190 190">
              <defs>
                <filter id={filterId} x="-60%" y="-60%" width="220%" height="220%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="6" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
              <text className="lra-is-text" x="95" y="128" textAnchor="middle">{word}</text>
            </svg>
          </span>
        </div>

        {showText && (
          <span className="lra-word-mask">
            <span className="lra-end" style={{ fontSize: textSize }}>{word}{end}</span>
          </span>
        )}
      </div>

      {showReplay && (
        <button type="button" className="lra-replay" onClick={() => setPlayKey((k) => k + 1)}>
          Replay
        </button>
      )}
    </div>
  );
}

export const AnimatedLogo = LogoReveal;
export default LogoReveal;