import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return visible;
}

export function ComparisonGraph() {
  const containerRef = useRef(null);
  const { isDark } = useTheme();
  const visible = useInView(containerRef, 0.15);

  const [animProgress, setAnimProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const DURATION = 2400;

  useEffect(() => {
    if (!visible) return;
    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const raw = Math.min(elapsed / DURATION, 1);
      // ease-out quart for smooth deceleration
      const eased = 1 - Math.pow(1 - raw, 4);
      setAnimProgress(eased);
      if (raw < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [visible]);

  const t = animProgress;

  // ── SVG coordinate system ──
  const W = 800, H = 520;
  const PAD = { top: 55, right: 55, bottom: 60, left: 70 };
  const gL = PAD.left, gR = W - PAD.right, gT = PAD.top, gB = H - PAD.bottom;
  const gW = gR - gL, gH = gB - gT;

  // ── Curves (both start near origin) ──
  const N = 160;

  const expoPoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const frac = i / N;
      const x = gL + frac * gW;
      const normalized = (Math.exp(frac * 3.4) - 1) / (Math.exp(3.4) - 1);
      const y = gB - normalized * gH * 0.88;
      pts.push([x, y]);
    }
    return pts;
  }, []);

  const linearPoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const frac = i / N;
      const x = gL + frac * gW;
      const normalized = 0.06 + frac * 0.15;
      const y = gB - normalized * gH;
      pts.push([x, y]);
    }
    return pts;
  }, []);

  const buildPath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

  const approxLen = 2600;

  // Animated clip: reveals curves progressively from origin
  const clipRight = gL + t * (gW + 10);

  // ── Endpoints ──
  const expoEnd = expoPoints[expoPoints.length - 1];
  const linearEnd = linearPoints[linearPoints.length - 1];

  // ── Gap arrow (right side) ──
  const gapX = gR + 30;
  const gapTopY = expoEnd[1];
  const gapBotY = linearEnd[1];
  const gapMidY = (gapTopY + gapBotY) / 2;

  // ── Colors ──
  const c = {
    axis: isDark ? 'rgba(148,163,184,0.3)' : 'rgba(100,116,139,0.35)',
    tick: isDark ? 'rgba(148,163,184,0.2)' : 'rgba(100,116,139,0.25)',
    gridDash: isDark ? 'rgba(148,163,184,0.06)' : 'rgba(100,116,139,0.07)',
    axisLabel: isDark ? '#94A3B8' : '#64748B',
    expo: isDark ? '#E85D36' : '#C44D2A',
    expoFill: isDark ? 'rgba(232,93,54,0.08)' : 'rgba(196,77,42,0.05)',
    linear: isDark ? '#7FA84A' : '#5A7E3C',
    linearFill: isDark ? 'rgba(127,168,74,0.06)' : 'rgba(90,126,60,0.04)',
    gap: isDark ? '#CBD5E1' : '#475569',
    labelText: isDark ? '#E2E8F0' : '#1E293B',
    labelSub: isDark ? '#94A3B8' : '#64748B',
  };

  // ── Inch-style tick marks ──
  const majorFrac = [0.2, 0.4, 0.6, 0.8];
  const minorFrac = [0.1, 0.3, 0.5, 0.7, 0.9];
  const majorLen = 7, minorLen = 4;

  return (
    <div ref={containerRef} className={`w-full transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
      >
        <defs>
          {/* Animated clip that reveals curves from origin */}
          <clipPath id="cg-clip">
            <rect x={0} y={0} width={clipRight} height={H} />
          </clipPath>
          <linearGradient id="cg-expo-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.expo} stopOpacity="0.15" />
            <stop offset="100%" stopColor={c.expo} stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="cg-linear-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.linear} stopOpacity="0.10" />
            <stop offset="100%" stopColor={c.linear} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* ── Subtle dashed grid lines ── */}
        {majorFrac.map((frac, i) => (
          <React.Fragment key={`g-${i}`}>
            <line x1={gL} y1={gB - frac * gH} x2={gR} y2={gB - frac * gH}
              stroke={c.gridDash} strokeWidth="1" strokeDasharray="4,8" />
            <line x1={gL + frac * gW} y1={gT} x2={gL + frac * gW} y2={gB}
              stroke={c.gridDash} strokeWidth="1" strokeDasharray="4,8" />
          </React.Fragment>
        ))}

        {/* ── X-axis with inch ticks ── */}
        <line x1={gL} y1={gB} x2={gR + 8} y2={gB} stroke={c.axis} strokeWidth="1" />
        {majorFrac.map((frac, i) => (
          <line key={`xm-${i}`} x1={gL + frac * gW} y1={gB} x2={gL + frac * gW} y2={gB + majorLen}
            stroke={c.tick} strokeWidth="1" />
        ))}
        {minorFrac.map((frac, i) => (
          <line key={`xn-${i}`} x1={gL + frac * gW} y1={gB} x2={gL + frac * gW} y2={gB + minorLen}
            stroke={c.tick} strokeWidth="0.6" />
        ))}

        {/* ── Y-axis with inch ticks ── */}
        <line x1={gL} y1={gT - 8} x2={gL} y2={gB} stroke={c.axis} strokeWidth="1" />
        {majorFrac.map((frac, i) => (
          <line key={`ym-${i}`} x1={gL} y1={gB - frac * gH} x2={gL - majorLen} y2={gB - frac * gH}
            stroke={c.tick} strokeWidth="1" />
        ))}
        {minorFrac.map((frac, i) => (
          <line key={`yn-${i}`} x1={gL} y1={gB - frac * gH} x2={gL - minorLen} y2={gB - frac * gH}
            stroke={c.tick} strokeWidth="0.6" />
        ))}

        {/* ── Axis labels ── */}
        <text x={gR + 8} y={gB + 18} textAnchor="end" fill={c.axisLabel}
          fontSize="10" fontFamily="'SF Mono','Fira Code','Cascadia Code',monospace"
          fontWeight="700" letterSpacing="0.08em">
          TENDER SCALE / TIME →
        </text>
        <text x={gL - 8} y={gT - 12} textAnchor="start" fill={c.axisLabel}
          fontSize="10" fontFamily="'SF Mono','Fira Code','Cascadia Code',monospace"
          fontWeight="700" letterSpacing="0.08em">
          ↑ COMPLEXITY
        </text>

        {/* ── Curves + Area fills (clipped to animate from origin) ── */}
        <g clipPath="url(#cg-clip)">
          {/* Area fills — reveal progressively from left */}
          {t > 0.02 && (
            <>
              <path
                d={`${buildPath(expoPoints)} L${expoEnd[0]},${gB} L${gL},${gB} Z`}
                fill="url(#cg-expo-fill)"
              />
              <path
                d={`${buildPath(linearPoints)} L${linearEnd[0]},${gB} L${gL},${gB} Z`}
                fill="url(#cg-linear-fill)"
              />
            </>
          )}

          {/* Curve 1: Regulatory Compliance (exponential) */}
          <path
            d={buildPath(expoPoints)}
            fill="none" stroke={c.expo} strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={approxLen} strokeDashoffset={approxLen * (1 - t)}
          />

          {/* Curve 2: Manual Capacity (linear) */}
          <path
            d={buildPath(linearPoints)}
            fill="none" stroke={c.linear} strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={approxLen} strokeDashoffset={approxLen * (1 - t)}
          />
        </g>

        {/* ── Endpoint dots (outside clip so they pop at the end) ── */}
        {t > 0.88 && (
          <>
            <circle cx={expoEnd[0]} cy={expoEnd[1]} r="4.5" fill={c.expo}
              opacity={Math.min((t - 0.88) / 0.12, 1)} />
            <circle cx={linearEnd[0]} cy={linearEnd[1]} r="4" fill={c.linear}
              opacity={Math.min((t - 0.88) / 0.12, 1)} />
          </>
        )}

        {/* ── COMPLIANCE GAP — right side vertical double arrow ── */}
        {t > 0.5 && (
          <g opacity={Math.min((t - 0.5) / 0.3, 1)}>
            <line x1={gapX} y1={gapTopY + 10} x2={gapX} y2={gapBotY - 10}
              stroke={c.gap} strokeWidth="1.2" strokeDasharray="3,3" />
            {/* Top arrowhead */}
            <polygon
              points={`${gapX},${gapTopY + 4} ${gapX - 4},${gapTopY + 13} ${gapX + 4},${gapTopY + 13}`}
              fill={c.gap} />
            {/* Bottom arrowhead */}
            <polygon
              points={`${gapX},${gapBotY - 4} ${gapX - 4},${gapBotY - 13} ${gapX + 4},${gapBotY - 13}`}
              fill={c.gap} />
            {/* Label rotated 90° */}
            <text x={gapX + 16} y={gapMidY} textAnchor="middle" dominantBaseline="middle"
              fill={c.labelText} fontSize="9" fontFamily="'SF Mono','Fira Code',monospace"
              fontWeight="800" letterSpacing="0.1em"
              transform={`rotate(-90, ${gapX + 16}, ${gapMidY})`}>
              THE COMPLIANCE GAP
            </text>
          </g>
        )}

        {/* ── Floating callout: Regulatory Complexity ── */}
        {t > 0.82 && (
          <g opacity={Math.min((t - 0.82) / 0.18, 1)}>
            <line x1={expoEnd[0]} y1={expoEnd[1]} x2={expoEnd[0] - 14} y2={expoEnd[1] - 12}
              stroke={c.expo} strokeWidth="0.8" strokeDasharray="2,2" opacity="0.5" />
            <text x={expoEnd[0] - 18} y={expoEnd[1] - 20} textAnchor="end"
              fill={c.labelText} fontSize="11"
              fontFamily="'SF Mono','Fira Code',monospace" fontWeight="700" letterSpacing="0.05em">
              REGULATORY COMPLEXITY
            </text>
            <text x={expoEnd[0] - 18} y={expoEnd[1] - 6} textAnchor="end"
              fill={c.labelSub} fontSize="9"
              fontFamily="'SF Mono','Fira Code',monospace" fontWeight="500" letterSpacing="0.04em">
              NEEDED TO SECURE TENDERS
            </text>
          </g>
        )}

        {/* ── Floating callout: Manual Capacity ── */}
        {t > 0.82 && (
          <g opacity={Math.min((t - 0.82) / 0.18, 1)}>
            <line x1={linearEnd[0]} y1={linearEnd[1]} x2={linearEnd[0] - 14} y2={linearEnd[1] + 14}
              stroke={c.linear} strokeWidth="0.8" strokeDasharray="2,2" opacity="0.5" />
            <text x={linearEnd[0] - 18} y={linearEnd[1] + 20} textAnchor="end"
              fill={c.labelText} fontSize="11"
              fontFamily="'SF Mono','Fira Code',monospace" fontWeight="700" letterSpacing="0.05em">
              WHAT PROCUREMENT OFFICERS
            </text>
            <text x={linearEnd[0] - 18} y={linearEnd[1] + 34} textAnchor="end"
              fill={c.labelSub} fontSize="9"
              fontFamily="'SF Mono','Fira Code',monospace" fontWeight="500" letterSpacing="0.04em">
              CAN PROCESS MANUALLY
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

export default ComparisonGraph;
