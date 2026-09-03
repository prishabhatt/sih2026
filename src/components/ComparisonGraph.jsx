import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

function useInView(ref, threshold = 0.2) {
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
  const DURATION = 2200;

  useEffect(() => {
    if (!visible) return;
    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const raw = Math.min(elapsed / DURATION, 1);
      const eased = 1 - Math.pow(1 - raw, 3);
      setAnimProgress(eased);
      if (raw < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [visible]);

  const t = animProgress;

  // ── Tall Expansive SVG Coordinate System Matching Reference Image ──
  const W = 840, H = 720;
  const PAD = { top: 60, right: 50, bottom: 65, left: 110 };
  const gL = PAD.left, gR = W - PAD.right, gT = PAD.top, gB = H - PAD.bottom;
  const gW = gR - gL, gH = gB - gT;

  // ── Curves ──
  const expoPoints = useMemo(() => {
    const pts = [];
    const N = 160;
    for (let i = 0; i <= N; i++) {
      const frac = i / N;
      // Start slightly to the left of the axis like reference image
      const x = (gL - 35) + frac * (gW + 25);
      const normalized = (Math.exp(frac * 3.3) - 1) / (Math.exp(3.3) - 1);
      const y = (gB - 5) - normalized * (gH * 0.92);
      pts.push([x, y]);
    }
    return pts;
  }, [gL, gW, gB, gH]);

  const linearPoints = useMemo(() => {
    const pts = [];
    const N = 160;
    for (let i = 0; i <= N; i++) {
      const frac = i / N;
      const x = (gL - 35) + frac * (gW + 25);
      const normalized = 0.04 + frac * 0.12;
      const y = (gB - 5) - normalized * gH;
      pts.push([x, y]);
    }
    return pts;
  }, [gL, gW, gB, gH]);

  const buildPath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

  const approxLen = 2800;

  // ── Endpoints ──
  const expoEnd = expoPoints[expoPoints.length - 1];
  const linearEnd = linearPoints[linearPoints.length - 1];

  // ── Gap Arrow (Aligned with right dots) ──
  const gapX = expoEnd[0];
  const gapTopY = expoEnd[1];
  const gapBotY = linearEnd[1];
  const gapMidY = (gapTopY + gapBotY) / 2;

  // ── Theme Styling ──
  const c = {
    axisLine: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(100,116,139,0.4)',
    tickLine: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(71,85,105,0.5)',
    axisText: isDark ? '#94A3B8' : '#475569',
    expo: isDark ? '#E85D36' : '#C44D2A',
    linear: isDark ? '#7FA84A' : '#5A7E3C',
    cardBg: isDark ? '#1C1C1E' : '#F9F7F1',
    cardBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
    blackPillBg: isDark ? '#000000' : '#18181B',
    blackPillText: '#FFFFFF',
    arrow: isDark ? '#CBD5E1' : '#1E293B',
  };

  // ── Tick Intervals along Axes ──
  const yTicks = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
  const xTicks = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

  return (
    <div ref={containerRef} className={`w-full transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto drop-shadow-sm select-none"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
      >
        {/* ── Vertical Y-axis (Dashed line with ticks) ── */}
        <line
          x1={gL}
          y1={gT}
          x2={gL}
          y2={gB}
          stroke={c.axisLine}
          strokeWidth="1.5"
          strokeDasharray="4,4"
        />
        {yTicks.map((frac, i) => {
          const isMajor = (i + 1) % 2 === 0;
          return (
            <line
              key={`yt-${i}`}
              x1={gL}
              y1={gB - frac * gH}
              x2={gL - (isMajor ? 12 : 7)}
              y2={gB - frac * gH}
              stroke={c.tickLine}
              strokeWidth={isMajor ? '1.8' : '1.2'}
            />
          );
        })}

        {/* ── Horizontal X-axis (Dashed line with ticks) ── */}
        <line
          x1={gL}
          y1={gB}
          x2={gR}
          y2={gB}
          stroke={c.axisLine}
          strokeWidth="1.5"
          strokeDasharray="4,4"
        />
        {xTicks.map((frac, i) => {
          const isMajor = (i + 1) % 2 === 0;
          return (
            <line
              key={`xt-${i}`}
              x1={gL + frac * gW}
              y1={gB}
              x2={gL + frac * gW}
              y2={gB + (isMajor ? 12 : 7)}
              stroke={c.tickLine}
              strokeWidth={isMajor ? '1.8' : '1.2'}
            />
          );
        })}

        {/* ── Axis Labels ── */}
        <text
          x={gL - 25}
          y={gB - gH * 0.35}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={c.axisText}
          fontSize="13"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
          fontWeight="700"
          letterSpacing="0.14em"
          transform={`rotate(-90, ${gL - 25}, ${gB - gH * 0.35})`}
        >
          COMPLEXITY
        </text>

        <text
          x={gL + 25}
          y={gB + 34}
          textAnchor="start"
          fill={c.axisText}
          fontSize="13"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
          fontWeight="700"
          letterSpacing="0.14em"
        >
          TIME
        </text>

        {/* ── Curve 1: Regulatory Complexity (Steep Exponential Curve) ── */}
        <path
          d={buildPath(expoPoints)}
          fill="none"
          stroke={c.expo}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={approxLen}
          strokeDashoffset={approxLen * (1 - t)}
        />

        {/* ── Curve 2: Manual Capacity (Linear Slope) ── */}
        <path
          d={buildPath(linearPoints)}
          fill="none"
          stroke={c.linear}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={approxLen}
          strokeDashoffset={approxLen * (1 - t)}
        />

        {/* ── Endpoints ── */}
        {t > 0.88 && (
          <>
            <circle
              cx={expoEnd[0]}
              cy={expoEnd[1]}
              r="6.5"
              fill={c.expo}
              opacity={Math.min((t - 0.88) / 0.12, 1)}
            />
            <circle
              cx={linearEnd[0]}
              cy={linearEnd[1]}
              r="6.5"
              fill={c.linear}
              opacity={Math.min((t - 0.88) / 0.12, 1)}
            />
          </>
        )}

        {/* ── Solid Vertical Double-Ended Arrow ── */}
        {t > 0.45 && (
          <g opacity={Math.min((t - 0.45) / 0.3, 1)}>
            <line
              x1={gapX}
              y1={gapTopY + 12}
              x2={gapX}
              y2={gapBotY - 12}
              stroke={c.arrow}
              strokeWidth="2.5"
            />
            {/* Top arrow head */}
            <polygon
              points={`${gapX},${gapTopY + 2} ${gapX - 5.5},${gapTopY + 14} ${gapX + 5.5},${gapTopY + 14}`}
              fill={c.arrow}
            />
            {/* Bottom arrow head */}
            <polygon
              points={`${gapX},${gapBotY - 2} ${gapX - 5.5},${gapBotY - 14} ${gapX + 5.5},${gapBotY - 14}`}
              fill={c.arrow}
            />
          </g>
        )}

        {/* ── Center Black Box Pill Badge: "THE COMPLIANCE GAP" ── */}
        {t > 0.6 && (
          <g
            opacity={Math.min((t - 0.6) / 0.25, 1)}
            transform={`translate(${gapX - 195}, ${gapMidY - 18})`}
          >
            <rect
              width="185"
              height="36"
              rx="4"
              fill={c.blackPillBg}
              className="shadow-md"
            />
            <text
              x="92.5"
              y="22.5"
              textAnchor="middle"
              fill={c.blackPillText}
              fontSize="11.5"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
              fontWeight="900"
              letterSpacing="0.1em"
            >
              THE COMPLIANCE GAP
            </text>
          </g>
        )}

        {/* ── Top Badge Card: "UNDERSTANDING NEEDED TO MANAGE PRODUCTION" ── */}
        {t > 0.8 && (
          <g
            opacity={Math.min((t - 0.8) / 0.2, 1)}
            transform={`translate(${expoEnd[0] - 225}, ${expoEnd[1] - 56})`}
          >
            <rect
              width="215"
              height="48"
              rx="4"
              fill={c.cardBg}
              stroke={c.cardBorder}
              strokeWidth="1"
            />
            <text
              x="107.5"
              y="20"
              textAnchor="middle"
              fill={c.expo}
              fontSize="11.5"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
              fontWeight="800"
              letterSpacing="0.05em"
            >
              UNDERSTANDING NEEDED TO
            </text>
            <text
              x="107.5"
              y="37"
              textAnchor="middle"
              fill={c.expo}
              fontSize="11.5"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
              fontWeight="800"
              letterSpacing="0.05em"
            >
              MANAGE PRODUCTION
            </text>
          </g>
        )}

        {/* ── Bottom Badge Card: "WHAT YOUR TEAM CAN HOLD IN THEIR HEADS" ── */}
        {t > 0.8 && (
          <g
            opacity={Math.min((t - 0.8) / 0.2, 1)}
            transform={`translate(${linearEnd[0] - 185}, ${linearEnd[1] - 12})`}
          >
            <rect
              width="175"
              height="48"
              rx="4"
              fill={c.cardBg}
              stroke={c.cardBorder}
              strokeWidth="1"
            />
            <text
              x="87.5"
              y="20"
              textAnchor="middle"
              fill={c.linear}
              fontSize="11.5"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
              fontWeight="800"
              letterSpacing="0.05em"
            >
              WHAT YOUR TEAM CAN
            </text>
            <text
              x="87.5"
              y="37"
              textAnchor="middle"
              fill={c.linear}
              fontSize="11.5"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
              fontWeight="800"
              letterSpacing="0.05em"
            >
              HOLD IN THEIR HEADS
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

export default ComparisonGraph;
