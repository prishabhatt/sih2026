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

    // 1. Industrial CAD Markers & Engineering Coordinates
    const cadMarkers = [
      { xRel: 0.12, yRel: 0.18, size: 14, rotSpeed: 0.003, angle: 0 },
      { xRel: 0.88, yRel: 0.22, size: 18, rotSpeed: -0.002, angle: 1.2 },
      { xRel: 0.15, yRel: 0.78, size: 16, rotSpeed: 0.0025, angle: 2.4 },
      { xRel: 0.85, yRel: 0.72, size: 15, rotSpeed: -0.003, angle: 0.8 },
      { xRel: 0.50, yRel: 0.48, size: 22, rotSpeed: 0.0015, angle: 3.1 },
    ];

    // 2. Multi-Wave Topological Contour Lines (Industrial Engineering Flux)
    const WAVE_COUNT = 7;
    const waveConfigs = [
      { amp: 45, freq: 0.0012, speed: 0.008, phase: 0, yOffsetRatio: 0.18 },
      { amp: 65, freq: 0.0009, speed: 0.006, phase: 1.4, yOffsetRatio: 0.32 },
      { amp: 50, freq: 0.0015, speed: 0.010, phase: 2.8, yOffsetRatio: 0.48 },
      { amp: 75, freq: 0.0008, speed: 0.005, phase: 4.2, yOffsetRatio: 0.62 },
      { amp: 55, freq: 0.0011, speed: 0.007, phase: 0.7, yOffsetRatio: 0.78 },
      { amp: 70, freq: 0.0007, speed: 0.004, phase: 3.5, yOffsetRatio: 0.90 },
      { amp: 40, freq: 0.0014, speed: 0.009, phase: 5.1, yOffsetRatio: 0.08 },
    ];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    }

    resize();
    window.addEventListener('resize', resize);

    function onMouseMove(e) {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    }

    function onMouseLeave() {
      mouseRef.current.targetX = -2000;
      mouseRef.current.targetY = -2000;
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    let time = 0;
    let radarAngle = 0;

    function render() {
      time += 0.012;
      radarAngle += 0.004;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow (LERP)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      const strokeBase = isDark ? 'rgba(147, 181, 217, ' : 'rgba(30, 58, 95, ';
      const goldStroke = isDark ? 'rgba(245, 158, 11, ' : 'rgba(217, 119, 6, ';
      const gridStroke = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 23, 42, 0.035)';

      // -----------------------------------------------------------------------
      // 1. Precision Technical Drafting Grid with Caliper Ticks
      // -----------------------------------------------------------------------
      const gridSize = 64;
      ctx.strokeStyle = gridStroke;
      ctx.lineWidth = 0.5;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        // Subtle crosshair tick markers at intersections
        for (let y = 0; y < height; y += gridSize) {
          if ((x / gridSize + y / gridSize) % 3 === 0) {
            ctx.strokeStyle = isDark ? 'rgba(147, 181, 217, 0.08)' : 'rgba(30, 58, 95, 0.08)';
            ctx.beginPath();
            ctx.moveTo(x - 3, y);
            ctx.lineTo(x + 3, y);
            ctx.moveTo(x, y - 3);
            ctx.lineTo(x, y + 3);
            ctx.stroke();
            ctx.strokeStyle = gridStroke;
          }
        }
      }

      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // -----------------------------------------------------------------------
      // 2. Harmonic Industrial Contour Waves (Engineering Flux / Topography)
      // -----------------------------------------------------------------------
      waveConfigs.forEach((wave, idx) => {
        const baseY = height * wave.yOffsetRatio;
        const alpha = isDark ? (0.07 + (idx % 3) * 0.03) : (0.08 + (idx % 3) * 0.035);
        const isAccent = idx === 1 || idx === 4;

        ctx.strokeStyle = isAccent ? `${goldStroke}${alpha})` : `${strokeBase}${alpha})`;
        ctx.lineWidth = isAccent ? 1 : 0.75;
        ctx.beginPath();

        const step = 20;
        let started = false;

        for (let x = 0; x <= width + step; x += step) {
          // Double harmonic sine wave
          const waveVal1 = Math.sin(x * wave.freq + time * wave.speed + wave.phase) * wave.amp;
          const waveVal2 = Math.cos(x * (wave.freq * 1.6) - time * (wave.speed * 0.8)) * (wave.amp * 0.35);

          // Mouse proximity deflection (subtle physical elastic stretch)
          let mouseDeflect = 0;
          if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
            const dx = x - mouseRef.current.x;
            const dy = (baseY + waveVal1) - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 220) {
              mouseDeflect = Math.sin((1 - dist / 220) * Math.PI) * 20 * (dy < 0 ? -1 : 1);
            }
          }

          const y = baseY + waveVal1 + waveVal2 + mouseDeflect;

          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();

        // Delicate floating measurement tick on wave peaks
        const sampleX = ((width * (0.2 + idx * 0.12) + time * 15) % width);
        const peakY = baseY + Math.sin(sampleX * wave.freq + time * wave.speed + wave.phase) * wave.amp;
        
        ctx.fillStyle = isAccent ? `${goldStroke}${alpha * 1.8})` : `${strokeBase}${alpha * 1.8})`;
        ctx.beginPath();
        ctx.arc(sampleX, peakY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // -----------------------------------------------------------------------
      // 3. Eclectic CAD Reticles & Technical Dial Markers
      // -----------------------------------------------------------------------
      cadMarkers.forEach((marker, mIdx) => {
        const cx = marker.xRel * width;
        const cy = marker.yRel * height;
        marker.angle += marker.rotSpeed;

        const isMainNode = mIdx === 0 || mIdx === 4;
        const alphaReticle = isDark ? 0.18 : 0.22;

        ctx.save();
        ctx.translate(cx, cy);

        // Rotating Segmented CAD Compass Ring
        ctx.strokeStyle = isDark ? `rgba(147, 181, 217, ${alphaReticle})` : `rgba(30, 58, 95, ${alphaReticle})`;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.arc(0, 0, marker.size, marker.angle, marker.angle + Math.PI * 1.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, marker.size, marker.angle + Math.PI * 1.5, marker.angle + Math.PI * 1.85);
        ctx.stroke();

        // Technical Center Crosshair
        ctx.strokeStyle = isDark ? `rgba(245, 158, 11, ${alphaReticle * 1.2})` : `rgba(217, 119, 6, ${alphaReticle * 1.2})`;
        ctx.beginPath();
        ctx.moveTo(-4, 0);
        ctx.lineTo(4, 0);
        ctx.moveTo(0, -4);
        ctx.lineTo(0, 4);
        ctx.stroke();

        ctx.restore();
      });

      // -----------------------------------------------------------------------
      // 4. Subtle Radial Illumination Around Cursor
      // -----------------------------------------------------------------------
      if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        const rad = 280;
        const glowGrad = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          rad
        );
        const glowCol = isDark ? 'rgba(30, 58, 95, 0.18)' : 'rgba(147, 181, 217, 0.22)';
        glowGrad.addColorStop(0, glowCol);
        glowGrad.addColorStop(0.6, glowCol.replace(/[\d.]+\)$/, '0.04)'));
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }

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
      {/* 1. Base Layer Dynamic Neutral Backdrop */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          isDark
            ? 'bg-gradient-to-b from-[#06080F] via-[#080C16] to-[#06080F]'
            : 'bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E9EEF5]'
        }`}
      />

      {/* 2. Precision Industrial / Eclectic Canvas (Contour Waves & CAD Reticles) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-100"
      />

      {/* 3. Soft Ambient Vignette for Depth */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          isDark
            ? 'bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(6,8,15,0.45)_100%)]'
            : 'bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(226,232,240,0.30)_100%)]'
        }`}
      />
    </div>
  );
}

export default AppleStripeBackground;
