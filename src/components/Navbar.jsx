import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Languages, 
  ChevronDown, 
  Sparkles, 
  CheckCircle2,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProcurement } from '../context/ProcurementContext';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, switchPersona, logout } = useAuth();
  const { lang, setLang, t, setIsSampleDrawerOpen } = useProcurement();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const navSteps = [
    { path: '/input', label: t.nav.step2, short: '1. Input Specs' },
    { path: '/analyzing', label: t.nav.step3, short: '2. AI Analysis' },
    { path: '/dashboard', label: t.nav.step4, short: '3. Matrix' },
    { path: '/reports', label: t.nav.step5, short: '4. Audit Certificate' },
  ];

  const currentStepIndex = navSteps.findIndex((s) => s.path === location.pathname);

  return (
    <header className="sticky top-0 z-40 bg-[#090D16]/95 backdrop-blur-md border-b border-slate-800/80 shadow-sm no-print">
      {/* Top Govt Notice Bar */}
      <div className="bg-[#0B1120] text-slate-400 text-xs px-4 py-1.5 flex items-center justify-between border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {t.nav.govBadge}
          </span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            Bureau of Indian Standards (BIS) Act 2016 & GFR 2017 Regulatory Traceability Gateway
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <button
            onClick={() => setIsSampleDrawerOpen(true)}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition text-[11px]"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{t.nav.loadSample}</span>
          </button>
          <span className="text-slate-700 hidden md:inline">|</span>
          <span className="hidden md:inline text-[11px] text-slate-400">
            NIC Node: <strong className="text-slate-300 font-mono">SECURE-04</strong>
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-4">
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

            <Link
              to="/"
              className="p-2 rounded-lg bg-[#0F172A] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition hidden sm:flex items-center gap-1.5"
              title="Return to Public Gateway Home"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Gateway Home</span>
            </Link>
          </div>

          {/* Stepper Progress */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0F172A] p-1 rounded-xl border border-slate-800">
            {navSteps.map((step, idx) => {
              const isActive = location.pathname === step.path;
              const isPast = currentStepIndex > idx;
              return (
                <Link
                  key={step.path}
                  to={step.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-800 text-slate-100 border border-slate-700 font-semibold'
                      : isPast
                      ? 'text-slate-400 hover:text-slate-200'
                      : 'text-slate-500 hover:text-slate-400'
                  }`}
                >
                  {isPast ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                      isActive ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {idx + 1}
                    </span>
                  )}
                  <span>{step.short}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Language & User */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#0F172A] hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition"
              >
                <Languages className="w-3.5 h-3.5 text-blue-400" />
                <span className="uppercase font-mono">{lang}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[#0F172A] rounded-xl shadow-xl border border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => { setLang('en'); setIsLangMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 ${
                      lang === 'en' ? 'font-semibold text-blue-400 bg-slate-800/50' : 'text-slate-300'
                    }`}
                  >
                    <span>English (EN)</span>
                    {lang === 'en' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                  <button
                    onClick={() => { setLang('hi'); setIsLangMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 ${
                      lang === 'hi' ? 'font-semibold text-blue-400 bg-slate-800/50' : 'text-slate-300'
                    }`}
                  >
                    <span>हिन्दी (Hindi)</span>
                    {lang === 'hi' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                  <button
                    onClick={() => { setLang('gu'); setIsLangMenuOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 ${
                      lang === 'gu' ? 'font-semibold text-blue-400 bg-slate-800/50' : 'text-slate-300'
                    }`}
                  >
                    <span>ગુજરાતી (Gujarati)</span>
                    {lang === 'gu' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* User Persona */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 bg-[#0F172A] hover:bg-slate-800 border border-slate-800 rounded-xl transition"
              >
                <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[130px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-normal leading-tight">
                    {currentUser.roleTitle}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0F172A] rounded-2xl shadow-xl border border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 bg-[#131C2E] rounded-xl border border-slate-800 mb-2">
                    <p className="text-xs font-bold text-slate-100">{currentUser.name}</p>
                    <p className="text-[11px] text-blue-400 font-medium">{currentUser.roleTitle}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{currentUser.organization}</p>
                    <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Auth: <strong>{currentUser.ssoProvider}</strong></span>
                      <span className="text-emerald-400 font-medium">Active</span>
                    </div>
                  </div>

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-2 py-1">
                    Switch Test Persona
                  </p>
                  <button
                    onClick={() => { switchPersona('metro'); setIsUserMenuOpen(false); }}
                    className="w-full text-left p-2 rounded-lg text-xs hover:bg-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-200">Er. Vikramaditya Sharma</p>
                      <p className="text-[10px] text-slate-400">Procurement Officer (Metro Rail)</p>
                    </div>
                    {currentUser.id === 'usr_metro_01' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>

                  <button
                    onClick={() => { switchPersona('nhai'); setIsUserMenuOpen(false); }}
                    className="w-full text-left p-2 rounded-lg text-xs hover:bg-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-200">Er. Rajeshwar Nath Kulkarni</p>
                      <p className="text-[10px] text-slate-400">Technical Evaluator (NHAI)</p>
                    </div>
                    {currentUser.id === 'usr_nhai_02' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>

                  <button
                    onClick={() => { switchPersona('audit'); setIsUserMenuOpen(false); }}
                    className="w-full text-left p-2 rounded-lg text-xs hover:bg-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-200">Smt. Ananya Sen</p>
                      <p className="text-[10px] text-slate-400">Vigilance & Audit Officer (CAG)</p>
                    </div>
                    {currentUser.id === 'usr_audit_03' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>

                  <div className="border-t border-slate-800 my-1 pt-1">
                    <button
                      onClick={() => { logout(); navigate('/login'); setIsUserMenuOpen(false); }}
                      className="w-full text-left p-2 text-xs text-rose-400 font-medium hover:bg-rose-500/10 rounded-lg transition"
                    >
                      {t.nav.logout}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
