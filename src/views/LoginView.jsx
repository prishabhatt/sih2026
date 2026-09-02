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
  Mail
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
    // Default to a persona when standard login is used for demo
    switchPersona('metro');
    loadScenario('underground_cable_metro');
    navigate('/input');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-neutral-200/80 dark:bg-black transition-colors duration-300 relative">

      {/* Header Navigation (Extracted outside the card) */}
      <div className="absolute top-0 w-full flex justify-between items-center p-6 sm:px-8 z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gateway Home
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Central Floating Card */}
      <div className="max-w-6xl w-full bg-[#F3F4F6] dark:bg-zinc-900 rounded-[2.5rem] p-3 sm:p-4 shadow-2xl ring-1 ring-white/60 dark:ring-white/10 flex flex-col lg:flex-row gap-4 relative overflow-hidden min-h-[600px] mt-12 sm:mt-8">

        {/* Left Column - Auth Form */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center overflow-y-auto">

          <div className="flex-1 flex flex-col max-w-sm w-full mx-auto justify-center">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {isSignUp ? 'Create an account' : 'Sign in to your account'}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {isSignUp
                  ? 'Register your details to access the AI recommendation engine.'
                  : 'Authenticate using your official credentials or SSO gateway.'}
              </p>
            </div>

            {isSignUp ? (
              <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus-within:ring-2 focus-within:ring-slate-900 dark:focus-within:ring-white transition-all overflow-hidden">
                    <User className="absolute left-4 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 text-sm bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                  <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus-within:ring-2 focus-within:ring-slate-900 dark:focus-within:ring-white transition-all overflow-hidden">
                    <Mail className="absolute left-4 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="official@gov.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 text-sm bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                  <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus-within:ring-2 focus-within:ring-slate-900 dark:focus-within:ring-white transition-all overflow-hidden">
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
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 bg-white dark:bg-zinc-900 dark:border-zinc-700"
                    required
                  />
                  <label htmlFor="terms" className="text-xs text-slate-500 dark:text-slate-400">
                    I agree to the <a href="#" className="text-slate-900 dark:text-white hover:underline font-medium">Terms & Conditions</a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 mt-2"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex flex-col gap-6">
                {/* Role Selection */}
                <div>
                  <h2 className="text-xs font-semibold text-slate-900 dark:text-white mb-2">
                    Select Official Role
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('procurement')}
                      className={`transition-colors cursor-pointer flex items-center gap-1.5 ${selectedRole === 'procurement'
                          ? 'px-4 py-2 rounded-full border border-transparent bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium shadow-sm'
                          : 'px-4 py-2 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                    >
                      <Building2 className="w-3 h-3" />
                      <span>Procurement</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('evaluator')}
                      className={`transition-colors cursor-pointer flex items-center gap-1.5 ${selectedRole === 'evaluator'
                          ? 'px-4 py-2 rounded-full border border-transparent bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium shadow-sm'
                          : 'px-4 py-2 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                    >
                      <FileCheck className="w-3 h-3" />
                      <span>Evaluator</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('auditor')}
                      className={`transition-colors cursor-pointer flex items-center gap-1.5 ${selectedRole === 'auditor'
                          ? 'px-4 py-2 rounded-full border border-transparent bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium shadow-sm'
                          : 'px-4 py-2 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                    >
                      <Award className="w-3 h-3" />
                      <span>Audit</span>
                    </button>
                  </div>
                </div>

                {/* Auth Method Switcher Tabs */}
                <div className="flex p-1 bg-slate-200/50 dark:bg-zinc-900 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('otp')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${authMethod === 'otp'
                        ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                  >
                    Mobile OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('sso')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${authMethod === 'sso'
                        ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
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
                          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Registered Mobile Number
                          </label>
                          <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus-within:ring-2 focus-within:ring-slate-900 dark:focus-within:ring-white transition-all overflow-hidden">
                            <span className="absolute left-4 font-mono text-sm text-slate-500 font-medium">
                              +91
                            </span>
                            <input
                              type="tel"
                              maxLength={10}
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                              placeholder="Enter 10-digit number"
                              className="w-full pl-12 pr-4 py-3 text-sm bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-white font-mono font-medium"
                            />
                          </div>
                          {otpError && (
                            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-medium">{otpError}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 mt-2"
                        >
                          <span>Send 6-Digit OTP</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in duration-200">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                          <div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Mobile Number</p>
                            <p className="font-mono font-medium text-slate-900 dark:text-white text-sm mt-1">+91 {mobileNumber}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setOtpStep(1)}
                            className="text-xs text-slate-900 dark:text-white hover:underline font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-sm transition-colors"
                          >
                            Edit
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              Enter 6-Digit OTP
                            </label>
                            <button
                              type="button"
                              onClick={handleAutoFillOtp}
                              className="text-[10px] font-mono text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition font-medium"
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
                                className="w-full h-12 text-center font-mono font-medium text-lg rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900 dark:focus:ring-white focus:outline-none transition-all selection:bg-slate-200 dark:selection:bg-zinc-700"
                              />
                            ))}
                          </div>

                          {otpError && (
                            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-medium">{otpError}</p>
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
                              className="text-xs text-slate-900 dark:text-white hover:underline flex items-center gap-1 font-medium"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Resend OTP</span>
                            </button>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={otpSuccess}
                          className={`w-full py-3.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${otpSuccess ? 'bg-emerald-600 dark:bg-emerald-500 text-white' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-slate-900/10'
                            }`}
                        >
                          {otpSuccess ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Verified</span>
                            </>
                          ) : (
                            <>
                              <span>Verify & Login</span>
                              <ArrowRight className="w-4 h-4" />
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
                      className="w-full py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-md shadow-slate-900/10 flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Jan Parichay SSO</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleSsoLogin('MeriPehchaan SSO')}
                        className="py-3 px-3 rounded-xl bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors text-center"
                      >
                        MeriPehchaan
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSsoLogin('GeM Portal SSO')}
                        className="py-3 px-3 rounded-xl bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors text-center"
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
                  className="font-medium text-slate-900 dark:text-white hover:underline"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <Lock className="w-3 h-3" />
              <span>Protected by 256-bit NIC e-Gov security.</span>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Demo Profiles */}
        <div className="flex-1 bg-[#0F0F11] dark:bg-[#0A0A0B] rounded-[2rem] p-8 lg:p-12 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col relative overflow-y-auto antialiased">

          <div className="flex flex-col h-full w-full max-w-sm mx-auto justify-center">

            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Quick Demo Profiles
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Pre-configured profiles for instant evaluation without requiring real mobile OTP verification.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleQuickPersona('metro', 'underground_cable_metro')}
                className="w-full text-left bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-semibold text-sm tracking-tight">
                    Er. Vikramaditya Sharma
                  </p>
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider">
                    ETD
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1">National Metro Rail (11kV Cables)</p>
              </button>

              <button
                onClick={() => handleQuickPersona('nhai', 'tmt_rebars_cement_nhai')}
                className="w-full text-left bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-semibold text-sm tracking-tight">
                    Er. Rajeshwar Nath Kulkarni
                  </p>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider">
                    CED
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1">NHAI (Fe 500D TMT & OPC 53)</p>
              </button>

              <button
                onClick={() => handleQuickPersona('geda', 'solar_pumps_kusum')}
                className="w-full text-left bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-semibold text-sm tracking-tight">
                    Dr. Jayeshbhai Patel
                  </p>
                  <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider">
                    LITD
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1">GEDA (PM-KUSUM Solar Pumps)</p>
              </button>

              <button
                onClick={() => handleQuickPersona('audit', 'underground_cable_metro')}
                className="w-full text-left bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-semibold text-sm tracking-tight">
                    Smt. Ananya Sen, IA&AS
                  </p>
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider">
                    AUDIT
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1">Comptroller & Auditor General</p>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
