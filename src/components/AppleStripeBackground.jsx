import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export function AppleStripeBackground() {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [targetMouse, setTargetMouse] = useState({ x: -1000, y: -1000 });

  // Smooth lerp mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setTargetMouse({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      setTargetMouse({ x: -1000, y: -1000 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    let animId;
    const lerp = () => {
      setMousePos((prev) => ({
        x: prev.x + (targetMouse.x - prev.x) * 0.08,
        y: prev.y + (targetMouse.y - prev.y) * 0.08,
      }));
      animId = requestAnimationFrame(lerp);
    };
    animId = requestAnimationFrame(lerp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [targetMouse]);

  // High-performance fluid gradient simulation (Pure organic light, zero grids/lines)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic fluid color orbs with parametric oscillation
    const orbs = [
      { x: 0.18, y: 0.2, vx: 0.0003, vy: 0.00025, r: 0.55, phase: 0 },
      { x: 0.82, y: 0.28, vx: -0.00025, vy: 0.0003, r: 0.58, phase: 2.1 },
      { x: 0.5, y: 0.72, vx: 0.0002, vy: -0.00028, r: 0.62, phase: 4.2 },
      { x: 0.15, y: 0.82, vx: -0.0003, vy: -0.0002, r: 0.5, phase: 1.5 },
      { x: 0.85, y: 0.8, vx: 0.0002, vy: 0.00025, r: 0.52, phase: 3.4 },
    ];

    let time = 0;

    const render = () => {
      time += 0.007;
      ctx.clearRect(0, 0, width, height);

      // Render each glowing gradient fluid node
      orbs.forEach((orb, i) => {
        const cx = (orb.x + Math.sin(time + orb.phase) * 0.14) * width;
        const cy = (orb.y + Math.cos(time * 0.8 + orb.phase) * 0.12) * height;
        const radius = orb.r * Math.min(width, height) * (1 + Math.sin(time * 0.5 + i) * 0.1);

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);

        if (isDark) {
          // Dark Mode: Rich Industrial Charcoal-Navy & Warm Subtle Amber Ambient Glow
          if (i === 0) {
            gradient.addColorStop(0, 'rgba(28, 45, 78, 0.55)'); // Rich Slate-Navy
            gradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.2)');
            gradient.addColorStop(1, 'rgba(11, 15, 25, 0)');
          } else if (i === 1) {
            gradient.addColorStop(0, 'rgba(40, 52, 78, 0.45)'); // Muted Charcoal-Navy
            gradient.addColorStop(0.55, 'rgba(15, 23, 42, 0.15)');
            gradient.addColorStop(1, 'rgba(11, 15, 25, 0)');
          } else if (i === 2) {
            gradient.addColorStop(0, 'rgba(217, 119, 6, 0.12)'); // Warm Subtle Amber/Gold Glow
            gradient.addColorStop(0.5, 'rgba(180, 83, 9, 0.04)');
            gradient.addColorStop(1, 'rgba(11, 15, 25, 0)');
          } else if (i === 3) {
            gradient.addColorStop(0, 'rgba(30, 58, 138, 0.28)'); // Deep Royal Navy
            gradient.addColorStop(0.55, 'rgba(15, 23, 42, 0.1)');
            gradient.addColorStop(1, 'rgba(11, 15, 25, 0)');
          } else {
            gradient.addColorStop(0, 'rgba(30, 41, 59, 0.4)'); // Deep Charcoal
            gradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.12)');
            gradient.addColorStop(1, 'rgba(11, 15, 25, 0)');
          }
        } else {
          // Light Mode: Soft Stone & Paper Iridescent Aura (Warm Off-White, Soft Slate, Delicate Sky)
          if (i === 0) {
            gradient.addColorStop(0, 'rgba(219, 234, 254, 0.5)'); // Soft Slate-Sky
            gradient.addColorStop(0.5, 'rgba(241, 245, 249, 0.25)');
            gradient.addColorStop(1, 'rgba(241, 245, 249, 0)');
          } else if (i === 1) {
            gradient.addColorStop(0, 'rgba(224, 231, 255, 0.45)'); // Soft Stone-Iris
            gradient.addColorStop(0.55, 'rgba(241, 245, 249, 0.2)');
            gradient.addColorStop(1, 'rgba(241, 245, 249, 0)');
          } else if (i === 2) {
            gradient.addColorStop(0, 'rgba(254, 243, 199, 0.35)'); // Delicate Warm Paper Gold
            gradient.addColorStop(0.5, 'rgba(241, 245, 249, 0.15)');
            gradient.addColorStop(1, 'rgba(241, 245, 249, 0)');
          } else if (i === 3) {
            gradient.addColorStop(0, 'rgba(203, 213, 225, 0.45)'); // Warm Stone Mist
            gradient.addColorStop(0.55, 'rgba(241, 245, 249, 0.2)');
            gradient.addColorStop(1, 'rgba(241, 245, 249, 0)');
          } else {
            gradient.addColorStop(0, 'rgba(226, 232, 240, 0.5)'); // Off-White Paper Aura
            gradient.addColorStop(0.5, 'rgba(241, 245, 249, 0.2)');
            gradient.addColorStop(1, 'rgba(241, 245, 249, 0)');
          }
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Fluid Canvas Gradient Mesh (High-Blur Organic Aurora) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full filter blur-[80px] sm:blur-[110px] opacity-95 transition-opacity duration-700"
      />

      {/* 2. Interactive Cursor Ambient Spotlight (Follows mouse smoothly) */}
      {mousePos.x > 0 && mousePos.y > 0 && (
        <div
          className="absolute rounded-full transition-transform duration-75 ease-out pointer-events-none filter blur-[90px]"
          style={{
            transform: `translate(${mousePos.x - 250}px, ${mousePos.y - 250}px)`,
            width: '500px',
            height: '500px',
            background: isDark
              ? 'radial-gradient(circle, rgba(59, 130, 246, 0.24) 0%, rgba(99, 102, 241, 0.12) 50%, transparent 75%)'
              : 'radial-gradient(circle, rgba(147, 197, 253, 0.45) 0%, rgba(199, 210, 254, 0.25) 50%, transparent 75%)',
          }}
        />
      )}

      {/* 3. Pure Ambient Lighting Washes (Top & Bottom subtle glow, no lines) */}
      <div className="absolute -top-32 left-1/4 w-[700px] h-[400px] bg-gradient-to-b from-blue-500/15 via-indigo-500/8 to-transparent filter blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[600px] h-[400px] bg-gradient-to-t from-indigo-500/15 via-blue-500/8 to-transparent filter blur-[100px] pointer-events-none" />
    </div>
  );
}

export default AppleStripeBackground;
