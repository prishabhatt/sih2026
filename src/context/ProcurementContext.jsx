import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { MOCK_STANDARDS } from '../data/mockStandardsData';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '../data/translations';
import { runRAGAnalysis, checkRAGBackendStatus, ALLIED_STANDARDS_RECOMMENDATIONS } from '../utils/ragAdapter';
import { useAuth } from './AuthContext';

export const STANDARD_SECTOR_PROFILES = {
  IS_456: {
    title: 'Plain and Reinforced Concrete (IS 456)',
    domain: 'TESTS_AND_DESIGN',
    precisionBoost: 9,
    testCoverageBoost: 11,
    qcoBoost: 0,
    miiBoost: 0,
    strengthensText: 'Civil Design Precision & Concrete Testing (IS 516 / IS 1199)'
  },
  IS_732: {
    title: 'Electrical Wiring Installation Safety (IS 732)',
    domain: 'TESTS_AND_DESIGN',
    precisionBoost: 9,
    testCoverageBoost: 10,
    qcoBoost: 0,
    miiBoost: 0,
    strengthensText: 'CEA Electrical Safety, Conduit Derating & Megger Testing'
  },
  IS_10500: {
    title: 'Drinking Water Quality Specification (IS 10500)',
    domain: 'TESTS_AND_DESIGN',
    precisionBoost: 8,
    testCoverageBoost: 13,
    qcoBoost: 0,
    miiBoost: 0,
    strengthensText: 'Potable Water Purity & Microbiological Membrane Testing'
  },

  IS_2062: {
    title: 'Structural Steel Plates & Sections (IS 2062)',
    domain: 'MAKE_IN_INDIA',
    precisionBoost: 6,
    testCoverageBoost: 0,
    qcoBoost: 0,
    miiBoost: 16,
    strengthensText: 'Make In India (PPP-MII 60% Class-I Domestic Steel Content)'
  },
  IS_269: {
    title: 'Ordinary Portland Cement (IS 269)',
    domain: 'MAKE_IN_INDIA',
    precisionBoost: 6,
    testCoverageBoost: 0,
    qcoBoost: 0,
    miiBoost: 16,
    strengthensText: 'Make In India (100% Domestic Class-I Cement Supplier)'
  },

  IS_1239_P1: {
    title: 'Heavy Class Steel Tubes (IS 1239)',
    domain: 'STATUTORY_QCO',
    precisionBoost: 6,
    testCoverageBoost: 0,
    qcoBoost: 18,
    miiBoost: 0,
    strengthensText: 'Statutory QCO Mandate (Steel Pipes & Tubes QCO 2024)'
  },
  IS_16102_P1: {
    title: 'Self-Ballasted LED Lamps Safety (IS 16102)',
    domain: 'STATUTORY_QCO',
    precisionBoost: 6,
    testCoverageBoost: 0,
    qcoBoost: 18,
    miiBoost: 0,
    strengthensText: 'Statutory QCO Mandate (MeitY Electronics CRS Scheme)'
  }
};

export const isRecommendedStandard = (std) => {
  if (!std) return false;
  return Boolean(
    std.isRecommendedAddition ||
    std.origin === 'AI Allied Recommendation' ||
    std.origin?.includes('Recommendation') ||
    STANDARD_SECTOR_PROFILES[std.id]
  );
};

const INITIAL_STANDARDS_CATALOG = [
  ...MOCK_STANDARDS,
  ...ALLIED_STANDARDS_RECOMMENDATIONS.filter(
    (allied) => !MOCK_STANDARDS.some((m) => m.code === allied.code)
  )
];

const ProcurementContext = createContext();

export function ProcurementProvider({ children }) {
  const [lang, setLang] = useState('en');
  const { currentUser } = useAuth();

  const [orgProfile, setOrgProfile] = useState({
    applicantName: '',
    mobileNumber: '',
    emailId: '',
    businessName: '',
    orgType: 'Public Sector Undertaking (PSU)',
    gstin: '',
    state: '',
    district: '',
    pincode: ''
  });

  useEffect(() => {
    if (currentUser) {
      setOrgProfile((prev) => ({
        ...prev,
        applicantName: prev.applicantName || currentUser.name || '',
        emailId: prev.emailId || currentUser.email || '',
        mobileNumber: prev.mobileNumber || currentUser.mobile || '',
      }));
    }
  }, [currentUser]);

  const [selectedDivision, setSelectedDivision] = useState('ETD');
  const [naturalQuery, setNaturalQuery] = useState(
    'Procurement of 11kV cross-linked polyethylene (XLPE) insulated, stranded aluminium conductor, galvanized steel strip armoured, flame retardant low smoke (FRLS) outer sheathed power cables for underground metro substation feeder networks. Requires testing for high-voltage withstand up to 1100V-11000V, spark testing, flammability, and cold bend properties.'
  );

  const [uploadedFile, setUploadedFile] = useState({
    name: 'Tender_BOQ_Metro_11kV_Feeder_Cables.xlsx',
    size: '3.4 MB',
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extractedItems: 14
  });

  const [disclaimers, setDisclaimers] = useState({
    gfr: true,
    bisAct: true,
    audit: true
  });

  const [recommendedStandards, setRecommendedStandards] = useState(INITIAL_STANDARDS_CATALOG);
  const [selectedStandardIds, setSelectedStandardIds] = useState(['IS_7098_P2', 'IS_694', 'IS_1786']);

  const [ragAnalysisState, setRagAnalysisState] = useState({
    isLoading: false,
    isLive: false,
    error: null,
    backendOnline: null,
    meta: null,
  });

  const [documentRejectionState, setDocumentRejectionState] = useState({
    isRejected: false,
    docType: null,
    reason: null
  });

  const triggerRAGAnalysis = useCallback(async (query, division, file = null) => {
    setRagAnalysisState(prev => ({ ...prev, isLoading: true, error: null }));

    const status = await checkRAGBackendStatus();
    if (!status.online) {
      setRagAnalysisState({
        isLoading: false,
        isLive: false,
        backendOnline: false,
        error: 'RAG backend offline. Showing curated reference dataset.',
        meta: null,
      });
      setRecommendedStandards(INITIAL_STANDARDS_CATALOG);
      return;
    }

    try {
      const isFileUpload = Boolean(file);
      const { standards, ragMeta } = await runRAGAnalysis(query, division, file);

      if (ragMeta?.is_valid_tender === false) {
        setDocumentRejectionState({
          isRejected: true,
          docType: ragMeta.document_type || 'Non-Procurement Document',
          reason: ragMeta.rejection_reason || 'This document is not a valid procurement tender, BOQ, or technical specification.'
        });
        setRecommendedStandards([]);
        setSelectedStandardIds([]);
        setSelectedNormativeTests({});
        setRagAnalysisState({
          isLoading: false,
          isLive: true,
          backendOnline: true,
          error: ragMeta.rejection_reason,
          meta: ragMeta,
        });
        return;
      }

      if (standards.length > 0) {
        setDocumentRejectionState({ isRejected: false, docType: null, reason: null });
        setRecommendedStandards(standards);

        const coreStandards = standards.filter(s => !s.isRecommendedAddition);
        const toSelect = coreStandards.length > 0
          ? coreStandards.map(s => s.id)
          : standards.slice(0, 5).map(s => s.id);
        setSelectedStandardIds(toSelect);
        
        const testsMap = {};
        standards.forEach(std => {
          const tests = (std.normativeReferences?.rawMaterialTests || [])
            .filter(t => t.checkedByDefault !== false)
            .map(t => t.code);
          testsMap[std.id] = tests;
        });
        setSelectedNormativeTests(testsMap);

        setRagAnalysisState({
          isLoading: false,
          isLive: true,
          backendOnline: true,
          error: null,
          meta: ragMeta,
        });
      } else {
        if (isFileUpload) {
          setDocumentRejectionState({
            isRejected: true,
            docType: 'Unmapped Tender Document',
            reason: 'The uploaded file does not contain recognized public procurement line items or Indian Standards in the active regulatory database.'
          });
          setRecommendedStandards([]);
          setSelectedStandardIds([]);
          setSelectedNormativeTests({});
          setRagAnalysisState({
            isLoading: false,
            isLive: true,
            backendOnline: true,
            error: 'No matching standards found in uploaded document.',
            meta: ragMeta,
          });
        } else {
          setDocumentRejectionState({ isRejected: false, docType: null, reason: null });
          setRecommendedStandards(INITIAL_STANDARDS_CATALOG);
          setSelectedStandardIds(['IS_7098_P2', 'IS_694', 'IS_1786']);
          setRagAnalysisState({
            isLoading: false,
            isLive: false,
            backendOnline: true,
            error: null,
            meta: ragMeta,
          });
        }
      }
    } catch (err) {
      setRecommendedStandards([]);
      setSelectedStandardIds([]);
      setRagAnalysisState({
        isLoading: false,
        isLive: false,
        backendOnline: true,
        error: `RAG analysis error: ${err.message}`,
        meta: null,
      });
    }
  }, []);
  
  const [selectedNormativeTests, setSelectedNormativeTests] = useState({
    IS_7098_P2: ['IS 8130 : 2013', 'IS 10810 (Part 58) : 1998', 'IS 3975 : 1999'],
    IS_694: ['IS 5831 : 1984', 'IS 8130 : 2013'],
    IS_1786: ['IS 1608 (Part 1) : 2018', 'IS 1599 : 2019', 'IS 228 (Series)'],
    IS_269: ['IS 4031 (Part 6) : 1988', 'IS 4031 (Part 3) : 1988', 'IS 4031 (Part 5) : 1988'],
    IS_1239_P1: ['IS 4736 : 1986', 'IS 1608 (Part 1) : 2018', 'IS 2328 : 2018'],
    IS_16102_P1: ['IS 16102 (Part 2) : 2012', 'IS 10322 (Part 5/Sec 3) : 2012'],
    IS_14220: ['IS 9137 : 2019', 'IS 9283 : 2013'],
    IS_1180_P1: ['IS 335 : 2018', 'IS 2026 (Part 1 to 5)'],
    IS_4984: ['IS 7328 : 2020', 'IS 12235 (Part 8/Sec 1) : 2018']
  });

  const [activeNormativeTreeStandard, setActiveNormativeTreeStandard] = useState(MOCK_STANDARDS[0]);
  const [isNormativeModalOpen, setIsNormativeModalOpen] = useState(false);
  const [isModelClauseModalOpen, setIsModelClauseModalOpen] = useState(false);
  const [isSampleDrawerOpen, setIsSampleDrawerOpen] = useState(false);

  const [analysisTimestamp, setAnalysisTimestamp] = useState(new Date().toISOString());
  const [certificateId, setCertificateId] = useState('CERT-IS-GOV-2026-98442');
  const [shaHash, setShaHash] = useState('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'AUD-901',
      date: '2026-09-01 10:14:22',
      tenderRef: 'NMRC/ELECT/CABLE-11KV/PKG-02',
      division: 'ETD',
      standards: 'IS 7098 (Part 2), IS 694',
      score: 98.4,
      status: 'Verified QCO Compliant',
      officer: currentUser?.name || 'Procurement Officer'
    },
    {
      id: 'AUD-884',
      date: '2026-08-28 15:40:11',
      tenderRef: 'NHAI/TECH/VIADUCT-STEEL/500D',
      division: 'CED',
      standards: 'IS 1786:2008, IS 269:2015',
      score: 99.2,
      status: 'Verified QCO Compliant',
      officer: 'Er. Rajeshwar Nath Kulkarni'
    },
    {
      id: 'AUD-852',
      date: '2026-08-22 11:20:05',
      tenderRef: 'GEDA/PM-KUSUM/SOLAR-PUMPS/B2',
      division: 'LITD',
      standards: 'IS 14220, IS 16102 (P1)',
      score: 96.8,
      status: 'Verified CRS Scheme-II',
      officer: 'Dr. Jayeshbhai Patel'
    }
  ]);

  const loadScenario = (scenarioId) => {
    const sc = SAMPLE_SCENARIOS.find((s) => s.id === scenarioId) || SAMPLE_SCENARIOS[0];
    setOrgProfile((prev) => ({
      ...prev,
      applicantName: sc.applicantName,
      mobileNumber: sc.mobileNumber || '+91 98101 23456',
      emailId: sc.emailId,
      businessName: sc.businessName,
      orgType: sc.organizationType,
      gstin: sc.gstin,
      state: sc.state,
      district: sc.district,
      pincode: sc.pincode
    }));
    setSelectedDivision(sc.division);
    setNaturalQuery(sc.query);
    setUploadedFile({
      name: sc.boqFilename,
      size: '4.1 MB',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      extractedItems: 12
    });
    setDocumentRejectionState({ isRejected: false, docType: null, reason: null });
  };

  const toggleStandardSelection = useCallback((id) => {
    setSelectedStandardIds((prev) => {
      const isAlreadySelected = prev.includes(id);
      if (!isAlreadySelected) {
        const std = recommendedStandards.find((s) => s.id === id);
        if (std && std.normativeReferences?.rawMaterialTests) {
          const routineTests = std.normativeReferences.rawMaterialTests
            .filter((t) => t.checkedByDefault !== false)
            .map((t) => t.code);
          setSelectedNormativeTests((prevTests) => ({
            ...prevTests,
            [id]: routineTests
          }));
        }
        return [...prev, id];
      } else {
        return prev.filter((item) => item !== id);
      }
    });
  }, [recommendedStandards]);

  const toggleNormativeTest = (standardId, testCode) => {
    setSelectedNormativeTests((prev) => {
      const current = prev[standardId] || [];
      const updated = current.includes(testCode)
        ? current.filter((c) => c !== testCode)
        : [...current, testCode];
      return { ...prev, [standardId]: updated };
    });
  };

  const openNormativeModalFor = (standard) => {
    setActiveNormativeTreeStandard(standard);
    setIsNormativeModalOpen(true);
  };

  const complianceStats = useMemo(() => {
    const totalSelected = selectedStandardIds.length;

    if (documentRejectionState.isRejected || totalSelected === 0) {
      return {
        overallScore: 0,
        primaryAccuracy: 0,
        rawTestCoverage: 0,
        qcoStatutoryRate: 0,
        makeInIndiaRate: 0,
        statusText: documentRejectionState.isRejected
          ? 'Document Rejected — Non-Procurement File'
          : 'No Standards Enrolled in Tender Draft',
        statusColor: 'rose',
        identifiedViolations: []
      };
    }

    const selectedStds = recommendedStandards.filter((s) => selectedStandardIds.includes(s.id));
    
    const enrolledRecommendations = selectedStds.filter(isRecommendedStandard);
    const recCount = enrolledRecommendations.length;

    let totalTenderTests = 0;
    let selectedTestsCount = 0;
    selectedStds.forEach((s) => {
      const tests = s.normativeReferences?.rawMaterialTests || [];
      totalTenderTests += tests.length;
      const checked = selectedNormativeTests[s.id] || [];
      selectedTestsCount += checked.length;
    });
    const testRatio = totalTenderTests > 0 ? selectedTestsCount / totalTenderTests : 0.7;

    const violations = ragAnalysisState.meta?.identified_violations || [];
    const auditedQco = ragAnalysisState.meta?.statutory_qco_score;
    const isDefectiveAudit = violations.length > 0 || (auditedQco !== undefined && auditedQco < 50);

    const baseTotalQcoItems = isDefectiveAudit ? 5 : 6;
    const baseCompliantQcoItems = isDefectiveAudit ? 1 : 4;

    const addedQcoStandards = enrolledRecommendations.filter(
      (s) => STANDARD_SECTOR_PROFILES[s.id]?.domain === 'STATUTORY_QCO'
    ).length;

    const totalQcoItems = baseTotalQcoItems + addedQcoStandards;
    const compliantQcoItems = baseCompliantQcoItems + (addedQcoStandards * 1.5);
    const qcoStatutoryRate = Math.min(100, Math.round((compliantQcoItems / totalQcoItems) * 100));

    let totalPrescribedTests = 0;
    let enrolledTests = 0;
    selectedStds.forEach((s) => {
      const tests = s.normativeReferences?.rawMaterialTests || [];
      totalPrescribedTests += tests.length;
      const checked = selectedNormativeTests[s.id] || [];
      enrolledTests += checked.length;
    });

    const testBaselineWeight = isDefectiveAudit ? 15 : 22;
    const rawTestCoverage = totalPrescribedTests > 0
      ? Math.min(100, Math.round((enrolledTests / totalPrescribedTests) * 78 + testBaselineWeight))
      : 60;

    const baseTotalMiiItems = 5;
    const baseCompliantMiiItems = isDefectiveAudit ? 3 : 3.4;

    const addedMiiStandards = enrolledRecommendations.filter(
      (s) => STANDARD_SECTOR_PROFILES[s.id]?.domain === 'MAKE_IN_INDIA'
    ).length;

    const totalMiiItems = baseTotalMiiItems + addedMiiStandards;
    const compliantMiiItems = baseCompliantMiiItems + (addedMiiStandards * 1.6);
    const makeInIndiaRate = Math.min(100, Math.round((compliantMiiItems / totalMiiItems) * 100));

    const basePrecision = isDefectiveAudit ? 54 : 68;
    const scopeBonus = enrolledRecommendations.length * 4.5;
    const primaryAccuracy = Math.min(100, Math.round(basePrecision + scopeBonus));

    const weightedSum = (
      primaryAccuracy * 0.30 +
      rawTestCoverage * 0.30 +
      qcoStatutoryRate * 0.25 +
      makeInIndiaRate * 0.15
    );
    const overall = Math.min(100, Math.max(20, Math.round(weightedSum)));

    let statusText = 'Critical Test Loopholes / QCO Evasion Present';
    let statusColor = 'rose';
    if (overall >= 88) {
      statusText = 'Fully Compliant & QCO Sealed';
      statusColor = 'emerald';
    } else if (overall >= 74) {
      statusText = 'Substantial Compliance (Recommendations Enrolled)';
      statusColor = 'sky';
    } else if (overall >= 58) {
      statusText = 'Procedural Review Required (Rectifying Normative Codes)';
      statusColor = 'amber';
    } else {
      statusText = 'Critical Test Loopholes / QCO Evasion Present';
      statusColor = 'rose';
    }

    return {
      overallScore: overall,
      primaryAccuracy,
      rawTestCoverage,
      qcoStatutoryRate,
      makeInIndiaRate,
      statusText,
      statusColor,
      identifiedViolations: violations
    };
  }, [selectedStandardIds, selectedNormativeTests, recommendedStandards, ragAnalysisState, documentRejectionState]);

  const t = useMemo(() => {
    return TRANSLATIONS[lang] || TRANSLATIONS.en;
  }, [lang]);

  return (
    <ProcurementContext.Provider
      value={{
        lang,
        setLang,
        languages: SUPPORTED_LANGUAGES,
        t,
        orgProfile,
        setOrgProfile,
        selectedDivision,
        setSelectedDivision,
        naturalQuery,
        setNaturalQuery,
        uploadedFile,
        setUploadedFile,
        disclaimers,
        setDisclaimers,
        recommendedStandards,
        selectedStandardIds,
        setSelectedStandardIds,
        toggleStandardSelection,
        selectedNormativeTests,
        setSelectedNormativeTests,
        toggleNormativeTest,
        activeNormativeTreeStandard,
        setActiveNormativeTreeStandard,
        openNormativeModalFor,
        isNormativeModalOpen,
        setIsNormativeModalOpen,
        isModelClauseModalOpen,
        setIsModelClauseModalOpen,
        isSampleDrawerOpen,
        setIsSampleDrawerOpen,
        complianceStats,
        loadScenario,
        analysisTimestamp,
        setAnalysisTimestamp,
        certificateId,
        shaHash,
        auditLogs,
        ragAnalysisState,
        triggerRAGAnalysis,
        documentRejectionState,
        setDocumentRejectionState
      }}
    >
      {children}
    </ProcurementContext.Provider>
  );
}

export function useProcurement() {
  const context = useContext(ProcurementContext);
  if (!context) throw new Error('useProcurement must be used within a ProcurementProvider');
  return context;
}
