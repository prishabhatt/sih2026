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
  Check,
  Globe
} from 'lucide-react';
import { triggerVerification } from "../utils/verificationPulse";
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
  const [authMethod, setAuthMethod] = useState('email'); // 'email', 'mobile', or 'sso'
  const [selectedRole, setSelectedRole] = useState('procurement');

  // ==========================================
  // GOOGLE SIGN-IN STATE
  // ==========================================
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  // ==========================================
  // EMAIL LOGIN VERIFICATION STATE
  // ==========================================
  const [loginEmail, setLoginEmail] = useState('v.sharma@metrorail.delhi.gov.in');
  const [loginEmailStep, setLoginEmailStep] = useState(1);
  const [loginEmailDigits, setLoginEmailDigits] = useState(['', '', '', '', '', '']);
  const [loginEmailCountdown, setLoginEmailCountdown] = useState(30);
  const [loginEmailIsCounting, setLoginEmailIsCounting] = useState(false);
  const [loginEmailError, setLoginEmailError] = useState('');
  const [loginEmailSuccess, setLoginEmailSuccess] = useState(false);
  const loginEmailRefs = useRef([]);

  // ==========================================
  // MOBILE LOGIN OTP STATE
  // ==========================================
  const [loginMobileNumber, setLoginMobileNumber] = useState('9810123456');
  const [loginMobileStep, setLoginMobileStep] = useState(1);
  const [loginMobileDigits, setLoginMobileDigits] = useState(['', '', '', '', '', '']);
  const [loginMobileCountdown, setLoginMobileCountdown] = useState(30);
  const [loginMobileIsCounting, setLoginMobileIsCounting] = useState(false);
  const [loginMobileError, setLoginMobileError] = useState('');
  const [loginMobileSuccess, setLoginMobileSuccess] = useState(false);
  const loginMobileRefs = useRef([]);

  // ==========================================
  // STREAMLINED SIGN UP PARAMETERS
  // ==========================================
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [emailOtpDigits, setEmailOtpDigits] = useState(['', '', '', '', '', '']);
  const [emailCountdown, setEmailCountdown] = useState(30);
  const [emailIsCounting, setEmailIsCounting] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState('');
  const emailOtpRefs = useRef([]);

  const [signupMobile, setSignupMobile] = useState('');
  const [signupOtpDigits, setSignupOtpDigits] = useState(['', '', '', '', '', '']);
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [signupOtpVerified, setSignupOtpVerified] = useState(false);
  const [signupCountdown, setSignupCountdown] = useState(30);
  const [signupIsCounting, setSignupIsCounting] = useState(false);
  const [signupOtpError, setSignupOtpError] = useState('');
  const signupOtpRefs = useRef([]);

  const [primaryDivision, setPrimaryDivision] = useState('ETD');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Timers
  useEffect(() => {
    let timer;
    if (loginEmailIsCounting && loginEmailCountdown > 0) {
      timer = setInterval(() => setLoginEmailCountdown((c) => c - 1), 1000);
    } else if (loginEmailCountdown === 0) {
      setLoginEmailIsCounting(false);
    }
    return () => clearInterval(timer);
  }, [loginEmailIsCounting, loginEmailCountdown]);

  useEffect(() => {
    let timer;
    if (loginMobileIsCounting && loginMobileCountdown > 0) {
      timer = setInterval(() => setLoginMobileCountdown((c) => c - 1), 1000);
    } else if (loginMobileCountdown === 0) {
      setLoginMobileIsCounting(false);
    }
    return () => clearInterval(timer);
  }, [loginMobileIsCounting, loginMobileCountdown]);

  useEffect(() => {
    let timer;
    if (signupIsCounting && signupCountdown > 0) {
      timer = setInterval(() => setSignupCountdown((c) => c - 1), 1000);
    } else if (signupCountdown === 0) {
      setSignupIsCounting(false);
    }
    return () => clearInterval(timer);
  }, [signupIsCounting, signupCountdown]);

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
  // GOOGLE SIGN-IN HANDLER
  // ----------------------------------------
  const handleGoogleSignIn = () => {
    setIsGoogleSigningIn(true);
    setTimeout(() => {
      triggerVerification({
        title: 'Google Workspace Verified',
        badge: 'Government Official SSO',
        description: 'Identity authenticated via verified institutional Google Workspace directory.'
      });
      setOrgProfile((prev) => ({
        ...prev,
        applicantName: 'Er. Vikramaditya Sharma',
        emailId: 'v.sharma@metrorail.delhi.gov.in',
        mobileNumber: '+91 9810123456'
      }));
      loginAsRole(selectedRole, 'Google Workspace SSO (Verified Official)');
      navigate('/input');
    }, 600);
  };

  // ----------------------------------------
  // EMAIL LOGIN HANDLERS
  // ----------------------------------------
  const handleSendLoginEmailCode = (e) => {
    e?.preventDefault();
    if (!loginEmail || !loginEmail.includes('@')) {
      setLoginEmailError('Please enter a valid institutional email address');
      return;
    }
    setLoginEmailError('');
    setLoginEmailStep(2);
    setLoginEmailCountdown(30);
    setLoginEmailIsCounting(true);
    setTimeout(() => {
      loginEmailRefs.current[0]?.focus();
    }, 100);
  };

  const handleLoginEmailDigitChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...loginEmailDigits];
    newDigits[index] = value;
    setLoginEmailDigits(newDigits);
    setLoginEmailError('');

    if (value && index < 5) {
      loginEmailRefs.current[index + 1]?.focus();
    }
  };

  const handleLoginEmailDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !loginEmailDigits[index] && index > 0) {
      loginEmailRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillLoginEmailCode = () => {
    setLoginEmailDigits(['9', '2', '4', '8', '1', '6']);
    setLoginEmailError('');
  };

  const handleVerifyLoginEmailCode = (e) => {
    e?.preventDefault();
    const entered = loginEmailDigits.join('');
    if (entered.length < 6) {
      setLoginEmailError('Please enter the complete 6-digit email verification code');
      return;
    }

    setLoginEmailSuccess(true);
    triggerVerification({
      title: 'Official Email Verified',
      badge: 'NIC e-Gov Token Active',
      description: `2-Factor security clearance verified for ${loginEmail}.`
    });

    setOrgProfile((prev) => ({
      ...prev,
      emailId: loginEmail
    }));

    setTimeout(() => {
      loginAsRole(selectedRole, `Email Verified (${loginEmail})`);
      navigate('/input');
    }, 700);
  };

  // ----------------------------------------
  // MOBILE OTP LOGIN HANDLERS
  // ----------------------------------------
  const handleSendLoginMobileOtp = (e) => {
    e?.preventDefault();
    if (!loginMobileNumber || loginMobileNumber.replace(/\D/g, '').length < 10) {
      setLoginMobileError('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoginMobileError('');
    setLoginMobileStep(2);
    setLoginMobileCountdown(30);
    setLoginMobileIsCounting(true);
    setTimeout(() => {
      loginMobileRefs.current[0]?.focus();
    }, 100);
  };

  const handleLoginMobileDigitChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...loginMobileDigits];
    newDigits[index] = value;
    setLoginMobileDigits(newDigits);
    setLoginMobileError('');

    if (value && index < 5) {
      loginMobileRefs.current[index + 1]?.focus();
    }
  };

  const handleLoginMobileDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !loginMobileDigits[index] && index > 0) {
      loginMobileRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillLoginMobileOtp = () => {
    setLoginMobileDigits(['7', '4', '2', '9', '1', '8']);
    setLoginMobileError('');
  };

  const handleVerifyLoginMobileOtp = (e) => {
    e?.preventDefault();
    const enteredOtp = loginMobileDigits.join('');
    if (enteredOtp.length < 6) {
      setLoginMobileError('Please enter the complete 6-digit mobile OTP');
      return;
    }

    setLoginMobileSuccess(true);
    triggerVerification({
      title: 'Mobile 2FA Verified',
      badge: 'Biometric & SMS Token Validated',
      description: `Encrypted 2-Factor session verified for +91 ${loginMobileNumber}.`
    });

    setOrgProfile((prev) => ({
      ...prev,
      mobileNumber: `+91 ${loginMobileNumber}`
    }));

    setTimeout(() => {
      loginAsRole(selectedRole, `Mobile 2FA (+91 ${loginMobileNumber})`);
      navigate('/input');
    }, 700);
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
    if (value && index < 5) emailOtpRefs.current[index + 1]?.focus();
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
    triggerVerification({
      title: 'Institutional Email Verified',
      badge: 'Valid Government Domain',
      description: `Official email address (${email}) successfully authenticated.`
    });
  };

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
    if (value && index < 5) signupOtpRefs.current[index + 1]?.focus();
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
    triggerVerification({
      title: 'Mobile 2FA Authenticated',
      badge: 'Verified SMS OTP',
      description: `Mobile number (+91 ${signupMobile}) verified for dual-factor access.`
    });
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    const activeName = fullName.trim() || 'Institutional Officer';
    const activeEmail = email.trim() || 'officer@gov.in';
    const activeMobile = signupMobile.trim() || '9810123456';

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

    setOrgProfile((prev) => ({
      ...prev,
      applicantName: activeName,
      mobileNumber: `+91 ${activeMobile}`,
      emailId: activeEmail
    }));

    if (setSelectedDivision) {
      setSelectedDivision(primaryDivision);
    }

    triggerVerification({
      title: 'Officer Account Provisioned',
      badge: 'BIS Authorized Evaluator',
      description: `Statutory permissions granted under BIS Act 2016 for ${activeName}.`
    });
    setTimeout(() => {
      navigate('/input');
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-[#F8FAFC] dark:bg-[#090A0F] text-slate-900 dark:text-slate-100 transition-colors duration-500 relative font-sans selection:bg-[#292524] selection:text-white">

      {/* Living Aurora Background */}
      <AppleStripeBackground />

      {/* Header Navigation */}
      <div className="absolute top-0 w-full flex justify-between items-center p-6 sm:px-8 z-20">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white/70 dark:bg-white/5 border border-white dark:border-white/10 backdrop-blur-xl transition-all cursor-pointer shadow-xs hover:scale-105"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Gateway Home</span>
        </button>
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-white/70 dark:bg-white/5 border border-white dark:border-white/10 backdrop-blur-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all cursor-pointer shadow-xs"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Central Glassmorphic Card Matching Input Specs */}
      <div className="w-full max-w-5xl bg-white/70 dark:bg-[#12141C]/80 backdrop-blur-2xl rounded-[2.5rem] p-3 sm:p-5 shadow-2xl border border-white dark:border-white/20 flex flex-col lg:flex-row gap-5 relative z-10 overflow-hidden min-h-[580px] mt-16 sm:mt-12 transition-all duration-300">

        {/* Left Column - Auth Form */}
        <div className="flex-1 p-5 sm:p-8 lg:p-10 flex flex-col justify-start overflow-y-auto max-h-[85vh] scroll-smooth">

          <div className="w-full max-w-xl mx-auto flex flex-col justify-start my-auto">

            {/* Header / Title */}
            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 border border-white dark:border-white/20 text-slate-800 dark:text-slate-200 text-xs font-bold mb-2.5 shadow-xs backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{isSignUp ? 'Institutional Officer Registration' : 'NIC e-Gov Gateway'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                {isSignUp ? 'Create Official Account' : 'Sign in to your account'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-normal">
                {isSignUp
                  ? 'Streamlined institutional access with statutory verification and standards division mapping.'
                  : 'Authenticate using verified Google SSO, institutional Email verification, or Mobile 2FA OTP.'}
              </p>
            </div>

            {/* ============================================================ */}
            {/* SIGN UP VIEW (STREAMLINED 5-FIELD REGISTRATION)               */}
            {/* ============================================================ */}
            {isSignUp ? (
              <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4 text-left">

                {/* 1. Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    1. Full Name
                  </label>
                  <div className="relative flex items-center bg-white/80 dark:bg-white/[0.04] backdrop-blur-md border border-white dark:border-white/20 rounded-xl focus-within:ring-2 focus-within:ring-slate-900/10 transition-all overflow-hidden shadow-xs">
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

                {/* 2. Official Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    2. Official Email Address (Verification)
                  </label>
                  <div className="space-y-2.5">
                    <div className="flex gap-2">
                      <div className="relative flex-1 flex items-center bg-white/80 dark:bg-white/[0.04] backdrop-blur-md border border-white dark:border-white/20 rounded-xl focus-within:ring-2 focus-within:ring-slate-900/10 transition-all overflow-hidden shadow-xs">
                        <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. officer@metrorail.gov.in"
                          className="w-full pl-10 pr-4 py-2.5 text-xs bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-white font-medium"
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
                          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#0B1E36] hover:bg-[#132845] dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-all cursor-pointer shadow-xs shrink-0"
                        >
                          {emailOtpSent ? 'Resend' : 'Verify'}
                        </button>
                      )}
                    </div>

                    {emailOtpSent && !emailOtpVerified && (
                      <div className="p-3.5 rounded-xl bg-white/80 dark:bg-black/30 backdrop-blur-md border border-white dark:border-white/20 space-y-2.5 animate-in fade-in shadow-xs">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            Enter 6-Digit Email Code
                          </span>
                          <button
                            type="button"
                            onClick={handleAutoFillEmailOtp}
                            className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
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
                              className="w-full h-10 text-center font-bold text-sm rounded-lg bg-white dark:bg-white/10 border border-white dark:border-white/20 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900/10 outline-none shadow-xs"
                            />
                          ))}
                        </div>

                        {emailOtpError && (
                          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{emailOtpError}</p>
                        )}

                        <div className="flex items-center justify-between pt-0.5 text-xs">
                          {emailIsCounting ? (
                            <span className="text-[11px] text-slate-400 font-medium">
                              Resend in: {emailCountdown}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendEmailOtp}
                              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
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

                {/* 3. Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    3. Mobile Number (2FA Authentication)
                  </label>
                  <div className="space-y-2.5">
                    <div className="flex gap-2">
                      <div className="relative flex-1 flex items-center bg-white/80 dark:bg-white/[0.04] backdrop-blur-md border border-white dark:border-white/20 rounded-xl focus-within:ring-2 focus-within:ring-slate-900/10 transition-all overflow-hidden shadow-xs">
                        <span className="pl-3.5 text-xs text-slate-400 font-bold">+91</span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={signupMobile}
                          onChange={(e) => setSignupMobile(e.target.value.replace(/\D/g, ''))}
                          placeholder="9810 123 456"
                          className="w-full pl-2.5 pr-4 py-2.5 text-xs bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-white font-medium"
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
                          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#0B1E36] hover:bg-[#132845] dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-all cursor-pointer shadow-xs shrink-0"
                        >
                          {signupOtpSent ? 'Resend' : 'Verify'}
                        </button>
                      )}
                    </div>

                    {signupOtpSent && !signupOtpVerified && (
                      <div className="p-3.5 rounded-xl bg-white/80 dark:bg-black/30 backdrop-blur-md border border-white dark:border-white/20 space-y-2.5 animate-in fade-in shadow-xs">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            Enter 6-Digit Mobile 2FA OTP
                          </span>
                          <button
                            type="button"
                            onClick={handleAutoFillSignupOtp}
                            className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
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
                              className="w-full h-10 text-center font-bold text-sm rounded-lg bg-white dark:bg-white/10 border border-white dark:border-white/20 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900/10 outline-none shadow-xs"
                            />
                          ))}
                        </div>

                        {signupOtpError && (
                          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">{signupOtpError}</p>
                        )}

                        <div className="flex items-center justify-between pt-0.5 text-xs">
                          {signupIsCounting ? (
                            <span className="text-[11px] text-slate-400 font-medium">
                              Resend in: {signupCountdown}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendSignupOtp}
                              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
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

                {/* 4. Primary BIS Technical Division */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    4. Primary BIS Technical Division
                  </label>
                  <div className="relative flex items-center bg-white/80 dark:bg-white/[0.04] backdrop-blur-md border border-white dark:border-white/20 rounded-xl focus-within:ring-2 focus-within:ring-slate-900/10 transition-all overflow-hidden shadow-xs">
                    <Layers className="absolute left-3.5 w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
                    <select
                      value={primaryDivision}
                      onChange={(e) => setPrimaryDivision(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-transparent dark:bg-[#111827] outline-none text-slate-900 dark:text-white font-bold cursor-pointer"
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
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    5. Secure Password
                  </label>
                  <div className="relative flex items-center bg-white/80 dark:bg-white/[0.04] backdrop-blur-md border border-white dark:border-white/20 rounded-xl focus-within:ring-2 focus-within:ring-slate-900/10 transition-all overflow-hidden shadow-xs">
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
                      className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold cursor-pointer"
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
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4 mt-0.5 cursor-pointer"
                    required
                  />
                  <label htmlFor="signup-terms" className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed cursor-pointer">
                    I confirm institutional authorization and agree to the <span className="text-slate-900 dark:text-white hover:underline font-bold">GFR 2017 & BIS Compliance Terms</span>.
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#0B1E36] hover:bg-[#132845] dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-black shadow-md flex items-center justify-center gap-2 mt-1 cursor-pointer transition-all border border-white/40"
                >
                  <span>Complete Registration & Enter Gateway</span>
                  <ArrowRight className="w-4 h-4 text-amber-400 dark:text-slate-900" />
                </button>
              </form>
            ) : (
              /* ============================================================ */
              /* SIGN IN VIEW: GOOGLE SSO + EMAIL VERIFICATION + MOBILE OTP   */
              /* ============================================================ */
              <div className="flex flex-col gap-4">

                {/* 1. PRIMARY: Sign in with Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleSigningIn}
                  className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-bold border border-white dark:border-white/20 shadow-md flex items-center justify-center gap-3 transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{isGoogleSigningIn ? 'Authenticating with Google...' : 'Sign in with Google Workspace'}</span>
                </button>

                {/* Elegant Divider */}
                <div className="relative flex items-center justify-center my-1">
                  <div className="border-t border-slate-300/80 dark:border-white/10 w-full" />
                  <span className="bg-transparent px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                    Or choose authentication method
                  </span>
                  <div className="border-t border-slate-300/80 dark:border-white/10 w-full" />
                </div>

                {/* Role Selection */}
                <div>
                  <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Select Official Role
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('procurement')}
                      className={`transition-all cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold ${selectedRole === 'procurement'
                          ? 'bg-[#0B1E36] dark:bg-white text-white dark:text-slate-900 shadow-sm'
                          : 'bg-white/60 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-white dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 backdrop-blur-md'
                        }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Procurement</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('evaluator')}
                      className={`transition-all cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold ${selectedRole === 'evaluator'
                          ? 'bg-[#0B1E36] dark:bg-white text-white dark:text-slate-900 shadow-sm'
                          : 'bg-white/60 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-white dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 backdrop-blur-md'
                        }`}
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Evaluator</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('auditor')}
                      className={`transition-all cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold ${selectedRole === 'auditor'
                          ? 'bg-[#0B1E36] dark:bg-white text-white dark:text-slate-900 shadow-sm'
                          : 'bg-white/60 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-white dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 backdrop-blur-md'
                        }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Audit</span>
                    </button>
                  </div>
                </div>

                {/* 3-Tab Switcher: Email Verification | Mobile OTP | National SSO */}
                <div className="flex p-1 bg-slate-200/60 dark:bg-white/[0.05] rounded-xl border border-white dark:border-white/10 backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('email')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${authMethod === 'email'
                        ? 'bg-white dark:bg-white/20 text-slate-950 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                      }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-500" />
                    <span>Email Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('mobile')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${authMethod === 'mobile'
                        ? 'bg-white dark:bg-white/20 text-slate-950 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                      }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Mobile OTP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('sso')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${authMethod === 'sso'
                        ? 'bg-white dark:bg-white/20 text-slate-950 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                      }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                    <span>National SSO</span>
                  </button>
                </div>

                {/* METHOD 1: EMAIL VERIFICATION */}
                {authMethod === 'email' && (
                  <div>
                    {loginEmailStep === 1 ? (
                      <form onSubmit={handleSendLoginEmailCode} className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Institutional / Official Email Address
                          </label>
                          <div className="relative flex items-center bg-white/80 dark:bg-white/[0.04] border border-white dark:border-white/20 rounded-xl focus-within:ring-2 focus-within:ring-slate-900/10 transition-all overflow-hidden shadow-xs backdrop-blur-md">
                            <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 shrink-0" />
                            <input
                              type="email"
                              required
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              placeholder="e.g. officer@metrorail.delhi.gov.in"
                              className="w-full pl-10 pr-4 py-2.5 text-xs bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-white font-medium"
                            />
                          </div>
                          {loginEmailError && (
                            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-medium">{loginEmailError}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 rounded-xl bg-[#0B1E36] hover:bg-[#132845] dark:bg-white/20 dark:hover:bg-white/30 text-white text-xs font-extrabold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all border border-white/60 dark:border-white/40"
                        >
                          <span>Send 6–Digit Email Verification Code</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyLoginEmailCode} className="space-y-4 animate-in fade-in duration-200">
                        <div className="p-3 rounded-xl bg-white/80 dark:bg-white/[0.04] border border-white dark:border-white/20 flex items-center justify-between backdrop-blur-md">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Email Address</p>
                            <p className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">{loginEmail}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setLoginEmailStep(1)}
                            className="text-xs text-slate-700 dark:text-slate-300 hover:underline font-bold px-3 py-1 rounded-lg bg-white dark:bg-white/10 border border-white dark:border-white/20 cursor-pointer shadow-xs"
                          >
                            Edit
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Enter 6-Digit Email Code
                            </label>
                            <button
                              type="button"
                              onClick={handleAutoFillLoginEmailCode}
                              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
                            >
                              Auto-Fill Demo
                            </button>
                          </div>

                          <div className="grid grid-cols-6 gap-2">
                            {loginEmailDigits.map((digit, idx) => (
                              <input
                                key={idx}
                                ref={(el) => (loginEmailRefs.current[idx] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleLoginEmailDigitChange(idx, e.target.value)}
                                onKeyDown={(e) => handleLoginEmailDigitKeyDown(idx, e)}
                                className="w-full h-11 text-center font-bold text-base rounded-xl bg-white/80 dark:bg-white/[0.04] border border-white dark:border-white/20 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all shadow-xs backdrop-blur-md"
                              />
                            ))}
                          </div>

                          {loginEmailError && (
                            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-medium">{loginEmailError}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          {loginEmailIsCounting ? (
                            <span className="text-xs text-slate-400 font-medium">
                              Resend code in: {loginEmailCountdown}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendLoginEmailCode}
                              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Resend Email Code</span>
                            </button>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={loginEmailSuccess}
                          className={`w-full py-3 rounded-xl text-white text-xs font-extrabold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/60 dark:border-white/40 ${loginEmailSuccess
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#0B1E36] hover:bg-[#132845] dark:bg-white/20 dark:hover:bg-white/30'
                            }`}
                        >
                          {loginEmailSuccess ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Verified & Logging In...</span>
                            </>
                          ) : (
                            <>
                              <span>Verify Email & Enter Portal</span>
                              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* METHOD 2: MOBILE OTP */}
                {authMethod === 'mobile' && (
                  <div>
                    {loginMobileStep === 1 ? (
                      <form onSubmit={handleSendLoginMobileOtp} className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Registered Mobile Number
                          </label>
                          <div className="relative flex items-center bg-white/80 dark:bg-white/[0.04] border border-white dark:border-white/20 rounded-xl focus-within:ring-2 focus-within:ring-slate-900/10 transition-all overflow-hidden shadow-xs backdrop-blur-md">
                            <span className="absolute left-3.5 text-xs text-slate-400 font-bold">
                              +91
                            </span>
                            <input
                              type="tel"
                              maxLength={10}
                              value={loginMobileNumber}
                              onChange={(e) => setLoginMobileNumber(e.target.value.replace(/\D/g, ''))}
                              placeholder="Enter 10-digit number"
                              className="w-full pl-11 pr-4 py-2.5 text-xs bg-transparent outline-none placeholder:text-slate-400 text-slate-900 dark:text-white font-medium"
                            />
                          </div>
                          {loginMobileError && (
                            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-medium">{loginMobileError}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 rounded-xl bg-[#0B1E36] hover:bg-[#132845] dark:bg-white/20 dark:hover:bg-white/30 text-white text-xs font-extrabold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all border border-white/60 dark:border-white/40"
                        >
                          <span>Send 6–Digit Mobile OTP</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyLoginMobileOtp} className="space-y-4 animate-in fade-in duration-200">
                        <div className="p-3 rounded-xl bg-white/80 dark:bg-white/[0.04] border border-white dark:border-white/20 flex items-center justify-between backdrop-blur-md">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Mobile Number</p>
                            <p className="font-bold text-slate-900 dark:text-white text-xs mt-0.5">+91 {loginMobileNumber}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setLoginMobileStep(1)}
                            className="text-xs text-slate-700 dark:text-slate-300 hover:underline font-bold px-3 py-1 rounded-lg bg-white dark:bg-white/10 border border-white dark:border-white/20 cursor-pointer shadow-xs"
                          >
                            Edit
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              Enter 6-Digit OTP
                            </label>
                            <button
                              type="button"
                              onClick={handleAutoFillLoginMobileOtp}
                              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
                            >
                              Auto-Fill Demo
                            </button>
                          </div>

                          <div className="grid grid-cols-6 gap-2">
                            {loginMobileDigits.map((digit, idx) => (
                              <input
                                key={idx}
                                ref={(el) => (loginMobileRefs.current[idx] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleLoginMobileDigitChange(idx, e.target.value)}
                                onKeyDown={(e) => handleLoginMobileDigitKeyDown(idx, e)}
                                className="w-full h-11 text-center font-bold text-base rounded-xl bg-white/80 dark:bg-white/[0.04] border border-white dark:border-white/20 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-900/10 focus:outline-none transition-all shadow-xs backdrop-blur-md"
                              />
                            ))}
                          </div>

                          {loginMobileError && (
                            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 font-medium">{loginMobileError}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          {loginMobileIsCounting ? (
                            <span className="text-xs text-slate-400 font-medium">
                              Resend in: {loginMobileCountdown}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendLoginMobileOtp}
                              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Resend OTP</span>
                            </button>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={loginMobileSuccess}
                          className={`w-full py-3 rounded-xl text-white text-xs font-extrabold shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/60 dark:border-white/40 ${loginMobileSuccess
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#0B1E36] hover:bg-[#132845] dark:bg-white/20 dark:hover:bg-white/30'
                            }`}
                        >
                          {loginMobileSuccess ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Verified & Logging In...</span>
                            </>
                          ) : (
                            <>
                              <span>Verify & Enter Portal</span>
                              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* METHOD 3: NATIONAL SSO OPTIONS */}
                {authMethod === 'sso' && (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleSsoLogin('Jan Parichay (National SSO)')}
                      className="w-full py-3 rounded-xl bg-[#0B1E36] hover:bg-[#132845] dark:bg-white/20 dark:hover:bg-white/30 border border-white/60 dark:border-white/40 text-white text-xs font-extrabold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Jan Parichay National SSO</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleSsoLogin('MeriPehchaan SSO')}
                        className="py-2.5 px-3 rounded-xl bg-white/70 dark:bg-white/[0.04] border border-white dark:border-white/20 hover:bg-white text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors text-center cursor-pointer backdrop-blur-md shadow-xs"
                      >
                        MeriPehchaan
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSsoLogin('GeM Portal SSO')}
                        className="py-2.5 px-3 rounded-xl bg-white/70 dark:bg-white/[0.04] border border-white dark:border-white/20 hover:bg-white text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors text-center cursor-pointer backdrop-blur-md shadow-xs"
                      >
                        GeM Portal SSO
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mode Toggle Sign Up / Sign In */}
            <div className="mt-5 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                {isSignUp ? "Already have an official account? " : "Don't have an official account? "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-bold text-slate-950 dark:text-white hover:underline cursor-pointer"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-normal">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>Protected by 256-bit NIC e-Gov statutory encryption.</span>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Demo Profiles (Matching Glassmorphism) */}
        <div className="flex-1 rounded-[2rem] p-8 lg:p-10 bg-[#111622] dark:bg-[#070B14] text-white border border-white/20 dark:border-white/10 shadow-2xl flex flex-col relative overflow-y-auto">

          <div className="flex flex-col h-full w-full max-w-sm mx-auto justify-center">

            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                QUICK DEMO PROFILES
              </span>
              <p className="text-xs text-slate-400 mt-1 font-normal leading-relaxed">
                Pre-configured profiles for instant evaluation without requiring manual email or mobile OTP verification.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleQuickPersona('metro', 'underground_cable_metro')}
                className="w-full text-left bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-white/30 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-bold text-xs tracking-tight">
                    Er. Vikramaditya Sharma
                  </p>
                  <span className="bg-white/15 text-slate-200 border border-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    ETD
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1 font-normal">National Metro Rail (11kV Cables)</p>
              </button>

              <button
                onClick={() => handleQuickPersona('nhai', 'tmt_rebars_cement_nhai')}
                className="w-full text-left bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-white/30 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-bold text-xs tracking-tight">
                    Er. Rajeshwar Nath Kulkarni
                  </p>
                  <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    CED
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1 font-normal">NHAI (Fe 500D TMT & OPC 53)</p>
              </button>

              <button
                onClick={() => handleQuickPersona('geda', 'solar_pumps_kusum')}
                className="w-full text-left bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-white/30 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-bold text-xs tracking-tight">
                    Dr. Jayeshbhai Patel
                  </p>
                  <span className="bg-amber-500/15 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    LITD
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1 font-normal">GEDA (PM-KUSUM Solar Pumps)</p>
              </button>

              <button
                onClick={() => handleQuickPersona('audit', 'underground_cable_metro')}
                className="w-full text-left bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-white/30 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white font-bold text-xs tracking-tight">
                    Smt. Ananya Sen, IA&AS
                  </p>
                  <span className="bg-purple-500/15 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
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

