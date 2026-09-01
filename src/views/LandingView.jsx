import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  FileCheck, 
  Database, 
  CheckCircle2, 
  Award, 
  Globe, 
  GitFork, 
  Lock, 
  ChevronRight,
  HardHat,
  Cpu,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { BIS_DIVISIONS } from '../data/divisionsData';

export function LandingView() {
  const navigate = useNavigate();
  const { t, lang, setLang, setIsSampleDrawerOpen, loadScenario } = useProcurement();

  const handleQuickDemoLaunch = (scenarioId) => {
    loadScenario(scenarioId);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 1. Government Banner & Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#090D16]/95 backdrop-blur-md border-b border-slate-800/80">
        {/* Top Government Notice Bar */}
        <div className="bg-[#0B1120] text-slate-400 text-[11px] px-4 sm:px-8 py-1.5 flex items-center justify-between border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-200 uppercase tracking-wider text-[10px]">
              Government of India
            </span>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">
              Ministry of Consumer Affairs, Food & Public Distribution • National Procurement AI Gateway
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-slate-400 font-mono text-[10px]">
              GFR 2017 Rule 144(xi) Verified
            </span>
            <span className="text-slate-700 hidden md:inline">|</span>
            {/* Multilingual Switcher */}
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <Globe className="w-3 h-3 text-blue-400" />
              <button
                onClick={() => setLang('en')}
                className={`px-1.5 py-0.5 rounded transition ${
                  lang === 'en'
                    ? 'text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <span className="text-slate-700">/</span>
              <button
                onClick={() => setLang('hi')}
                className={`px-1.5 py-0.5 rounded transition ${
                  lang === 'hi'
                    ? 'text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                हिन्दी
              </button>
              <span className="text-slate-700">/</span>
              <button
                onClick={() => setLang('gu')}
                className={`px-1.5 py-0.5 rounded transition ${
                  lang === 'gu'
                    ? 'text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ગુજરાતી
              </button>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 group-hover:border-slate-600 transition">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base tracking-tight text-slate-100">
                    BIS<span className="text-blue-500">Engine</span>
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
                    Gov-Tech
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-normal hidden sm:block">
                  National Procurement AI Compliance Gateway
                </p>
              </div>
            </Link>

            {/* Quick Navigation Anchor Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
              <a href="#about" className="hover:text-white transition">About</a>
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#statutory-standards" className="hover:text-white transition">Statutory Standards</a>
            </nav>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSampleDrawerOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 border border-slate-800 text-amber-400 text-xs font-medium transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.nav.loadSample}</span>
              </button>

              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition"
              >
                <span>Portal Login / SSO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] border border-slate-800 text-slate-300 text-xs font-medium shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>National Procurement AI Compliance Gateway • Smart India Hackathon 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            AI-Powered Indian Standards Recommendation Engine
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Eliminate technical loopholes and substandard material delivery in Government Tenders. Automatically map draft specifications and BOQs to 22,000+ Bureau of Indian Standards (BIS) and statutory Quality Control Orders (QCOs) under GFR 2017 to eliminate normative reference loopholes.
          </p>

          {/* Dual CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition"
            >
              <span>Access Procurement Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#statutory-standards"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-slate-200 border border-slate-800 text-sm font-medium flex items-center justify-center gap-2 transition"
            >
              <Database className="w-4 h-4 text-blue-400" />
              <span>Explore Standards Corpus</span>
            </a>

            <button
              onClick={() => setIsSampleDrawerOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#131C2E] hover:bg-slate-800 text-amber-400 border border-slate-800 text-sm font-medium flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.landing.ctaSample}</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-400">
            <span className="px-3 py-1 rounded-md bg-[#0F172A] border border-slate-800 font-mono text-[11px] text-slate-300">
              ✓ GFR 2017 Rule 144(xi) Aligned
            </span>
            <span className="px-3 py-1 rounded-md bg-[#0F172A] border border-slate-800 font-mono text-[11px] text-slate-300">
              ✓ BIS Act 2016 Section 16 QCO Enforcement
            </span>
            <span className="px-3 py-1 rounded-md bg-[#0F172A] border border-slate-800 font-mono text-[11px] text-slate-300">
              ✓ GeM 4.0 Model NIT Clause Generator
            </span>
          </div>
        </div>
      </section>

      {/* 3. Live Metrics Counter Strip */}
      <section className="py-10 bg-[#0B1120] border-b border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100">22,410+</p>
            <p className="text-xs text-slate-400 font-medium">Active Indian Standards Synced</p>
          </div>

          <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">142+</p>
            <p className="text-xs text-slate-400 font-medium">Statutory Quality Control Orders (QCOs)</p>
          </div>

          <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-400">100%</p>
            <p className="text-xs text-slate-400 font-medium">Normative Raw Material Test Coverage</p>
          </div>

          <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">0%</p>
            <p className="text-xs text-slate-400 font-medium">Quality Substitution & Bid Loopholes</p>
          </div>
        </div>
      </section>

      {/* 4. Context & Problem-to-Solution Grid (Features) */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded">
              Context & Core Solution Grid
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              Bridging the Critical Gap in Indian Public Procurement
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Why generic tender schedules fail and how our AI-driven normative reference engine guarantees statutory and physical compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Feature 1: Semantic RAG Search */}
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">1. Semantic RAG Vector Search</h3>
                  <span className="text-[10px] font-mono text-slate-500">768-D Multilingual Embeddings</span>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 text-rose-300">
                  <strong className="block text-[11px] uppercase tracking-wide text-rose-400 font-mono mb-0.5">Procurement Risk:</strong>
                  Vague descriptions and non-standard nomenclature allow suppliers to deliver sub-grade materials without explicit contract violations.
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-300">
                  <strong className="block text-[11px] uppercase tracking-wide text-emerald-400 font-mono mb-0.5">AI Engine Resolution:</strong>
                  Dense vector embeddings match natural language queries, engineering parameters, voltage classes, and material grades to exact IS codes.
                </div>
              </div>
            </div>

            {/* Feature 2: Automated Normative Reference Mapping */}
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <GitFork className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">2. Automated Normative Reference Mapping</h3>
                  <span className="text-[10px] font-mono text-slate-500">Sub-standard & Test Method Traversal</span>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 text-rose-300">
                  <strong className="block text-[11px] uppercase tracking-wide text-rose-400 font-mono mb-0.5">Procurement Risk:</strong>
                  Primary product standards cite nested test codes (e.g. IS 1608 for tensile strength, IS 8130 for conductors, IS 4031 for cement) that are routinely omitted from tender BOQs.
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-300">
                  <strong className="block text-[11px] uppercase tracking-wide text-emerald-400 font-mono mb-0.5">AI Engine Resolution:</strong>
                  Automated dependency traversal embeds mandatory raw material, flammability, and factory acceptance test (FAT) methods directly into the tender scope.
                </div>
              </div>
            </div>

            {/* Feature 3: Live Version / Amendment Tracking */}
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">3. Live Version & Amendment Tracking</h3>
                  <span className="text-[10px] font-mono text-slate-500">Zero Superseded Standards Risk</span>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 text-rose-300">
                  <strong className="block text-[11px] uppercase tracking-wide text-rose-400 font-mono mb-0.5">Procurement Risk:</strong>
                  Procurement teams frequently copy-paste historical tender specifications citing superseded standards or obsolete testing thresholds.
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-300">
                  <strong className="block text-[11px] uppercase tracking-wide text-emerald-400 font-mono mb-0.5">AI Engine Resolution:</strong>
                  Real-time BIS Gazette synchronization automatically applies the latest amendments (e.g. Amdt 2021-23), ensuring only current standards are bundled.
                </div>
              </div>
            </div>

            {/* Feature 4: Statutory QCO Flags */}
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">4. Statutory QCO Flags (Scheme-I & Scheme-II)</h3>
                  <span className="text-[10px] font-mono text-slate-500">BIS Act 2016 Legal Gate</span>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 text-rose-300">
                  <strong className="block text-[11px] uppercase tracking-wide text-rose-400 font-mono mb-0.5">Procurement Risk:</strong>
                  Procuring officers unknowingly accept voluntary self-declarations for products governed by mandatory Quality Control Orders (QCOs).
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-300">
                  <strong className="block text-[11px] uppercase tracking-wide text-emerald-400 font-mono mb-0.5">AI Engine Resolution:</strong>
                  Real-time gazette verification flags mandatory Scheme-I (ISI Mark) and Scheme-II (CRS) certification criteria, enforcing statutory bid rejection for non-compliant bidders.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Statutory Standards Corpus (Divisions) */}
      <section id="statutory-standards" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0B1120] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded">
              Universal BIS Division Coverage
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              Statutory Indian Standards Corpus
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Comprehensive technical coverage across India's core infrastructure and industrial domains.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {BIS_DIVISIONS.map((div) => (
              <div
                key={div.code}
                className="bg-[#0F172A] p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded inline-block mb-2">
                    {div.code}
                  </span>
                  <h4 className="text-xs font-bold text-slate-100">{div.shortName}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{div.fullName}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between font-mono">
                  <span>{div.standardsCount} Stds</span>
                  <span className="text-emerald-400 font-semibold">{div.activeQCOs} QCOs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. About Us Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
              Institutional Framework
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              About the National Procurement Engine
            </h2>
            <p className="text-xs text-slate-400">
              Institutional alignment with Digital India, GeM portals, and public sector procurement transparency.
            </p>
          </div>

          <div className="bg-[#0F172A] p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4 shadow-sm text-slate-300">
            <p>
              Under General Financial Rules (GFR) 2017 Rule 144(xi), public procurement authorities are statutorily mandated to procure items adhering to mandatory Indian Standards and Quality Control Orders. However, technical bid evaluators often face fragmented standards catalogs and hidden normative test requirements that lead to contractor disputes and compromised infrastructure quality.
            </p>
            <p>
              The AI-Powered Indian Standards Engine serves as an intelligent regulatory bridge. By connecting Government e-Marketplace (GeM) and CPPP procurement workflows directly with the Bureau of Indian Standards (BIS) repository, we ensure every government rupee spent on national infrastructure guarantees safety, durability, and Make-in-India compliance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>GeM 4.0 API Aligned</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Public Procurement Order 2017</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero Restrictive Trade Bias</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pre-Footer Call to Action Banner */}
      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-[#0F172A] rounded-2xl border border-slate-800 p-8 text-center space-y-4 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
            Ready to Eliminate Procurement Vulnerabilities?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Generate legally binding BIS technical specifications and Model NIT clauses in under 60 seconds.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md flex items-center gap-2 transition"
            >
              <span>Launch Procurement Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. Institutional Footer */}
      <footer className="bg-[#0B1120] text-slate-400 text-xs py-8 border-t border-slate-800/80 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Smart India Hackathon 2026</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Public Procurement Specifications.
              </p>
            </div>

            <div>
              <h4 className="text-slate-200 font-semibold mb-2">Statutory Enforcements</h4>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li>• BIS Act 2016 (Section 16 QCO Mandates)</li>
                <li>• General Financial Rules (GFR) 2017 Rule 144(xi)</li>
                <li>• Public Procurement (Make in India) Order 2017</li>
                <li>• National Single Sign-On (Jan Parichay)</li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-200 font-semibold mb-2">Quick Navigation</h4>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li><Link to="/login" className="hover:text-white transition">› Officer Login & OTP Portal</Link></li>
                <li><Link to="/input" className="hover:text-white transition">› Specification Input Form</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition">› Recommendation Matrix</Link></li>
                <li><Link to="/reports" className="hover:text-white transition">› Compliance Audit Certificate</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-200 font-semibold mb-2">Security Architecture</h4>
              <p className="font-mono text-[11px] text-emerald-400 bg-[#090D16] p-2 rounded-lg border border-slate-800">
                256-Bit SHA-256 Non-Repudiation Seal
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">
                Simulated NIC e-Gov Cloud Gateway • Node 04
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
            <p>© 2026 Smart India Hackathon. Government of India.</p>
            <p className="mt-2 sm:mt-0 font-mono">Developed for Public Procurement Traceability & Quality Assurance</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingView;
