import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sun,
  Moon,
  Building2,
  FileCheck,
  Award,
  Smartphone,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Lock,
  User,
  Mail,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useProcurement } from '../context/ProcurementContext';
import { useTheme } from '../context/ThemeContext';
import { AppleStripeBackground } from '../components/AppleStripeBackground';

export function LoginView() {
  const navigate = useNavigate();
  const { loginAsRole, switchPersona } = useAuth();
  const { t, loadScenario, setOrgProfile } = useProcurement();
  const { isDark, toggleTheme } = useTheme();

  const [isSignUp, setIsSignUp] = useState(false);
  const [authMethod, setAuthMethod] = useState('otp'); // 'otp' or 'sso'
  const [selectedRole, setSelectedRole] = useState('procurement');

  // Sign Up State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      setOtpError(t?.otp?.invalidMobile || 'Invalid Mobile Number');
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
      setOtpError(t?.otp?.invalidOtp || 'Invalid OTP');
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

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    switchPersona('metro');
    loadScenario('underground_cable_metro');
    navigate('/input');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-[#F1F5F9] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-500 relative font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Living Aurora Background */}
      <AppleStripeBackground />

      {/* Header Navigation */}
      <div className="absolute top-0 w-full flex justify-between items-center p-6 sm:px-8 z-20">
        <button
          onClick={() => navigate('/')}
          className="glass-btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Gateway Home</span>
        </button>
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full glass-btn-secondary flex items-center justify-center text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Central Floating Glass Card */}
      <div className="max-w-5xl w-full glass-card rounded-[2.5rem] p-3 sm:p-4 shadow-2xl border border-white/70 dark:border-white/10 flex flex-col lg:flex-row gap-4 relative z-10 overflow-hidden min-h-[580px] mt-16 sm:mt-12">

        {/* Left Column - Auth Form */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center overflow-y-auto">

          <div className="flex-1 flex flex-col max-w-sm w-full mx-auto justify-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill-container text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-xs mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>NIC e-Gov Gateway</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {isSignUp ? 'Create your ' : 'Sign in to '}
                <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-sky-300">
                  {isSignUp ? 'Account.' : 'Gateway.'}
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {isSignUp
                  ? 'Register your official procurement identity to access the AI engine.'
                  : 'Authenticate using your verified mobile OTP or national SSO gateway.'}
              </p>
            </div>

            {isSignUp ? (
              <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative flex items-center glass-pill-container rounded-2xl focus-within:ring-2 focus-within:ring-blue-500 transition-all overflow-hidden">
                    <User className="absolute left-4 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Er. Vikramaditya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 text-sm bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Official Email</label>
                  <div className="relative flex items-center glass-pill-container rounded-2xl focus-within:ring-2 focus-within:ring-blue-500 transition-all overflow-hidden">
                    <Mail className="absolute left-4 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="officer@delhimetrorail.gov.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 text-sm bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-white font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                  <div className="relative flex items-center glass-pill-container rounded-2xl focus-within:ring-2 focus-within:ring-blue-500 transition-all overflow-hidden">
                    <Lock className="absolute left-4 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 text-sm bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="terms"
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="terms" className="text-xs text-slate-500 dark:text-slate-400">
                    I agree to the <span className="text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer">Terms & Conditions</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="glass-btn-primary shimmer-sweep w-full py-3.5 rounded-full text-white text-xs font-extrabold shadow-lg flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <span>Create Official Account</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </form>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Role Selection */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Select Official Role
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('procurement')}
                      className={`transition-all cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold ${selectedRole === 'procurement'
                          ? 'glass-btn-primary text-white shadow-xs'
                          : 'glass-btn-secondary text-slate-600 dark:text-slate-300'
                        }`}
                    >
                      <Building2 className="w-3 h-3" />
                      <span>Procurement</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('evaluator')}
                      className={`transition-all cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold ${selectedRole === 'evaluator'
                          ? 'glass-btn-primary text-white shadow-xs'
                          : 'glass-btn-secondary text-slate-600 dark:text-slate-300'
                        }`}
                    >
                      <FileCheck className="w-3 h-3" />
                      <span>Evaluator</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('auditor')}
                      className={`transition-all cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold ${selectedRole === 'auditor'
                          ? 'glass-btn-primary text-white shadow-xs'
                          : 'glass-btn-secondary text-slate-600 dark:text-slate-300'
                        }`}
                    >
                      <Award className="w-3 h-3" />
                      <span>Audit</span>
                    </button>
                  </div>
                </div>

                {/* Auth Method Switcher Tabs */}
                <div className="flex p-0.5 glass-pill-container rounded-full">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('otp')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${authMethod === 'otp'
                        ? 'glass-pill-active text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    Mobile OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('sso')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${authMethod === 'sso'
                        ? 'glass-pill-active text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    National SSO
                  </button>
                </div>

                {/* AUTH METHOD 1: Mobile OTP Workflow */}
                {authMethod === 'otp' && (
                  <div>
                    {otpStep === 1 ? (
                      <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                            Registered Mobile Number
                          </label>
                          <div className="relative flex items-center glass-pill-container rounded-2xl focus-within:ring-2 focus-within:ring-blue-500 transition-all overflow-hidden">
                            <span className="absolute left-4 font-mono text-sm text-slate-400 font-bold">
                              +91
                            </span>
                            <input
                              type="tel"
                              maxLength={10}
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                              placeholder="Enter 10-digit number"
                              className="w-full pl-12 pr-4 py-3 text-sm bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-white font-mono font-bold"
                            />
                          </div>
                          {otpError && (
                            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-semibold">{otpError}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="glass-btn-primary shimmer-sweep w-full py-3.5 rounded-full text-white text-xs font-extrabold shadow-lg flex items-center justify-center gap-2 mt-2 cursor-pointer"
                        >
                          <span>Send 6-Digit OTP</span>
                          <ArrowRight className="w-4 h-4 text-amber-400" />
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in duration-200">
                        <div className="p-3.5 rounded-2xl glass-pill-container flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Mobile Number</p>
                            <p className="font-mono font-bold text-slate-900 dark:text-white text-xs mt-0.5">+91 {mobileNumber}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setOtpStep(1)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold px-3 py-1 rounded-full glass-btn-secondary cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                              Enter 6-Digit OTP
                            </label>
                            <button
                              type="button"
                              onClick={handleAutoFillOtp}
                              className="text-[10px] font-mono text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
                            >
                              Auto-Fill Demo
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
                                className="w-full h-12 text-center font-mono font-bold text-lg rounded-2xl glass-pill-container text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                              />
                            ))}
                          </div>

                          {otpError && (
                            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-semibold">{otpError}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          {isCounting ? (
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                              Resend in: {countdown}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Resend OTP</span>
                            </button>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={otpSuccess}
                          className={`glass-btn-primary shimmer-sweep w-full py-3.5 rounded-full text-white text-xs font-extrabold shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            otpSuccess ? '!bg-emerald-600 text-white' : ''
                          }`}
                        >
                          {otpSuccess ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Verified & Logging In...</span>
                            </>
                          ) : (
                            <>
                              <span>Verify & Login</span>
                              <ArrowRight className="w-4 h-4 text-amber-400" />
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* AUTH METHOD 2: National SSO Options */}
                {authMethod === 'sso' && (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleSsoLogin('Jan Parichay (National SSO)')}
                      className="glass-btn-primary shimmer-sweep w-full py-3.5 rounded-full text-white text-xs font-extrabold shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Jan Parichay SSO</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleSsoLogin('MeriPehchaan SSO')}
                        className="py-3 px-3 rounded-2xl glass-btn-secondary text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors text-center cursor-pointer"
                      >
                        MeriPehchaan
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSsoLogin('GeM Portal SSO')}
                        className="py-3 px-3 rounded-2xl glass-btn-secondary text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors text-center cursor-pointer"
                      >
                        GeM Portal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mode Toggle Sign Up / Sign In */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>Protected by 256-bit NIC e-Gov security.</span>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Demo Profiles */}
        <div className="flex-1 rounded-[2rem] p-8 lg:p-12 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 dark:from-[#070B14] dark:via-[#0B1428] dark:to-[#050810] text-white border border-white/20 shadow-2xl flex flex-col relative overflow-y-auto">

          <div className="flex flex-col h-full w-full max-w-sm mx-auto justify-center">

            <div className="mb-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400 block mb-1">
                INSTANT EVALUATION
              </span>
              <h3 className="text-xl font-black text-white tracking-tight">
                Quick Demo Profiles
              </h3>
              <p className="text-xs text-slate-300 mt-1 font-normal leading-relaxed">
                Pre-configured government personas for instant evaluation without requiring real mobile OTP verification.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleQuickPersona('metro', 'underground_cable_metro')}
                className="w-full text-left bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-bold text-sm tracking-tight">
                    Er. Vikramaditya Sharma
                  </p>
                  <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                    ETD
                  </span>
                </div>
                <p className="text-slate-300 text-xs mt-1">National Metro Rail (11kV HT XLPE Cables)</p>
              </button>

              <button
                onClick={() => handleQuickPersona('nhai', 'tmt_rebars_cement_nhai')}
                className="w-full text-left bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-bold text-sm tracking-tight">
                    Er. Rajeshwar Nath Kulkarni
                  </p>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                    CED
                  </span>
                </div>
                <p className="text-slate-300 text-xs mt-1">NHAI (Fe 500D TMT & OPC 53 Grade)</p>
              </button>

              <button
                onClick={() => handleQuickPersona('geda', 'solar_pumps_kusum')}
                className="w-full text-left bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-bold text-sm tracking-tight">
                    Dr. Jayeshbhai Patel
                  </p>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                    LITD
                  </span>
                </div>
                <p className="text-slate-300 text-xs mt-1">GEDA (PM-KUSUM Solar Water Pumps)</p>
              </button>

              <button
                onClick={() => handleQuickPersona('audit', 'underground_cable_metro')}
                className="w-full text-left bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-bold text-sm tracking-tight">
                    Smt. Ananya Sen, IA&AS
                  </p>
                  <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                    AUDIT
                  </span>
                </div>
                <p className="text-slate-300 text-xs mt-1">Comptroller & Auditor General (GFR 144(xi))</p>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginView;
