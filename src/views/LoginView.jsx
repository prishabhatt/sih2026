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
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-100 dark:bg-[#0B1120] transition-colors duration-300 relative">
      
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
      <div className="max-w-5xl w-full bg-white dark:bg-[#131C2E] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200 dark:border-slate-700 min-h-[600px] mt-12 sm:mt-8">
        
        {/* Left Column - Auth Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col relative bg-white dark:bg-[#131C2E] overflow-y-auto">
          
          <div className="flex-1 flex flex-col max-w-sm w-full mx-auto justify-center">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                {isSignUp ? 'Create an account' : 'Sign in to your account'}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isSignUp 
                  ? 'Register your details to access the AI recommendation engine.' 
                  : 'Authenticate using your official credentials or SSO gateway.'}
              </p>
            </div>

            {isSignUp ? (
              <form onSubmit={handleSignUpSubmit} className="space-y-4 mb-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="official@gov.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-slate-50 dark:bg-slate-800 dark:border-slate-600" 
                    required 
                  />
                  <label htmlFor="terms" className="text-xs text-slate-500 dark:text-slate-400">
                    I agree to the <a href="#" className="text-slate-900 dark:text-slate-200 hover:underline font-medium">Terms & Conditions</a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <>
                {/* Role Selection */}
                <div className="mb-6">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-3">
                    <User className="w-3.5 h-3.5" />
                    Select Official Role
                  </h2>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('procurement')}
                      className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                        selectedRole === 'procurement'
                          ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-400 dark:border-blue-500/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/30'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <Building2 className={`w-4 h-4 ${selectedRole === 'procurement' ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                      <span className="text-[10px] font-semibold leading-tight">Procurement<br/>Officer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('evaluator')}
                      className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                        selectedRole === 'evaluator'
                          ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-400 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <FileCheck className={`w-4 h-4 ${selectedRole === 'evaluator' ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                      <span className="text-[10px] font-semibold leading-tight">Technical<br/>Evaluator</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole('auditor')}
                      className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                        selectedRole === 'auditor'
                          ? 'bg-purple-50 dark:bg-purple-500/15 border-purple-400 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/30'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <Award className={`w-4 h-4 ${selectedRole === 'auditor' ? 'text-purple-600 dark:text-purple-400' : ''}`} />
                      <span className="text-[10px] font-semibold leading-tight">Vigilance &<br/>Audit</span>
                    </button>
                  </div>
                </div>

                {/* Auth Method Switcher Tabs */}
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/50 p-1 border border-slate-200 dark:border-slate-700 mb-5">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('otp')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                      authMethod === 'otp'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-600'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Official Mobile OTP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMethod('sso')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                      authMethod === 'sso'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-600'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>National SSO Gateway</span>
                  </button>
                </div>

                {/* AUTH METHOD 1: Mobile OTP Workflow */}
                {authMethod === 'otp' && (
                  <div className="space-y-4 pt-1">
                    {otpStep === 1 ? (
                      <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                            Registered Official Mobile Number
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 font-mono text-sm text-slate-500 font-semibold border-r border-slate-300 dark:border-slate-600 pr-2">
                              +91
                            </span>
                            <input
                              type="tel"
                              maxLength={10}
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                              placeholder="Enter 10-digit number"
                              className="w-full pl-14 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm font-mono font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                            />
                          </div>
                          {otpError && (
                            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-medium">{otpError}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                          <Smartphone className="w-4 h-4" />
                          <span>Send 6-Digit OTP</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-200">
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                          <div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Mobile Number</p>
                            <p className="font-mono font-bold text-slate-900 dark:text-white text-sm mt-0.5">+91 {mobileNumber}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setOtpStep(1)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                          >
                            Change
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              Enter 6-Digit OTP
                            </label>
                            <button
                              type="button"
                              onClick={handleAutoFillOtp}
                              className="text-[10px] font-mono text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 px-2 py-0.5 rounded transition font-semibold"
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
                                className="w-full h-12 text-center font-mono font-bold text-lg rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all selection:bg-blue-600/30"
                              />
                            ))}
                          </div>

                          {otpError && (
                            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-medium">{otpError}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          {isCounting ? (
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                              Resend OTP in: <strong>{countdown}s</strong>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Resend OTP</span>
                            </button>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={otpSuccess}
                          className={`w-full py-3 px-4 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
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
                              <span>Verify OTP & Login</span>
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
                  <div className="space-y-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSsoLogin('Jan Parichay (National SSO)')}
                      className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      <span>Jan Parichay (National SSO)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleSsoLogin('MeriPehchaan SSO')}
                        className="py-3 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors text-center"
                      >
                        MeriPehchaan
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSsoLogin('GeM Portal SSO')}
                        className="py-3 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors text-center"
                      >
                        GeM Portal
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Mode Toggle Sign Up / Sign In */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button 
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)} 
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-start justify-center gap-2 text-slate-500 dark:text-slate-400">
              <Lock className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-center">
                Protected under 256-bit NIC e-Gov security architecture. All queries logged under GFR 2017 Rule 144(xi).
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Demo Profiles */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col bg-slate-50 dark:bg-[#0B1120]/50 overflow-y-auto border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700">
          
          <div className="flex flex-col h-full w-full max-w-sm mx-auto justify-center">
            
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-slate-300 mb-1.5">
                Quick Demo Profiles
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Pre-configured profiles for instant evaluation without requiring real mobile OTP verification.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleQuickPersona('metro', 'underground_cable_metro')}
                className="w-full text-left p-4 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all group shadow-sm flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Er. Vikramaditya Sharma
                  </p>
                  <span className="text-[10px] font-mono text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 px-2 py-0.5 rounded-md font-bold">ETD</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">National Metro Rail (11kV Cables)</p>
              </button>

              <button
                onClick={() => handleQuickPersona('nhai', 'tmt_rebars_cement_nhai')}
                className="w-full text-left p-4 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all group shadow-sm flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Er. Rajeshwar Nath Kulkarni
                  </p>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-md font-bold">CED</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">NHAI (Fe 500D TMT & OPC 53)</p>
              </button>

              <button
                onClick={() => handleQuickPersona('geda', 'solar_pumps_kusum')}
                className="w-full text-left p-4 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all group shadow-sm flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    Dr. Jayeshbhai Patel
                  </p>
                  <span className="text-[10px] font-mono text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 px-2 py-0.5 rounded-md font-bold">LITD</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">GEDA (PM-KUSUM Solar Pumps)</p>
              </button>

              <button
                onClick={() => handleQuickPersona('audit', 'underground_cable_metro')}
                className="w-full text-left p-4 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all group shadow-sm flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Smt. Ananya Sen, IA&AS
                  </p>
                  <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 px-2 py-0.5 rounded-md font-bold">AUDIT</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Comptroller & Auditor General</p>
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
