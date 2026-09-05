import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

// ─────────────────────────────────────────────────────────────
// DEMO PERSONAS — kept intact so switchPersona / loadScenario
// still work exactly as before for the quick-access demo cards.
// ─────────────────────────────────────────────────────────────
const DEMO_PERSONAS = {
  metro: {
    id: 'usr_metro_01',
    name: 'Er. Vikramaditya Sharma',
    role: 'procurement',
    roleTitle: 'Procurement Officer',
    organization: 'National Metro Rail Corporation Ltd',
    department: 'Electrical Rolling Stock & Traction Wing',
    email: 'v.sharma@metrorail.delhi.gov.in',
    mobile: '+91 98101 23456',
    ssoProvider: 'Jan Parichay (National SSO)',
    badgeId: 'GOV-DEL-ETD-8821',
    securityClearance: 'Level-3 (Confidential B2B Tenders)'
  },
  nhai: {
    id: 'usr_nhai_02',
    name: 'Er. Rajeshwar Nath Kulkarni',
    role: 'evaluator',
    roleTitle: 'Technical Bid Evaluator',
    organization: 'National Highways Authority of India (NHAI)',
    department: 'Structures, Bridges & Elevated Viaducts Cell',
    email: 'r.kulkarni@nhai.gov.in',
    mobile: '+91 94220 87654',
    ssoProvider: 'MeriPehchaan SSO',
    badgeId: 'GOV-NHAI-CED-4109',
    securityClearance: 'Level-3 (Structural Integrity Cell)'
  },
  audit: {
    id: 'usr_audit_03',
    name: 'Smt. Ananya Sen, IA&AS',
    role: 'auditor',
    roleTitle: 'Principal Director of Audit (Vigilance)',
    organization: 'Office of Comptroller & Auditor General of India',
    department: 'Commercial & Infrastructure Audit Wing',
    email: 'ananya.sen@cag.gov.in',
    mobile: '+91 98300 55443',
    ssoProvider: 'Gov NIC Portal SSO',
    badgeId: 'CAG-HQ-AUDIT-007',
    securityClearance: 'Level-1 (National Statutory Audit)'
  },
  geda: {
    id: 'usr_geda_04',
    name: 'Dr. Jayeshbhai Patel',
    role: 'procurement',
    roleTitle: 'Director of Renewable Procurement',
    organization: 'Gujarat Energy Development Agency (GEDA)',
    department: 'Solar Pumping & PM-KUSUM Mission',
    email: 'j.patel@geda.gujarat.gov.in',
    mobile: '+91 98250 11223',
    ssoProvider: 'GeM Portal SSO',
    badgeId: 'GUJ-GEDA-LITD-302',
    securityClearance: 'Level-2 (State Renewable Tenders)'
  }
};

// ─────────────────────────────────────────────────────────────
// Helper: map a Firebase user → the shape the rest of the app
// expects, with sensible fallbacks for optional fields.
// ─────────────────────────────────────────────────────────────
function mapFirebaseUser(firebaseUser, overrides = {}) {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || overrides.name || 'Officer',
    role: overrides.role || 'procurement',
    roleTitle: overrides.roleTitle || 'Procurement Officer',
    organization: overrides.organization || 'Government Department',
    department: overrides.department || 'Engineering Wing',
    email: firebaseUser.email || '',
    mobile: overrides.mobile || '',
    ssoProvider: overrides.ssoProvider || 'Firebase Auth',
    badgeId: overrides.badgeId || ('GOV-ID-' + firebaseUser.uid.slice(-4).toUpperCase()),
    securityClearance: 'Level-3 (Statutory E-Procurement Verified)',
    photoURL: firebaseUser.photoURL || null,
  };
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // ─── Sync Firebase auth state ──────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser((prev) => {
          // If we already have a richer local profile (e.g. from registerUser),
          // keep it but refresh immutable Firebase fields.
          if (prev && prev.id === firebaseUser.uid) {
            return { ...prev, email: firebaseUser.email, name: firebaseUser.displayName || prev.name };
          }
          return mapFirebaseUser(firebaseUser);
        });
        setIsAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ─── Firebase: Email + Password Login ──────────────────────
  const loginWithEmailPassword = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  // ─── Firebase: Email + Password Sign-Up ────────────────────
  const registerWithEmailPassword = async (name, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Persist display name on the Firebase profile
    await updateProfile(result.user, { displayName: name });
    return result.user;
  };

  // ─── Firebase: Google Popup ────────────────────────────────
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  // ─── Apply real Firebase user into app profile ────────────
  // Call this after any Firebase sign-in to set the correct name/email
  // while still attaching the role the user selected on the login screen.
  const applyFirebaseUser = (firebaseUser, role = 'procurement', ssoProvider = 'Firebase Auth') => {
    const roleLabels = {
      procurement: 'Procurement Officer',
      evaluator: 'Technical Bid Evaluator',
      auditor: 'Principal Director of Audit',
      admin: 'System Administrator',
    };
    const mapped = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Officer',
      role,
      roleTitle: roleLabels[role] || 'Procurement Officer',
      organization: 'Government Department',
      department: 'Engineering Wing',
      email: firebaseUser.email || '',
      mobile: firebaseUser.phoneNumber || '',
      ssoProvider,
      badgeId: 'GOV-ID-' + firebaseUser.uid.slice(-4).toUpperCase(),
      securityClearance: 'Level-3 (Statutory E-Procurement Verified)',
      photoURL: firebaseUser.photoURL || null,
    };
    setCurrentUser(mapped);
    setIsAuthenticated(true);
  };

  // ─── Firebase: Email Link (Passwordless / Magic Link) ─────
  const sendEmailSignInLink = async (email) => {
    const actionCodeSettings = {
      // After the user clicks the link, they'll be redirected here.
      // Firebase will append oobCode, mode, etc. automatically.
      url: window.location.origin + '/login',
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // Persist email so we can complete sign-in after redirect
    window.localStorage.setItem('emailForSignIn', email);
  };

  const completeEmailSignInWithLink = async (href) => {
    if (!isSignInWithEmailLink(auth, href)) return null;
    // Retrieve stored email — user might have opened the link on a different device
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      // Prompt would be needed here; for now surface as an error
      throw new Error(
        'Please open the sign-in link on the same device you requested it from, or try again.'
      );
    }
    const result = await signInWithEmailLink(auth, email, href);
    window.localStorage.removeItem('emailForSignIn');
    return result.user;
  };

  // ─── Legacy wrapper: loginAsRole (demo quick-access cards) ─
  // Maps a role key → a demo persona and sets local state only.
  const loginAsRole = (roleKey = 'procurement', ssoName = 'Jan Parichay (National SSO)') => {
    let persona = DEMO_PERSONAS.metro;
    if (roleKey === 'evaluator') persona = DEMO_PERSONAS.nhai;
    else if (roleKey === 'auditor') persona = DEMO_PERSONAS.audit;
    else if (roleKey === 'admin') {
      persona = {
        id: 'usr_admin_99',
        name: 'Shri Amitabh Srivastava',
        role: 'admin',
        roleTitle: 'System & Policy Administrator',
        organization: 'Bureau of Indian Standards / NIC Gateway',
        department: 'Standardization Policy & QCO Registry',
        email: 'admin.bis@nic.in',
        mobile: '+91 98110 00099',
        ssoProvider: ssoName,
        badgeId: 'NIC-BIS-ROOT-01',
        securityClearance: 'Root Super-Admin'
      };
    }
    setCurrentUser({ ...persona, ssoProvider: ssoName });
    setIsAuthenticated(true);
  };

  // ─── Legacy wrapper: registerUser (called after Firebase signup) ─
  const registerUser = (userData) => {
    const newUser = {
      id: auth.currentUser?.uid || ('usr_reg_' + Date.now().toString().slice(-4)),
      name: userData.name || 'Officer',
      role: userData.role || 'procurement',
      roleTitle: userData.roleTitle || userData.designation || 'Procurement Officer',
      organization: userData.organization || 'Government Department',
      department: userData.department || userData.orgType || 'Engineering Wing',
      email: userData.email || auth.currentUser?.email || 'officer@gov.in',
      mobile: userData.mobile || '+91 98101 23456',
      ssoProvider: '2FA Mobile OTP Verified (NIC Gateway)',
      badgeId: userData.badgeId || ('GOV-ID-' + Math.floor(1000 + Math.random() * 9000)),
      securityClearance: 'Level-3 (Statutory E-Procurement Verified)'
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    return newUser;
  };

  // ─── Switch demo persona (unchanged) ───────────────────────
  const switchPersona = (personaKey) => {
    if (DEMO_PERSONAS[personaKey]) {
      setCurrentUser(DEMO_PERSONAS[personaKey]);
      setIsAuthenticated(true);
    }
  };

  // ─── Logout (Firebase + local state) ───────────────────────
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase sign-out error:', err);
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        authLoading,
        // Firebase auth methods (used by LoginView handlers)
        loginWithEmailPassword,
        registerWithEmailPassword,
        loginWithGoogle,
        applyFirebaseUser,
        sendEmailSignInLink,
        completeEmailSignInWithLink,
        // Legacy API (used by the rest of the app — untouched)
        loginAsRole,
        registerUser,
        switchPersona,
        logout,
        demoPersonas: DEMO_PERSONAS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
