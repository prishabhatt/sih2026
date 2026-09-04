import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Languages, 
  ChevronDown, 
  Sparkles, 
  CheckCircle2,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProcurement } from '../context/ProcurementContext';
import { useTheme } from '../context/ThemeContext';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, switchPersona, logout } = useAuth();
  const { lang, setLang, languages = [], t, setIsSampleDrawerOpen } = useProcurement();
  const { toggleTheme, setLightTheme, setDarkTheme, isDark } = useTheme();
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const navSteps = [
    { path: '/', label: 'Gateway Home', short: 'Home' },
    { path: '/input', label: t.nav.step2, short: 'Input Specs' },
    { path: '/analyzing', label: t.nav.step3, short: 'AI Analysis' },
    { path: '/dashboard', label: t.nav.step4, short: 'Matrix' },
    { path: '/reports', label: t.nav.step5, short: 'Report' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#090A0F]/85 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] no-print transition-all py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
            {/* Brand Logo */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1C1917] to-[#292524] dark:from-[#1C1917] dark:to-[#292524] border border-[#292524]/30 dark:border-white/20 flex items-center justify-center text-white shadow-md shadow-[#1C1917]/20 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                      BIS<span className="text-[#292524] dark:text-[#A8A29E] font-serif italic">Engine</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold glass-pill-active text-slate-800 dark:text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                      NIC-Active
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                    National Procurement AI Compliance Gateway
                  </p>
                </div>
              </Link>
            </div>

            {/* Right Actions Container */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 justify-end">
              {/* Distinct Segmented Theme Capsule Toggle */}
              <div className="flex items-center p-1 rounded-full bg-slate-200/90 dark:bg-black/50 border-2 border-slate-300 dark:border-white/20 shadow-inner backdrop-blur-2xl transition-all">
                <button
                  type="button"
                  onClick={setLightTheme}
                  className={`flex items-center justify-center p-1.5 px-2.5 rounded-full text-xs transition-all duration-200 cursor-pointer ${
                    !isDark
                      ? 'bg-white text-amber-500 shadow-[0_2px_8px_rgba(0,0,0,0.15)] ring-1 ring-black/5 font-extrabold scale-105'
                      : 'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                  title="Switch to Institutional Light Mode"
                >
                  <Sun className={`w-4 h-4 stroke-[2.5] ${!isDark ? 'text-amber-500 drop-shadow-xs' : 'text-slate-400'}`} />
                </button>

                <button
                  type="button"
                  onClick={setDarkTheme}
                  className={`flex items-center justify-center p-1.5 px-2.5 rounded-full text-xs transition-all duration-200 cursor-pointer ${
                    isDark
                      ? 'bg-[#0B1E36] dark:bg-slate-800 text-sky-400 shadow-[0_2px_8px_rgba(0,0,0,0.3)] ring-1 ring-white/20 font-extrabold scale-105'
                      : 'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                  title="Switch to Dark Mode"
                >
                  <Moon className={`w-4 h-4 stroke-[2.5] ${isDark ? 'text-sky-300 drop-shadow-xs' : 'text-slate-400'}`} />
                </button>
              </div>

              {/* Multilingual Distinct Glassmorphic Container */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider text-slate-900 dark:text-white bg-white/90 hover:bg-white dark:bg-white/15 dark:hover:bg-white/25 border-2 border-slate-300/90 dark:border-white/30 backdrop-blur-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all cursor-pointer hover:scale-105"
                  title="Select Portal Language"
                >
                  <Globe className="w-4 h-4 text-amber-500 shrink-0 stroke-[2.5]" />
                  <span className="uppercase">{lang}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-300 transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180 text-amber-500' : ''}`} />
                </button>

                {isLangMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsLangMenuOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-[#0B132B]/95 rounded-2xl shadow-2xl p-2 z-50 border border-slate-300/80 dark:border-white/20 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150 max-h-96 overflow-y-auto">
                      <div className="px-3 py-1.5 mb-1 border-b border-slate-200/60 dark:border-white/5">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                          Major Indian Languages
                        </span>
                      </div>
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => { setLang(l.code); setIsLangMenuOpen(false); }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors my-0.5 ${
                            lang === l.code 
                              ? 'font-bold bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white' 
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold">{l.native}</span>
                              <span className="text-[10px] opacity-70 font-semibold">({l.code.toUpperCase()})</span>
                            </div>
                            <div className="text-[9px] text-slate-400 dark:text-slate-400 font-sans">
                              {l.region}
                            </div>
                          </div>
                          {lang === l.code && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* User Persona */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="glass-btn-secondary inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1C1917] to-[#292524] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[130px]">
                      {currentUser?.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight truncate max-w-[130px]">
                      {currentUser?.roleTitle}
                    </p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsUserMenuOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#0B132B] rounded-3xl shadow-2xl p-3 z-50 border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="p-3.5 bg-slate-50 dark:bg-[#060A17] border border-slate-200/80 dark:border-white/10 rounded-2xl mb-2">
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white">{currentUser?.name}</p>
                        <p className="text-[11px] text-[#292524] dark:text-[#A8A29E] font-semibold">{currentUser?.roleTitle}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{currentUser?.organization}</p>
                        <div className="mt-2 pt-2 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                          <span>Auth: <strong className="font-semibold">{currentUser?.ssoProvider}</strong></span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active</span>
                        </div>
                      </div>

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 py-1">
                        Switch Test Persona
                      </p>
                      <button
                        onClick={() => { switchPersona('metro'); setIsUserMenuOpen(false); }}
                        className="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">Er. Vikramaditya Sharma</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Procurement Officer (Metro Rail)</p>
                        </div>
                        {currentUser?.id === 'usr_metro_01' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      </button>

                      <button
                        onClick={() => { switchPersona('nhai'); setIsUserMenuOpen(false); }}
                        className="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">Er. Rajeshwar Nath Kulkarni</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Technical Evaluator (NHAI)</p>
                        </div>
                        {currentUser?.id === 'usr_nhai_02' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      </button>

                      <button
                        onClick={() => { switchPersona('audit'); setIsUserMenuOpen(false); }}
                        className="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">Smt. Ananya Sen</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Vigilance & Audit Officer (CAG)</p>
                        </div>
                        {currentUser?.id === 'usr_audit_03' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      </button>

                      <div className="border-t border-slate-200/80 dark:border-white/10 my-1 pt-1">
                        <button
                          onClick={() => { logout(); navigate('/login'); setIsUserMenuOpen(false); }}
                          className="w-full text-left p-2 text-xs text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                        >
                          {t.nav.logout}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Stepper (Centered Floating Pill) */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-6 mb-8 relative z-30 flex justify-center">
        <nav className="inline-flex flex-nowrap items-center bg-white/75 dark:bg-[#0B132B]/75 backdrop-blur-2xl border border-slate-300/90 dark:border-white/20 p-1.5 rounded-full overflow-x-auto max-w-full no-scrollbar shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
          {navSteps.map((step) => {
            const isActive = location.pathname === step.path;
            
            return (
              <Link
                key={step.path}
                to={step.path}
                className={`px-4 py-2 rounded-full text-xs transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-b from-white via-white/90 to-slate-100/95 dark:from-white/25 dark:via-white/15 dark:to-white/10 text-slate-950 dark:text-white font-black shadow-[0_2px_10px_rgba(0,0,0,0.07),inset_0_1px_1px_rgba(255,255,255,0.9)] border border-slate-300/90 dark:border-white/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white font-semibold hover:bg-white/50 dark:hover:bg-white/10'
                }`}
              >
                {step.short}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
