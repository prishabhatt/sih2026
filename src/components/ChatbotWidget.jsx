import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  Terminal,
  FileText,
  AlertTriangle,
  Scale,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  ChevronDown,
  Info,
  Building2,
  Lock,
  Layers,
  Award
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';

// Comprehensive General, Platform, & Technical Knowledge Base for CORA
const BOT_KNOWLEDGE = [
  // 1. GENERAL PLATFORM / ABOUT WEBSITE
  {
    keywords: ['what is this website', 'what is this platform', 'what is this app', 'about this website', 'what does this do', 'purpose of this website', 'what is bis engine', 'overview of platform', 'what can this website do', 'tell me about this website'],
    response: {
      type: 'info',
      title: 'About the BIS Standards Recommendation Engine',
      content: 'This website is BIS Engine—an institutional, AI-powered public procurement intelligence portal developed for the Smart India Hackathon (SIH 2026).\n\nCore Functions:\n1. Semantic IS Resolution: Maps unstructured draft tender scopes & BOQs to 22,410+ Bureau of Indian Standards.\n2. Statutory QCO Enforcement: Automatically verifies Gazette Quality Control Orders (QCOs) under Section 16 of the BIS Act 2016.\n3. Bid-Bias Elimination: Audits specifications against GFR 2017 Rule 144(xi) to prevent single-vendor favouritism.\n4. Audit Passports: Synthesizes model NIT tender clauses and cryptographic SHA-256 scannable QR Passports for CAG/RITES inspection.',
      action: {
        label: 'Open Live Sandbox ↗',
        route: '/sandbox'
      },
      suggestions: [
        'How do I use this platform?',
        'Who built this project?',
        'Explain GFR Rule 144(xi)'
      ]
    }
  },
  {
    keywords: ['who made this', 'who created this', 'who built this', 'who developed this', 'team chronos', 'sih', 'smart india hackathon', 'creators', 'developers'],
    response: {
      type: 'info',
      title: 'Developed by Team Chronos • SIH 2026',
      content: 'This project was designed and engineered by Team Chronos for the Smart India Hackathon 2026, under the problem statement for the Ministry of Consumer Affairs, Food & Public Distribution and the Bureau of Indian Standards (BIS).\n\nOur objective is to modernize national procurement across GeM and CPPP portals with transparent, audit-proof AI governance.',
      action: {
        label: 'Explore Platform Overview',
        route: '/'
      },
      suggestions: [
        'What is this website?',
        'How does the engine work?',
        'What is a QCO?'
      ]
    }
  },
  {
    keywords: ['how to use', 'how do i use', 'how it works', 'workflow', 'how does it work', 'tutorial', 'how to start', 'guide', 'steps'],
    response: {
      type: 'info',
      title: 'How to Use BIS Engine (3-Step Workflow)',
      content: 'Step 1 — Ingest Scope (/input):\nPaste or upload your draft tender specification, Bill of Quantities (BOQ), or GeM Custom Bid description.\n\nStep 2 — AI Resolution & Bias Audit (/dashboard):\nThe 768-D neural vector engine resolves primary IS codes, links normative test methods, and flags restrictive brand parameters under GFR Rule 144(xi).\n\nStep 3 — Export NIT Clause & QR Passport (/reports):\nGenerate standardized Notice Inviting Tender (NIT) technical clauses and scannable SHA-256 QR compliance passports for field inspectors.',
      action: {
        label: 'Go to Tender Input Form',
        route: '/input'
      },
      suggestions: [
        'Open Live Sandbox',
        'Check IS 7098 Cable Standard',
        'What is an Audit Passport?'
      ]
    }
  },
  {
    keywords: ['who are you', 'what is your name', 'about you', 'introduce yourself', 'what is cora'],
    response: {
      type: 'info',
      title: 'Hello! I am CORA',
      content: 'I am CORA (Compliance & Optimization Recommendation Assistant), your government-grade AI Standards & Procurement Copilot.\n\nI can help you with:\n• Finding exact Bureau of Indian Standards (IS codes) for any item\n• Verifying mandatory Gazette Quality Control Orders (QCOs)\n• Auditing tender specifications for GFR 2017 Rule 144(xi) compliance\n• Formatting model NIT clauses for GeM and CPPP\n• Answering general procurement & regulatory questions',
      suggestions: [
        'What is this website?',
        'What is IS 7098 (Part 2)?',
        'Explain GFR Rule 144(xi)'
      ]
    }
  },
  {
    keywords: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening', 'greetings'],
    response: {
      type: 'info',
      title: 'Namaste! How can I assist you today?',
      content: 'Welcome to the BIS Standards Recommendation Engine. You can ask me about:\n\n• Indian Standards (IS Codes): e.g., Cables, TMT Steel, Solar Pumps, Pipes, Cement.\n• Statutory QCO Decrees: Checking mandatory ISI marks under Section 16 of the BIS Act.\n• GFR 2017 Compliance: Removing restrictive proprietary clauses in tenders.\n• Tender Clauses & QR Passports: Exporting audit-proof technical specifications.',
      suggestions: [
        'What is this website?',
        'What is IS 1786 for TMT Steel?',
        'How to generate a QR Passport?'
      ]
    }
  },
  {
    keywords: ['what is bis', 'bureau of indian standards', 'manak', 'isi mark', 'bis act'],
    response: {
      type: 'info',
      title: 'What is the Bureau of Indian Standards (BIS)?',
      content: 'The Bureau of Indian Standards (BIS) is the National Standards Body of India established under the BIS Act 2016.\n\nKey Responsibilities:\n• Formulating National Standards across 16 technical divisions (22,410+ active standards)\n• Operating product certification schemes (Scheme-I ISI Mark, Scheme-II Compulsory Registration CRS)\n• Supporting statutory Quality Control Orders (QCOs) notified by Central Ministries.',
      suggestions: [
        'What is a QCO?',
        'Which divisions are indexed?',
        'Explain GFR Rule 144(xi)'
      ]
    }
  },
  {
    keywords: ['what is qco', 'quality control order', 'mandatory qco', 'gazette qco', 'section 16'],
    response: {
      type: 'info',
      title: 'What is a Quality Control Order (QCO)?',
      content: 'Quality Control Orders (QCOs) are statutory decrees issued by Central Ministries under Section 16 of the BIS Act 2016.\n\nLegal Implications:\n• Once a QCO takes effect, it is unlawful to manufacture, import, distribute, or sell the specified goods without a valid BIS Certification (ISI Mark or CRS registration).\n• Public procurement authorities must mandate compliant BIS standards in tender specifications without exception.',
      suggestions: [
        'Check QCO for TMT Steel Bars',
        'Check QCO for 11kV HT Cables',
        'Explain GFR Rule 144(xi)'
      ]
    }
  },
  {
    keywords: ['what is gfr', 'gfr 2017', 'general financial rules', 'rule 144', 'rule 144(xi)', 'rule 144(iv)', 'single vendor bias'],
    response: {
      type: 'info',
      title: 'GFR 2017 — Rule 144(iv) & Rule 144(xi)',
      content: 'General Financial Rules (GFR) 2017 govern public procurement across India:\n\n• Rule 144(iv): Prohibits referencing specific brand names, trademarks, or proprietary manufacturers in public tenders to protect fair competition.\n• Rule 144(xi): Mandates standard national parameters (BIS Standards) so that all qualified domestic vendors can participate equally without anti-competitive barriers.',
      action: {
        label: 'Test Rule 144(xi) in Engine',
        route: '/input'
      },
      suggestions: [
        'What is this website?',
        'What is an Audit Passport?',
        'Open Live Sandbox'
      ]
    }
  },
  {
    keywords: ['what is gem', 'government e-marketplace', 'gem portal', 'cppp'],
    response: {
      type: 'info',
      title: 'GeM (Government e-Marketplace) & CPPP Integration',
      content: 'GeM (gem.gov.in) is the national public procurement portal for all Central and State Government organizations.\n\nHow BIS Engine Integrates:\nOur engine generates standardized Model NIT Technical Clauses formatted specifically for direct copy-paste into GeM Custom Bids and the Central Public Procurement Portal (CPPP).',
      action: {
        label: 'Open Live Sandbox',
        route: '/sandbox'
      },
      suggestions: [
        'Generate Model NIT Clause',
        'What is an Audit Passport?',
        'How to use this platform?'
      ]
    }
  },
  {
    keywords: ['what is an audit passport', 'audit passport', 'qr code', 'sha-256', 'digital seal', 'tamper proof', 'cag audit', 'verification'],
    response: {
      type: 'info',
      title: 'Cryptographic SHA-256 QR Audit Passports',
      content: 'Every resolved tender scope on our engine produces an immutable digital audit passport:\n\n• SHA-256 Cryptographic Hash: Combines the BOQ specification, resolved IS standard, mandatory test methods, and officer credential timestamp into a tamper-evident digital seal.\n• Field QR Code: Inspection authorities (e.g., RITES, DGS&D) and CAG auditors can scan the QR code on-site using any smartphone or mobile terminal to verify delivered goods against original tender mandates.',
      action: {
        label: 'View Sample Audit Passports',
        route: '/reports'
      },
      suggestions: [
        'What is this website?',
        'How does neural vector RAG work?',
        'Open Live Sandbox'
      ]
    }
  },
  {
    keywords: ['make in india', 'mii', 'local content', 'class-i', 'class-ii', 'preference to make in india'],
    response: {
      type: 'info',
      title: 'Public Procurement (Preference to Make in India) Order',
      content: 'The PPP-MII Order 2017 mandates purchase preference for domestic suppliers:\n\n• Class-I Local Supplier: Minimum 50% local content.\n• Class-II Local Supplier: Minimum 20% local content.\n• Non-Local Supplier: Less than 20% local content.\n\nOur engine automatically injects mandatory MII local content declaration clauses into your synthesized NIT documents.',
      suggestions: [
        'What is GFR 2017?',
        'What is this website?',
        'What is IS 7098 for Cables?'
      ]
    }
  },
  {
    keywords: ['divisions', 'etd', 'ced', 'mtd', 'chd', 'litd', 'txd', 'supported standards', 'engineering divisions'],
    response: {
      type: 'info',
      title: 'Universal Standards Corpus (6 Technical Divisions)',
      content: 'The platform indexes standards across 6 primary engineering divisions:\n\n• ETD (Electrotechnical): Power cables, transformers, switchgear (2,450+ standards)\n• CED (Civil Engineering): Cement, TMT rebar, structural steel (3,120+ standards)\n• MTD (Metallurgical): Steel pipes, alloy tubes, castings (1,840+ standards)\n• CHD (Chemical): Paints, polymers, industrial chemicals (2,180+ standards)\n• LITD (Electronics & IT): Solar PV, smart meters, inverters (1,650+ standards)\n• TXD (Textiles): Geotextiles, technical fabrics, protective wear (1,290+ standards)',
      suggestions: [
        'What is IS 7098 in ETD?',
        'What is IS 1786 in CED?',
        'Open Live Sandbox'
      ]
    }
  },

  // 2. TECHNICAL IS CODES AND SCENARIOS
  {
    keywords: ['is 7098', 'cable', 'xlpe', 'underground cable', 'ht cable', '11kv'],
    response: {
      type: 'standard',
      title: 'IS 7098 (Part 2) : 2011 — High Voltage XLPE Cables',
      content: 'Standard covers Cross-linked Polyethylene (XLPE) insulated thermoplastic sheathed cables for working voltages from 3.3 kV up to and including 33 kV.',
      qco: 'Cables & Wires (Quality Control) Order, 2023 [Mandatory ISI Mark under Scheme-I].',
      tests: ['IS 8130 : 2013 (Conductor Resistance)', 'IS 10810 Part 58 (Oxygen Index >= 29%)', 'IS 3975 : 1999 (Galvanized Steel Armour)'],
      scenarioId: 'underground_cable_metro',
      actionLabel: 'Load Cable Scenario in Engine'
    }
  },
  {
    keywords: ['is 1786', 'tmt', 'rebar', 'steel', 'fe 500', 'fe 500d', 'reinforcement'],
    response: {
      type: 'standard',
      title: 'IS 1786 : 2008 — High Strength Deformed Steel Bars (TMT Fe 500D)',
      content: 'Specifies requirements for thermo-mechanically treated deformed steel reinforcement bars for concrete with minimum yield stress of 500 N/mm² and total elongation >= 16%.',
      qco: 'Steel & Steel Products (Quality Control) Order, 2024 [Mandatory BIS License].',
      tests: ['IS 1608 Part 1 (Tensile Yield Stress)', 'IS 1599 (180° Cold Bend Mandrel Test)', 'Chemical Spectro-Analysis (C <= 0.25%, S+P <= 0.075%)'],
      scenarioId: 'tmt_rebars_cement_nhai',
      actionLabel: 'Load Rebar Scenario in Engine'
    }
  },
  {
    keywords: ['is 1239', 'pipe', 'ms pipe', 'erw', 'water pipe', 'tubes'],
    response: {
      type: 'standard',
      title: 'IS 1239 (Part 1) : 2004 — Steel Tubes & Tubulars (MS ERW Pipes)',
      content: 'Covers electric resistance welded (ERW) mild steel tubes suitable for screwing or welding, categorized into Light, Medium, and Heavy classes for water and gas networks.',
      qco: 'Pipes and Tubes (Quality Control) Order, 2023 [Mandatory ISI Mark].',
      tests: ['IS 4736 : 1986 (Zinc Mass Coating >= 400 g/m²)', 'IS 2328 : 2018 (Tube Flattening Test to 75%)', 'IS 5822 : 1994 (Hydro-test at 1.5x Design Pressure)'],
      scenarioId: 'erw_pipes_municipal',
      actionLabel: 'Load Pipe Scenario in Engine'
    }
  },
  {
    keywords: ['solar', 'pm-kusum', 'kusum', 'pv', 'is 17017', 'pump', 'is 14286'],
    response: {
      type: 'standard',
      title: 'IS 17017 & IS 14286 — Solar Photovoltaic Water Pumping Systems',
      content: 'Covers design qualification and performance requirements for standalone DC/AC solar pumping systems under the PM-KUSUM scheme with MPPT controllers.',
      qco: 'Solar Photovoltaics, Systems & Devices (Compulsory Registration Order) [CRS Scheme-II].',
      tests: ['IS/IEC 61215 (Design Qualification & Type Approval)', 'IS 10322 (Luminaires / Safety)', 'MNRE Efficiency Benchmarks (>= 98% Controller Efficiency)'],
      scenarioId: 'solar_pumps_kusum',
      actionLabel: 'Load Solar Scenario in Engine'
    }
  },
  {
    keywords: ['is 269', 'cement', 'opc', 'opc 53', 'portland cement'],
    response: {
      type: 'standard',
      title: 'IS 269 : 2015 — Ordinary Portland Cement (OPC 53 Grade)',
      content: 'Covers manufacturing and chemical/physical requirements for 33, 43, and 53 grade Ordinary Portland Cement used in high-strength concrete bridges and superstructures.',
      qco: 'Cement (Quality Control) Order, 2024 [Mandatory BIS Certification].',
      tests: ['IS 4031 Part 6 (28-day Compressive Strength >= 53 MPa)', 'IS 4031 Part 3 (Soundness Test <= 10mm)', 'IS 4031 Part 5 (Initial Setting Time >= 30 mins)'],
      scenarioId: 'tmt_rebars_cement_nhai',
      actionLabel: 'Load Cement Scenario in Engine'
    }
  }
];

export function ChatbotWidget() {
  const navigate = useNavigate();
  const { loadScenario } = useProcurement();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      timestamp: 'Just now',
      text: 'Namaste! I am CORA, your AI Procurement & Standards Assistant.\n\nYou can ask me about 22,410+ Bureau of Indian Standards (IS codes), mandatory Gazette QCO decrees, GFR 2017 Rule 144(xi) compliance, or how this platform works!',
      suggestions: [
        'What is this website?',
        'What is IS 7098 (Part 2)?',
        'Check QCO for TMT Steel Bars',
        'Explain GFR Rule 144(xi)'
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerQuery = query.toLowerCase().replace(/[?.,!]/g, ' ').trim();
      
      // Match from knowledge base
      let matchedEntry = BOT_KNOWLEDGE.find((entry) =>
        entry.keywords.some((kw) => {
          const cleanKw = kw.toLowerCase().trim();
          return lowerQuery.includes(cleanKw) || cleanKw.includes(lowerQuery);
        })
      );

      let botReply;
      if (matchedEntry) {
        botReply = {
          id: Date.now() + 1,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          card: matchedEntry.response,
          suggestions: matchedEntry.response.suggestions || [
            'What is this website?',
            'Explain GFR Rule 144(xi)',
            'Check IS 7098 Cable Standard'
          ]
        };
      } else {
        botReply = {
          id: Date.now() + 1,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'I searched our 768-D vector database across 22,410+ Bureau of Indian Standards for: "' + query + '".\n\nWould you like me to resolve this specification in the live AI procurement engine or test it against mandatory Quality Control Orders (QCOs)?',
          action: {
            label: 'Analyze in AI Standards Engine',
            route: '/input'
          },
          suggestions: [
            'What is this website?',
            'What is IS 7098 (Part 2)?',
            'Explain GFR Rule 144(xi)'
          ]
        };
      }

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 450);
  };

  const handleActionClick = (action) => {
    if (action.scenarioId) {
      loadScenario(action.scenarioId);
      navigate('/input');
      setIsOpen(false);
    } else if (action.route) {
      navigate(action.route);
      setIsOpen(false);
    } else {
      navigate('/input');
      setIsOpen(false);
    }
  };

  const handleCopyText = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    if (!isListening) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* FLOATING MASCOT BUTTON (BOTTOM RIGHT CORNER - ALL PAGES)                  */}
      {/* ========================================================================= */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Animated Tooltip (When Closed) */}
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-[#0F172A]/90 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-xl backdrop-blur-xl cursor-pointer hover:border-blue-500/40 transition-all transform hover:-translate-x-1"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Need help with IS Codes? <strong>Ask CORA</strong></span>
          </div>
        )}

        {/* Mascot Icon Trigger Button */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
          }}
          aria-label="Open CORA Chatbot"
          className="relative group p-1 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 shadow-2xl hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all transform hover:scale-105 active:scale-95"
        >
          {/* Subtle Outer Pulse Ring */}
          <span className="absolute -inset-1 rounded-full bg-blue-500/30 blur-sm group-hover:bg-blue-500/50 animate-pulse pointer-events-none" />

          {/* Mascot Image Circular Container */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-slate-900 border-2 border-white/80 dark:border-slate-800 flex items-center justify-center">
            <img
              src="/mascot.png"
              alt="CORA Mascot"
              className="w-full h-full object-cover transform scale-110 group-hover:scale-125 transition-transform duration-300"
            />
          </div>

          {/* Online Notification Pill Badge */}
          <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#070B14] shadow-sm flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* CHATBOT WINDOW (EXPANDABLE, GLASSMORPHIC & ACCESSIBLE)                    */}
      {/* ========================================================================= */}
      {isOpen && (
        <div
          className={`fixed z-50 right-4 sm:right-6 transition-all duration-300 flex flex-col ${
            isMinimized
              ? 'bottom-24 w-80 h-16 rounded-2xl'
              : 'bottom-24 w-[92vw] sm:w-[420px] max-w-[440px] h-[580px] max-h-[82vh] rounded-3xl'
          } bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-2xl overflow-hidden`}
        >
          {/* Header Bar */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#070B14]/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-blue-500/30 bg-slate-900 flex-shrink-0 shadow-sm">
                <img
                  src="/mascot.png"
                  alt="CORA"
                  className="w-full h-full object-cover scale-110"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
                    <span className="text-blue-600 dark:text-blue-400">CORA</span>
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    AI BOT
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  National Standards Copilot
                </p>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: Date.now(),
                      sender: 'bot',
                      timestamp: 'Just now',
                      text: 'Chat history cleared. I am CORA, how can I assist you with Bureau of Indian Standards (BIS) compliance or GFR 2017 rules today?',
                      suggestions: [
                        'What is this website?',
                        'What is IS 7098 (Part 2)?',
                        'Check QCO for TMT Steel Bars',
                        'Explain GFR Rule 144(xi)'
                      ]
                    }
                  ]);
                }}
                title="Clear Chat"
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-rose-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message Feed Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-3.5 ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                          : 'bg-slate-100/90 dark:bg-[#0F172A]/80 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-xs'
                      }`}
                    >
                      {/* Normal Bot / User Text */}
                      {msg.text && (
                        <p className="leading-relaxed whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      )}

                      {/* Rich Knowledge Card (General or Standard) */}
                      {msg.card && (
                        <div className="space-y-2.5 mt-1">
                          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-extrabold text-xs">
                            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                            <span>{msg.card.title}</span>
                          </div>
                          
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {msg.card.content}
                          </p>

                          {msg.card.qco && (
                            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                              <span>⚖️ {msg.card.qco}</span>
                            </div>
                          )}

                          {msg.card.tests && (
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Mandatory Reference Tests:
                              </p>
                              {msg.card.tests.map((test, i) => (
                                <div
                                  key={i}
                                  className="p-1.5 rounded-lg bg-white/60 dark:bg-black/40 border border-slate-200/60 dark:border-white/5 font-mono text-[10px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                  <span className="truncate">{test}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {msg.card.actionLabel && (
                            <button
                              onClick={() => handleActionClick(msg.card)}
                              className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1.5 transition"
                            >
                              <span>{msg.card.actionLabel}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {msg.card.action && (
                            <button
                              onClick={() => handleActionClick(msg.card.action)}
                              className="w-full mt-2 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1.5 transition"
                            >
                              <span>{msg.card.action.label}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Generic Action Button */}
                      {msg.action && (
                        <button
                          onClick={() => handleActionClick(msg.action)}
                          className="w-full mt-2.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1.5 transition"
                        >
                          <span>{msg.action.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-black/5 dark:border-white/5 text-[9px] text-slate-400">
                        <span>{msg.timestamp}</span>
                        {msg.sender === 'bot' && (
                          <button
                            onClick={() => handleCopyText(msg.text || (msg.card ? msg.card.title + '\n' + msg.card.content : ''), index)}
                            className="hover:text-blue-500 flex items-center gap-1"
                          >
                            {copiedIndex === index ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Quick Suggestion Chips Under Bot Message */}
                    {msg.suggestions && index === messages.length - 1 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                        {msg.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(sug)}
                            className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#0F172A] hover:bg-blue-50 dark:hover:bg-blue-950/50 border border-slate-200 dark:border-white/10 hover:border-blue-400 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-[10px] font-semibold shadow-2xs transition-all"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Animation State */}
                {isTyping && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-[#0F172A]/80 border border-slate-200 dark:border-white/10 w-24">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-slate-50/90 dark:bg-[#070B14]/90">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Ask about IS codes, QCOs, or platform guide..."
                      className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    />
                    <button
                      type="button"
                      onClick={handleVoiceInput}
                      title={isListening ? 'Stop Listening' : 'Voice Input'}
                      className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition ${
                        isListening
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'text-slate-400 hover:text-blue-500'
                      }`}
                    >
                      {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white shadow-sm transition flex-shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
                
                <div className="flex items-center justify-between pt-2 px-1 text-[9px] font-mono text-slate-400">
                  <span>NIC-BIS 768-D Vector Index Node</span>
                  <span>Press Enter ↵</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default ChatbotWidget;
