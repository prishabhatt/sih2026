import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Languages, 
  ChevronDown, 
  Sparkles, 
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProcurement } from '../context/ProcurementContext';
import { useTheme } from '../context/ThemeContext';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, switchPersona, logout } = useAuth();
  const { lang, setLang, t, setIsSampleDrawerOpen } = useProcurement();
  const { toggleTheme, setLightTheme, setDarkTheme, isDark } = useTheme();
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const navSteps = [
    { path: '/', label: 'Gateway Home', short: 'Home' },
    { path: '/input', label: t.nav.step2, short: 'Input Specs' },
    { path: '/analyzing', label: t.nav.step3, short: 'AI Analysis' },
    { path: '/dashboard', label: t.nav.step4, short: 'Matrix' },
    { path: '/reports', label: t.nav.step5, short: 'Certificate' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#090D16]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 shadow-sm no-print transition-colors py-4 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
            {/* Brand Logo */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 group-hover:border-blue-400 dark:group-hover:border-slate-600 transition">
                  <ShieldCheck className="w-5 h-5 text-blue-700 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100">
                      BIS<span className="text-blue-600 dark:text-blue-500">Engine</span>
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                      Gov-Tech
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal hidden sm:block">
                    National Procurement AI Compliance Gateway
                  </p>
                </div>
              </Link>
            </div>

            {/* Right Actions Container (All in one line) */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 justify-end">
              
              {/* Load Sample Specs Button */}
              <button
                onClick={() => setIsSampleDrawerOpen(true)}
                className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition text-xs pr-2 sm:pr-4 sm:border-r border-slate-200 dark:border-slate-700"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span className="hidden sm:inline">{t.nav.loadSample}</span>
                <span className="sm:hidden">Sample Specs</span>
              </button>

              {/* Labeled Segmented Theme Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={setLightTheme}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition ${
                    !isDark
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Switch to Institutional Light Mode"
                >
                  <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-amber-500' : 'text-slate-400'}`} />
                </button>

                <button
                  type="button"
                  onClick={setDarkTheme}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition ${
                    isDark
                      ? 'bg-slate-800 text-slate-100 shadow-xs border border-slate-700 font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Switch to Dark Mode"
                >
                  <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-blue-400' : 'text-slate-500'}`} />
                </button>
              </div>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 transition"
                >
                  <Languages className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="uppercase font-mono hidden sm:inline">{lang}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 hidden sm:inline" />
                </button>

                {isLangMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#0F172A] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => { setLang('en'); setIsLangMenuOpen(false); }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/80 ${
                        lang === 'en' ? 'font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800/50' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>English (EN)</span>
                      {lang === 'en' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    </button>
                    <button
                      onClick={() => { setLang('hi'); setIsLangMenuOpen(false); }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/80 ${
                        lang === 'hi' ? 'font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800/50' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>हिन्दी (Hindi)</span>
                      {lang === 'hi' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    </button>
                    <button
                      onClick={() => { setLang('gu'); setIsLangMenuOpen(false); }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/80 ${
                        lang === 'gu' ? 'font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800/50' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>ગુજરાતી (Gujarati)</span>
                      {lang === 'gu' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    </button>
                  </div>
                )}
              </div>

              {/* User Persona */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2.5 pr-2.5 sm:pr-3 py-1.5 bg-slate-100 dark:bg-[#0F172A] hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl transition"
                >
                  <div className="w-6 h-6 rounded-md bg-blue-600 text-white dark:bg-slate-800 dark:border dark:border-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[130px]">
                      {currentUser?.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal leading-tight truncate max-w-[130px]">
                      {currentUser?.roleTitle}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 hidden sm:inline" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#0F172A] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-3 bg-slate-50 dark:bg-[#131C2E] rounded-xl border border-slate-200 dark:border-slate-800 mb-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{currentUser?.name}</p>
                      <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">{currentUser?.roleTitle}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{currentUser?.organization}</p>
                      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                        <span>Auth: <strong>{currentUser?.ssoProvider}</strong></span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Active</span>
                      </div>
                    </div>

                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 py-1">
                      Switch Test Persona
                    </p>
                    <button
                      onClick={() => { switchPersona('metro'); setIsUserMenuOpen(false); }}
                      className="w-full text-left p-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">Er. Vikramaditya Sharma</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Procurement Officer (Metro Rail)</p>
                      </div>
                      {currentUser?.id === 'usr_metro_01' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => { switchPersona('nhai'); setIsUserMenuOpen(false); }}
                      className="w-full text-left p-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">Er. Rajeshwar Nath Kulkarni</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Technical Evaluator (NHAI)</p>
                      </div>
                      {currentUser?.id === 'usr_nhai_02' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => { switchPersona('audit'); setIsUserMenuOpen(false); }}
                      className="w-full text-left p-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">Smt. Ananya Sen</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Vigilance & Audit Officer (CAG)</p>
                      </div>
                      {currentUser?.id === 'usr_audit_03' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    </button>

                    <div className="border-t border-slate-200 dark:border-slate-800 my-1 pt-1">
                      <button
                        onClick={() => { logout(); navigate('/login'); setIsUserMenuOpen(false); }}
                        className="w-full text-left p-2 text-xs text-rose-600 dark:text-rose-400 font-medium hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition"
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

      {/* Relocated Navigation Stepper (Centered Layout, floats below header) */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-6 mb-8 relative z-30 flex justify-center">
        <nav className="inline-flex flex-nowrap items-center glass-pill-container p-1.5 rounded-full overflow-x-auto max-w-full no-scrollbar shadow-lg">
          {navSteps.map((step) => {
            const isActive = location.pathname === step.path;
            
            return (
              <Link
                key={step.path}
                to={step.path}
                className={`px-4 py-2 rounded-full text-xs transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'glass-pill-active text-slate-900 dark:text-white font-bold scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium hover:bg-white/40 dark:hover:bg-white/[0.04]'
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
