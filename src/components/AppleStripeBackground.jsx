import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export function AppleStripeBackground() {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const orbs = [
      { x: 0.18, y: 0.22, vx: 0.0003, vy: 0.0002, phase: 0, radiusMult: 0.48, colorDark: 'rgba(20, 48, 92, 0.45)', colorLight: 'rgba(147, 185, 230, 0.32)' },
      { x: 0.82, y: 0.28, vx: -0.0002, vy: 0.0003, phase: 2.1, radiusMult: 0.42, colorDark: 'rgba(217, 119, 6, 0.16)', colorLight: 'rgba(251, 191, 36, 0.22)' },
      { x: 0.50, y: 0.55, vx: 0.0001, vy: -0.0002, phase: 4.2, radiusMult: 0.55, colorDark: 'rgba(11, 30, 58, 0.55)', colorLight: 'rgba(199, 218, 245, 0.28)' },
      { x: 0.25, y: 0.80, vx: 0.00025, vy: -0.00015, phase: 1.5, radiusMult: 0.38, colorDark: 'rgba(16, 185, 129, 0.12)', colorLight: 'rgba(52, 211, 153, 0.16)' },
      { x: 0.78, y: 0.78, vx: -0.0002, vy: -0.0002, phase: 3.4, radiusMult: 0.46, colorDark: 'rgba(30, 58, 95, 0.38)', colorLight: 'rgba(165, 180, 252, 0.20)' },
    ];

    const PARTICLE_COUNT = Math.min(55, Math.floor((width * height) / 28000));
    let particles = [];

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          baseRadius: Math.random() * 1.6 + 0.8,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02,
          isGold: Math.random() > 0.75,
          isEmerald: Math.random() > 0.85,
        });
      }
    }
    initParticles();

    function handleResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }
    window.addEventListener('resize', handleResize);

    function handleMouseMove(e) {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    }

    function handleMouseLeave() {
      mouseRef.current.active = false;
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let scanlineY = 0;
    let time = 0;

    function render() {
      time += 0.006;
      ctx.clearRect(0, 0, width, height);

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      ctx.save();
      orbs.forEach((orb, i) => {
        const cx = (orb.x + Math.sin(time * 0.8 + orb.phase) * 0.14) * width;
        const cy = (orb.y + Math.cos(time * 0.6 + orb.phase) * 0.12) * height;
        const radius = Math.min(width, height) * (orb.radiusMult + Math.sin(time * 0.5 + i) * 0.04);

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        const color = isDark ? orb.colorDark : orb.colorLight;

        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, color.replace(/[\d.]+\)$/, (m) => `${parseFloat(m) * 0.45})`));
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        const mouseGrad = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          Math.min(width, height) * 0.38
        );
        const spotlightColor = isDark
          ? 'rgba(30, 58, 95, 0.30)'
          : 'rgba(199, 218, 245, 0.35)';
        mouseGrad.addColorStop(0, spotlightColor);
        mouseGrad.addColorStop(0.5, spotlightColor.replace(/[\d.]+\)$/, '0.08)'));
        mouseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = mouseGrad;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, Math.min(width, height) * 0.38, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();





      const connectionDist = Math.min(width, height) * 0.16;
      const mouseDist = 180;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < -20) p1.x = width + 20;
        if (p1.x > width + 20) p1.x = -20;
        if (p1.y < -20) p1.y = height + 20;
        if (p1.y > height + 20) p1.y = -20;

        if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
          const dxM = p1.x - mouseRef.current.x;
          const dyM = p1.y - mouseRef.current.y;
          const distM = Math.sqrt(dxM * dxM + dyM * dyM);

          if (distM < mouseDist) {
            const force = (1 - distM / mouseDist) * 0.02;
            p1.x += dxM * force;
            p1.y += dyM * force;

            const alphaM = (1 - distM / mouseDist) * (isDark ? 0.28 : 0.22);
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

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * (isDark ? 0.16 : 0.14);
            ctx.strokeStyle = isDark
              ? `rgba(147, 181, 217, ${alpha})`
              : `rgba(30, 58, 95, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.phase += p.pulseSpeed;
        const pulse = Math.sin(p.phase) * 0.4 + 1;
        const radius = p.baseRadius * pulse;

        let fillColor;
        if (p.isGold) {
          fillColor = isDark
            ? `rgba(245, 158, 11, ${0.4 + Math.sin(p.phase) * 0.25})`
            : `rgba(217, 119, 6, ${0.45 + Math.sin(p.phase) * 0.25})`;
        } else if (p.isEmerald) {
          fillColor = isDark
            ? `rgba(52, 211, 153, ${0.4 + Math.sin(p.phase) * 0.25})`
            : `rgba(16, 185, 129, ${0.45 + Math.sin(p.phase) * 0.25})`;
        } else {
          fillColor = isDark
            ? `rgba(200, 220, 245, ${0.35 + Math.sin(p.phase) * 0.2})`
            : `rgba(30, 58, 95, ${0.4 + Math.sin(p.phase) * 0.2})`;
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
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${isDark
          ? 'bg-gradient-to-b from-[#05070D] via-[#070B14] to-[#05070D]'
          : 'bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]'
          }`}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-100"
      />

      <div
        className={`absolute -top-40 left-1/4 w-[800px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 ${isDark
          ? 'bg-gradient-to-b from-[#1E3A5F]/25 via-[#0B1E36]/15 to-transparent'
          : 'bg-gradient-to-b from-[#93B5D9]/30 via-[#C2D8ED]/15 to-transparent'
          }`}
      />
      <div
        className={`absolute -bottom-40 right-1/4 w-[700px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 ${isDark
          ? 'bg-gradient-to-t from-[#D97706]/12 via-[#1E3A5F]/10 to-transparent'
          : 'bg-gradient-to-t from-[#F59E0B]/15 via-[#93B5D9]/15 to-transparent'
          }`}
      />

      <div
        className={`absolute inset-0 pointer-events-none ${isDark
          ? 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,7,13,0.4)_100%)]'
          : 'bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(226,232,240,0.35)_100%)]'
          }`}
      />
    </div>
  );
}

export default AppleStripeBackground;
