import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  Database,
  AlertTriangle,
  Terminal,
  Sun,
  Moon,
  FileText,
  Scale,
  Cpu,
  QrCode,
  Send,
  Search,
  Activity,
  Lock,
  Award,
  Check,
  Globe,
  Headphones,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  X
} from 'lucide-react';

import { useTheme } from '../context/ThemeContext';
import { useProcurement } from '../context/ProcurementContext';
import { BIS_DIVISIONS } from '../data/divisionsData';
import { AppleStripeBackground } from '../components/AppleStripeBackground';
import { ComparisonGraph } from '../components/ComparisonGraph';
import AnimatedLogo from '../components/AnimatedLogo';

function AnimatedNumber({ target, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => { if (animationFrameId) cancelAnimationFrame(animationFrameId); };
  }, [target, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

function useTypewriter(text, speed = 25, delay = 500) {
  const [displayed, setDisplayed] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setIsComplete(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayed, isComplete };
}

function ScrollReveal({ children, className = '', direction = 'up', delay = 0 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dirClass = direction === 'left' ? 'sr-fade-left' : direction === 'right' ? 'sr-fade-right' : direction === 'scale' ? 'sr-scale' : 'sr-fade-up';
  const delayClass = delay ? `sr-delay-${delay}` : '';

  return (
    <div ref={ref} className={`${dirClass} ${delayClass} ${isVisible ? 'sr-visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function LandingView() {
  const navigate = useNavigate();
  const { toggleTheme, setLightTheme, setDarkTheme, isDark } = useTheme();
  const { lang, setLang, languages = [], t = {}, loadScenario } = useProcurement();

  const [activeDivisionTab, setActiveDivisionTab] = useState('ETD');
  const [expandedPipelineRow, setExpandedPipelineRow] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isHelpDeskOpen, setIsHelpDeskOpen] = useState(false);
  const [queryForm, setQueryForm] = useState({
    name: 'Er. Vikramaditya Sharma',
    email: 'v.sharma@metrorail.delhi.gov.in',
    category: 'MANDATORY_QCO',
    tenderRef: 'NMRC/ELECT/CABLE-11KV/PKG-02',
    description: ''
  });
  const [isSubmittingQuery, setIsSubmittingQuery] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (!queryForm.description.trim()) return;
    setIsSubmittingQuery(true);
    setTimeout(() => {
      setSubmittedTicket({
        id: `BIS-TKT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        category: queryForm.category,
        tenderRef: queryForm.tenderRef || 'General Public Tender',
        email: queryForm.email
      });
      setIsSubmittingQuery(false);
    }, 500);
  };

  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [demoQuery, setDemoQuery] = useState('11kV HT XLPE Metro Power Distribution Cables with FRLS sheath');
  const [isResolving, setIsResolving] = useState(false);
  const [resolvedResult, setResolvedResult] = useState({
    code: 'IS 7098 (Part 2) : 2011',
    title: 'XLPE Insulated Thermoplastic Sheathed Power Cables (3.3 kV to 33 kV)',
    confidence: 99.4,
    qco: 'Cables & Wires (Quality Control) Order, 2023 [Mandatory ISI Mark]',
    normative: ['IS 8130 : 2013 (Conductor Resistance)', 'IS 10810 P58 (Oxygen Index >= 29%)', 'IS 3975 (Zinc Galvanization)'],
    division: 'ETD (Electrotechnical)',
    mii: '60% Class-I Local Content',
    scenarioId: 'underground_cable_metro',
    latency: '34ms',
    denseVector: '768-D DENSE_EMBEDDING_V4'
  });

  const { displayed: typewriterText, isComplete: typewriterDone } = useTypewriter(demoQuery, 22, 600);

  const liveDemoPresets = useMemo(() => [
    {
      label: '11kV Metro Cable', tag: 'ETD-09',
      query: '11kV HT XLPE Metro Power Distribution Cables with FRLS sheath',
      code: 'IS 7098 (Part 2) : 2011', title: 'XLPE Insulated Thermoplastic Sheathed Power Cables (3.3 kV to 33 kV)',
      confidence: 99.4, qco: 'Cables & Wires (Quality Control) Order, 2023 [Mandatory ISI Mark]',
      normative: ['IS 8130 : 2013 (Conductor Resistance)', 'IS 10810 P58 (Oxygen Index >= 29%)', 'IS 3975 (Zinc Galvanization)'],
      division: 'ETD (Electrotechnical)', mii: '60% Class-I Local Content',
      scenarioId: 'underground_cable_metro', latency: '34ms', denseVector: '768-D [0.412, -0.891, 0.224, ...]'
    },
    {
      label: 'Fe 500D TMT Rebar', tag: 'CED-54',
      query: 'High strength Fe 500D TMT steel bars & 53 Grade OPC cement for bridge deck',
      code: 'IS 1786 : 2008 & IS 269 : 2015', title: 'High Strength Deformed Steel Bars / OPC 53 Grade Cement',
      confidence: 98.8, qco: 'Steel & Cement (Quality Control) Orders, 2024 [Mandatory BIS License]',
      normative: ['IS 1608 P1 (Tensile & Proof Stress >= 500 MPa)', 'IS 1599 (180° Cold Bend Mandrel Test)', 'IS 4031 P6 (Compressive Strength)'],
      division: 'CED (Civil Engineering)', mii: '65% Class-I Local Content',
      scenarioId: 'tmt_rebars_cement_nhai', latency: '28ms', denseVector: '768-D [0.724, 0.119, -0.543, ...]'
    },
    {
      label: 'Solar PV Pump', tag: 'MED-12',
      query: '5 HP submersible solar water pumping system with MPPT controller (PM-KUSUM)',
      code: 'IS 17017 & IS 14286', title: 'Solar Photovoltaic Water Pumping Systems',
      confidence: 97.6, qco: 'Solar PV Systems & Components Order, 2023 [Mandatory CRS Registration]',
      normative: ['IS/IEC 61215 (Design Qualification)', 'IS 9225 (Submersible Pump Efficiency)', 'IS/IEC 60068 (Environmental Testing)'],
      division: 'LITD / MED', mii: '70% Class-I Local Content',
      scenarioId: 'solar_pv_pumping_system', latency: '41ms', denseVector: '768-D [-0.312, 0.884, 0.612, ...]'
    },
    {
      label: 'HDPE Water Pipe', tag: 'CED-05',
      query: 'PE 100 HDPE Pressure Pipes PN 10 for drinking water supply scheme (JJM)',
      code: 'IS 4984 : 2016', title: 'High Density Polyethylene Pipes for Water Supply',
      confidence: 99.1, qco: 'Pipes and Fittings (Quality Control) Order, 2024 [Mandatory ISI Mark]',
      normative: ['IS 2530 (Methods of Test for PE Materials)', 'IS 7328 (High Density Polyethylene Materials)'],
      division: 'CED (Civil Engineering)', mii: '80% Class-I Local Content',
      scenarioId: 'hdpe_pipe_water_supply', latency: '26ms', denseVector: '768-D [0.518, -0.294, 0.811, ...]'
    }
  ], []);

  const handleSelectPreset = (preset, idx) => {
    setActivePresetIndex(idx);
    setDemoQuery(preset.query);
    setIsResolving(true);
    setTimeout(() => {
      setResolvedResult(preset);
      setIsResolving(false);
    }, 300);
  };

  const handleRunCustomQuery = (e) => {
    e.preventDefault();
    if (!demoQuery.trim()) return;
    setIsResolving(true);
    setTimeout(() => {
      const q = demoQuery.toLowerCase();

      // Keyword sets for each preset — score by how many keywords match
      const keywords = [
        { idx: 0, words: ['cable', 'xlpe', 'ht', '11kv', '33kv', 'wire', 'frls', 'metro', 'power cable', 'conductor', 'distribution cable', 'electrical cable'] },
        { idx: 1, words: ['tmt', 'rebar', 'steel bar', 'fe 500', 'fe500', 'cement', 'opc', 'concrete', 'bridge', 'reinforcement', 'deformed bar', 'nhai'] },
        { idx: 2, words: ['solar', 'pv', 'pump', 'photovoltaic', 'kusum', 'mppt', 'submersible', 'irrigation', 'drip', 'iot', 'controller', 'automation', 'sprinkler', 'water pump', 'agricultural'] },
        { idx: 3, words: ['hdpe', 'pipe', 'polyethylene', 'pe 100', 'jjm', 'water supply', 'drinking water', 'pressure pipe', 'plumbing'] },
      ];

      let bestIdx = 0;
      let bestScore = 0;
      keywords.forEach(({ idx, words }) => {
        const score = words.filter(w => q.includes(w)).length;
        if (score > bestScore) { bestScore = score; bestIdx = idx; }
      });

      const matched = liveDemoPresets[bestIdx];
      setResolvedResult({ ...matched, title: `RAG Resolved: ${demoQuery.slice(0, 48)}...`, confidence: +(94 + Math.random() * 5).toFixed(1), latency: `${Math.floor(25 + Math.random() * 25)}ms` });
      setIsResolving(false);
    }, 700);
  };

  const activeDivInfo = useMemo(() => BIS_DIVISIONS.find((d) => d.code === activeDivisionTab) || BIS_DIVISIONS[0], [activeDivisionTab]);

  const pipelineRows = useMemo(() => [
    {
      num: '01',
      title: t?.landing?.stage1Title || 'Reads Tender Documents & BOQ Lists',
      subtitle: t?.landing?.stage1Desc || 'Processes plain English, Hindi, and regional tender documents in seconds',
      badge: 'DOCUMENT INGESTION',
      description: t?.landing?.stage1Desc || 'Upload raw tender files (PDF, Word, or Excel BOQ spreadsheets). The AI instantly reads through every clause, technical parameter, and line item without missing hidden fine print.',
      specs: ['Reads PDFs, Word & Excel', 'Multilingual Hindi & English', 'Extracts Item Parameters'],
      icon: FileText
    },
    {
      num: '02',
      title: t?.landing?.stage2Title || 'Matches with 22,000+ Indian Standards (BIS)',
      subtitle: t?.landing?.stage2Desc || 'Verifies every product against official national quality and safety codes',
      badge: 'STANDARDS MATCHING',
      description: t?.landing?.stage2Desc || 'Automatically matches items (steel, power cables, pipes, cement) against the latest Bureau of Indian Standards (IS) codes. Flags obsolete, withdrawn, or missing standards immediately.',
      specs: ['22,410+ Active Standards', 'Catches Outdated Standards', 'Mandatory Gazette Orders (QCO)'],
      icon: Cpu
    },
    {
      num: '03',
      title: t?.landing?.stage3Title || 'Detects Tender Rigging & Single-Vendor Favouritism',
      subtitle: t?.landing?.stage3Desc || 'Enforces GFR 2017 Rule 144(xi) to stop biased specifications',
      badge: 'FRAUD & BIAS SCANNER',
      description: t?.landing?.stage3Desc || 'Scans draft specifications for restrictive, brand-specific clauses engineered to secretly favour a single preferred supplier. Guarantees fair, open public bidding and Make-in-India compliance.',
      specs: ['GFR Rule 144(xi) Anti-Bias Check', 'Blocks Tailored Vendor Clauses', 'Make-in-India (MII) Validation'],
      icon: Scale
    },
    {
      num: '04',
      title: t?.landing?.stage4Title || 'Court-Ready Certificate & Tamper-Proof QR Passport',
      subtitle: t?.landing?.stage4Desc || 'Generates legally binding NIT clauses and digital audit proof',
      badge: 'DIGITAL EVIDENCE',
      description: t?.landing?.stage5Desc || 'Creates legally enforceable Notice Inviting Tender (NIT) clauses and an immutable SHA-256 digital QR passport. Prosecutors, CAG auditors, and warehouse inspectors can scan the QR code to verify zero tampering.',
      specs: ['Court-Admissible Digital Seal', 'Mobile Scannable QR Code', '1-Click GeM/CPPP Legal Clauses'],
      icon: QrCode
    }
  ], [t]);

  const faqItems = useMemo(() => [
    {
      q: lang === 'hi' ? 'एआई इंजन नवीनतम संशोधित भारतीय मानक को कैसे हल करता है?' :
        lang === 'gu' ? 'એઆઈ એન્જિન નવીનતમ સુધારેલા ભારતીય ધોરણને કેવી રીતે શોધે છે?' :
          'How does the AI engine resolve the latest amended Indian Standard?',
      a: lang === 'hi' ? 'इंजन 768-आयामी सघन वेक्टर एम्बेडिंग के साथ लाइव बीआईएस गजट कॉर्पस को इंडेक्स करता है। जब किसी निविदा विवरण को इनपुट किया जाता है, तो सिमेंटिक आरएजी मिलान नवीनतम संशोधन प्राप्त करता है।' :
        lang === 'gu' ? 'એન્જિન 768-પરિમાણીય વેક્ટર એમ્બેડિંગ્સ સાથે લાઇવ બીઆઈએસ ગેઝેટ કોર્પસને ઇન્ડેક્સ કરે છે. જ્યારે ટેન્ડર વિગતો દાખલ થાય છે ત્યારે સિમેન્ટીક RAG મેચિંગ તાજેતરના સુધારા પુનઃપ્રાપ્ત કરે છે.' :
          'The engine indexes the live BIS Gazette corpus with 768-dimensional dense vector embeddings. When a tender description is ingested, semantic RAG matching retrieves the most recent reaffirmation and active amendments, preventing references to obsolete specifications.'
    },
    {
      q: lang === 'hi' ? 'GFR 2017 नियम 144(xi) के तहत एकल-विक्रेता पक्षपात को कैसे रोका जाता है?' :
        lang === 'gu' ? 'GFR 2017 નિયમ 144(xi) હેઠળ સિંગલ-વેન્ડર પક્ષપાત કેવી રીતે અટકાવવામાં આવે છે?' :
          'How does the system prevent single-vendor bias under GFR 2017 Rule 144(xi)?',
      a: lang === 'hi' ? 'GFR 2017 नियम 144(xi) उन विनिर्देशों को प्रतिबंधित करता है जो प्रतिस्पर्धा को किसी विशिष्ट मेक या ब्रांड तक सीमित करते हैं। इंजन मानकीकृत बीआईएस मापदंडों के विरुद्ध ड्राफ्ट निविदा खंडों का ऑडिट करता है।' :
        lang === 'gu' ? 'GFR 2017 નિયમ 144(xi) એવી વિશિષ્ટતાઓને પ્રતિબંધિત કરે છે જે સ્પર્ધાને કોઈ ચોક્કસ બ્રાન્ડ સુધી સીમિત કરે છે. એન્જિન પ્રમાણિત પરિમાણો સામે ડ્રાફ્ટ ટેન્ડર શરતોનું ઓડિટ કરે છે.' :
          'GFR 2017 Rule 144(xi) prohibits specifications that restrict competition to a specific make or brand. The engine audits draft tender clauses against standardized Indian Standards parameters.'
    },
    {
      q: lang === 'hi' ? 'वैधानिक गुणवत्ता नियंत्रण आदेश (QCO) कैसे लागू किए जाते हैं?' :
        lang === 'gu' ? 'વૈધાનિક ગુણવત્તા નિયંત્રણ ઓર્ડર (QCO) કેવી રીતે લાગુ કરવામાં આવે છે?' :
          'How are statutory QCOs and mandatory BIS certification enforced?',
      a: lang === 'hi' ? 'बीआईएस अधिनियम 2016 की धारा 16 के तहत, अनिवार्य क्यूसीओ आदेश स्कीम-I आईएसआई मार्क या स्कीम-II सीआरएस पंजीकरण अनिवार्य करते हैं। गेटवे स्वचालित रूप से अनिवार्य क्यूसीओ को चिह्नित करता है।' :
        lang === 'gu' ? 'BIS એક્ટ 2016 ની કલમ 16 હેઠળ, ગેઝેટ કરાયેલા QCOs સ્કીમ-I ISI માર્ક અથવા સ્કીમ-II CRS રજીસ્ટ્રેશન ફરજિયાત કરે છે. ગેટવે આપમેળે વસ્તુઓને સક્રિય QCO હેઠળ ફ્લેગ કરે છે.' :
          'Under Section 16 of the BIS Act 2016, gazetted QCOs mandate Scheme-I ISI Marks or Scheme-II CRS Registrations. The gateway automatically flags items under active QCO decrees.'
    },
    {
      q: lang === 'hi' ? 'क्रिप्टोग्राफिक SHA-256 डिजिटल पासपोर्ट क्या है?' :
        lang === 'gu' ? 'ક્રિપ્ટોગ્રાફિક SHA-256 ડિજિટલ પાસપોર્ટ શું છે?' :
          'What is a Cryptographic SHA-256 Digital Passport?',
      a: lang === 'hi' ? 'सत्यापन के बाद, सिस्टम सभी अनुमोदित मानकों, प्रामाणिक परीक्षण प्रोटोकॉल और स्थानीय सामग्री सीमाओं का SHA-256 हैश उत्पन्न करता है, जिसे साइट निरीक्षण के लिए क्यूआर कोड में एम्बेड किया जाता है।' :
        lang === 'gu' ? 'ચકાસણી પછી, સિસ્ટમ તમામ મંજૂર ધોરણો, પરીક્ષણ પ્રોટોકોલ અને સ્થાનિક સામગ્રી થ્રેશોલ્ડના SHA-256 હેશની ગણતરી કરે છે, જે સાઇટ નિરીક્ષણ માટે QR પાસપોર્ટમાં એમ્બેડ થાય છે.' :
          'Once verified, the system computes a SHA-256 hash of all approved standards, normative test protocols, and local content thresholds, embedded in a tamper-proof QR Passport for field inspection.'
    }
  ], [lang]);

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-500 relative font-sans antialiased overflow-x-hidden selection:bg-[#1E3A5F] selection:text-white">
      {/* Living Atmospheric Industrial Background */}
      <AppleStripeBackground />
      <div className="noise-overlay" />

      {/* ================================================================ */}
      {/* NAVBAR (Floating Glassmorphic Capsule with Top/Side Margins)      */}
      {/* ================================================================ */}
      <div className="fixed top-4 sm:top-5 inset-x-0 z-50 flex justify-center px-4 sm:px-6 lg:px-8 pointer-events-none">
        <header className="pointer-events-auto max-w-[1360px] w-full backdrop-blur-2xl bg-white/85 dark:bg-[#070B14]/90 border-2 border-white dark:border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-full px-6 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-6 transition-all">

          {/* Module 1: Brand Logo */}
          <div className="flex items-center shrink-0">
            <a href="#overview" className="flex items-center gap-2.5 group">
              <div className="shrink-0 transition-transform group-hover:scale-105">
                <AnimatedLogo
                  size={46}
                  showReplay={false}
                  textColor={isDark ? '#F1F5F9' : '#0B1E36'}
                />
              </div>
              <div className="hidden sm:flex items-center pl-2.5 border-l border-slate-300/80 dark:border-white/15">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-tight">
                  AI Standards Engine
                </span>
              </div>
            </a>
          </div>

          {/* Module 2: Central Navigation in Sleek Glassmorphic Capsule */}
          <nav className="hidden xl:flex items-center gap-1 p-1.5 rounded-full bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 backdrop-blur-xl">
            <a href="#overview" className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 hover:shadow-xs transition-all">
              {lang === 'hi' ? 'अवलोकन' : lang === 'gu' ? 'ઝાંખી' : 'Overview'}
            </a>
            <a href="#terminal" className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 hover:shadow-xs transition-all">
              {lang === 'hi' ? 'लाइव डेमो' : lang === 'gu' ? 'લાઇવ ડેમો' : 'Live Demo'}
            </a>
            <a href="#architecture" className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 hover:shadow-xs transition-all">
              {lang === 'hi' ? 'आर्किटेक्चर' : lang === 'gu' ? 'આર્કિટેક્ચર' : 'Architecture'}
            </a>
            <a href="#pipeline" className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 hover:shadow-xs transition-all">
              {lang === 'hi' ? 'सिस्टम पाइपलाइन' : lang === 'gu' ? 'સિસ્ટમ પાઇપલાઇન' : 'System Pipeline'}
            </a>
            <a href="#corpus" className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 hover:shadow-xs transition-all">
              {lang === 'hi' ? 'मानक संग्रह' : lang === 'gu' ? 'માનક સંગ્રહ' : 'Standards Corpus'}
            </a>
            <a href="#faq" className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 hover:shadow-xs transition-all">
              {lang === 'hi' ? 'एफएक्यू' : lang === 'gu' ? 'પ્રશ્નોત્તરી' : 'FAQ'}
            </a>
          </nav>

          {/* Module 3: Right Controls Group */}
          <div className="flex items-center gap-3 sm:gap-3.5 shrink-0">
            {/* Multilingual Distinct Glassmorphic Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-black tracking-wider text-slate-900 dark:text-white bg-white/90 hover:bg-white dark:bg-white/15 dark:hover:bg-white/25 border-2 border-slate-300/90 dark:border-white/30 backdrop-blur-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all cursor-pointer hover:scale-105"
              >
                <Globe className="w-4 h-4 text-amber-500 shrink-0 stroke-[2.5]" />
                <span className="uppercase">{lang}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-300 transition-transform ${isLangOpen ? 'rotate-180 text-amber-500' : ''}`} />
              </button>
              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-[#090D16]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200/90 dark:border-white/10 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-96 overflow-y-auto">
                    <div className="px-3 py-1.5 mb-1 border-b border-slate-200/60 dark:border-white/5">
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
                        Official Indian Languages
                      </span>
                    </div>
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setIsLangOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors my-0.5 cursor-pointer ${lang === l.code
                            ? 'font-bold bg-[#1E3A5F]/15 dark:bg-[#1E3A5F]/40 text-[#1E3A5F] dark:text-white border border-[#1E3A5F]/30'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                          }`}
                      >
                        <div>
                          <span className="font-semibold">{l.native}</span>
                          <span className="text-[10px] opacity-60 ml-1.5 font-mono">({l.code.toUpperCase()})</span>
                        </div>
                        {lang === l.code && <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Distinct Segmented Theme Capsule Toggle */}
            <div className="flex items-center p-1 rounded-full bg-slate-200/90 dark:bg-black/50 border-2 border-slate-300 dark:border-white/20 shadow-inner backdrop-blur-2xl transition-all">
              <button
                type="button"
                onClick={setLightTheme}
                className={`flex items-center justify-center p-1.5 px-2.5 rounded-full text-xs transition-all duration-200 cursor-pointer ${!isDark
                    ? 'bg-white text-amber-500 shadow-[0_2px_8px_rgba(0,0,0,0.15)] ring-1 ring-black/5 font-extrabold scale-105'
                    : 'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                title="Switch to Institutional Light Mode"
              >
                <Sun className={`w-4 h-4 stroke-[2.5] ${!isDark ? 'text-amber-500 drop-shadow-xs' : 'text-slate-400'}`} />
              </button>

              <button
                type="button"
                onClick={setDarkTheme}
                className={`flex items-center justify-center p-1.5 px-2.5 rounded-full text-xs transition-all duration-200 cursor-pointer ${isDark
                    ? 'bg-[#0B1E36] dark:bg-slate-800 text-sky-400 shadow-[0_2px_8px_rgba(0,0,0,0.3)] ring-1 ring-white/20 font-extrabold scale-105'
                    : 'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                title="Switch to Dark Mode"
              >
                <Moon className={`w-4 h-4 stroke-[2.5] ${isDark ? 'text-sky-300 drop-shadow-xs' : 'text-slate-400'}`} />
              </button>
            </div>

            {/* Portal Login Button */}
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-[#0B1E36] hover:bg-[#132845] dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#07080A] shadow-[0_4px_16px_rgba(11,30,54,0.2)] transition-all cursor-pointer flex items-center gap-2 hover:scale-105 border border-white/30 dark:border-white/10"
            >
              <span>{t?.nav?.portalLogin || 'Portal Login'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400 dark:text-slate-900" />
            </button>
          </div>
        </header>
      </div>

      {/* ================================================================ */}
      {/* HERO                                                             */}
      {/* ================================================================ */}
      <section id="overview" className="relative z-10 pt-36 sm:pt-44 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="hero-animate text-[40px] sm:text-[56px] lg:text-[70px] font-black tracking-[-0.03em] leading-[1.02] text-slate-900 dark:text-white">
            {t?.landing?.heroTitle || 'AI-Powered Indian Standards Engine for Public Procurement'}
          </h1>

          <p className="hero-animate text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal" style={{ animationDelay: '0.2s' }}>
            {t?.landing?.heroSubtitle || 'Autonomous AI gateway that resolves exact Bureau of Indian Standards (IS) codes, mandatory Gazette QCO decrees, and eliminates single-vendor bias under GFR 2017 Rule 144(xi).'}
          </p>

          <div className="hero-animate flex items-center justify-center pt-2" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-[#0B1E36] hover:bg-[#132845] dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#07080A] shadow-xl shadow-[#0B1E36]/25 dark:shadow-white/10 transition-all transform hover:scale-105 flex items-center gap-2.5 cursor-pointer"
            >
              <span>{t?.landing?.ctaLaunch || 'Access Recommendation Portal'}</span>
              <ArrowRight className="w-4 h-4 text-amber-400 dark:text-slate-900" />
            </button>
          </div>

          <div className="hero-animate pt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-500 dark:text-slate-400" style={{ animationDelay: '0.4s' }}>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t?.landing?.trustPill1 || '22,410+ IS Standards'}</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> {t?.landing?.trustPill2 || '142 Active QCO Decrees'}</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-[#1E3A5F] dark:text-sky-400" /> {t?.landing?.trustPill3 || 'SHA-256 Sealed Passports'}</span>
          </div>
        </div>

        {/* ================================================================ */}
        {/* METRICS GRID                                                     */}
        {/* ================================================================ */}
        <div className="hero-animate mt-16" style={{ animationDelay: '0.5s' }}>
          <div className="rounded-3xl bg-white/75 dark:bg-[#0E1322]/70 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200/70 dark:divide-white/[0.06]">
              {[
                { label: 'STANDARDS', value: 22410, suffix: '+', desc: t?.landing?.statStandardsLabel || 'Active Bureau of Indian Standards' },
                { label: 'QCO DECREES', value: 142, suffix: '+', desc: t?.landing?.statQcoLabel || 'Mandatory Gazette QCOs Enforced' },
                { label: 'COMPLIANCE', value: 100, suffix: '%', desc: t?.landing?.statNormativeLabel || 'GFR 2017 & BIS Act 2016' },
                { label: 'BIAS SCORE', value: 0, suffix: '%', desc: t?.landing?.statDisputesLabel || 'Single-Vendor Proprietary Bias' },
              ].map((stat, i) => (
                <div key={i} className="p-6 text-center hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 block mb-1.5">
                    {stat.label}
                  </span>
                  <p className="text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
                    <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-sans">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* TERMINAL DEMO                                                    */}
      {/* ================================================================ */}
      <section id="terminal" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="rounded-3xl bg-white/80 dark:bg-[#0E1322]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl overflow-hidden">
            {/* Title Bar */}
            <div className="px-6 py-4 border-b border-slate-200/80 dark:border-white/[0.06] bg-slate-50/40 dark:bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-xs text-slate-600 dark:text-slate-400 font-bold">terminal.bis.gov.in/neural-rag-v4.2</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-emerald-500" /> {resolvedResult.latency}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  SIM {(resolvedResult.confidence / 100).toFixed(4)}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Presets */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {lang === 'hi' ? 'विशिष्टता चुनें:' : lang === 'gu' ? 'વિશિષ્ટતા પસંદ કરો:' : 'Select Specification:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {liveDemoPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPreset(preset, idx)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${activePresetIndex === idx
                          ? 'bg-[#0B1E36] dark:bg-white text-white dark:text-[#07080A] shadow-sm'
                          : 'bg-slate-100/80 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-white/[0.08]'
                        }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleRunCustomQuery}>
                <div className="flex items-center bg-slate-50/80 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 rounded-2xl overflow-hidden focus-within:border-[#1E3A5F] dark:focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-[#1E3A5F]/20 dark:focus-within:ring-amber-400/20 transition-all">
                  <Search className="w-4.5 h-4.5 text-slate-400 ml-4 shrink-0" />
                  <input
                    type="text"
                    value={demoQuery}
                    onChange={(e) => setDemoQuery(e.target.value)}
                    className="flex-1 px-3.5 py-3.5 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-mono outline-none"
                    placeholder={t?.input?.naturalQueryPlaceholder || 'Enter or paste draft procurement BOQ specification...'}
                  />
                  <button
                    type="submit"
                    disabled={isResolving}
                    className="px-5 py-2.5 mr-2 rounded-xl bg-[#0B1E36] dark:bg-white text-white dark:text-[#07080A] text-xs font-bold font-mono disabled:opacity-40 hover:bg-[#132845] dark:hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{isResolving ? (lang === 'hi' ? 'हल कर रहा है...' : lang === 'gu' ? 'શોધી રહ્યું છે...' : 'Resolving...') : (lang === 'hi' ? 'आरएजी चलाएं' : lang === 'gu' ? 'RAG ચલાવો' : 'Execute RAG')}</span>
                    <Send className="w-3 h-3 text-amber-400 dark:text-slate-900" />
                  </button>
                </div>
              </form>

              {/* Split Canvas */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: Vector Extraction */}
                <ScrollReveal direction="left" delay={1} className="lg:col-span-7">
                  <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/[0.05] space-y-4 h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {lang === 'hi' ? 'निकाला गया वेक्टर' : lang === 'gu' ? 'એક્સટ્રેક્ટ કરેલ વેક્ટર' : 'Extracted Vector'}
                        </span>
                        <span className="text-[10px] text-[#1E3A5F] dark:text-amber-400 px-2 py-0.5 rounded-full bg-[#1E3A5F]/10 dark:bg-amber-500/10 border border-[#1E3A5F]/20 dark:border-amber-500/20">{resolvedResult.denseVector}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200/80 dark:border-white/[0.05] font-mono text-xs text-slate-800 dark:text-slate-300 leading-relaxed">
                        <span className="text-emerald-500 mr-1.5">›</span>
                        "{typewriterDone ? demoQuery : typewriterText}"
                        {!typewriterDone && <span className="typewriter-cursor" />}
                      </div>
                      <div>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                          {lang === 'hi' ? 'प्रामाणिक संदर्भ:' : lang === 'gu' ? 'પ્રમાણભૂત સંદર્ભો:' : 'Normative References:'}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {resolvedResult.normative.map((test, i) => (
                            <div key={`${resolvedResult.code}-${i}`} className="flex items-center gap-2 text-[11px] font-mono text-slate-700 dark:text-slate-300 p-2.5 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/[0.05]">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span className="truncate">{test}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-200/80 dark:border-white/[0.05] flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                      <span>{lang === 'hi' ? 'विभाग' : lang === 'gu' ? 'વિભાગ' : 'Division'}: <strong className="text-slate-900 dark:text-white">{resolvedResult.division}</strong></span>
                      <span>MII: <strong className="text-emerald-600 dark:text-emerald-400">{resolvedResult.mii}</strong></span>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Right: Resolved Standard */}
                <ScrollReveal direction="right" delay={2} className="lg:col-span-5">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0B1E36] to-[#0E2038] text-white border border-[#1E3A5F]/60 shadow-xl space-y-4 h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                          {lang === 'hi' ? 'सर्वोत्तम मिलान' : lang === 'gu' ? 'શ્રેષ્ઠ મેળ' : 'Top Match'} • {resolvedResult.confidence}%
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black font-mono text-white tracking-tight">{resolvedResult.code}</h3>
                        <p className="text-xs text-slate-300 mt-1 leading-snug">{resolvedResult.title}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold font-mono uppercase text-[9px] text-amber-300 block">
                            {lang === 'hi' ? 'वैधानिक गजट आदेश:' : lang === 'gu' ? 'વૈધાનિક ગેઝેટ હુકમ:' : 'STATUTORY GAZETTE DECREE:'}
                          </span>
                          <p className="mt-0.5 text-xs text-amber-100 font-medium">{resolvedResult.qco}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => { loadScenario(resolvedResult.scenarioId); navigate('/dashboard'); }}
                      className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20"
                    >
                      <span>{t?.landing?.ctaLaunch || 'Launch Full Tender Matrix'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ================================================================ */}
      {/* ARCHITECTURE                                                     */}
      {/* ================================================================ */}
      <section id="architecture" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          <ScrollReveal direction="left" className="lg:col-span-7">
            <ComparisonGraph />
          </ScrollReveal>

          <ScrollReveal direction="right" className="lg:col-span-5">
            <div className="space-y-5">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {t?.landing?.problemSolutionTitle || 'Bridging the Critical Gap in Indian Public Procurement'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                {t?.landing?.aboutP1 || 'Public procurement officers face immense legal liability under CAG audits and CVC scrutiny when tender specifications inadvertently cite outdated standards or embed single-vendor proprietary parameters.'}
              </p>
              <div className="pt-2 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C44D2A] dark:bg-[#E87744] mt-2 shrink-0" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {lang === 'hi' ? 'नियामक मानक और QCO जटिलता घातीय रूप से बढ़ती है, जबकि मैनुअल समीक्षा क्षमता स्थिर रहती है।' :
                      lang === 'gu' ? 'નિયામક ધોરણો અને QCO જટિલતા ઘાતાંકીય રીતે વધે છે, જ્યારે મેન્યુઅલ સમીક્ષા ક્ષમતા સપાટ રહે છે.' :
                        'Regulatory standards and QCO complexity scale exponentially while manual review capacity remains flat — creating a growing compliance gap that exposes tenders to CAG audit risk.'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#5A7E3C] dark:bg-[#8AB862] mt-2 shrink-0" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {lang === 'hi' ? 'ISync इस बढ़ते अंतर को पाटकर स्वचालित अनुपालन सुनिश्चित करता है।' :
                      lang === 'gu' ? 'ISync આ વધતા અંતરને પાર કરીને સ્વચાલિત અનુપાલન સુનિશ્ચિત કરે છે.' :
                        'ISync bridges this gap by autonomously resolving exact Indian Standards, normative references, and mandatory QCO decrees in milliseconds.'}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================================================================ */}
      {/* PIPELINE                                                         */}
      {/* ================================================================ */}
      <section id="pipeline" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-8 space-y-2 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1E3A5F] dark:text-amber-400 block">
              {t?.landing?.archSubtitle || '4-Stage Investigation & Audit Workflow'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {t?.landing?.archTitle || 'How the System Inspects & Validates Every Tender'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-1 font-normal leading-relaxed">
              {lang === 'hi' ? 'यह देखने के लिए किसी भी चरण पर क्लिक करें कि सिस्टम निविदा दस्तावेजों की जांच कैसे करता है और धोखाधड़ी को रोकता है।' :
                lang === 'gu' ? 'સિસ્ટમ ટેન્ડર દસ્તાવેજોની તપાસ કેવી રીતે કરે છે અને છેતરપિંડી અટકાવે છે તે જોવા માટે કોઈપણ પગલા પર ક્લિક કરો.' :
                  'Click any stage below to see how the system reads tender documents, detects legal violations, and creates court-ready proof.'}
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {pipelineRows.map((row, idx) => {
            const isExpanded = expandedPipelineRow === idx;
            return (
              <ScrollReveal key={idx} direction="up" delay={idx + 1}>
                <div
                  onClick={() => setExpandedPipelineRow(isExpanded ? null : idx)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer backdrop-blur-xl ${isExpanded
                      ? 'bg-white/90 dark:bg-[#0E1322]/90 border-[#1E3A5F]/50 dark:border-amber-500/50 shadow-xl'
                      : 'bg-white/60 dark:bg-[#0E1322]/50 border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-xl sm:text-2xl font-mono font-bold text-[#1E3A5F] dark:text-amber-400">{row.num}.</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{row.title}</h3>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 hidden sm:inline">{row.badge}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{row.subtitle}</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180 text-amber-500' : ''}`} />
                  </div>

                  {isExpanded && (
                    <div className="mt-5 pt-5 border-t border-slate-200/80 dark:border-white/[0.06] grid grid-cols-1 md:grid-cols-12 gap-5 animate-in fade-in duration-200">
                      <p className="md:col-span-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{row.description}</p>
                      <div className="md:col-span-4 space-y-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                          {lang === 'hi' ? 'मुख्य क्षमताएं:' : lang === 'gu' ? 'મુખ્ય ક્ષમતાઓ:' : 'Core Capabilities:'}
                        </span>
                        {row.specs.map((spec, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ================================================================ */}
      {/* DIVISIONS                                                        */}
      {/* ================================================================ */}
      <section id="corpus" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="p-8 sm:p-12 rounded-3xl bg-white/75 dark:bg-[#0E1322]/70 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#1E3A5F] dark:text-amber-400 mb-2 block">
              {t?.landing?.divisionsSubtitle || 'Universal Standards Corpus'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
              {t?.landing?.divisionsTitle || '7 Technical BIS Divisions'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-6">
              {BIS_DIVISIONS.map((div) => (
                <button
                  key={div.code}
                  onClick={() => setActiveDivisionTab(div.code)}
                  className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border ${activeDivisionTab === div.code
                      ? 'bg-[#0B1E36] dark:bg-white text-white dark:text-[#07080A] border-[#0B1E36] dark:border-white shadow-md'
                      : 'border-slate-200/80 dark:border-white/10 hover:bg-slate-100/70 dark:hover:bg-white/[0.04]'
                    }`}
                >
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full mb-1.5 block w-fit ${activeDivisionTab === div.code ? 'bg-amber-400 text-slate-950' : 'bg-slate-200/60 dark:bg-white/[0.08] text-slate-700 dark:text-slate-300'
                    }`}>
                    {div.code}
                  </span>
                  <p className="text-xs font-bold truncate">{div.shortName}</p>
                  <p className="text-[10px] font-mono opacity-80 mt-0.5">{div.standardsCount.toLocaleString()} {lang === 'hi' ? 'मानक' : lang === 'gu' ? 'ધોરણો' : 'Stds'}</p>
                </button>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/[0.05] grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  {lang === 'hi' ? 'विभाग' : lang === 'gu' ? 'વિભાગ' : 'Division'}
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">{activeDivInfo.fullName}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  {lang === 'hi' ? 'मानक और क्यूसीओ' : lang === 'gu' ? 'ધોરણો અને QCO' : 'Standards & QCOs'}
                </span>
                <p className="text-sm font-bold font-mono text-[#1E3A5F] dark:text-amber-400 mt-1">{activeDivInfo.standardsCount.toLocaleString()} Active Standards • {activeDivInfo.activeQCOs} QCOs</p>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  {lang === 'hi' ? 'कार्यक्षेत्र' : lang === 'gu' ? 'કાર્યક્ષેત્ર' : 'Scope'}
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{activeDivInfo.keyProducts}</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ================================================================ */}
      {/* FAQ                                                              */}
      {/* ================================================================ */}
      <section id="faq" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <ScrollReveal direction="left" className="lg:col-span-4">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#1E3A5F] dark:text-amber-400 block">
                {t?.landing?.faqSubtitle || 'Legal & Statutory Guidance'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {t?.landing?.faqTitle || 'FAQ (Frequently Asked Questions)'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {lang === 'hi' ? 'बीआईएस अधिनियम 2016 और जीएफआर 2017 अनुपालन के संबंध में अक्सर पूछे जाने वाले कानूनी प्रश्न।' :
                  lang === 'gu' ? 'BIS એક્ટ 2016 અને GFR 2017 પાલન અંગે વારંવાર પૂછાતા પ્રશ્નો.' :
                    'Clear legal and statutory answers regarding BIS Act 2016, Gazette QCO mandates, and GFR 2017 anti-bias compliance.'}
              </p>
            </div>
          </ScrollReveal>

          <div className="lg:col-span-8 space-y-3">
            {faqItems.map((item, fIdx) => (
              <ScrollReveal key={fIdx} direction="up" delay={fIdx + 1}>
                <div
                  onClick={() => setOpenFaqIndex(openFaqIndex === fIdx ? null : fIdx)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer backdrop-blur-xl ${openFaqIndex === fIdx
                      ? 'bg-white/90 dark:bg-[#0E1322]/90 border-[#1E3A5F]/50 dark:border-amber-500/50 shadow-md'
                      : 'bg-white/60 dark:bg-[#0E1322]/50 border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white pr-3">{item.q}</h3>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform shrink-0 ${openFaqIndex === fIdx ? 'rotate-180 text-amber-500' : ''}`} />
                  </div>
                  {openFaqIndex === fIdx && (
                    <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-white/[0.06] text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed animate-in fade-in duration-150">
                      {item.a}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CTA BANNER                                                       */}
      {/* ================================================================ */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="rounded-3xl p-10 sm:p-14 bg-gradient-to-br from-[#0B1E36] via-[#10243E] to-[#0B1428] text-white border border-[#1E3A5F]/50 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(245,158,11,0.15),transparent_70%)] rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-xl space-y-4 relative z-10">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 block">
                {lang === 'hi' ? 'सरकारी सहायता केंद्र' : lang === 'gu' ? 'સરકારી હેલ્પ ડેસ્ક અને સપોર્ટ' : 'Government Helpdesk & Support'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {t?.landing?.ctaBannerTitle || 'Need Help with Your Tender Specifications?'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {t?.landing?.ctaBannerSubtitle || 'Our dedicated technical and legal help desk assists procurement officers, evaluators, and auditors across Central & State ministries in resolving BIS standards, QCO mandates, and GFR 2017 compliance.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsHelpDeskOpen(true)}
                  className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl shadow-amber-400/25 transition-all transform hover:scale-105 flex items-center gap-2.5 cursor-pointer"
                >
                  <Headphones className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'hi' ? 'सहायता केंद्र से संपर्क करें' : lang === 'gu' ? 'સપોર્ટ / હેલ્પ ડેસ્ક સંપર્ક' : 'Contact Support / Help Desk'}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ================================================================ */}
      {/* FOOTER                                                           */}
      {/* ================================================================ */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-white/[0.08] bg-white/75 dark:bg-[#070B14]/80 backdrop-blur-2xl py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <ScrollReveal direction="up" delay={1}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <AnimatedLogo
                    size={42}
                    showReplay={false}
                    textColor={isDark ? '#F1F5F9' : '#0B1E36'}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  {t?.nav?.brandSubtitle || 'National AI-Powered Recommendation Engine for Indian Standards & GFR 2017 Compliance.'}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {lang === 'hi' ? 'सभी सिस्टम चालू हैं' : lang === 'gu' ? 'બધી સિસ્ટમો સક્રિય છે' : 'All Systems Operational'}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={2}>
              <div className="space-y-2">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  {lang === 'hi' ? 'वैधानिक ढांचा' : lang === 'gu' ? 'વૈધાનિક માળખું' : 'Statutory Frameworks'}
                </p>
                <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 font-normal">
                  <li>• BIS Act 2016 (Section 16)</li>
                  <li>• GFR 2017 Rule 144(xi)</li>
                  <li>• Public Procurement Order 2017</li>
                  <li>• GeM Guidelines v4.2</li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={3}>
              <div className="space-y-2">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  {lang === 'hi' ? 'मुख्य क्षमताएं' : lang === 'gu' ? 'મુખ્ય ક્ષમતાઓ' : 'Core Capabilities'}
                </p>
                <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 font-normal">
                  <li>• 768-D Vector Retrieval</li>
                  <li>• Normative Graph Traversal</li>
                  <li>• Model NIT Clause Synthesis</li>
                  <li>• SHA-256 QR Passports</li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={4}>
              <div className="space-y-2">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">National Procurement Gateway</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Bureau of Indian Standards (BIS)</p>
                <p className="text-[11px] text-slate-400 font-mono mt-1">Ministry of Consumer Affairs, Food & Public Distribution</p>
              </div>
            </ScrollReveal>
          </div>
          <div className="pt-6 border-t border-slate-200/80 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <p>© 2026 ISync. Bureau of Indian Standards. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">{lang === 'hi' ? 'सुरक्षा नीति' : lang === 'gu' ? 'સુરક્ષા નીતિ' : 'Security Policy'}</span>
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">{lang === 'hi' ? 'सेवा की शर्तें' : lang === 'gu' ? 'સેવાની શરતો' : 'Terms of Service'}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ================================================================ */}
      {/* INTERACTIVE QUERY & GRIEVANCE REPORTING MODAL                    */}
      {/* ================================================================ */}
      {isHelpDeskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full max-w-xl bg-white dark:bg-[#0B132B] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-white/20 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => { setIsHelpDeskOpen(false); setSubmittedTicket(null); }}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!submittedTicket ? (
              /* Query Reporting Form */
              <div>
                {/* Modal Header */}
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {lang === 'hi' ? 'प्रश्न या शिकायत दर्ज करें' : lang === 'gu' ? 'પ્રશ્ન અથવા ફરિયાદ નોંધાવો' : 'Report a Query or Grievance'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === 'hi' ? 'बीआईएस तकनीकी और कानूनी अनुपालन निदेशालय को सीधी सबमिशन' : lang === 'gu' ? 'BIS ટેકનિકલ અને કાનૂની નિયામકને સીધી સબમિશન' : 'Submit your query directly to the BIS Technical & Legal Directorate'}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleQuerySubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                        {lang === 'hi' ? 'अधिकारी का नाम / पद' : lang === 'gu' ? 'અધિકારીનું નામ / પદ' : 'Officer Name / Dept'}
                      </label>
                      <input
                        type="text"
                        required
                        value={queryForm.name}
                        onChange={(e) => setQueryForm({ ...queryForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-amber-400"
                        placeholder="Er. Name (Department)"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                        {lang === 'hi' ? 'आधिकारिक ईमेल' : lang === 'gu' ? 'સત્તાવાર ઈમેલ' : 'Official Email ID'}
                      </label>
                      <input
                        type="email"
                        required
                        value={queryForm.email}
                        onChange={(e) => setQueryForm({ ...queryForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-amber-400"
                        placeholder="name@gov.in"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                        {lang === 'hi' ? 'प्रश्न श्रेणी' : lang === 'gu' ? 'પ્રશ્ન કેટેગરી' : 'Query Category'}
                      </label>
                      <select
                        value={queryForm.category}
                        onChange={(e) => setQueryForm({ ...queryForm, category: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0E1322] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                      >
                        <option value="MANDATORY_QCO">Mandatory Gazette QCO Order Clarification</option>
                        <option value="GFR_ANTI_BIAS">GFR 2017 Rule 144(xi) Anti-Bias Check</option>
                        <option value="STANDARDS_UPDATE">Missing or Outdated Indian Standard (IS)</option>
                        <option value="BOQ_REVIEW">Tender BOQ Technical Specification Review</option>
                        <option value="GENERAL_GRIEVANCE">General Procurement Inquiry / Grievance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                        {lang === 'hi' ? 'निविदा संदर्भ / संख्या' : lang === 'gu' ? 'ટેન્ડર સંદર્ભ / નંબર' : 'Tender Ref / BOQ No.'}
                      </label>
                      <input
                        type="text"
                        value={queryForm.tenderRef}
                        onChange={(e) => setQueryForm({ ...queryForm, tenderRef: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-amber-400"
                        placeholder="e.g. RAIL/2026/PKG-01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase tracking-wider">
                      {lang === 'hi' ? 'प्रश्न का विवरण' : lang === 'gu' ? 'પ્રશ્નની વિગત' : 'Detailed Query / Description'}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={queryForm.description}
                      onChange={(e) => setQueryForm({ ...queryForm, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-amber-400 resize-none leading-relaxed"
                      placeholder="Specify the IS standard, mandatory QCO decree, single-vendor clause concern, or technical doubt..."
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsHelpDeskOpen(false)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
                    >
                      {lang === 'hi' ? 'रद्द करें' : lang === 'gu' ? 'રદ કરો' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingQuery || !queryForm.description.trim()}
                      className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-400/20 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>{isSubmittingQuery ? (lang === 'hi' ? 'दर्ज हो रहा है...' : 'Submitting...') : (lang === 'hi' ? 'प्रश्न दर्ज करें →' : 'Submit Query Ticket →')}</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Success Confirmation Card */
              <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    {lang === 'hi' ? 'प्रश्न टिकट सफलतापूर्वक दर्ज किया गया' : lang === 'gu' ? 'પ્રશ્ન ટિકિટ સફળતાપૂર્વક નોંધાઈ ગઈ' : 'Query Ticket Successfully Registered'}
                  </h3>
                  <div className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                    {submittedTicket.id}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 text-left font-mono space-y-1.5 max-w-md mx-auto">
                  <p>• <strong>Timestamp:</strong> {submittedTicket.timestamp}</p>
                  <p>• <strong>Category:</strong> {submittedTicket.category}</p>
                  <p>• <strong>Tender Ref:</strong> {submittedTicket.tenderRef}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 font-sans">
                    An official confirmation receipt has been dispatched to <strong className="text-slate-900 dark:text-white">{submittedTicket.email}</strong>. The Legal Directorate will review and provide statutory guidance within 2 business hours.
                  </p>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSubmittedTicket(null);
                      setQueryForm({ ...queryForm, description: '' });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    {lang === 'hi' ? 'दूसरा प्रश्न दर्ज करें' : 'Submit Another Query'}
                  </button>
                  <button
                    onClick={() => {
                      setIsHelpDeskOpen(false);
                      setSubmittedTicket(null);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#0B1E36] dark:bg-white text-white dark:text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-md"
                  >
                    {lang === 'hi' ? 'पूर्ण' : 'Done'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingView;
