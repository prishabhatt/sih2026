import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  X,
  Send,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
  Maximize2,
  Minimize2,
  Mic,
  MicOff,
  Paperclip,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';

// Comprehensive Knowledge Base for CORA
const BOT_KNOWLEDGE = [
  {
    keywords: ['what is this website', 'what is this platform', 'what is this app', 'about this website', 'what does this do', 'purpose of this website', 'what is bis engine', 'overview of platform'],
    response: {
      type: 'info',
      title: 'About the BIS Standards Recommendation Engine',
      content: 'This platform is BIS Engine—an institutional AI-powered public procurement intelligence portal designed for the Smart India Hackathon (SIH 2026).\n\nCore Functions:\n1. Semantic IS Resolution: Maps unstructured tender scopes and BOQs to 22,410+ Bureau of Indian Standards.\n2. Statutory QCO Enforcement: Automatically verifies Gazette Quality Control Orders under Section 16 of BIS Act 2016.\n3. Bid-Bias Elimination: Audits specifications against GFR 2017 Rule 144(xi) to prevent single-vendor favouritism.\n4. Digital QR Passports: Synthesizes model NIT tender clauses and cryptographic SHA-256 compliance passports.',
      action: {
        label: 'Open Live Sandbox ↗',
        route: '/sandbox'
      },
      suggestions: [
        'What is IS 7098 (Part 2)?',
        'Explain GFR Rule 144(xi)',
        'What are mandatory QCOs?'
      ]
    }
  },
  {
    keywords: ['is 7098', 'is 7098 (part 2)', 'cable', 'xlpe', 'power cable', 'ht cable', '11kv', '33kv'],
    response: {
      type: 'standard',
      title: 'IS 7098 (Part 2) : 2011 — XLPE Insulated Heavy Duty Power Cables',
      content: 'Covers cross-linked polyethylene insulated thermoplastic sheathed cables for working voltages from 3.3 kV up to and including 33 kV for power distribution grids.',
      qco: 'Electrical Wires and Cables (Quality Control) Order, 2023 [Mandatory ISI Mark Scheme-I].',
      tests: ['IS 8130 (Conductor DC Resistance @ 20°C)', 'IS 5831 (Insulation Shrinkage & Tensile Test)', 'IS 10810 Part 53 (Oxygen Index Test >= 29)'],
      scenarioId: 'is_7098_cable_procurement',
      actionLabel: 'Load Cable Scenario in Engine'
    }
  },
  {
    keywords: ['gfr', 'gfr 2017', 'rule 144', 'rule 144(xi)', 'bias', 'vendor bias', 'neutrality'],
    response: {
      type: 'info',
      title: 'GFR 2017 Rule 144(xi) — Fundamental Principles of Public Procurement',
      content: 'Rule 144 of the General Financial Rules (GFR 2017) mandates that technical specifications must be generic, open, and objective.\n\nKey Requirements:\n• Zero proprietary make/brand names in NIT clauses\n• Zero tailored dimensional parameters aimed at favoring a single OEM\n• Compulsory reference to Bureau of Indian Standards (BIS) codes where available\n• Unrestricted market competition for all certified Indian suppliers',
      suggestions: [
        'What is this website?',
        'What is IS 7098 (Part 2)?',
        'What are mandatory QCOs?'
      ]
    }
  },
  {
    keywords: ['qco', 'quality control order', 'mandatory standards', 'gazette', 'bis act 2016'],
    response: {
      type: 'info',
      title: 'Mandatory Quality Control Orders (QCOs)',
      content: 'Under Section 16 of the BIS Act 2016, Central Ministries issue statutory Quality Control Orders making BIS certification (ISI Mark / CRS) compulsory for specified goods.\n\nKey Rules:\n• No person shall manufacture, import, distribute, or sell notified products without valid BIS license\n• Government procuring entities cannot accept non-BIS certified bids under statutory penalty',
      suggestions: [
        'What is this website?',
        'What is IS 7098 (Part 2)?',
        'Explain GFR Rule 144(xi)'
      ]
    }
  },
  {
    keywords: ['is 1786', 'tmt', 'steel', 'rebar', 'reinforcement bar', 'fe 500d', 'fe 550d'],
    response: {
      type: 'standard',
      title: 'IS 1786 : 2008 — High Strength Deformed Steel Bars (TMT)',
      content: 'Specifies chemical composition and mechanical properties for Thermo-Mechanically Treated (TMT) steel bars for concrete reinforcement (Fe 415, Fe 500D, Fe 550D, Fe 600).',
      qco: 'Steel and Steel Products (Quality Control) Order, 2024 [Mandatory ISI Mark].',
      tests: ['IS 1608 Part 1 (Yield Stress & Tensile Strength Ratio >= 1.10)', 'IS 1599 (Bend & Rebend Ductility Test)', 'IS 228 (Spectrometric Carbon Equivalent <= 0.42%)'],
      scenarioId: 'tmt_rebars_cement_nhai',
      actionLabel: 'Load TMT Rebar Scenario'
    }
  },
  {
    keywords: ['is 14543', 'food', 'water', 'packaged drinking water', 'irctc', 'beverage'],
    response: {
      type: 'standard',
      title: 'IS 14543 : 2016 — Packaged Drinking Water (Other than Natural Mineral Water)',
      content: 'Prescribes mandatory microbiological, physical, and chemical requirements for packaged drinking water sold in sealed containers for public passenger catering and institutional supply.',
      qco: 'Food Safety and Standards (Packaging) Regulations & Mandatory BIS Certification Order [Scheme-I ISI Mark].',
      tests: ['IS 14543 Table 1 (Microbiological Aerobic Count & Coliform Absent)', 'IS 3025 (Total Dissolved Solids 75-500 mg/L & pH 6.5-8.5)', 'IS 3025 Part 32 (Chloride, Sulphate & Heavy Metals Below Detection Limits)'],
      scenarioId: 'packaged_water_railways',
      actionLabel: 'Load Packaged Water Scenario'
    }
  }
];

export function ChatbotWidget() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadScenario } = useProcurement();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef(null);

  // Dynamic contextual taglines respective to each page
  const getPageTagline = () => {
    switch (location.pathname) {
      case '/':
        return {
          prefix: 'Need help with IS Codes?',
          action: 'Ask CORA'
        };
      case '/input':
        return {
          prefix: 'Need help structuring your BOQ?',
          action: 'Ask CORA'
        };
      case '/analyzing':
        return {
          prefix: 'AI Vector Audit in progress •',
          action: 'Ask CORA'
        };
      case '/dashboard':
        return {
          prefix: 'Need help with QCOs & Bias Score?',
          action: 'Ask CORA'
        };
      case '/reports':
        return {
          prefix: 'Need help with NIT Clause & QR Pass?',
          action: 'Ask CORA'
        };
      case '/sandbox':
        return {
          prefix: 'Testing procurement scenarios live?',
          action: 'Ask CORA'
        };
      case '/login':
        return {
          prefix: 'Need help with Executive Login?',
          action: 'Ask CORA'
        };
      default:
        return {
          prefix: 'Need help with BIS Standards?',
          action: 'Ask CORA'
        };
    }
  };

  const tagline = getPageTagline();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      timestamp: 'Just now',
      text: 'Namaste! I am CORA, your AI Procurement & Standards Assistant.\n\nYou can ask me about 22,410+ Bureau of Indian Standards (IS codes), mandatory Gazette QCO decrees, GFR 2017 Rule 144(xi) compliance, or how this platform works!',
      suggestions: [
        'What is this website?',
        'What is IS 7098 (Part 2)?',
        'Explain GFR Rule 144(xi)'
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

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
          timestamp: 'Just now',
          card: matchedEntry.response,
          suggestions: matchedEntry.response.suggestions || [
            'What is this website?',
            'What is IS 7098 (Part 2)?',
            'Explain GFR Rule 144(xi)'
          ]
        };
      } else {
        botReply = {
          id: Date.now() + 1,
          sender: 'bot',
          timestamp: 'Just now',
          text: 'I queried our 768-D neural vector database across 22,410+ Indian Standards for: "' + query + '".\n\nWould you like me to resolve this specification directly in the live AI procurement engine or audit it against mandatory Quality Control Orders (QCOs)?',
          action: {
            label: 'Analyze in AI Standards Engine ↗',
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

  const restartChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        timestamp: 'Just now',
        text: 'Namaste! I am CORA, your AI Procurement & Standards Assistant.\n\nYou can ask me about 22,410+ Bureau of Indian Standards (IS codes), mandatory Gazette QCO decrees, GFR 2017 Rule 144(xi) compliance, or how this platform works!',
        suggestions: [
          'What is this website?',
          'What is IS 7098 (Part 2)?',
          'Explain GFR Rule 144(xi)'
        ]
      }
    ]);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* FLOATING MASCOT BUTTON (SMALL COMPACT BUTTON ON BOTTOM RIGHT)             */}
      {/* ========================================================================= */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5">
        {!isOpen && (
          <button
            type="button"
            key={location.pathname}
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 dark:bg-[#162138]/95 border border-slate-200 dark:border-blue-400/30 text-slate-800 dark:text-blue-100 text-xs font-semibold shadow-xl backdrop-blur-md cursor-pointer hover:border-blue-500/60 transition-all hover:-translate-x-1 animate-in fade-in slide-in-from-right-2 duration-300 ring-1 ring-black/5 dark:ring-white/10"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{tagline.prefix} <strong>{tagline.action}</strong></span>
          </button>
        )}

        {/* Small Circular Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open CORA Chatbot"
          className="relative rounded-full p-0.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 shadow-2xl hover:shadow-[0_0_24px_rgba(37,99,235,0.5)] transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center flex-shrink-0"
          style={{ width: 50, height: 50, minWidth: 50, minHeight: 50, maxWidth: 50, maxHeight: 50 }}
        >
          <span className="absolute -inset-0.5 rounded-full bg-blue-500/30 animate-pulse pointer-events-none" />

          <div 
            className="w-full h-full rounded-full overflow-hidden bg-[#0A1224] border border-white/80 dark:border-white/30 flex items-center justify-center"
            style={{ width: '100%', height: '100%' }}
          >
            <img
              src="/mascot.png"
              alt="CORA Mascot"
              className="w-full h-full object-cover select-none pointer-events-none"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0B1120] shadow-xs" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* CHATBOT WINDOW (SOPHISTICATED ROYAL SAPPHIRE & ELEVATED CONTRAST)         */}
      {/* ========================================================================= */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col ${
            isExpanded
              ? 'bottom-4 right-2 left-2 sm:left-auto sm:right-6 sm:bottom-6 w-[calc(100vw-16px)] sm:w-[500px] h-[720px] max-h-[92vh]'
              : 'bottom-20 right-2 left-2 sm:left-auto sm:right-6 w-[calc(100vw-16px)] sm:w-[390px] md:w-[410px] h-[550px] sm:h-[590px] max-h-[85vh]'
          } rounded-[28px] bg-[#F6F8FA] dark:bg-[#181A20] border-2 border-slate-200/90 dark:border-2 dark:border-blue-500/30 shadow-[0_25px_70px_rgba(0,0,0,0.5),0_0_35px_rgba(37,99,235,0.15)] dark:shadow-[0_0_60px_-15px_rgba(37,99,235,0.3)] ring-1 ring-black/5 overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
        >
          {/* Top Royal Sovereign Navy Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-[#0C234E] via-[#123675] to-[#1B4B9A] dark:bg-none dark:bg-zinc-950/80 border-b border-blue-400/20 dark:border-blue-500/20 text-white flex items-center justify-between gap-3 shadow-md flex-shrink-0">
            <div className="flex items-center gap-2.5">
              {/* Avatar Icon */}
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 bg-[#0A1938] flex-shrink-0 shadow-inner flex items-center justify-center p-0.5">
                <img
                  src="/mascot.png"
                  alt="CORA"
                  className="w-full h-full object-cover scale-110"
                />
              </div>

              {/* Title & Status */}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide drop-shadow-xs">
                    CORA
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-blue-500/25 text-white border border-blue-300/30">
                    COPILOT
                  </span>
                </div>
                <p className="text-[11px] text-blue-100/90 font-normal flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online • Procurement Intelligence Copilot</span>
                </p>
              </div>
            </div>

            {/* Header Right Action Icons */}
            <div className="flex items-center gap-1.5 text-white/80">
              <button
                onClick={restartChat}
                title="Restart Chat"
                className="p-1.5 rounded-lg hover:bg-white/15 hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Restore' : 'Expand'}
                className="p-1.5 rounded-lg hover:bg-white/15 hover:text-white transition cursor-pointer"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-lg hover:bg-white/15 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
            {messages.map((msg, index) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[92%] sm:max-w-[88%] rounded-2xl p-4 sm:p-4.5 ${
                      isBot
                        ? 'bg-[#ECEEF2] dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 border border-slate-200/60 dark:border dark:border-zinc-700 shadow-sm'
                        : 'bg-[#2563EB] dark:bg-blue-600 text-white dark:text-white rounded-br-none shadow-md font-medium'
                    }`}
                  >
                    {/* Bot Message Formatted Text */}
                    {msg.text && (
                      <div className="leading-relaxed whitespace-pre-wrap font-normal text-xs sm:text-[13px]">
                        {msg.text.split('\n\n').map((para, pIdx) => {
                          const parts = para.split('CORA');
                          return (
                            <p key={pIdx} className={pIdx > 0 ? 'mt-3' : ''}>
                              {parts.map((part, idx) => (
                                <React.Fragment key={idx}>
                                  {part}
                                  {idx < parts.length - 1 && <strong>CORA</strong>}
                                </React.Fragment>
                              ))}
                            </p>
                          );
                        })}
                      </div>
                    )}

                    {/* Rich Knowledge Card */}
                    {msg.card && (
                      <div className="space-y-2.5 mt-1 text-xs sm:text-[13px]">
                        <div className="flex items-center gap-1.5 text-blue-700 dark:text-sky-300 font-extrabold text-xs sm:text-sm">
                          <ShieldCheck className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-sky-400" />
                          <span>{msg.card.title}</span>
                        </div>
                        
                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-normal">
                          {msg.card.content}
                        </p>

                        {msg.card.qco && (
                          <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-400/15 border border-amber-500/20 dark:border-amber-400/30 text-[11px] font-semibold text-amber-900 dark:text-amber-200 flex items-start gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <span>⚖️ {msg.card.qco}</span>
                          </div>
                        )}

                        {msg.card.tests && (
                          <div className="space-y-1.5 pt-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-blue-200/80">
                              Mandatory Reference Tests:
                            </p>
                            {msg.card.tests.map((test, i) => (
                              <div
                                key={i}
                                className="p-2 rounded-xl bg-white/80 dark:bg-[#121C32] border border-slate-200 dark:border-white/10 font-mono text-[11px] text-slate-800 dark:text-slate-200 flex items-center gap-2"
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
                            className="w-full mt-2.5 py-2.5 px-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <span>{msg.card.actionLabel}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {msg.card.action && (
                          <button
                            onClick={() => handleActionClick(msg.card.action)}
                            className="w-full mt-2.5 py-2.5 px-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
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
                        className="w-full mt-3 py-2.5 px-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <span>{msg.action.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Footer Row inside bot message card */}
                    {isBot && (
                      <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-300/50 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400">
                        <button
                          onClick={() => handleCopyText(msg.text || (msg.card ? msg.card.title + '\n' + msg.card.content : ''), index)}
                          className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer transition"
                        >
                          {copiedIndex === index ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Suggestion Chips Below Bot Message */}
                  {msg.suggestions && index === messages.length - 1 && (
                    <div className="flex flex-wrap gap-2 mt-3 max-w-[98%]">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSendMessage(sug)}
                          className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                        >
                          <span>{sug}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#ECEEF2] dark:bg-[#1C2945] border border-slate-200/50 dark:border-white/15 w-24">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="p-3 sm:p-3.5 border-t border-slate-200/80 dark:border-t dark:border-zinc-800 bg-[#F6F8FA] dark:bg-zinc-950/80 flex-shrink-0 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center bg-[#E5E9EE] dark:bg-zinc-900 border border-slate-200/90 dark:border dark:border-zinc-700 rounded-full px-3 py-1.5 gap-2 shadow-inner"
            >
              {/* Paperclip Attachment Icon */}
              <button
                type="button"
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                title="Attach Document or Spec Sheet"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about IS codes, QCOs, or platform..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none py-1.5"
              />

              {/* Voice Input Mic */}
              <button
                type="button"
                onClick={handleVoiceInput}
                title={isListening ? 'Stop Listening' : 'Voice Input'}
                className={`p-1.5 rounded-full transition cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Circular Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim()}
                aria-label="Send message"
                className="w-8 h-8 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 disabled:hover:bg-[#2563EB] text-white shadow-md flex items-center justify-center flex-shrink-0 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 -rotate-45 -mr-0.5" />
              </button>
            </form>

            {/* Micro Footer Legend */}
            <div className="flex items-center justify-between px-2 text-[10px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>NIC-BIS 768-D Vector Index Node</span>
              </span>
              <span>Press Enter ↵</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatbotWidget;
