<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
=======
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
>>>>>>> 6ac448708dd57bc42282f955d1760c2f2054674f
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
  ChevronDown,
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
<<<<<<< HEAD
  Cpu,     // <-- ADDED THIS
  QrCode   // <-- ADDED THIS
=======
  ArrowUpRight,
  Compass,
  CheckCheck,
  Send,
  HelpCircle,
  BarChart3
>>>>>>> 6ac448708dd57bc42282f955d1760c2f2054674f
} from 'lucide-react';

import { useTheme } from '../context/ThemeContext';
import { useProcurement } from '../context/ProcurementContext';
import { BIS_DIVISIONS } from '../data/divisionsData';
import { AppleStripeBackground } from '../components/AppleStripeBackground';
import { GlassSegmentedControl } from '../components/GlassSegmentedControl';

function AnimatedNumber({ target, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
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
  const { lang, setLang, t, loadScenario } = useProcurement();

  const [activeDivisionTab, setActiveDivisionTab] = useState('ETD');
  const [expandedPipelineRow, setExpandedPipelineRow] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Interactive Live Hero Sandbox Demo state
  const [demoQuery, setDemoQuery] = useState('11kV HT XLPE Metro Power Distribution Cables with FRLS sheath');
  const [isResolving, setIsResolving] = useState(false);
  const [resolvedResult, setResolvedResult] = useState({
    code: 'IS 7098 (Part 2) : 2011',
    title: 'XLPE Insulated Thermoplastic Sheathed Power Cables (3.3 kV to 33 kV)',
    confidence: 99.4,
    qco: 'Cables & Wires (Quality Control) Order, 2023 [Mandatory ISI Mark]',
    normative: ['IS 8130 : 2013 (Conductor Resistance)', 'IS 10810 P58 (Oxygen Index >= 29%)'],
    division: 'ETD (Electrotechnical)',
    mii: '60% Class-I Local',
    scenarioId: 'underground_cable_metro'
  });

  const liveDemoPresets = [
    {
      label: '⚡ 11kV Metro Cable',
      query: '11kV HT XLPE Metro Power Distribution Cables with FRLS sheath',
      code: 'IS 7098 (Part 2) : 2011',
      title: 'XLPE Insulated Power Cables (3.3 kV to 33 kV)',
      confidence: 99.4,
      qco: 'Cables & Wires (Quality Control) Order, 2023 [Mandatory ISI Mark]',
      normative: ['IS 8130 : 2013 (Conductor Resistance)', 'IS 10810 P58 (Oxygen Index >= 29%)'],
      division: 'ETD (Electrotechnical)',
      mii: '60% Class-I Local',
      scenarioId: 'underground_cable_metro'
    },
    {
      label: '🏗️ Fe 500D TMT Rebar',
      query: 'High strength Fe 500D TMT steel bars & 53 Grade OPC cement for bridge deck',
      code: 'IS 1786 : 2008 & IS 269 : 2015',
      title: 'High Strength Deformed Steel Bars / OPC 53 Grade Cement',
      confidence: 98.8,
      qco: 'Steel & Cement (Quality Control) Orders, 2024 [Mandatory BIS License]',
      normative: ['IS 1608 P1 (Yield Stress >= 500 MPa)', 'IS 1599 (180° Cold Bend Test)'],
      division: 'CED (Civil Engineering)',
      mii: '65% Class-I Local',
      scenarioId: 'tmt_rebars_cement_nhai'
    },
    {
      label: '☀️ Solar PV Pump',
      query: '5 HP submersible solar water pumping system with MPPT controller (PM-KUSUM)',
      code: 'IS 17017 & IS 14286',
      title: 'Solar Photovoltaic Water Pumping Systems',
      confidence: 97.6,
      qco: 'Solar PV Systems & Components Order, 2023 [Mandatory CRS Registration]',
      normative: ['IS/IEC 61215 (Design Qualification)', 'IS 9225 (Submersible Pump Test)'],
      division: 'LITD / MED',
      mii: '70% Class-I Local',
      scenarioId: 'solar_pv_pumping_system'
    }
  ];

  const handleSelectPreset = (preset) => {
    setDemoQuery(preset.query);
    setIsResolving(true);
    setTimeout(() => {
      setResolvedResult(preset);
      setIsResolving(false);
    }, 350);
  };

  const handleRunCustomQuery = (e) => {
    e.preventDefault();
    if (!demoQuery.trim()) return;
    setIsResolving(true);
    setTimeout(() => {
      const matched = liveDemoPresets.find(p => demoQuery.toLowerCase().includes(p.label.slice(2).toLowerCase())) || liveDemoPresets[0];
      setResolvedResult({
        ...matched,
        title: `AI Resolved: ${demoQuery.slice(0, 48)}...`,
        confidence: 99.1
      });
      setIsResolving(false);
    }, 450);
  };

  const activeDivInfo = BIS_DIVISIONS.find((d) => d.code === activeDivisionTab) || BIS_DIVISIONS[0];

  const divisionOptions = BIS_DIVISIONS.map((d) => ({
    id: d.code,
    label: `${d.code} • ${d.shortName}`,
    badge: `${(d.standardsCount / 1000).toFixed(1)}k`
  }));

  // Interactive 4-Stage Editorial Service Rows (Inspired by Ref Image 1 & 3)
  const pipelineRows = [
    {
      num: '01',
      title: 'Natural-Language Scope & Tender BOQ Ingestion',
      subtitle: 'Multilingual Ingestion & Vector Extraction',
      description: 'Procurement authorities upload unstructured draft tender specifications, engineering bills of quantities (BOQs), or GeM Custom Bid descriptions. The OCR parser extracts parameters across English, Hindi, and regional scripts.',
      specs: ['PDF, DOCX & Raw Text', 'Multilingual OCR Ingestion', 'Clause Tokenizer'],
      icon: FileText,
      tag: 'INGESTION LAYER'
    },
    {
      num: '02',
      title: 'Neural Vector RAG Semantic Resolution',
      subtitle: '768-D Dense Embeddings across 22,410+ Standards',
      description: 'Resolves technical scopes to exact Bureau of Indian Standards (IS) codes, latest reaffirmations, and active amendments. Cross-checks gazetted Quality Control Orders (QCOs) to mandate ISI/CRS mark certification.',
      specs: ['768-D Dense Embeddings', 'Cosine Similarity >= 95%', 'Gazette QCO Cross-Check'],
      icon: Cpu,
      tag: 'NEURAL RAG ENGINE'
    },
    {
      num: '03',
      title: 'GFR 2017 Rule 144(xi) Anti-Bias Loophole Scanner',
      subtitle: 'Eliminating Single-Vendor Lock-in & Proprietary Traps',
      description: 'Scans tender drafts for restrictive commercial parameters that stifle fair competition or secretly bias awards toward single vendors. Enforces open, competitive, and audit-proof public procurement criteria.',
      specs: ['GFR Rule 144(xi) Audit', 'Proprietary Clause Blocker', 'Make-in-India (MII) Validation'],
      icon: Scale,
      tag: 'LEGAL AUDIT GUARD'
    },
    {
      num: '04',
      title: 'Cryptographic SHA-256 Passport & Model NIT Export',
      subtitle: 'Tamper-Proof Field Verification & 1-Click NIT Clauses',
      description: 'Synthesizes legally binding model Notice Inviting Tender (NIT) technical clauses and generates immutable SHA-256 sealed QR compliance passports for field warehouse inspection by RITES, DGS&D, or CAG auditors.',
      specs: ['SHA-256 Digital Seal', 'Mobile Scannable QR', '1-Click GeM NIT Export'],
      icon: QrCode,
      tag: 'CRYPTOGRAPHIC TRUST'
    }
  ];

  // FAQ Accordion Data (Inspired by Ref Image 4)
  const faqItems = [
    {
      q: 'How does the AI engine resolve the latest amended Indian Standard instead of outdated revisions?',
      a: 'The engine indexes the live BIS Gazette corpus with 768-dimensional dense vector embeddings. When a tender description is ingested, semantic RAG matching retrieves the most recent reaffirmation and active amendments (e.g. Water Tree Retardant XLPE insulation criteria under IS 7098 Part 2 Amd 3), preventing references to obsolete specifications.'
    },
    {
      q: 'How does the system prevent single-vendor bias under GFR 2017 Rule 144(xi)?',
      a: 'General Financial Rules (GFR) 2017 Rule 144(xi) prohibits procurement specifications that restrict competition to a specific make, brand, or proprietary tolerance. The engine audits draft tender clauses against standardized Indian Standards parameters, highlighting non-standard custom constraints that could trigger CAG audit objections.'
    },
    {
      q: 'How are statutory Quality Control Orders (QCOs) and mandatory BIS certification enforced?',
      a: 'Under Section 16 of the BIS Act 2016, gazetted QCOs mandate Scheme-I ISI Marks or Scheme-II CRS Registrations for critical commodities (e.g., steel rebars, power cables, solar PV equipment). The gateway automatically flags items under active QCO decrees, generating mandatory qualification clauses for tender documents.'
    },
    {
      q: 'What is a Cryptographic SHA-256 Digital Passport and how is it used in the field?',
      a: 'Once a tender specification is verified, the system computes a SHA-256 cryptographic hash of all approved standards, normative test protocols, and local content thresholds. This hash is embedded in a tamper-proof QR Passport that field warehouse inspectors (RITES/DGS&D) can scan on-site using smartphones to verify delivered goods against tender decrees.'
    }
  ];

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors duration-500 relative overflow-hidden font-sans">

=======
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-500 relative font-sans selection:bg-blue-600 selection:text-white">
      
>>>>>>> 6ac448708dd57bc42282f955d1760c2f2054674f
      {/* ========================================================================= */}
      {/* LIVING ATMOSPHERE: PURE ORGANIC FLUID AURORA (ZERO GRIDS / ZERO WIRES)    */}
      {/* ========================================================================= */}
<<<<<<< HEAD

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
=======
      <AppleStripeBackground />
>>>>>>> 6ac448708dd57bc42282f955d1760c2f2054674f

      {/* ========================================================================= */}
      {/* 1. HEADER & NAVIGATION BAR (FIXED FROSTED GLASS ISLAND)                   */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-2xl bg-white/85 dark:bg-[#0B0F19]/85 border-b border-slate-200/80 dark:border-white/[0.08] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-600 dark:to-blue-800 border border-white/30 flex items-center justify-center text-white shadow-md shadow-blue-600/25">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  BIS<span className="text-blue-600 dark:text-blue-400 font-serif italic">Engine</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold glass-pill-active text-slate-800 dark:text-slate-200 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  NIC-BIS Active
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
                National Procurement AI Compliance Gateway
              </p>
            </div>
          </div>

<<<<<<< HEAD
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
=======
          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#overview" className="hover:text-blue-600 dark:hover:text-white transition-colors">Overview</a>
            <a href="#demo" className="hover:text-blue-600 dark:hover:text-white transition-colors">Live Resolver</a>
            <a href="#pipeline" className="hover:text-blue-600 dark:hover:text-white transition-colors">Pipeline</a>
            <a href="#about" className="hover:text-blue-600 dark:hover:text-white transition-colors">Mandate</a>
            <a href="#divisions" className="hover:text-blue-600 dark:hover:text-white transition-colors">Corpus</a>
            <a href="#faq" className="hover:text-blue-600 dark:hover:text-white transition-colors">Knowledge Base</a>
          </nav>
>>>>>>> 6ac448708dd57bc42282f955d1760c2f2054674f

          {/* Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="flex items-center rounded-full glass-pill-container p-0.5 text-[11px] font-bold font-mono">
              <button
                onClick={() => setLang('en')}
<<<<<<< HEAD
                className={`px-1.5 py-0.5 rounded transition ${lang === 'en'
                  ? 'text-blue-700 dark:text-blue-400 font-bold bg-blue-100 dark:bg-blue-500/10 border border-blue-300 dark:border-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
=======
                className={`px-2.5 py-1 rounded-full transition-all ${lang === 'en' ? 'glass-pill-active text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
>>>>>>> 6ac448708dd57bc42282f955d1760c2f2054674f
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
<<<<<<< HEAD
                className={`px-1.5 py-0.5 rounded transition ${lang === 'hi'
                  ? 'text-blue-700 dark:text-blue-400 font-bold bg-blue-100 dark:bg-blue-500/10 border border-blue-300 dark:border-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
=======
                className={`px-2.5 py-1 rounded-full transition-all ${lang === 'hi' ? 'glass-pill-active text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
>>>>>>> 6ac448708dd57bc42282f955d1760c2f2054674f
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLang('gu')}
<<<<<<< HEAD
                className={`px-1.5 py-0.5 rounded transition ${lang === 'gu'
                  ? 'text-blue-700 dark:text-blue-400 font-bold bg-blue-100 dark:bg-blue-500/10 border border-blue-300 dark:border-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
=======
                className={`px-2.5 py-1 rounded-full transition-all ${lang === 'gu' ? 'glass-pill-active text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
>>>>>>> 6ac448708dd57bc42282f955d1760c2f2054674f
              >
                ગુજરાતી
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="w-9 h-9 rounded-full glass-btn-secondary flex items-center justify-center text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Portal Login */}
            <button
              onClick={() => navigate('/login')}
              className="glass-btn-primary shimmer-sweep inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <span>Portal Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SECTION 1: HERO SECTION (EDITORIAL VELTO & PRECISION ADVOCACY AESTHETIC) */}
      {/* ========================================================================= */}
      <section id="overview" className="relative z-10 pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Subtle Pill Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill-container text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            <span>Government-Grade Procurement Intelligence • SIH 2026</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[70px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.04]">
            Smarter Insights for <br />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300">
              Audit-Proof Tenders.
            </span>
          </h1>

          {/* Editorial Paragraph */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            An AI-powered recommendation gateway that automatically parses technical specifications, resolving exact Indian Standards (IS), mandatory Gazette QCOs, and anti-bias compliance under GFR 2017.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#demo"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('demo');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                  const input = el.querySelector('input');
                  if (input) setTimeout(() => input.focus(), 600);
                }
              }}
              className="glass-btn-primary shimmer-sweep inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-white font-extrabold text-sm shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Try Live Interactive Demo</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </a>

            <button
              onClick={() => {
                loadScenario('underground_cable_metro');
                navigate('/sandbox');
              }}
              className="glass-btn-secondary inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-slate-800 dark:text-white font-bold text-sm transition-all cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Launch Full Sandbox ↗</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HORIZONTAL MINIMALIST METRIC STRIP (HARMONIZED COLOR FAMILY)              */}
        {/* ========================================================================= */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl glass-card border border-white/60 dark:border-white/10 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200/80 dark:divide-white/10 gap-6 md:gap-0">
            {/* Stat 1 */}
            <div className="px-4 text-center">
              <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500 block mb-1">
                STANDARDS CORPUS
              </span>
              <p className="text-3xl sm:text-4xl lg:text-[40px] font-black font-mono text-slate-900 dark:text-slate-100 tabular-nums tracking-tight">
                <AnimatedNumber target={22410} suffix="+" duration={2000} />
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Active Indian Standards</p>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 block tracking-wider">REF: IS-CORPUS-2026</span>
            </div>

            {/* Stat 2 */}
            <div className="px-4 text-center pt-4 md:pt-0">
              <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500 block mb-1">
                STATUTORY DECREES
              </span>
              <p className="text-3xl sm:text-4xl lg:text-[40px] font-black font-mono text-slate-900 dark:text-slate-100 tabular-nums tracking-tight">
                <AnimatedNumber target={142} suffix="+" duration={1800} />
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Mandatory Gazette QCOs</p>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 block tracking-wider">BIS ACT SEC. 16</span>
            </div>

            {/* Stat 3 */}
            <div className="px-4 text-center pt-4 md:pt-0">
              <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500 block mb-1">
                LEGAL COMPLIANCE
              </span>
              <p className="text-3xl sm:text-4xl lg:text-[40px] font-black font-mono text-slate-900 dark:text-slate-100 tabular-nums tracking-tight">
                <AnimatedNumber target={100} suffix="%" duration={1600} />
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Statutory GFR 2017 Rules</p>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 block tracking-wider">RULE 144(XI) COMPLIANT</span>
            </div>

            {/* Stat 4 */}
            <div className="px-4 text-center pt-4 md:pt-0">
              <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500 block mb-1">
                FAIR BIDDING
              </span>
              <p className="text-3xl sm:text-4xl lg:text-[40px] font-black font-mono text-slate-900 dark:text-slate-100 tabular-nums tracking-tight">
                <AnimatedNumber target={0} suffix="%" duration={1200} />
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Single-Vendor Bid Bias</p>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 block tracking-wider">PROPRIETARY LOCK-IN: NIL</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: INTERACTIVE LIVE SANDBOX TERMINAL (VELTO-TIER MINIMALIST DEMO)*/}
      {/* ========================================================================= */}
      <section id="demo" className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-6 sm:p-10 rounded-3xl glass-card border border-white/70 dark:border-white/10 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold glass-pill-active text-blue-600 dark:text-blue-400 font-mono">
                  <Cpu className="w-3.5 h-3.5" />
                  Live AI Engine Resolution
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Select a live procurement case:
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
                Semantic Standards Matching in Action
              </h2>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              {liveDemoPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    demoQuery === preset.query
                      ? 'glass-btn-primary text-white shadow-sm'
                      : 'glass-btn-secondary text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleRunCustomQuery} className="relative mb-6">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={demoQuery}
                onChange={(e) => setDemoQuery(e.target.value)}
                placeholder="Enter product description, technical BOQ scope, or tender parameters..."
                className="w-full pl-12 pr-32 py-3.5 rounded-2xl glass-pill-container text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 rounded-xl glass-btn-primary text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>Resolve</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </form>

          {/* Live Resolution Output Panel */}
          <div className="p-6 rounded-2xl bg-white/60 dark:bg-[#070B14]/80 border border-slate-200/90 dark:border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Result Details */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600/10 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300 font-mono font-bold text-xs">
                  {resolvedResult.division}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {isResolving ? 'Resolving Vector Similarity...' : `${resolvedResult.confidence}% Vector Match`}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-600/10 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300 font-medium text-xs font-mono">
                  {resolvedResult.mii}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white font-mono flex items-center gap-2">
                  <span>{resolvedResult.code}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-sans font-semibold">
                    Current Published Edition
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal mt-0.5">
                  {resolvedResult.title}
                </p>
              </div>

              {/* Gazette QCO Order Badge */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Statutory Gazette Mandate: </span>
                  <span>{resolvedResult.qco}</span>
                </div>
              </div>

              {/* Normative References */}
              <div className="text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-700 dark:text-slate-300">Allied Normative Standards: </span>
                <span>{resolvedResult.normative.join(' • ')}</span>
              </div>
            </div>

            {/* Right Action Trigger */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl glass-pill-container border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Ready for Full Tender Audit?
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Generate model clauses, test matrix, & SHA-256 passport.
                </p>
              </div>
              <button
                onClick={() => {
                  loadScenario(resolvedResult.scenarioId);
                  navigate('/dashboard');
                }}
                className="w-full py-2.5 px-4 rounded-full glass-btn-primary text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <span>Open Full Audit Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: THE INSTITUTIONAL MANDATE (EDITORIAL SPREAD Ref Image 1 & 2)  */}
      {/* ========================================================================= */}
      <section id="about" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Editorial Intro */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 block">
              THE INSTITUTIONAL MANDATE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Solving Systemic Vulnerabilities in Public Procurement.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Government departments, Public Sector Enterprises (PSEs), and procurement portals procure billions in products annually. Identifying the exact standard is hindered by over 22,410+ published codes, overlapping scopes, frequent amendments, and unlinked normative test requirements.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/input')}
                className="glass-btn-secondary inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
              >
                <span>Learn More About GFR Guidelines</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: 3 Strategic Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Eliminating Single-Vendor Bias
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Enforcing GFR 2017 Rule 144(xi) to block custom restrictive specifications that favor specific commercial vendors.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                22,410+ Standards Semantic Discovery
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Semantically maps unstructured bills of materials to exact Bureau of Indian Standards (IS) codes and current amendments.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Non-Repudiation Audit Passports
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Generates SHA-256 digital seals and scannable QR passports for field warehouse inspection by RITES and CAG auditors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: NUMBERED EDITORIAL PIPELINE (Ref Image 1 & 3 Accordion Rows)   */}
      {/* ========================================================================= */}
      <section id="pipeline" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 block mb-2">
              END-TO-END PIPELINE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Comprehensive Procurement Intelligence
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
            Click any verification layer to inspect how the engine transforms unstructured tender descriptions into legally binding procurement records.
          </p>
        </div>

        {/* Numbered Rows (Inspired by Ref Image 1 "Our Service" & Ref Image 3) */}
        <div className="space-y-4">
          {pipelineRows.map((row, idx) => {
            const Icon = row.icon;
            const isExpanded = expandedPipelineRow === idx;

            return (
              <div
                key={idx}
                onClick={() => setExpandedPipelineRow(isExpanded ? null : idx)}
                className={`p-6 sm:p-8 rounded-3xl glass-card transition-all cursor-pointer ${
                  isExpanded
                    ? 'border-blue-500/50 dark:border-blue-400/50 shadow-xl'
                    : 'hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-5">
                    <span className="text-2xl sm:text-3xl font-mono font-black text-blue-600 dark:text-blue-400 opacity-90">
                      {row.num}.
                    </span>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                          {row.title}
                        </h3>
                        <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full glass-pill-active text-slate-700 dark:text-slate-300">
                          {row.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {row.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <div className="w-8 h-8 rounded-full glass-btn-secondary flex items-center justify-center text-slate-700 dark:text-slate-300">
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
                    <div className="lg:col-span-8">
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {row.description}
                      </p>
                    </div>
                    <div className="lg:col-span-4 flex flex-wrap gap-2 items-center">
                      {row.specs.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40"
                        >
                          • {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: UNIVERSAL STANDARDS CORPUS (Ref Image 2 Segmented Control)     */}
      {/* ========================================================================= */}
      <section id="divisions" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="p-8 sm:p-12 rounded-3xl glass-card">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-2 block">
              UNIVERSAL STANDARDS CORPUS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              6 Technical Divisions Synchronized
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 font-normal">
              The engine indexes standards across all major engineering and scientific divisions of the Bureau of Indian Standards.
            </p>
          </div>

<<<<<<< HEAD
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
=======
          {/* Division Tabs (Using GlassSegmentedControl matching Reference Image 2) */}
          <div className="mb-8 overflow-x-auto pb-2 no-scrollbar">
            <GlassSegmentedControl
              options={divisionOptions}
              value={activeDivisionTab}
              onChange={(id) => setActiveDivisionTab(id)}
              size="md"
            />
>>>>>>> 6ac448708dd57bc42282f955d1760c2f2054674f
          </div>

          {/* Active Division Panel */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white/60 dark:bg-[#070B14]/70 border border-slate-200/90 dark:border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Division Name</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white mt-1">{activeDivInfo.fullName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">Division Code: {activeDivInfo.code}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Corpus Telemetry</p>
              <p className="text-base font-extrabold font-mono text-blue-600 dark:text-blue-400 mt-1">
                {activeDivInfo.standardsCount.toLocaleString()} Active Standards
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                {activeDivInfo.activeQCOs} Statutory Quality Control Orders
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Key Product Scope</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                {activeDivInfo.keyProducts}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: FAQ ACCORDION (Inspired by Ref Image 4 "Frequently Asked")     */}
      {/* ========================================================================= */}
      <section id="faq" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Title */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 block">
              STATUTORY KNOWLEDGE BASE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Understand the legal framework, semantic vector indexing, GFR 2017 rules, and cryptographic verification underlying the platform.
            </p>
          </div>

          {/* Right Accordion List */}
          <div className="lg:col-span-8 space-y-4">
            {faqItems.map((item, fIdx) => {
              const isOpen = openFaqIndex === fIdx;

              return (
                <div
                  key={fIdx}
                  onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                  className="p-6 rounded-3xl glass-card transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {item.q}
                    </h3>
                    <div className="w-7 h-7 rounded-full glass-btn-secondary flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in duration-200">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: CLOSING CALL-TO-ACTION SPREAD (Ref Image 4 Style)             */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="relative rounded-3xl p-10 sm:p-16 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 dark:from-[#0B1428] dark:via-[#0E1B38] dark:to-[#070B14] text-white border border-white/20 shadow-2xl backdrop-blur-2xl">
          {/* Subtle Ambient Light Wash */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.3),transparent_70%)] rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-blue-400 mb-3 block">
              GOVERNMENT PORTAL ACCESS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
              Ready to modernize national procurement?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed font-normal">
              Experience the live prototype on the web or test the companion mobile app on your smartphone with instant OTP authentication.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="glass-btn-primary shimmer-sweep inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-extrabold text-xs shadow-xl transition-all cursor-pointer"
              >
                <span>Start Procurement Audit</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => {
                  loadScenario('underground_cable_metro');
                  navigate('/sandbox');
                }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 hover:border-white/40 backdrop-blur-md transition-all cursor-pointer shadow-sm"
              >
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Launch Interactive Sandbox ↗</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: INSTITUTIONAL GOVERNMENT FOOTER                                */}
      {/* ========================================================================= */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-white/[0.08] bg-white/85 dark:bg-[#0B0F19]/85 pt-14 pb-10 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<<<<<<< HEAD
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-200 dark:border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-sm mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>BISEngine</span>
=======
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Column 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-sm">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  BIS<span className="text-blue-600 dark:text-blue-400 font-serif italic">Engine</span>
                </span>
>>>>>>> 6ac448708dd57bc42282f955d1760c2f2054674f
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
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
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 font-normal">
                <li>BIS Act 2016 (Section 16)</li>
                <li>General Financial Rules (GFR) 2017</li>
                <li>Public Procurement Order (PPO) 2017</li>
                <li>GeM Quality Verification Guidelines</li>
              </ul>
            </div>

            {/* Column 3: Platform Features */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Core Capabilities</p>
              <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 font-normal">
                <li>Dense Vector Retrieval (768-D)</li>
                <li>Normative Reference Graph Explorer</li>
                <li>Model NIT Clause Generator</li>
                <li>SHA-256 Sealed QR Passports</li>
              </ul>
            </div>

            {/* Column 4: SIH 2026 Initiative */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Smart India Hackathon</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                Developed for the Ministry of Consumer Affairs, Food & Public Distribution by Team Chronos.
              </p>
              <p className="text-[11px] font-mono text-slate-400">Gov-Tech Prototype v1.0</p>
            </div>
          </div>

<<<<<<< HEAD
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
            <p>© BISEngine. Government of India.</p>
            <p className="mt-2 sm:mt-0 font-mono">Developed for Public Procurement Traceability & Quality Assurance</p>
=======
          {/* Bottom Copyright Strip */}
          <div className="pt-8 border-t border-slate-200 dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p>© 2026 BIS Standards Engine. Smart India Hackathon 2026. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">National Security Protocol</a>
            </div>
>>>>>>> 6ac448708dd57bc42282f955d1760c2f2054674f
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingView;
