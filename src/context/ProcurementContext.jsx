import React, { createContext, useContext, useState, useMemo } from 'react';
import { MOCK_STANDARDS } from '../data/mockStandardsData';
import { SAMPLE_SCENARIOS } from '../data/sampleScenarios';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '../data/translations';

const ProcurementContext = createContext();

export function ProcurementProvider({ children }) {
  const [lang, setLang] = useState('en');

  // Form State
  const [orgProfile, setOrgProfile] = useState({
    applicantName: 'Er. Vikramaditya Sharma',
    mobileNumber: '+91 98101 23456',
    emailId: 'v.sharma@metrorail.delhi.gov.in',
    businessName: 'National Metro Rail Corporation Ltd',
    orgType: 'Public Sector Undertaking (PSU)',
    gstin: '07AAACN1234F1Z8',
    state: 'Delhi',
    district: 'New Delhi',
    pincode: '110001'
  });

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

  // Recommendation & Selection State
  const [recommendedStandards, setRecommendedStandards] = useState(MOCK_STANDARDS);
  const [selectedStandardIds, setSelectedStandardIds] = useState(['IS_7098_P2', 'IS_694', 'IS_1786']);
  
  // Selected Normative Test methods (Map of standardId -> array of test codes)
  const [selectedNormativeTests, setSelectedNormativeTests] = useState({
    IS_7098_P2: ['IS 8130 : 2013', 'IS 10810 (Part 58) : 1998', 'IS 3975 : 1999'],
    IS_1786: ['IS 1608 (Part 1) : 2018', 'IS 1599 : 2019', 'IS 228 (Series)'],
    IS_269: ['IS 4031 (Part 6) : 1988', 'IS 4031 (Part 3) : 1988', 'IS 4031 (Part 5) : 1988'],
    IS_1239_P1: ['IS 4736 : 1986', 'IS 1608 (Part 1) : 2018', 'IS 2328 : 2018'],
    IS_16102_P1: ['IS 16102 (Part 2) : 2012', 'IS 10322 (Part 5/Sec 3) : 2012'],
    IS_14220: ['IS 9137 : 2019', 'IS 9283 : 2013'],
    IS_1180_P1: ['IS 335 : 2018', 'IS 2026 (Part 1 to 5)'],
    IS_4984: ['IS 7328 : 2020', 'IS 12235 (Part 8/Sec 1) : 2018']
  });

  // UI Modals & Drawers
  const [activeNormativeTreeStandard, setActiveNormativeTreeStandard] = useState(MOCK_STANDARDS[0]);
  const [isNormativeModalOpen, setIsNormativeModalOpen] = useState(false);
  const [isModelClauseModalOpen, setIsModelClauseModalOpen] = useState(false);
  const [isSampleDrawerOpen, setIsSampleDrawerOpen] = useState(false);

  // Analysis Telemetry
  const [analysisTimestamp, setAnalysisTimestamp] = useState(new Date().toISOString());
  const [certificateId, setCertificateId] = useState('CERT-BIS-SIH-2026-98442');
  const [shaHash, setShaHash] = useState('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'AUD-901',
      date: '2026-09-01 10:14:22',
      tenderRef: 'NMRC/ELECT/CABLE-11KV/PKG-02',
      division: 'ETD',
      standards: 'IS 7098 (Part 2), IS 694',
      score: 98.4,
      status: 'Verified QCO Compliant',
      officer: 'Er. Vikramaditya Sharma'
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

  // Load Sample Scenario
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
  };

  // Toggle Standard Selection in Tender
  const toggleStandardSelection = (id) => {
    setSelectedStandardIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle Normative Test Checkbox
  const toggleNormativeTest = (standardId, testCode) => {
    setSelectedNormativeTests((prev) => {
      const current = prev[standardId] || [];
      const updated = current.includes(testCode)
        ? current.filter((c) => c !== testCode)
        : [...current, testCode];
      return { ...prev, [standardId]: updated };
    });
  };

  // Open Normative Tree Modal
  const openNormativeModalFor = (standard) => {
    setActiveNormativeTreeStandard(standard);
    setIsNormativeModalOpen(true);
  };

  // Compliance Calculation
  const complianceStats = useMemo(() => {
    const totalSelected = selectedStandardIds.length;
    if (totalSelected === 0) {
      return {
        overallScore: 0,
        primaryAccuracy: 0,
        rawTestCoverage: 0,
        qcoStatutoryRate: 100,
        makeInIndiaRate: 100,
        statusText: 'No Standards in Tender',
        statusColor: 'slate'
      };
    }

    const selectedStds = MOCK_STANDARDS.filter((s) => selectedStandardIds.includes(s.id));
    
    // 1. Primary standards precision (avg confidence score)
    const avgConfidence = selectedStds.reduce((acc, s) => acc + s.confidenceScore, 0) / totalSelected;
    
    // 2. QCO compliance (100% if all mandatory QCOs are marked)
    const qcoCount = selectedStds.filter((s) => s.qcoMandatory).length;
    const qcoRate = (qcoCount / totalSelected) * 100;

    // 3. Normative test coverage
    let totalPossibleTests = 0;
    let selectedTestsCount = 0;
    selectedStds.forEach((s) => {
      const tests = s.normativeReferences?.rawMaterialTests || [];
      totalPossibleTests += tests.length;
      const checkedTests = selectedNormativeTests[s.id] || [];
      selectedTestsCount += checkedTests.length;
    });

    const testCoverage = totalPossibleTests > 0 ? (selectedTestsCount / totalPossibleTests) * 100 : 95;

    // Overall weighted score: 40% Primary Confidence + 35% Normative Test Coverage + 25% QCO Enforcement
    const overall = Math.min(100, Math.round(avgConfidence * 0.4 + testCoverage * 0.35 + qcoRate * 0.25));

    let statusText = 'Fully Compliant & QCO Sealed';
    let statusColor = 'emerald';
    if (overall < 70) {
      statusText = 'Critical Test Loopholes Present';
      statusColor = 'rose';
    } else if (overall < 88) {
      statusText = 'Moderate Compliance - Add Raw Material Tests';
      statusColor = 'amber';
    }

    return {
      overallScore: overall,
      primaryAccuracy: Math.round(avgConfidence),
      rawTestCoverage: Math.round(testCoverage),
      qcoStatutoryRate: Math.round(qcoRate),
      makeInIndiaRate: 100,
      statusText,
      statusColor
    };
  }, [selectedStandardIds, selectedNormativeTests]);

  // Translation helper
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
        auditLogs
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
