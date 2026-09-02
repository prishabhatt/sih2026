import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  Database,
  AlertTriangle,
  Terminal,
  Sun,
  Moon,
  FileText,
  Scale,
  Cpu,
  QrCode,
  Send,
  Search
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
    return () => { if (animationFrameId) cancelAnimationFrame(animationFrameId); };
  }, [target, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export function LandingView() {
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();
  const { lang, setLang, loadScenario } = useProcurement();

  const [activeDivisionTab, setActiveDivisionTab] = useState('ETD');
  const [expandedPipelineRow, setExpandedPipelineRow] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

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
    { label: '⚡ 11kV Metro Cable', query: '11kV HT XLPE Metro Power Distribution Cables with FRLS sheath', code: 'IS 7098 (Part 2) : 2011', title: 'XLPE Insulated Power Cables (3.3 kV to 33 kV)', confidence: 99.4, qco: 'Cables & Wires (Quality Control) Order, 2023 [Mandatory ISI Mark]', normative: ['IS 8130 : 2013 (Conductor Resistance)', 'IS 10810 P58 (Oxygen Index >= 29%)'], division: 'ETD (Electrotechnical)', mii: '60% Class-I Local', scenarioId: 'underground_cable_metro' },
    { label: '🏗️ Fe 500D TMT Rebar', query: 'High strength Fe 500D TMT steel bars & 53 Grade OPC cement for bridge deck', code: 'IS 1786 : 2008 & IS 269 : 2015', title: 'High Strength Deformed Steel Bars / OPC 53 Grade Cement', confidence: 98.8, qco: 'Steel & Cement (Quality Control) Orders, 2024 [Mandatory BIS License]', normative: ['IS 1608 P1 (Yield Stress >= 500 MPa)', 'IS 1599 (180° Cold Bend Test)'], division: 'CED (Civil Engineering)', mii: '65% Class-I Local', scenarioId: 'tmt_rebars_cement_nhai' },
    { label: '☀️ Solar PV Pump', query: '5 HP submersible solar water pumping system with MPPT controller (PM-KUSUM)', code: 'IS 17017 & IS 14286', title: 'Solar Photovoltaic Water Pumping Systems', confidence: 97.6, qco: 'Solar PV Systems & Components Order, 2023 [Mandatory CRS Registration]', normative: ['IS/IEC 61215 (Design Qualification)', 'IS 9225 (Submersible Pump Test)'], division: 'LITD / MED', mii: '70% Class-I Local', scenarioId: 'solar_pv_pumping_system' }
  ];

  const handleSelectPreset = (preset) => {
    setDemoQuery(preset.query);
    setIsResolving(true);
    setTimeout(() => { setResolvedResult(preset); setIsResolving(false); }, 350);
  };

  const handleRunCustomQuery = (e) => {
    e.preventDefault();
    if (!demoQuery.trim()) return;
    setIsResolving(true);
    setTimeout(() => {
      const matched = liveDemoPresets.find(p => demoQuery.toLowerCase().includes(p.label.slice(2).toLowerCase())) || liveDemoPresets[0];
      setResolvedResult({ ...matched, title: `AI Resolved: ${demoQuery.slice(0, 48)}...`, confidence: 99.1 });
      setIsResolving(false);
    }, 450);
  };

  const activeDivInfo = BIS_DIVISIONS.find((d) => d.code === activeDivisionTab) || BIS_DIVISIONS[0];
  const divisionOptions = BIS_DIVISIONS.map((d) => ({ id: d.code, label: `${d.code} • ${d.shortName}`, badge: `${(d.standardsCount / 1000).toFixed(1)}k` }));

  const pipelineRows = [
    { num: '01', title: 'Natural-Language Scope & Tender BOQ Ingestion', subtitle: 'Multilingual Ingestion & Vector Extraction', description: 'Procurement authorities upload unstructured draft tender specifications, engineering bills of quantities (BOQs), or GeM Custom Bid descriptions. The OCR parser extracts parameters across English, Hindi, and regional scripts.', specs: ['PDF, DOCX & Raw Text', 'Multilingual OCR Ingestion', 'Clause Tokenizer'], icon: FileText, tag: 'INGESTION LAYER' },
    { num: '02', title: 'Neural Vector RAG Semantic Resolution', subtitle: '768-D Dense Embeddings across 22,410+ Standards', description: 'Resolves technical scopes to exact Bureau of Indian Standards (IS) codes, latest reaffirmations, and active amendments. Cross-checks gazetted Quality Control Orders (QCOs) to mandate ISI/CRS mark certification.', specs: ['768-D Dense Embeddings', 'Cosine Similarity >= 95%', 'Gazette QCO Cross-Check'], icon: Cpu, tag: 'NEURAL RAG ENGINE' },
    { num: '03', title: 'GFR 2017 Rule 144(xi) Anti-Bias Loophole Scanner', subtitle: 'Eliminating Single-Vendor Lock-in & Proprietary Traps', description: 'Scans tender drafts for restrictive commercial parameters that stifle fair competition or secretly bias awards toward single vendors. Enforces open, competitive, and audit-proof public procurement criteria.', specs: ['GFR Rule 144(xi) Audit', 'Proprietary Clause Blocker', 'Make-in-India (MII) Validation'], icon: Scale, tag: 'LEGAL AUDIT GUARD' },
    { num: '04', title: 'Cryptographic SHA-256 Passport & Model NIT Export', subtitle: 'Tamper-Proof Field Verification & 1-Click NIT Clauses', description: 'Synthesizes legally binding model Notice Inviting Tender (NIT) technical clauses and generates immutable SHA-256 sealed QR compliance passports for field warehouse inspection by RITES, DGS&D, or CAG auditors.', specs: ['SHA-256 Digital Seal', 'Mobile Scannable QR', '1-Click GeM NIT Export'], icon: QrCode, tag: 'CRYPTOGRAPHIC TRUST' }
  ];

  const faqItems = [
    { q: 'How does the AI engine resolve the latest amended Indian Standard instead of outdated revisions?', a: 'The engine indexes the live BIS Gazette corpus with 768-dimensional dense vector embeddings. When a tender description is ingested, semantic RAG matching retrieves the most recent reaffirmation and active amendments (e.g. Water Tree Retardant XLPE insulation criteria under IS 7098 Part 2 Amd 3), preventing references to obsolete specifications.' },
    { q: 'How does the system prevent single-vendor bias under GFR 2017 Rule 144(xi)?', a: 'General Financial Rules (GFR) 2017 Rule 144(xi) prohibits procurement specifications that restrict competition to a specific make, brand, or proprietary tolerance. The engine audits draft tender clauses against standardized Indian Standards parameters, highlighting non-standard custom constraints that could trigger CAG audit objections.' },
    { q: 'How are statutory Quality Control Orders (QCOs) and mandatory BIS certification enforced?', a: 'Under Section 16 of the BIS Act 2016, gazetted QCOs mandate Scheme-I ISI Marks or Scheme-II CRS Registrations for critical commodities (e.g., steel rebars, power cables, solar PV equipment). The gateway automatically flags items under active QCO decrees, generating mandatory qualification clauses for tender documents.' },
    { q: 'What is a Cryptographic SHA-256 Digital Passport and how is it used in the field?', a: 'Once a tender specification is verified, the system computes a SHA-256 cryptographic hash of all approved standards, normative test protocols, and local content thresholds. This hash is embedded in a tamper-proof QR Passport that field warehouse inspectors (RITES/DGS&D) can scan on-site using smartphones to verify delivered goods against tender decrees.' }
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-500 relative font-sans selection:bg-blue-600 selection:text-white">
      <AppleStripeBackground />
      <header className="fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-2xl bg-white/85 dark:bg-[#0B0F19]/85 border-b border-slate-200/80 dark:border-white/[0.08] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
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
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> NIC-BIS Active
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">National Procurement AI Compliance Gateway</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#overview" className="hover:text-blue-600 dark:hover:text-white transition-colors">Overview</a>
            <a href="#demo" className="hover:text-blue-600 dark:hover:text-white transition-colors">Live Resolver</a>
            <a href="#pipeline" className="hover:text-blue-600 dark:hover:text-white transition-colors">Pipeline</a>
            <a href="#about" className="hover:text-blue-600 dark:hover:text-white transition-colors">Mandate</a>
            <a href="#divisions" className="hover:text-blue-600 dark:hover:text-white transition-colors">Corpus</a>
            <a href="#faq" className="hover:text-blue-600 dark:hover:text-white transition-colors">Knowledge Base</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center rounded-full glass-pill-container p-0.5 text-[11px] font-bold font-mono">
              <button onClick={() => setLang('en')} className={`px-2.5 py-1 rounded-full transition-all ${lang === 'en' ? 'glass-pill-active text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>EN</button>
              <button onClick={() => setLang('hi')} className={`px-2.5 py-1 rounded-full transition-all ${lang === 'hi' ? 'glass-pill-active text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>हिन्दी</button>
              <button onClick={() => setLang('gu')} className={`px-2.5 py-1 rounded-full transition-all ${lang === 'gu' ? 'glass-pill-active text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>ગુજરાતી</button>
            </div>
            <button onClick={toggleTheme} className="w-9 h-9 rounded-full glass-btn-secondary flex items-center justify-center text-slate-700 dark:text-slate-300 transition-all cursor-pointer">
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button onClick={() => navigate('/login')} className="glass-btn-primary shimmer-sweep inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white font-bold text-xs shadow-md transition-all cursor-pointer">
              <span>Portal Login</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>
      </header>

      <section id="overview" className="relative z-10 pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill-container text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            <span>Government-Grade Procurement Intelligence • SIH 2026</span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-[70px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.04]">
            Smarter Insights for <br />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300">Audit-Proof Tenders.</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            An AI-powered recommendation gateway that automatically parses technical specifications, resolving exact Indian Standards (IS), mandatory Gazette QCOs, and anti-bias compliance under GFR 2017.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} className="glass-btn-primary shimmer-sweep inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-white font-extrabold text-sm shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer">
              <span>Try Live Interactive Demo</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
            <button onClick={() => { loadScenario('underground_cable_metro'); navigate('/sandbox'); }} className="glass-btn-secondary inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-slate-800 dark:text-white font-bold text-sm transition-all cursor-pointer">
              <Terminal className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Launch Full Sandbox ↗</span>
            </button>
          </div>
        </div>
        <div className="mt-16 p-6 sm:p-8 rounded-3xl glass-card border border-white/60 dark:border-white/10 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200/80 dark:divide-white/10 gap-6 md:gap-0">
            <div className="px-4 text-center"><span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500 block mb-1">STANDARDS CORPUS</span><p className="text-3xl sm:text-4xl lg:text-[40px] font-black font-mono text-slate-900 dark:text-slate-100 tabular-nums tracking-tight"><AnimatedNumber target={22410} suffix="+" /></p><p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Active Indian Standards</p></div>
            <div className="px-4 text-center pt-4 md:pt-0"><span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500 block mb-1">STATUTORY DECREES</span><p className="text-3xl sm:text-4xl lg:text-[40px] font-black font-mono text-slate-900 dark:text-slate-100 tabular-nums tracking-tight"><AnimatedNumber target={142} suffix="+" /></p><p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Mandatory Gazette QCOs</p></div>
            <div className="px-4 text-center pt-4 md:pt-0"><span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500 block mb-1">LEGAL COMPLIANCE</span><p className="text-3xl sm:text-4xl lg:text-[40px] font-black font-mono text-slate-900 dark:text-slate-100 tabular-nums tracking-tight"><AnimatedNumber target={100} suffix="%" /></p><p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Statutory GFR 2017 Rules</p></div>
            <div className="px-4 text-center pt-4 md:pt-0"><span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-slate-400 dark:text-slate-500 block mb-1">FAIR BIDDING</span><p className="text-3xl sm:text-4xl lg:text-[40px] font-black font-mono text-slate-900 dark:text-slate-100 tabular-nums tracking-tight"><AnimatedNumber target={0} suffix="%" /></p><p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Single-Vendor Bid Bias</p></div>
          </div>
        </div>
      </section>

      <section id="demo" className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-6 sm:p-10 rounded-3xl glass-card border border-white/70 dark:border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold glass-pill-active text-blue-600 dark:text-blue-400 font-mono"><Cpu className="w-3.5 h-3.5" /> Live AI Engine Resolution</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Select a live procurement case:</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">Semantic Standards Matching in Action</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {liveDemoPresets.map((preset, idx) => (
                <button key={idx} onClick={() => handleSelectPreset(preset)} className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${demoQuery === preset.query ? 'glass-btn-primary text-white shadow-sm' : 'glass-btn-secondary text-slate-700 dark:text-slate-300'}`}>{preset.label}</button>
              ))}
            </div>
          </div>
          <form onSubmit={handleRunCustomQuery} className="relative mb-6">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input type="text" value={demoQuery} onChange={(e) => setDemoQuery(e.target.value)} placeholder="Enter product description..." className="w-full pl-12 pr-32 py-3.5 rounded-2xl glass-pill-container text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <button type="submit" className="absolute right-2 px-4 py-2 rounded-xl glass-btn-primary text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                <span>Resolve</span>
                <Send className="w-3 h-3 text-amber-400" />
              </button>
            </div>
          </form>
          <div className="p-6 rounded-2xl bg-white/60 dark:bg-[#070B14]/80 border border-slate-200/90 dark:border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600/10 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300 font-mono font-bold text-xs">{resolvedResult.division}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300 font-bold text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />{isResolving ? 'Resolving...' : `${resolvedResult.confidence}% Vector Match`}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-mono">{resolvedResult.code}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal">{resolvedResult.title}</p>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div><span className="font-bold">Statutory Gazette Mandate: </span>{resolvedResult.qco}</div>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl glass-pill-container border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center"><Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" /></div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Ready for Full Tender Audit?</p>
              <button onClick={() => { loadScenario(resolvedResult.scenarioId); navigate('/dashboard'); }} className="w-full py-2.5 px-4 rounded-full glass-btn-primary text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer">
                <span>Open Full Audit Matrix</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 block">THE INSTITUTIONAL MANDATE</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Solving Systemic Vulnerabilities in Public Procurement.</h2>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-400"><Scale className="w-5 h-5" /></div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Eliminating Single-Vendor Bias</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Enforcing GFR 2017 Rule 144(xi) to block restrictive specs.</p>
            </div>
            <div className="p-6 rounded-3xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><Database className="w-5 h-5" /></div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">22,410+ Standards Discovery</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Maps bills of materials to exact IS codes and amendments.</p>
            </div>
            <div className="p-6 rounded-3xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><ShieldCheck className="w-5 h-5" /></div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Audit Passports</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Generates SHA-256 seals and QR passports for RITES/CAG.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pipeline" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 block mb-2">END-TO-END PIPELINE</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Comprehensive Intelligence</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">Click any verification layer to inspect how the engine transforms tender descriptions into procurement records.</p>
        </div>
        <div className="space-y-4">
          {pipelineRows.map((row, idx) => {
            const isExpanded = expandedPipelineRow === idx;
            return (
              <div key={idx} onClick={() => setExpandedPipelineRow(isExpanded ? null : idx)} className={`p-6 sm:p-8 rounded-3xl glass-card transition-all cursor-pointer ${isExpanded ? 'border-blue-500/50 shadow-xl' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-5">
                    <span className="text-2xl font-mono font-black text-blue-600 dark:text-blue-400">{row.num}.</span>
                    <div>
                      <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">{row.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{row.subtitle}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="divisions" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="p-8 sm:p-12 rounded-3xl glass-card">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-2 block">UNIVERSAL STANDARDS CORPUS</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">6 Technical Divisions Synchronized</h2>
          </div>
          <div className="mb-8 overflow-x-auto pb-2 no-scrollbar">
            <GlassSegmentedControl options={divisionOptions} value={activeDivisionTab} onChange={(id) => setActiveDivisionTab(id)} size="md" />
          </div>
          <div className="p-6 sm:p-8 rounded-2xl bg-white/60 dark:bg-[#070B14]/70 border border-slate-200/90 dark:border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Division</p><p className="text-base font-extrabold text-slate-900 dark:text-white mt-1">{activeDivInfo.fullName}</p></div>
            <div><p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Telemetry</p><p className="text-base font-extrabold font-mono text-blue-600 dark:text-blue-400 mt-1">{activeDivInfo.standardsCount.toLocaleString()} Active Standards</p></div>
            <div><p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Scope</p><p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{activeDivInfo.keyProducts}</p></div>
          </div>
        </div>
      </section>

      <section id="faq" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 block">STATUTORY KNOWLEDGE BASE</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">FAQ.</h2>
          </div>
          <div className="lg:col-span-8 space-y-4">
            {faqItems.map((item, fIdx) => (
              <div key={fIdx} onClick={() => setOpenFaqIndex(openFaqIndex === fIdx ? null : fIdx)} className="p-6 rounded-3xl glass-card transition-all cursor-pointer">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{item.q}</h3>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openFaqIndex === fIdx ? 'rotate-180' : ''}`} />
                </div>
                {openFaqIndex === fIdx && <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-white/10 text-xs sm:text-sm text-slate-600 dark:text-slate-300">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/[0.08]">
        <div className="relative rounded-3xl p-10 sm:p-16 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 dark:from-[#0B1428] dark:via-[#0E1B38] dark:to-[#070B14] text-white border border-white/20 shadow-2xl backdrop-blur-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.3),transparent_70%)] rounded-full blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">Ready to modernize national procurement?</h2>
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={() => navigate('/login')} className="glass-btn-primary shimmer-sweep inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-extrabold text-xs cursor-pointer"><span>Start Procurement Audit</span></button>
              <button onClick={() => { loadScenario('underground_cable_metro'); navigate('/sandbox'); }} className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/10 text-white font-bold text-xs cursor-pointer"><Terminal className="w-4 h-4 text-amber-400" /><span>Launch Sandbox ↗</span></button>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-200 dark:border-white/[0.08] bg-white/85 dark:bg-[#0B0F19]/85 pt-14 pb-10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white"><ShieldCheck className="w-4 h-4" /></div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">BIS<span className="text-blue-600 dark:text-blue-400 font-serif italic">Engine</span></span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">National AI-Powered Recommendation Engine for Bureau of Indian Standards Compliance.</p>
              <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" /> <span>All Systems Operational</span>
              </div>
            </div>
            <div className="space-y-2"><p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Statutory Framework</p><ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 font-normal"><li>BIS Act 2016</li><li>GFR 2017</li><li>PPO 2017</li></ul></div>
            <div className="space-y-2"><p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Core Capabilities</p><ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 font-normal"><li>Dense Vector Retrieval</li><li>Model NIT Generation</li></ul></div>
            <div className="space-y-2"><p className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Smart India Hackathon</p><p className="text-xs text-slate-500 dark:text-slate-400">Team Chronos • Gov-Tech Prototype v1.0</p></div>
          </div>
          <div className="pt-8 border-t border-slate-200 dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p>© 2026 BIS Standards Engine. Smart India Hackathon 2026. All rights reserved.</p>
            <div className="flex items-center gap-6"><span className="cursor-pointer">Privacy</span><span className="cursor-pointer">Terms</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingView;
