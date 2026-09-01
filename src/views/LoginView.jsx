import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Building2, 
  Award, 
  FileCheck, 
  UserCheck, 
  ShieldAlert, 
  Sparkles, 
  Smartphone, 
  KeyRound, 
  CheckCircle2, 
  RefreshCw, 
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useProcurement } from '../context/ProcurementContext';
import { useTheme } from '../context/ThemeContext';

export function LoginView() {
  const navigate = useNavigate();
  const { loginAsRole, switchPersona } = useAuth();
  const { t, loadScenario, setOrgProfile } = useProcurement();
  const { isDark, toggleTheme } = useTheme();

  const [authMethod, setAuthMethod] = useState('otp'); // 'otp' or 'sso'
  const [selectedRole, setSelectedRole] = useState('procurement');

  // Mobile OTP State
  const [mobileNumber, setMobileNumber] = useState('9810123456');
  const [otpStep, setOtpStep] = useState(1);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [isCounting, setIsCounting] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);

  const otpInputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (isCounting && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setIsCounting(false);
    }
    return () => clearInterval(timer);
  }, [isCounting, countdown]);

  const handleSendOtp = (e) => {
    e?.preventDefault();
    if (!mobileNumber || mobileNumber.replace(/\D/g, '').length < 10) {
      setOtpError(t.otp.invalidMobile);
      return;
    }
    setOtpError('');
    setOtpStep(2);
    setCountdown(30);
    setIsCounting(true);
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 100);
  };

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    setOtpError('');

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillOtp = () => {
    const sampleOtp = ['7', '4', '2', '9', '1', '8'];
    setOtpDigits(sampleOtp);
    setOtpError('');
  };

  const handleVerifyOtp = (e) => {
    e?.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      setOtpError(t.otp.invalidOtp);
      return;
    }

    setOtpSuccess(true);
    confetti({ particleCount: 35, spread: 45, origin: { y: 0.8 } });

    setOrgProfile((prev) => ({
      ...prev,
      mobileNumber: `+91 ${mobileNumber}`
    }));

    setTimeout(() => {
      loginAsRole(selectedRole, 'Mobile 2-Factor OTP (+91 ' + mobileNumber + ')');
      navigate('/input');
    }, 800);
  };

  const handleSsoLogin = (ssoProvider) => {
    loginAsRole(selectedRole, ssoProvider);
    navigate('/input');
  };

  const handleQuickPersona = (personaKey, scenarioId) => {
    switchPersona(personaKey);
    loadScenario(scenarioId);
    navigate('/input');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Navigation back to landing */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Gateway Home</span>
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
              GFR 2017 Statutory Access Portal
            </span>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Header Hero */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 text-xs font-medium shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.login.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t.login.heroTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t.login.heroSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Auth Card */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-5">
            {/* Role Selection */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
                <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                {t.login.selectRole}
              </h2>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('procurement')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    selectedRole === 'procurement'
                      ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-400 dark:border-blue-500/40 text-blue-900 dark:text-slate-100 ring-1 ring-blue-500/30'
                      : 'bg-slate-50 dark:bg-[#131C2E] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-[11px] font-semibold">{t.login.roleProcurement}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('evaluator')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    selectedRole === 'evaluator'
                      ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-400 dark:border-blue-500/40 text-blue-900 dark:text-slate-100 ring-1 ring-blue-500/30'
                      : 'bg-slate-50 dark:bg-[#131C2E] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[11px] font-semibold">{t.login.roleEvaluator}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('auditor')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    selectedRole === 'auditor'
                      ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-400 dark:border-blue-500/40 text-blue-900 dark:text-slate-100 ring-1 ring-blue-500/30'
                      : 'bg-slate-50 dark:bg-[#131C2E] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-[11px] font-semibold">{t.login.roleAuditor}</span>
                </button>
              </div>
            </div>

            {/* Auth Method Switcher Tabs */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-[#131C2E] p-1 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setAuthMethod('otp')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  authMethod === 'otp'
                    ? 'bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.login.tabOtp}</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMethod('sso')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  authMethod === 'sso'
                    ? 'bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{t.login.tabSso}</span>
              </button>
            </div>

            {/* AUTH METHOD 1: Mobile OTP Workflow */}
            {authMethod === 'otp' && (
              <div className="space-y-4 pt-1">
                {otpStep === 1 ? (
                  <form onSubmit={handleSendOtp} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        {t.otp.mobileLabel}
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 font-mono text-xs text-slate-500 font-semibold border-r border-slate-300 dark:border-slate-700 pr-2">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder={t.otp.mobilePlaceholder}
                          className="w-full pl-14 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#131C2E] text-slate-900 dark:text-slate-100 text-xs font-mono font-semibold focus:border-blue-500 focus:outline-none transition"
                        />
                      </div>
                      {otpError && (
                        <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium">{otpError}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>{t.otp.btnSendOtp}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-200">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#131C2E] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-mono">Mobile Number</p>
                        <p className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5">+91 {mobileNumber}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtpStep(1)}
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        Change
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          {t.otp.otpLabel}
                        </label>
                        <button
                          type="button"
                          onClick={handleAutoFillOtp}
                          className="text-[10px] font-mono text-amber-700 dark:text-amber-400 hover:underline bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded transition font-semibold"
                        >
                          {t.otp.autoFillBtn}
                        </button>
                      </div>

                      {/* 6-Digit OTP Container */}
                      <div className="grid grid-cols-6 gap-2">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => (otpInputRefs.current[idx] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-full h-11 text-center font-mono font-bold text-base rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#131C2E] text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none transition selection:bg-blue-600"
                          />
                        ))}
                      </div>

                      {otpError && (
                        <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1.5 font-medium">{otpError}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      {isCounting ? (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {t.otp.resendWait}: <strong>{countdown}s</strong>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>{t.otp.btnResendOtp}</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={otpSuccess}
                      className={`w-full py-2.5 px-4 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm ${
                        otpSuccess ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {otpSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>Verified • Entering Portal...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4 text-emerald-300" />
                          <span>{t.otp.btnVerify}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* AUTH METHOD 2: National SSO Options */}
            {authMethod === 'sso' && (
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleSsoLogin('Jan Parichay (National SSO)')}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>{t.login.ssoJanParichay}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSsoLogin('MeriPehchaan SSO')}
                    className="py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-[#131C2E] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition text-center"
                  >
                    {t.login.ssoMeriPehchaan}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSsoLogin('GeM Portal SSO')}
                    className="py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-[#131C2E] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition text-center"
                  >
                    {t.login.ssoGem}
                  </button>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 text-center flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.login.auditNotice}</span>
            </div>
          </div>

          {/* Quick Demo Profiles Side Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                  {t.login.demoPersonasTitle}
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pre-configured profiles for instant SIH evaluation:
              </p>

              <div className="space-y-2">
                <button
                  onClick={() => handleQuickPersona('metro', 'underground_cable_metro')}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-[#131C2E] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-blue-400 transition group shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      Er. Vikramaditya Sharma
                    </p>
                    <span className="text-[10px] font-mono text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-1.5 py-0.5 rounded font-bold">ETD</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">National Metro Rail (11kV Cables)</p>
                </button>

                <button
                  onClick={() => handleQuickPersona('nhai', 'tmt_rebars_cement_nhai')}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-[#131C2E] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 transition group shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                      Er. Rajeshwar Nath Kulkarni
                    </p>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-1.5 py-0.5 rounded font-bold">CED</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">NHAI (Fe 500D TMT & OPC 53)</p>
                </button>

                <button
                  onClick={() => handleQuickPersona('geda', 'solar_pumps_kusum')}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-[#131C2E] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition group shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                      Dr. Jayeshbhai Patel
                    </p>
                    <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-1.5 py-0.5 rounded font-bold">LITD</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">GEDA (PM-KUSUM Solar Pumps)</p>
                </button>

                <button
                  onClick={() => handleQuickPersona('audit', 'underground_cable_metro')}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-[#131C2E] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-purple-400 transition group shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                      Smt. Ananya Sen, IA&AS
                    </p>
                    <span className="text-[10px] font-mono text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 px-1.5 py-0.5 rounded font-bold">AUDIT</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Comptroller & Auditor General</p>
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2.5 shadow-xs">
              <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Smart India Hackathon 2026 Prototype: Semantic RAG retrieval across 22,000+ BIS standards with QCO registry verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
