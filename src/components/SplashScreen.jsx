import React, { useEffect, useRef } from 'react';
import { AnimatedLogo } from './AnimatedLogo';

export function SplashScreen({ onComplete }) {
  const doneRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        if (typeof window !== 'undefined') {
          window.__isync_splash_done = true;
          window.dispatchEvent(new CustomEvent('isync-splash-complete'));
        }
        onComplete?.();
      }
    }, 3500);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 999999, background: '#030712' }}
    >
      <div
        className="absolute"
        style={{
          width: 500,
          height: 500,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(56,189,248,0.07) 0%, rgba(56,189,248,0.02) 40%, transparent 65%)',
          filter: 'blur(60px)',
          animation: 'sp-pulse 2.5s ease-in-out infinite',
        }}
      />

      <div
        className="relative flex flex-col items-center gap-6"
        style={{
          opacity: 0,
          animation: 'sp-emblem-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s forwards',
        }}
      >
        <AnimatedLogo size={120} animate={true} showText={false} />

        <div className="flex items-center" style={{ marginTop: 2 }}>
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#38BDF8',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              textShadow: '0 0 12px rgba(56,189,248,0.25)',
            }}
          >
            IS
          </span>
          <span
            style={{
              fontSize: 28,
              fontWeight: 300,
              letterSpacing: '-0.01em',
              color: '#94A3B8',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              opacity: 0,
              transform: 'translateX(-8px)',
              animation: 'sp-slide-in 0.5s cubic-bezier(0.16,1,0.3,1) 1.8s forwards',
            }}
          >
            sync
          </span>
        </div>

        <p
          style={{
            fontSize: 10,
            color: '#475569',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            opacity: 0,
            animation: 'sp-fade-in 0.4s ease-out 2.2s forwards',
          }}
        >
          Procurement Intelligence Gateway
        </p>
      </div>

      <style>{`
        @keyframes sp-emblem-in {
          from { opacity: 0; transform: scale(0.65) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes sp-slide-in {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes sp-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sp-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
      `}</style>
    </div>
  );
}
