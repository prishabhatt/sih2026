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
  Sparkles,
  IdCard,
  Briefcase,
  Layers,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useProcurement } from '../context/ProcurementContext';
import { useTheme } from '../context/ThemeContext';
import { AppleStripeBackground } from '../components/AppleStripeBackground';

export function LoginView() {
  const navigate = useNavigate();
  const { loginAsRole, registerUser, switchPersona } = useAuth();
  const { t, loadScenario, setOrgProfile, setSelectedDivision } = useProcurement();
  const { isDark, toggleTheme } = useTheme();

  const [isSignUp, setIsSignUp] = useState(false);
  const [authMethod, setAuthMethod] = useState('otp'); // 'otp' or 'sso'
  const [selectedRole, setSelectedRole] = useState('procurement');

  // ==========================================
  // STREAMLINED SIGN UP PARAMETERS
  // ==========================================
  // 1. Full Name
  const [fullName, setFullName] = useState('');

  // 2. Official Email Address + Email OTP State
  const [email, setEmail] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [emailOtpDigits, setEmailOtpDigits] = useState(['', '', '', '', '', '']);
  const [emailCountdown, setEmailCountdown] = useState(30);
  const [emailIsCounting, setEmailIsCounting] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState('');
  const emailOtpRefs = useRef([]);

  // 3. Mobile Number + 2FA Mobile OTP State
  const [signupMobile, setSignupMobile] = useState('');
  const [signupOtpDigits, setSignupOtpDigits] = useState(['', '', '', '', '', '']);
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [signupOtpVerified, setSignupOtpVerified] = useState(false);
  const [signupCountdown, setSignupCountdown] = useState(30);
  const [signupIsCounting, setSignupIsCounting] = useState(false);
  const [signupOtpError, setSignupOtpError] = useState('');
  const signupOtpRefs = useRef([]);

  // 4. Primary BIS Technical Division (Dropdown)
  const [primaryDivision, setPrimaryDivision] = useState('ETD');

  // 5. Secure Password
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // ==========================================
  // LOGIN MOBILE OTP STATE
  // ==========================================
  const [loginMobileNumber, setLoginMobileNumber] = useState('9810123456');
  const [loginOtpStep, setLoginOtpStep] = useState(1);
  const [loginOtpDigits, setLoginOtpDigits] = useState(['', '', '', '', '', '']);
  const [loginCountdown, setLoginCountdown] = useState(30);
  const [loginIsCounting, setLoginIsCounting] = useState(false);
  const [loginOtpError, setLoginOtpError] = useState('');
  const [loginOtpSuccess, setLoginOtpSuccess] = useState(false);
  const loginOtpRefs = useRef([]);

  // Timer for Login OTP Countdown
  useEffect(() => {
    let timer;
    if (loginIsCounting && loginCountdown > 0) {
      timer = setInterval(() => setLoginCountdown((c) => c - 1), 1000);
    } else if (loginCountdown === 0) {
      setLoginIsCounting(false);
    }
    return () => clearInterval(timer);
  }, [loginIsCounting, loginCountdown]);

  // Timer for Sign Up Mobile OTP Countdown
  useEffect(() => {
    let timer;
    if (signupIsCounting && signupCountdown > 0) {
      timer = setInterval(() => setSignupCountdown((c) => c - 1), 1000);
    } else if (signupCountdown === 0) {
      setSignupIsCounting(false);
    }
    return () => clearInterval(timer);
  }, [signupIsCounting, signupCountdown]);

  // Timer for Email OTP Countdown
  useEffect(() => {
    let timer;
    if (emailIsCounting && emailCountdown > 0) {
      timer = setInterval(() => setEmailCountdown((c) => c - 1), 1000);
    } else if (emailCountdown === 0) {
      setEmailIsCounting(false);
    }
    return () => clearInterval(timer);
  }, [emailIsCounting, emailCountdown]);

  // ----------------------------------------
  // LOGIN HANDLERS (Mobile OTP / SSO only)
  // ----------------------------------------
  const handleSendLoginOtp = (e) => {
    e?.preventDefault();
    if (!loginMobileNumber || loginMobileNumber.replace(/\D/g, '').length < 10) {
      setLoginOtpError(t?.otp?.invalidMobile || 'Invalid Mobile Number');
      return;
    }
    setLoginOtpError('');
    setLoginOtpStep(2);
    setLoginCountdown(30);
    setLoginIsCounting(true);
    setTimeout(() => {
      loginOtpRefs.current[0]?.focus();
    }, 100);
  };

  const handleLoginOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...loginOtpDigits];
    newDigits[index] = value;
    setLoginOtpDigits(newDigits);
    setLoginOtpError('');

    if (value && index < 5) {
      loginOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleLoginOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !loginOtpDigits[index] && index > 0) {
      loginOtpRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillLoginOtp = () => {
    const sampleOtp = ['7', '4', '2', '9', '1', '8'];
    setLoginOtpDigits(sampleOtp);
    setLoginOtpError('');
  };

  const handleVerifyLoginOtp = (e) => {
    e?.preventDefault();
    const enteredOtp = loginOtpDigits.join('');
    if (enteredOtp.length < 6) {
      setLoginOtpError(t?.otp?.invalidOtp || 'Invalid OTP');
      return;
    }

    setLoginOtpSuccess(true);
    confetti({ particleCount: 35, spread: 45, origin: { y: 0.8 } });

    setOrgProfile((prev) => ({
      ...prev,
      mobileNumber: `+91 ${loginMobileNumber}`
    }));

    setTimeout(() => {
      loginAsRole(selectedRole, 'Mobile 2-Factor OTP (+91 ' + loginMobileNumber + ')');
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

  // ----------------------------------------
  // SIGN UP HANDLERS
  // ----------------------------------------
  // Email OTP Handlers
  const handleSendEmailOtp = (e) => {
    e?.preventDefault();
    if (!email || !email.includes('@')) {
      setEmailOtpError('Enter a valid institutional email address');
      return;
    }
    setEmailOtpError('');
    setEmailOtpSent(true);
    setEmailCountdown(30);
    setEmailIsCounting(true);
    setTimeout(() => {
      emailOtpRefs.current[0]?.focus();
    }, 100);
  };

  const handleEmailOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...emailOtpDigits];
    newDigits[index] = value;
    setEmailOtpDigits(newDigits);
    setEmailOtpError('');

    if (value && index < 5) {
      emailOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleEmailOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !emailOtpDigits[index] && index > 0) {
      emailOtpRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillEmailOtp = () => {
    setEmailOtpDigits(['5', '8', '2', '4', '1', '9']);
    setEmailOtpError('');
  };

  const handleVerifyEmailOtp = () => {
    const entered = emailOtpDigits.join('');
    if (entered.length < 6) {
      setEmailOtpError('Please enter all 6 email OTP digits');
      return;
    }
    setEmailOtpVerified(true);
    setEmailOtpError('');
    confetti({ particleCount: 20, spread: 35, origin: { y: 0.7 } });
  };

  // Mobile OTP Handlers
  const handleSendSignupOtp = (e) => {
    e?.preventDefault();
    if (!signupMobile || signupMobile.replace(/\D/g, '').length < 10) {
      setSignupOtpError('Enter a valid 10-digit mobile number');
      return;
    }
    setSignupOtpError('');
    setSignupOtpSent(true);
    setSignupCountdown(30);
    setSignupIsCounting(true);
    setTimeout(() => {
      signupOtpRefs.current[0]?.focus();
    }, 100);
  };

  const handleSignupOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...signupOtpDigits];
    newDigits[index] = value;
    setSignupOtpDigits(newDigits);
    setSignupOtpError('');

    if (value && index < 5) {
      signupOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleSignupOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !signupOtpDigits[index] && index > 0) {
      signupOtpRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillSignupOtp = () => {
    setSignupOtpDigits(['8', '3', '9', '2', '0', '4']);
    setSignupOtpError('');
  };

  const handleVerifySignupOtp = () => {
    const entered = signupOtpDigits.join('');
    if (entered.length < 6) {
      setSignupOtpError('Please enter all 6 mobile OTP digits');
      return;
    }
    setSignupOtpVerified(true);
    setSignupOtpError('');
    confetti({ particleCount: 25, spread: 35, origin: { y: 0.7 } });
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();

    const activeName = fullName.trim() || 'Institutional Officer';
    const activeEmail = email.trim() || 'officer@gov.in';
    const activeMobile = signupMobile.trim() || '9810123456';

    // Register user in AuthContext
    registerUser({
      name: activeName,
      badgeId: 'GOV-IN-BIS-' + Math.floor(1000 + Math.random() * 9000),
      organization: 'National Procurement Entity',
      department: `Engineering Directorate — ${primaryDivision}`,
      email: activeEmail,
      mobile: `+91 ${activeMobile}`,
      role: 'procurement',
      roleTitle: 'Procurement Officer'
    });

    // Update ProcurementContext with new institutional profile
    setOrgProfile((prev) => ({
      ...prev,
      applicantName: activeName,
      mobileNumber: `+91 ${activeMobile}`,
      emailId: activeEmail
    }));

    if (setSelectedDivision) {
      setSelectedDivision(primaryDivision);
    }

    confetti({ particleCount: 45, spread: 60, origin: { y: 0.75 } });
    setTimeout(() => {
      navigate('/input');
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-500 relative font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Living Aurora Background */}
      <AppleStripeBackground />

      {/* Header Navigation */}
      <div className="absolute top-0 w-full flex justify-between items-center p-6 sm:px-8 z-20">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Gateway Home</span>
        </button>
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-white/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-xs"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Central Floating Card */}
      <div className="w-full max-w-5xl bg-white dark:bg-[#0F172A] rounded-[2.5rem] p-3 sm:p-5 shadow-2xl border border-slate-200/80 dark:border-white/10 flex flex-col lg:flex-row gap-5 relative z-10 overflow-hidden min-h-[580px] mt-16 sm:mt-12 transition-all duration-300">

        {/* Left Column - Auth Form */}
        <div className="flex-1 p-5 sm:p-8 lg:p-10 flex flex-col justify-start overflow-y-auto max-h-[85vh] scroll-smooth">

          <div className="w-full max-w-xl mx-auto flex flex-col justify-start my-auto">
            
            {/* Header / Title */}
            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 text-[11px] font-semibold mb-2.5 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isSignUp ? 'Institutional Officer Registration' : 'NIC e-Gov Gateway'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {isSignUp ? 'Create Official Account' : 'Sign in to your account'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-normal">
                {isSignUp
                  ? 'Streamlined institutional access with statutory verification and standards division mapping.'
                  : 'Authenticate using your verified mobile OTP or national SSO gateway.'}
              </p>
            </div>

            {/* ============================================================ */}
            {/* SIGN UP VIEW (STREAMLINED 5-FIELD GLASSMORPHIC REGISTRATION) */}
            {/* ============================================================ */}
            {isSignUp ? (
              <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4 text-left">
                
                {/* 1. Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    1. Full Name
                  </label>
                  <div className="relative flex items-center bg-transparent backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-white/20">
                    <User className="absolute left-3.5 w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Er. Vikramaditya Sharma"
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                {/* 2. Official Email Address (with integrated Verify/OTP button) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    2. Official Email Address
                  </label>
                  <div className="space-y-2.5">
                    <div className="flex gap-2">
                      <div className="relative flex-1 flex items-center bg-transparent backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-white/20">
                        <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. officer@metrorail.gov.in"
                          className="w-full pl-10 pr-4 py-2.5 text-xs bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-white font-mono font-medium"
                          disabled={emailOtpVerified}
                        />
                      </div>

                      {emailOtpVerified ? (
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl shrink-0 shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendEmailOtp}
                          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-all cursor-pointer shadow-xs shrink-0"
                        >
                          {emailOtpSent ? 'Resend' : 'Verify'}
                        </button>
                      )}
                    </div>

                    {/* Inline Email OTP Box */}
                    {emailOtpSent && !emailOtpVerified && (
                      <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 space-y-2.5 animate-in fade-in shadow-xs">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            Enter 6-Digit Email Code
                          </span>
                          <button
                            type="button"
                            onClick={handleAutoFillEmailOtp}
                            className="text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                          >
                            Auto-Fill Demo
                          </button>
                        </div>

                        <div className="grid grid-cols-6 gap-1.5">
                          {emailOtpDigits.map((digit, idx) => (
                            <input
                              key={idx}
                              ref={(el) => (emailOtpRefs.current[idx] = el)}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleEmailOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleEmailOtpKeyDown(idx, e)}
                              className="w-full h-10 text-center font-mono font-bold text-sm rounded-lg bg-transparent border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-xs"
                            />
                          ))}
                        </div>

                        {emailOtpError && (
                          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{emailOtpError}</p>
                        )}

                        <div className="flex items-center justify-between pt-0.5 text-xs">
                          {emailIsCounting ? (
                            <span className="text-[11px] text-slate-400 font-mono">
                              Resend in: {emailCountdown}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendEmailOtp}
                              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                            >
                              Resend Code
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={handleVerifyEmailOtp}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            Verify Code
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Mobile Number (with integrated 2FA Verify/OTP button) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    3. Mobile Number (2FA Authentication)
                  </label>
                  <div className="space-y-2.5">
                    <div className="flex gap-2">
                      <div className="relative flex-1 flex items-center bg-transparent backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-white/20">
                        <span className="pl-3.5 font-mono text-xs text-slate-400 font-semibold">+91</span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={signupMobile}
                          onChange={(e) => setSignupMobile(e.target.value.replace(/\D/g, ''))}
                          placeholder="9810 123 456"
                          className="w-full pl-2.5 pr-4 py-2.5 text-xs bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-white font-mono font-medium"
                          disabled={signupOtpVerified}
                        />
                      </div>

                      {signupOtpVerified ? (
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl shrink-0 shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                          <span>2FA Verified</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendSignupOtp}
                          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-all cursor-pointer shadow-xs shrink-0"
                        >
                          {signupOtpSent ? 'Resend' : 'Verify'}
                        </button>
                      )}
                    </div>

                    {/* Inline Mobile OTP Box */}
                    {signupOtpSent && !signupOtpVerified && (
                      <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 space-y-2.5 animate-in fade-in shadow-xs">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            Enter 6-Digit Mobile 2FA OTP
                          </span>
                          <button
                            type="button"
                            onClick={handleAutoFillSignupOtp}
                            className="text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                          >
                            Auto-Fill Demo
                          </button>
                        </div>

                        <div className="grid grid-cols-6 gap-1.5">
                          {signupOtpDigits.map((digit, idx) => (
                            <input
                              key={idx}
                              ref={(el) => (signupOtpRefs.current[idx] = el)}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleSignupOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleSignupOtpKeyDown(idx, e)}
                              className="w-full h-10 text-center font-mono font-bold text-sm rounded-lg bg-transparent border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-xs"
                            />
                          ))}
                        </div>

                        {signupOtpError && (
                          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{signupOtpError}</p>
                        )}

                        <div className="flex items-center justify-between pt-0.5 text-xs">
                          {signupIsCounting ? (
                            <span className="text-[11px] text-slate-400 font-mono">
                              Resend in: {signupCountdown}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendSignupOtp}
                              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                            >
                              Resend Code
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={handleVerifySignupOtp}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            Verify 2FA
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Primary BIS Technical Division (Dropdown) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    4. Primary BIS Technical Division
                  </label>
                  <div className="relative flex items-center bg-transparent backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-white/20">
                    <Layers className="absolute left-3.5 w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
                    <select
                      value={primaryDivision}
                      onChange={(e) => setPrimaryDivision(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-transparent dark:bg-[#111827] outline-none text-slate-900 dark:text-white font-medium cursor-pointer"
                    >
                      <option value="CED">CED (Civil Engineering)</option>
                      <option value="ETD">ETD (Electrotechnical)</option>
                      <option value="MTD">MTD (Mechanical)</option>
                      <option value="CHD">CHD (Chemical)</option>
                      <option value="LITD">LITD (Electronics & IT)</option>
                      <option value="TXD">TXD (Textiles)</option>
                    </select>
                  </div>
                </div>

                {/* 5. Secure Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    5. Secure Password
                  </label>
                  <div className="relative flex items-center bg-transparent backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-white/20">
                    <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter secure institutional password"
                      className="w-full pl-10 pr-10 py-2.5 text-xs bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-white font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium cursor-pointer"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* Statutory Checkbox */}
                <div className="flex items-start gap-2.5 px-0.5 pt-1">
                  <input
                    type="checkbox"
                    id="signup-terms"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 mt-0.5 cursor-pointer"
                    required
                  />
                  <label htmlFor="signup-terms" className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed cursor-pointer">
                    I confirm institutional authorization and agree to the <span className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">GFR 2017 & BIS Compliance Terms</span>.
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-md flex items-center justify-center gap-2 mt-1 cursor-pointer transition-all"
                >
                  <span>Complete Registration & Enter Gateway</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* ============================================================ */
              /* LOGIN VIEW (MOBILE OTP / NATIONAL SSO ONLY) */
              /* ============================================================ */
              <div className="flex flex-col gap-5">
                {/* Role Selection */}
                <div>
                  <h2 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Select Official Role
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('procurement')}
                      className={`transition-all cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
                        selectedRole === 'procurement'
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                          : 'bg-slate-50 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Procurement</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('evaluator')}
                      className={`transition-all cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
                        selectedRole === 'evaluator'
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                          : 'bg-slate-50 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Evaluator</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('auditor')}
                      className={`transition-all cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold ${
                        selectedRole === 'auditor'
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                          : 'bg-slate-50 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Audit</span>
                    </button>
                  </div>
                </div>

                {/* Auth Method Switcher Tabs */}
                <div className="flex p-1 bg-slate-100 dark:bg-white/[0.05] rounded-xl border border-slate-200/60 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('otp')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      authMethod === 'otp'
                        ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Mobile OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('sso')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      authMethod === 'sso'
                        ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    National SSO
                  </button>
                </div>

                {/* AUTH METHOD 1: Mobile OTP Workflow */}
                {authMethod === 'otp' && (
                  <div>
                    {loginOtpStep === 1 ? (
                      <form onSubmit={handleSendLoginOtp} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Registered Mobile Number
                          </label>
                          <div className="relative flex items-center bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all overflow-hidden">
                            <span className="absolute left-3.5 font-mono text-xs text-slate-400 font-semibold">
                              +91
                            </span>
                            <input
                              type="tel"
                              maxLength={10}
                              value={loginMobileNumber}
                              onChange={(e) => setLoginMobileNumber(e.target.value.replace(/\D/g, ''))}
                              placeholder="Enter 10-digit number"
                              className="w-full pl-11 pr-4 py-2.5 text-xs bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-white font-mono font-medium"
                            />
                          </div>
                          {loginOtpError && (
                            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-medium">{loginOtpError}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-[#131C2E] dark:hover:bg-[#1A253C] dark:border dark:border-white/10 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 mt-2 cursor-pointer transition-all"
                        >
                          <span>Send 6–Digit OTP</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyLoginOtp} className="space-y-5 animate-in fade-in duration-200">
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Mobile Number</p>
                            <p className="font-mono font-bold text-slate-900 dark:text-white text-xs mt-0.5">+91 {loginMobileNumber}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setLoginOtpStep(1)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold px-3 py-1 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 cursor-pointer shadow-xs"
                          >
                            Edit
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                              Enter 6-Digit OTP
                            </label>
                            <button
                              type="button"
                              onClick={handleAutoFillLoginOtp}
                              className="text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                            >
                              Auto-Fill Demo
                            </button>
                          </div>

                          {/* 6-Digit OTP Container */}
                          <div className="grid grid-cols-6 gap-2">
                            {loginOtpDigits.map((digit, idx) => (
                              <input
                                key={idx}
                                ref={(el) => (loginOtpRefs.current[idx] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleLoginOtpChange(idx, e.target.value)}
                                onKeyDown={(e) => handleLoginOtpKeyDown(idx, e)}
                                className="w-full h-11 text-center font-mono font-bold text-base rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                              />
                            ))}
                          </div>

                          {loginOtpError && (
                            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-medium">{loginOtpError}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          {loginIsCounting ? (
                            <span className="text-xs text-slate-400 font-mono">
                              Resend in: {loginCountdown}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendLoginOtp}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Resend OTP</span>
                            </button>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={loginOtpSuccess}
                          className={`w-full py-3 rounded-xl text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            loginOtpSuccess 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-slate-900 hover:bg-slate-800 dark:bg-[#131C2E] dark:hover:bg-[#1A253C] dark:border dark:border-white/10'
                          }`}
                        >
                          {loginOtpSuccess ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Verified & Logging In...</span>
                            </>
                          ) : (
                            <>
                              <span>Verify & Login</span>
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
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleSsoLogin('Jan Parichay (National SSO)')}
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-[#131C2E] dark:hover:bg-[#1A253C] dark:border dark:border-white/10 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Jan Parichay SSO</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleSsoLogin('MeriPehchaan SSO')}
                        className="py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors text-center cursor-pointer"
                      >
                        MeriPehchaan
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSsoLogin('GeM Portal SSO')}
                        className="py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors text-center cursor-pointer"
                      >
                        GeM Portal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mode Toggle Sign Up / Sign In */}
            <div className="mt-5 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-bold text-slate-900 dark:text-white hover:underline cursor-pointer"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-normal">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>Protected by 256-bit NIC e-Gov security.</span>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Demo Profiles (100% INTACT) */}
        <div className="flex-1 rounded-[2rem] p-8 lg:p-10 bg-[#111622] dark:bg-[#070B14] text-white border border-slate-800/80 dark:border-white/10 shadow-2xl flex flex-col relative overflow-y-auto">

          <div className="flex flex-col h-full w-full max-w-sm mx-auto justify-center">

            <div className="mb-6">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                QUICK DEMO PROFILES
              </span>
              <p className="text-xs text-slate-400 mt-1 font-normal leading-relaxed">
                Pre-configured profiles for instant evaluation without requiring real mobile OTP verification.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleQuickPersona('metro', 'underground_cable_metro')}
                className="w-full text-left bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/15 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-bold text-xs tracking-tight">
                    Er. Vikramaditya Sharma
                  </p>
                  <span className="bg-blue-500/15 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">
                    ETD
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1 font-normal">National Metro Rail (11kV Cables)</p>
              </button>

              <button
                onClick={() => handleQuickPersona('nhai', 'tmt_rebars_cement_nhai')}
                className="w-full text-left bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/15 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-bold text-xs tracking-tight">
                    Er. Rajeshwar Nath Kulkarni
                  </p>
                  <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">
                    CED
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1 font-normal">NHAI (Fe 500D TMT & OPC 53)</p>
              </button>

              <button
                onClick={() => handleQuickPersona('geda', 'solar_pumps_kusum')}
                className="w-full text-left bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/15 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-bold text-xs tracking-tight">
                    Dr. Jayeshbhai Patel
                  </p>
                  <span className="bg-amber-500/15 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">
                    LITD
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1 font-normal">GEDA (PM-KUSUM Solar Pumps)</p>
              </button>

              <button
                onClick={() => handleQuickPersona('audit', 'underground_cable_metro')}
                className="w-full text-left bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/15 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-bold text-xs tracking-tight">
                    Smt. Ananya Sen, IA&AS
                  </p>
                  <span className="bg-purple-500/15 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">
                    AUDIT
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1 font-normal">Comptroller & Auditor General</p>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginView;
