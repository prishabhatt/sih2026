import React, { createContext, useContext, useState } from 'react';

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

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(DEMO_PERSONAS.metro);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

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

  const registerUser = (userData) => {
    const newUser = {
      id: 'usr_reg_' + Date.now().toString().slice(-4),
      name: userData.name || 'Officer',
      role: userData.role || 'procurement',
      roleTitle: userData.roleTitle || userData.designation || 'Procurement Officer',
      organization: userData.organization || 'Government Department',
      department: userData.department || userData.orgType || 'Engineering Wing',
      email: userData.email || 'officer@gov.in',
      mobile: userData.mobile || '+91 98101 23456',
      ssoProvider: '2FA Mobile OTP Verified (NIC Gateway)',
      badgeId: userData.badgeId || ('GOV-ID-' + Math.floor(1000 + Math.random() * 9000)),
      securityClearance: 'Level-3 (Statutory E-Procurement Verified)'
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    return newUser;
  };

  const switchPersona = (personaKey) => {
    if (DEMO_PERSONAS[personaKey]) {
      setCurrentUser(DEMO_PERSONAS[personaKey]);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        loginAsRole,
        registerUser,
        switchPersona,
        logout,
        demoPersonas: DEMO_PERSONAS
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
