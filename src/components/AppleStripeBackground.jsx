import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export function AppleStripeBackground() {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);
  const mouseRef = useRef({
    x: -2000,
    y: -2000,
    targetX: -2000,
    targetY: -2000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Organic Fluid Aurora Orbs
    const orbs = [
      {
        baseX: 0.2,
        baseY: 0.25,
        radiusRatio: 0.5,
        phase: 0,
        darkColor: 'rgba(30, 58, 95, 0.45)',     // Sophisticated Navy
        lightColor: 'rgba(147, 185, 230, 0.40)', // Ethereal Azure
      },
      {
        baseX: 0.8,
        baseY: 0.2,
        radiusRatio: 0.45,
        phase: 2.1,
        darkColor: 'rgba(217, 119, 6, 0.22)',    // Liquid State Amber/Gold
        lightColor: 'rgba(245, 158, 11, 0.25)',  // Warm Champagne Gold
      },
      {
        baseX: 0.5,
        baseY: 0.65,
        radiusRatio: 0.55,
        phase: 4.2,
        darkColor: 'rgba(11, 30, 58, 0.55)',    // Deep Midnight Indigo
        lightColor: 'rgba(199, 218, 245, 0.38)', // Frost Titanium
      },
      {
        baseX: 0.25,
        baseY: 0.8,
        radiusRatio: 0.4,
        phase: 1.5,
        darkColor: 'rgba(16, 185, 129, 0.18)',   // GFR Emerald Security Glow
        lightColor: 'rgba(52, 211, 153, 0.25)',  // Mint Emerald
      },
      {
        baseX: 0.85,
        baseY: 0.75,
        radiusRatio: 0.48,
        phase: 3.4,
        darkColor: 'rgba(30, 58, 95, 0.38)',     // Royal Navy
        lightColor: 'rgba(165, 180, 252, 0.30)', // Soft Iris
      },
    ];

    // 2. Neural Constellation Particles
    let particles = [];
    const PARTICLE_COUNT = Math.min(60, Math.max(30, Math.floor((width * height) / 24000)));

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          baseRadius: Math.random() * 1.5 + 0.8,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.02,
          type: Math.random() > 0.7 ? 'gold' : Math.random() > 0.85 ? 'emerald' : 'navy',
        });
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initParticles();
    }

    resize();
    window.addEventListener('resize', resize);

    function onMouseMove(e) {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    }

    function onMouseLeave() {
      mouseRef.current.active = false;
      mouseRef.current.targetX = -2000;
      mouseRef.current.targetY = -2000;
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    // 3. Render Loop
    let time = 0;
    let scanlineY = 0;

    function render() {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow (LERP)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.07;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.07;

      // -----------------------------------------------------------------------
      // PASS 1: Volumetric Fluid Aurora Orbs
      // -----------------------------------------------------------------------
      ctx.save();
      orbs.forEach((orb, i) => {
        const cx = (orb.baseX + Math.sin(time * 0.7 + orb.phase) * 0.12) * width;
        const cy = (orb.baseY + Math.cos(time * 0.5 + orb.phase) * 0.1) * height;
        const minDim = Math.min(width, height);
        const radius = minDim * (orb.radiusRatio + Math.sin(time * 0.4 + i) * 0.05);

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        const color = isDark ? orb.darkColor : orb.lightColor;

        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, color.replace(/[\d.]+\)$/, (m) => `${parseFloat(m) * 0.45})`));
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Interactive Mouse Spotlight
      if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        const spotlightRadius = Math.min(width, height) * 0.35;
        const mouseGrad = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          spotlightRadius
        );
        const spotlightColor = isDark
          ? 'rgba(30, 58, 95, 0.32)'
          : 'rgba(147, 197, 253, 0.40)';

        mouseGrad.addColorStop(0, spotlightColor);
        mouseGrad.addColorStop(0.5, spotlightColor.replace(/[\d.]+\)$/, '0.08)'));
        mouseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = mouseGrad;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, spotlightRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // -----------------------------------------------------------------------
      // PASS 2: Laser Scanline Wave
      // -----------------------------------------------------------------------
      scanlineY = (scanlineY + 0.75) % (height + 250);
      const curY = scanlineY - 120;

      if (curY > -50 && curY < height + 50) {
        const scanGrad = ctx.createLinearGradient(0, curY - 50, 0, curY + 50);
        const scanColor = isDark ? 'rgba(245, 158, 11, 0.035)' : 'rgba(30, 58, 95, 0.04)';

        scanGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        scanGrad.addColorStop(0.5, scanColor);
        scanGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, curY - 50, width, 100);

        ctx.strokeStyle = isDark ? 'rgba(245, 158, 11, 0.14)' : 'rgba(30, 58, 95, 0.09)';
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(0, curY);
        ctx.lineTo(width, curY);
        ctx.stroke();
      }

      // -----------------------------------------------------------------------
      // PASS 3: Neural Constellation Mesh
      // -----------------------------------------------------------------------
      const connectionDist = Math.min(width, height) * 0.15;
      const mouseDist = 170;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < -10) p1.x = width + 10;
        if (p1.x > width + 10) p1.x = -10;
        if (p1.y < -10) p1.y = height + 10;
        if (p1.y > height + 10) p1.y = -10;

        // Interactive Cursor Connection
        if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
          const dxM = p1.x - mouseRef.current.x;
          const dyM = p1.y - mouseRef.current.y;
          const distM = Math.sqrt(dxM * dxM + dyM * dyM);

          if (distM < mouseDist) {
            const force = (1 - distM / mouseDist) * 0.025;
            p1.x += dxM * force;
            p1.y += dyM * force;

            const alphaM = (1 - distM / mouseDist) * (isDark ? 0.35 : 0.28);
            ctx.strokeStyle = isDark
              ? `rgba(245, 158, 11, ${alphaM})`
              : `rgba(30, 58, 95, ${alphaM})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();
          }
        }

        // Inter-Particle Connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * (isDark ? 0.18 : 0.16);
            ctx.strokeStyle = isDark
              ? `rgba(147, 181, 217, ${alpha})`
              : `rgba(30, 58, 95, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw Glowing Particles
      particles.forEach((p) => {
        p.phase += p.pulseSpeed;
        const pulse = Math.sin(p.phase) * 0.35 + 1;
        const radius = p.baseRadius * pulse;

        let fillColor;
        if (p.type === 'gold') {
          fillColor = isDark
            ? `rgba(245, 158, 11, ${0.5 + Math.sin(p.phase) * 0.3})`
            : `rgba(217, 119, 6, ${0.55 + Math.sin(p.phase) * 0.3})`;
        } else if (p.type === 'emerald') {
          fillColor = isDark
            ? `rgba(52, 211, 153, ${0.5 + Math.sin(p.phase) * 0.3})`
            : `rgba(16, 185, 129, ${0.55 + Math.sin(p.phase) * 0.3})`;
        } else {
          fillColor = isDark
            ? `rgba(199, 218, 245, ${0.4 + Math.sin(p.phase) * 0.25})`
            : `rgba(30, 58, 95, ${0.45 + Math.sin(p.phase) * 0.25})`;
        }

        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Base Layer Dynamic Backdrop Gradient */}
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${
          isDark
            ? 'bg-gradient-to-b from-[#05070D] via-[#070B14] to-[#05070D]'
            : 'bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]'
        }`}
      />

      {/* 2. Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-100 transition-opacity duration-700"
      />

      {/* 3. Top Ambient Wash */}
      <div
        className={`absolute -top-32 left-1/4 w-[750px] h-[450px] rounded-full blur-[110px] pointer-events-none transition-all duration-1000 ${
          isDark
            ? 'bg-gradient-to-b from-[#1E3A5F]/30 via-[#0B1E36]/20 to-transparent'
            : 'bg-gradient-to-b from-[#93B5D9]/35 via-[#C2D8ED]/20 to-transparent'
        }`}
      />

      {/* 4. Bottom Ambient Wash */}
      <div
        className={`absolute -bottom-32 right-1/4 w-[650px] h-[450px] rounded-full blur-[110px] pointer-events-none transition-all duration-1000 ${
          isDark
            ? 'bg-gradient-to-t from-[#D97706]/15 via-[#1E3A5F]/15 to-transparent'
            : 'bg-gradient-to-t from-[#F59E0B]/18 via-[#93B5D9]/20 to-transparent'
        }`}
      />

      {/* 5. Delicate Micro-Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? 'rgba(255,255,255,0.7)' : 'rgba(15,23,42,0.6)'} 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />
    </div>
  );
}

export default AppleStripeBackground;
