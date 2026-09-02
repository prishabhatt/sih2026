import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  FileCheck,
  CheckCircle2,
  Award,
  Globe,
  GitFork,
  Lock,
  ChevronRight,
  Database,
  AlertTriangle,
  Terminal,
  Activity,
  Sun,
  Moon,
  Smartphone,
  BookOpen,
  Building2,
  TrendingUp,
  FileText,
  Check,
  Copy,
  Zap,
  Scale,
  FileSpreadsheet,
  AlertCircle,
  Cpu,     // <-- ADDED THIS
  QrCode   // <-- ADDED THIS
} from 'lucide-react';

import { useTheme } from '../context/ThemeContext';
import { useProcurement } from '../context/ProcurementContext';
import { BIS_DIVISIONS } from '../data/divisionsData';

function AnimatedNumber({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [target, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function LandingView() {
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();
  const { lang, setLang, t } = useProcurement();

  const [activeDivisionTab, setActiveDivisionTab] = useState('ETD');

  const activeDivInfo = BIS_DIVISIONS.find((d) => d.code === activeDivisionTab) || BIS_DIVISIONS[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors duration-500 relative overflow-hidden font-sans">

      {/* ========================================================================= */}
      {/* ATMOSPHERIC BACKGROUND: HORIZONTAL PHOTON BEAM & ORBITAL TRAJECTORIES      */}
      {/* ========================================================================= */}

      {/* Top Luminous Perspective Beam */}
      <div className="absolute top-[60px] inset-x-0 h-[640px] pointer-events-none z-0 overflow-hidden">
        {/* Dark Mode Luminous Flare */}
        <div className="hidden dark:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[520px]">
          <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 via-white to-transparent blur-[1px] opacity-90" />
          <div className="absolute top-1/2 left-0 right-0 h-[28px] -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-400/40 via-blue-500/50 to-transparent blur-[12px]" />
          <div className="absolute top-1/2 left-0 right-0 h-[140px] -translate-y-1/2 bg-gradient-to-r from-transparent via-blue-600/20 via-cyan-500/25 to-transparent blur-[60px]" />

          {/* Dual Diffuse Aura (Top & Bottom Expansion) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[220px] bg-gradient-to-b from-blue-600/15 via-cyan-500/10 to-transparent blur-[80px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[220px] bg-gradient-to-t from-blue-600/15 via-cyan-500/10 to-transparent blur-[80px]" />

          {/* Smooth Diffused Horizontal Horizon Flare (Zero Clashing Dots) */}
          <div className="absolute top-1/2 left-0 w-72 h-44 -translate-y-1/2 bg-cyan-400/15 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-96 h-36 -translate-y-1/2 bg-blue-500/15 blur-3xl" />
        </div>

        {/* Light Mode Soft Azure Aura */}
        <div className="block dark:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[400px] bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(191,219,254,0.6),rgba(224,242,254,0.3),transparent_70%)] blur-2xl" />
      </div>

      {/* Orbital Trajectory Lines (Payius Inspiration) */}
      <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[1200px] h-[550px] pointer-events-none z-0 opacity-40 dark:opacity-30 hidden sm:block">
        <svg viewBox="0 0 1200 550" fill="none" className="w-full h-full">
          <ellipse cx="600" cy="275" rx="560" ry="180" stroke="url(#orbit-line-1)" strokeWidth="1" strokeDasharray="4 4" />
          <ellipse cx="600" cy="275" rx="440" ry="130" stroke="url(#orbit-line-2)" strokeWidth="1.2" />
          <ellipse cx="600" cy="275" rx="290" ry="85" stroke="url(#orbit-line-3)" strokeWidth="1" />
          <circle cx="210" cy="220" r="3.5" fill="#38BDF8" className="animate-pulse" />
          <circle cx="600" cy="145" r="4.5" fill="#60A5FA" />
          <circle cx="980" cy="320" r="3.5" fill="#38BDF8" className="animate-pulse" />
          <circle cx="430" cy="355" r="2.5" fill="#93C5FD" />
          <circle cx="780" cy="210" r="3" fill="#67E8F9" />
          <defs>
            <linearGradient id="orbit-line-1" x1="40" y1="275" x2="1160" y2="275" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" stopOpacity="0" />
              <stop offset="0.5" stopColor="#38BDF8" stopOpacity="0.5" />
              <stop offset="1" stopColor="#38BDF8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="orbit-line-2" x1="160" y1="275" x2="1040" y2="275" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" stopOpacity="0.05" />
              <stop offset="0.5" stopColor="#60A5FA" stopOpacity="0.7" />
              <stop offset="1" stopColor="#60A5FA" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="orbit-line-3" x1="310" y1="275" x2="890" y2="275" gradientUnits="userSpaceOnUse">
              <stop stopColor="#93C5FD" stopOpacity="0" />
              <stop offset="0.5" stopColor="#93C5FD" stopOpacity="0.4" />
              <stop offset="1" stopColor="#93C5FD" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 1. HEADER & NAVIGATION BAR                                                */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/80 dark:bg-[#030712]/80 border-b border-slate-200/80 dark:border-white/[0.08] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  BIS<span className="text-cyan-600 dark:text-cyan-400">Engine</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  NIC-BIS Node Active
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
                National Procurement AI Compliance Gateway
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-slate-500 dark:text-slate-400 font-mono text-[10px]">
              GFR 2017 Rule 144(xi) Verified
            </span>
            <span className="text-slate-300 dark:text-slate-700 hidden md:inline">|</span>

            {/* Theme Toggle in Header */}
            <button
              onClick={toggleTheme}
              className="p-1 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition hover:bg-slate-300"
              title={isDark ? 'Switch to Institutional Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="flex items-center rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 p-0.5 text-[11px] font-bold font-mono">
              <button
                onClick={() => setLang('en')}
                className={`px-1.5 py-0.5 rounded transition ${lang === 'en'
                  ? 'text-blue-700 dark:text-blue-400 font-bold bg-blue-100 dark:bg-blue-500/10 border border-blue-300 dark:border-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-1.5 py-0.5 rounded transition ${lang === 'hi'
                  ? 'text-blue-700 dark:text-blue-400 font-bold bg-blue-100 dark:bg-blue-500/10 border border-blue-300 dark:border-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLang('gu')}
                className={`px-1.5 py-0.5 rounded transition ${lang === 'gu'
                  ? 'text-blue-700 dark:text-blue-400 font-bold bg-blue-100 dark:bg-blue-500/10 border border-blue-300 dark:border-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
              >
                ગુજરાતી
              </button>
            </div>

            {/* Reactive Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-all"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all"
            >
              <span>Portal Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SECTION 1: CINEMATIC INTRODUCTION HERO (THE HOOK)                        */}
      {/* ========================================================================= */}
      <section id="overview" className="relative z-10 pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Prestigious Ministerial Introduction */}
          <div className="lg:col-span-7 text-left space-y-6 relative z-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 dark:bg-cyan-950/40 border border-blue-200/80 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-300 text-xs font-semibold shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Government-Grade Procurement Intelligence • SIH Prototype</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] pb-1">
              Smarter Insights for{' '}
              <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
                Audit-Proof Tenders
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
              A unified national AI engine automating Bureau of Indian Standards (BIS) compliance, Quality Control Orders (QCOs), and public procurement validation under GFR 2017.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#mission"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-500 hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Explore Platform Overview</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => navigate('/sandbox')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-white/[0.04] hover:bg-slate-50 dark:hover:bg-white/[0.08] text-slate-800 dark:text-white font-bold text-sm border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md transition-all"
              >
                <Terminal className="w-4 h-4 text-cyan-500" />
                <span>Launch Live Sandbox ↗</span>
              </button>
            </div>
          </div>

          {/* Right Column: High-Impact Telemetry Counters */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#0B111E]/90 border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-lg shadow-cyan-500/5 transition-all hover:border-cyan-500/30 group">
              <p className="text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                <AnimatedNumber target={22410} suffix="+" duration={2200} />
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">Active Indian Standards</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#0B111E]/90 border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-lg shadow-emerald-500/5 transition-all hover:border-emerald-500/30 group">
              <p className="text-3xl sm:text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">
                <AnimatedNumber target={142} suffix="+" duration={1800} />
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">Mandatory Gazette QCOs</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#0B111E]/90 border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-lg shadow-blue-500/5 transition-all hover:border-cyan-500/30 group">
              <p className="text-3xl sm:text-4xl font-black font-mono text-blue-600 dark:text-cyan-400 tabular-nums tracking-tight">
                <AnimatedNumber target={100} suffix="%" duration={1600} />
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">Statutory GFR 2017 Compliance</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#0B111E]/90 border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-lg shadow-sky-500/5 transition-all hover:border-sky-500/30 group">
              <p className="text-3xl sm:text-4xl font-black font-mono text-cyan-600 dark:text-sky-300 tabular-nums tracking-tight">
                <AnimatedNumber target={0} suffix="%" duration={1200} />
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">Single-Vendor Bid Bias</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: THE INSTITUTIONAL MISSION & SYSTEMIC CHALLENGES                */}
      {/* ========================================================================= */}
      <section id="mission" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-3 block">
            The Institutional Mandate
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Solving Systemic Vulnerabilities in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
              National Procurement.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-4">
            Addressing regulatory loopholes, quality compromises, and audit friction across central ministries, state undertakings, and GeM transactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mission Card 1 */}
          <div className="p-8 rounded-3xl bg-white/90 dark:bg-[#0B111E]/90 border border-slate-200/90 dark:border-white/[0.08] hover:border-cyan-500/40 transition-all shadow-sm backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3">
              Eliminating Single-Vendor Bid Bias
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Enforcing General Financial Rules (GFR) 2017 Rule 144(xi). Automatically detects custom proprietary specifications that inadvertently restrict fair competition and favor specific commercial vendors.
            </p>
          </div>

          {/* Mission Card 2 */}
          <div className="p-8 rounded-3xl bg-white/90 dark:bg-[#0B111E]/90 border border-slate-200/90 dark:border-white/[0.08] hover:border-emerald-500/40 transition-all shadow-sm backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3">
              Automating 22,410+ IS Standards Discovery
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Replaces error-prone manual catalog searches. Semantically parses unstructured BOQs, Bill of Materials, and technical specifications to exact, gazetted Indian Standards, current amendments, and test methods.
            </p>
          </div>

          {/* Mission Card 3 */}
          <div className="p-8 rounded-3xl bg-white/90 dark:bg-[#0B111E]/90 border border-slate-200/90 dark:border-white/[0.08] hover:border-blue-500/40 transition-all shadow-sm backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-cyan-400 mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3">
              Non-Repudiation Audit & Verification
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Generates cryptographic SHA-256 digital seals and scannable QR Passports to provide field inspection authorities (e.g. RITES, DGS&D) and CAG auditors with tamper-proof verification of delivered materials.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: REFINED CORE PLATFORM CAPABILITIES (BENTO GRID)                */}
      {/* ========================================================================= */}
      <section id="capabilities" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-3 block">
            End-to-End Gov-Tech Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Institutional AI Features Built for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
              Government Scale.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-4">
            Six synchronized intelligence modules designed for procurement authorities, CAG auditors, and third-party inspection agencies.
          </p>
        </div>

        {/* 6-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#0B111E]/90 border border-slate-200/90 dark:border-white/[0.08] hover:border-cyan-500/40 transition-all shadow-sm backdrop-blur-md group">
            <div className="w-11 h-11 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
              Intelligent RAG Vector Resolution
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Instant multilingual vector semantic parsing across 22,410+ national standards with 768-D dense embeddings, resolving technical scopes to primary IS codes and year versions.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#0B111E]/90 border border-slate-200/90 dark:border-white/[0.08] hover:border-emerald-500/40 transition-all shadow-sm backdrop-blur-md group">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
              Statutory QCO Warning Guards
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Automated legal compliance verification checking Gazette Quality Control Orders (QCOs), Scheme-I mandatory ISI licenses, and Scheme-II CRS certifications under Section 16 of the BIS Act 2016.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#0B111E]/90 border border-slate-200/90 dark:border-white/[0.08] hover:border-indigo-500/40 transition-all shadow-sm backdrop-blur-md group">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5 group-hover:scale-105 transition-transform">
              <GitFork className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
              Normative Reference Graph Traversal
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Deep dependency graph mapping that automatically traces and links mandatory raw material test methods (e.g., conductor resistance, tensile yield, flammability) to prevent material substitution.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#0B111E]/90 border border-slate-200/90 dark:border-white/[0.08] hover:border-amber-500/40 transition-all shadow-sm backdrop-blur-md group">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/50 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
              GFR 2017 Rule 144(xi) Loophole Scanner
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Audits draft specifications for restrictive, non-standard proprietary parameters and unapproved foreign standards, ensuring open, transparent, and fair public bidding.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#0B111E]/90 border border-slate-200/90 dark:border-white/[0.08] hover:border-cyan-500/40 transition-all shadow-sm backdrop-blur-md group">
            <div className="w-11 h-11 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
              Model NIT Clause Synthesis
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              1-click synthesis of legally binding, standardized Notice Inviting Tender (NIT) technical clauses formatted specifically for direct insertion into GeM Custom Bids & CPPP portals.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#0B111E]/90 border border-slate-200/90 dark:border-white/[0.08] hover:border-purple-500/40 transition-all shadow-sm backdrop-blur-md group">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-5 group-hover:scale-105 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
              Cryptographic Audit Passports
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Generates immutable digital compliance passports with SHA-256 non-repudiation digital seals and scannable QR codes for field warehouse verification with mobile inspection terminals.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: UNIVERSAL STANDARDS CORPUS & TECHNICAL DIVISIONS                */}
      {/* ========================================================================= */}
      <section id="divisions" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-white/90 dark:bg-[#0B111E]/90 border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-2 block">
              Universal Standards Index
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              6 Technical Divisions Synchronized
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              The engine indexes standards across all major engineering and scientific divisions of the Bureau of Indian Standards.
            </p>
          </div>

          {/* Division Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {BIS_DIVISIONS.map((div) => {
              const isSelected = activeDivisionTab === div.code;
              return (
                <button
                  key={div.code}
                  onClick={() => setActiveDivisionTab(div.code)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold font-mono transition-all ${isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                >
                  {div.code} • {div.shortName}
                </button>
              );
            })}
          </div>

          {/* Active Division Panel */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Division Name</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white mt-1">{activeDivInfo.fullName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">Division Code: {activeDivInfo.code}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Telemetry & Mandates</p>
              <p className="text-base font-extrabold font-mono text-blue-600 dark:text-cyan-400 mt-1">
                {activeDivInfo.standardsCount.toLocaleString()} Active Standards
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                {activeDivInfo.activeQCOs} Statutory Quality Control Orders
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Key Product Categories</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                {activeDivInfo.keyProducts}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: SŌRA-STYLE CHROMATIC CLOSING CTA                                */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl p-10 sm:p-16 overflow-hidden bg-gradient-to-br from-slate-900 via-[#060B18] to-[#03060E] text-white border border-white/[0.12] shadow-2xl">
          {/* Chromatic Particle Beam Ribbon (Sōra Style) */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-amber-500/20 via-rose-500/20 to-blue-600/30 rounded-full blur-[110px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3 block">
              Get Early Access
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
              Ready to modernize national procurement?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
              Experience the live prototype on the web or test the companion mobile app on your smartphone with instant OTP authentication.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all"
              >
                <span>Start Procurement Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/sandbox')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/15 transition-all"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Launch Interactive Sandbox</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: INSTITUTIONAL GOVERNMENT FOOTER                                */}
      {/* ========================================================================= */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#030712] pt-14 pb-10 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-200 dark:border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-sm mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>BISEngine</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                National AI-Powered Recommendation Engine for Bureau of Indian Standards Compliance.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>All Systems Operational</span>
              </div>
            </div>

            {/* Column 2: Legal & Statutory */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Statutory Framework</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400">
                <li>BIS Act 2016 (Section 16)</li>
                <li>General Financial Rules (GFR) 2017</li>
                <li>Public Procurement Order (PPO) 2017</li>
                <li>GeM Quality Verification Guidelines</li>
              </ul>
            </div>

            {/* Column 3: Platform Features */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Core Capabilities</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400">
                <li>Dense Vector Retrieval (768-D)</li>
                <li>Normative Reference Graph Explorer</li>
                <li>Model NIT Clause Generator</li>
                <li>SHA-256 Sealed QR Passports</li>
              </ul>
            </div>

            {/* Column 4: SIH 2026 Initiative */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Smart India Hackathon</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Developed for the Ministry of Consumer Affairs, Food & Public Distribution by Team Chronos.
              </p>
              <p className="text-[11px] font-mono text-slate-400">Gov-Tech Prototype v1.0</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
            <p>© BISEngine. Government of India.</p>
            <p className="mt-2 sm:mt-0 font-mono">Developed for Public Procurement Traceability & Quality Assurance</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingView;