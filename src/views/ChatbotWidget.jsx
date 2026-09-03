import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
    MessageSquare,
    X,
    Send,
    Bot,
    User,
    ShieldCheck,
    ArrowRight,
    Copy,
    Check,
    RefreshCw,
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
    Award,
    Paperclip
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import './cora-assistant.css';

// CORA mascot artwork — the branded robot render used at every size across the widget
const MASCOT_SRC = '/mascot1.png.jpeg';

function MascotAvatar({ size = 28, className = '' }) {
    return (
        <span
            className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#4F83FF] via-[#5B5FFF] to-[#7A3CFF] ring-1 ring-slate-300/70 dark:ring-white/20 shadow-sm ${className}`}
            style={{ width: size, height: size }}
        >
            <img
                src={MASCOT_SRC}
                alt=""
                draggable="false"
                style={{ objectPosition: '50% 45%', transform: 'scale(1.18)' }}
                className="h-full w-full object-cover"
            />
        </span>
    );
}

// Comprehensive General, Platform, & Technical Knowledge Base for CORA
const BOT_KNOWLEDGE = [
    // 1. GENERAL PLATFORM / ABOUT WEBSITE
    {
        keywords: ['what is this website', 'what is this platform', 'what is this app', 'about this website', 'what does this do', 'purpose of this website', 'what is bis engine', 'overview of platform', 'what can this website do', 'tell me about this website'],
        response: {
            type: 'info',
            title: 'About the BIS Standards Recommendation Engine',
            content: 'This website is BIS Engine—an institutional, AI-powered public procurement intelligence portal developed for the Smart India Hackathon (SIH 2026).\n\nCore Functions:\n- **Semantic IS Resolution**: Maps unstructured draft tender scopes & BOQs to 22,410+ Bureau of Indian Standards.\n- **Statutory QCO Enforcement**: Automatically verifies Gazette Quality Control Orders (QCOs) under Section 16 of the BIS Act 2016.\n- **Bid-Bias Elimination**: Audits specifications against GFR 2017 Rule 144(xi) to prevent single-vendor favouritism.\n- **Audit Passports**: Synthesizes model NIT tender clauses and cryptographic SHA-256 scannable QR Passports for CAG/RITES inspection.',
            action: {
                label: 'Open Live Sandbox ↗',
                route: '/sandbox'
            }
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
            }
        }
    },
    {
        keywords: ['add 11kv cables standard', 'add cable standard', 'add is 7098', 'add 7098'],
        response: {
            type: 'inline_action',
            content: 'I found **IS 7098 (Part 2)** for 11kV High Voltage XLPE Cables. Should I add this to your current draft tender?',
            inlineAction: {
                label: '+ Add to Draft',
                type: 'add_standard',
                payload: 'IS_7098_P2'
            }
        }
    },
    {
        keywords: ['how to use', 'how do i use', 'how it works', 'workflow', 'how does it work', 'tutorial', 'how to start', 'guide', 'steps'],
        response: {
            type: 'info',
            title: 'How to Use BIS Engine (3-Step Workflow)',
            content: 'Step 1 — **Ingest Scope** (/input):\nPaste or upload your draft tender specification, Bill of Quantities (BOQ), or GeM Custom Bid description.\n\nStep 2 — **AI Resolution & Bias Audit** (/dashboard):\nThe 768-D neural vector engine resolves primary IS codes, links normative test methods, and flags restrictive brand parameters under GFR Rule 144(xi).\n\nStep 3 — **Export NIT Clause & QR Passport** (/reports):\nGenerate standardized Notice Inviting Tender (NIT) technical clauses and scannable SHA-256 QR compliance passports for field inspectors.',
            action: {
                label: 'Go to Tender Input Form',
                route: '/input'
            }
        }
    },
    {
        keywords: ['who are you', 'what is your name', 'about you', 'introduce yourself', 'what is cora'],
        response: {
            type: 'info',
            title: 'Hello! I am CORA',
            content: 'I am **CORA (Compliance & Optimization Recommendation Assistant)**, your government-grade AI Standards & Procurement Copilot.\n\nI can help you with:\n- Finding exact Bureau of Indian Standards (IS codes) for any item\n- Verifying mandatory Gazette Quality Control Orders (QCOs)\n- Auditing tender specifications for GFR 2017 Rule 144(xi) compliance\n- Formatting model NIT clauses for GeM and CPPP\n- Answering general procurement & regulatory questions'
        }
    },
    {
        keywords: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening', 'greetings'],
        response: {
            type: 'info',
            title: 'Namaste! How can I assist you today?',
            content: 'Welcome to the BIS Standards Recommendation Engine. You can ask me about:\n\n- **Indian Standards (IS Codes)**: e.g., Cables, TMT Steel, Solar Pumps, Pipes, Cement.\n- **Statutory QCO Decrees**: Checking mandatory ISI marks under Section 16 of the BIS Act.\n- **GFR 2017 Compliance**: Removing restrictive proprietary clauses in tenders.\n- **Tender Clauses & QR Passports**: Exporting audit-proof technical specifications.'
        }
    },
    {
        keywords: ['what is bis', 'bureau of indian standards', 'manak', 'isi mark', 'bis act'],
        response: {
            type: 'info',
            title: 'What is the Bureau of Indian Standards (BIS)?',
            content: 'The Bureau of Indian Standards (BIS) is the National Standards Body of India established under the BIS Act 2016.\n\nKey Responsibilities:\n- Formulating National Standards across 16 technical divisions (22,410+ active standards)\n- Operating product certification schemes (Scheme-I ISI Mark, Scheme-II Compulsory Registration CRS)\n- Supporting statutory Quality Control Orders (QCOs) notified by Central Ministries.'
        }
    },
    {
        keywords: ['what is qco', 'quality control order', 'mandatory qco', 'gazette qco', 'section 16'],
        response: {
            type: 'info',
            title: 'What is a Quality Control Order (QCO)?',
            content: 'Quality Control Orders (QCOs) are statutory decrees issued by Central Ministries under Section 16 of the BIS Act 2016.\n\nLegal Implications:\n- Once a QCO takes effect, it is unlawful to manufacture, import, distribute, or sell the specified goods without a valid BIS Certification (ISI Mark or CRS registration).\n- Public procurement authorities must mandate compliant BIS standards in tender specifications without exception.'
        }
    },
    {
        keywords: ['what is gfr', 'gfr 2017', 'general financial rules', 'rule 144', 'rule 144(xi)', 'rule 144(iv)', 'single vendor bias'],
        response: {
            type: 'info',
            title: 'GFR 2017 — Rule 144(iv) & Rule 144(xi)',
            content: 'General Financial Rules (GFR) 2017 govern public procurement across India:\n\n- **Rule 144(iv)**: Prohibits referencing specific brand names, trademarks, or proprietary manufacturers in public tenders to protect fair competition.\n- **Rule 144(xi)**: Mandates standard national parameters (BIS Standards) so that all qualified domestic vendors can participate equally without anti-competitive barriers.',
            action: {
                label: 'Test Rule 144(xi) in Engine',
                route: '/input'
            }
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
            }
        }
    },
    {
        keywords: ['what is an audit passport', 'audit passport', 'qr code', 'sha-256', 'digital seal', 'tamper proof', 'cag audit', 'verification'],
        response: {
            type: 'info',
            title: 'Cryptographic SHA-256 QR Audit Passports',
            content: 'Every resolved tender scope on our engine produces an immutable digital audit passport:\n\n- **SHA-256 Cryptographic Hash**: Combines the BOQ specification, resolved IS standard, mandatory test methods, and officer credential timestamp into a tamper-evident digital seal.\n- **Field QR Code**: Inspection authorities (e.g., RITES, DGS&D) and CAG auditors can scan the QR code on-site using any smartphone or mobile terminal to verify delivered goods against original tender mandates.',
            action: {
                label: 'View Sample Audit Passports',
                route: '/reports'
            }
        }
    },
    {
        keywords: ['make in india', 'mii', 'local content', 'class-i', 'class-ii', 'preference to make in india'],
        response: {
            type: 'info',
            title: 'Public Procurement (Preference to Make in India) Order',
            content: 'The PPP-MII Order 2017 mandates purchase preference for domestic suppliers:\n\n- **Class-I Local Supplier**: Minimum 50% local content.\n- **Class-II Local Supplier**: Minimum 20% local content.\n- **Non-Local Supplier**: Less than 20% local content.\n\nOur engine automatically injects mandatory MII local content declaration clauses into your synthesized NIT documents.'
        }
    },
    {
        keywords: ['divisions', 'etd', 'ced', 'mtd', 'chd', 'litd', 'txd', 'supported standards', 'engineering divisions'],
        response: {
            type: 'info',
            title: 'Universal Standards Corpus (6 Technical Divisions)',
            content: 'The platform indexes standards across 6 primary engineering divisions:\n\n- **ETD** (Electrotechnical): Power cables, transformers, switchgear (2,450+ standards)\n- **CED** (Civil Engineering): Cement, TMT rebar, structural steel (3,120+ standards)\n- **MTD** (Metallurgical): Steel pipes, alloy tubes, castings (1,840+ standards)\n- **CHD** (Chemical): Paints, polymers, industrial chemicals (2,180+ standards)\n- **LITD** (Electronics & IT): Solar PV, smart meters, inverters (1,650+ standards)\n- **TXD** (Textiles): Geotextiles, technical fabrics, protective wear (1,290+ standards)'
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
    const location = useLocation();
    const { loadScenario, toggleStandardSelection, selectedStandardIds } = useProcurement();
    const fileInputRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [inputText, setInputText] = useState('');
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [hasAlert, setHasAlert] = useState(false);

    const messagesEndRef = useRef(null);

    const getContextSuggestions = () => {
        if (location.pathname === '/dashboard') {
            return [
                'Analyze my current draft',
                'Am I missing any mandatory tests?',
                'Add 11kV cables standard'
            ];
        } else if (location.pathname === '/reports') {
            return [
                'Summarize my compliance history',
                'What is an Audit Passport?',
                'Explain GFR Rule 144(xi)'
            ];
        } else {
            return [
                'What is this website?',
                'What is IS 7098 (Part 2)?',
                'Explain GFR Rule 144(xi)'
            ];
        }
    };

    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            timestamp: 'Just now',
            text: 'Namaste! I am **CORA**, your AI Procurement & Standards Assistant.\n\nYou can ask me about 22,410+ Bureau of Indian Standards (IS codes), mandatory Gazette QCO decrees, GFR 2017 Rule 144(xi) compliance, or how this platform works!',
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

    // Gentle proactive nudge while the widget is closed (periodic attention ping)
    useEffect(() => {
        if (isOpen) {
            setHasAlert(false);
            return undefined;
        }
        const nudge = setInterval(() => {
            setHasAlert(true);
            setTimeout(() => setHasAlert(false), 6000);
        }, 30000);
        return () => clearInterval(nudge);
    }, [isOpen]);

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
                if (matchedEntry.response.type === 'inline_action') {
                    botReply = {
                        id: Date.now() + 1,
                        sender: 'bot',
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        text: matchedEntry.response.content,
                        inlineAction: matchedEntry.response.inlineAction
                    };
                } else {
                    botReply = {
                        id: Date.now() + 1,
                        sender: 'bot',
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        card: matchedEntry.response,
                    };
                }
            } else {
                botReply = {
                    id: Date.now() + 1,
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    text: 'I searched our 768-D vector database across 22,410+ Bureau of Indian Standards for: "' + query + '".\n\nWould you like me to resolve this specification in the live AI procurement engine or test it against mandatory Quality Control Orders (QCOs)?',
                    action: {
                        label: 'Analyze in AI Standards Engine',
                        route: '/input'
                    }
                };
            }

            setMessages((prev) => [...prev, botReply]);
            setIsTyping(false);
        }, 800);
    };

    const handleActionClick = (action) => {
        if (action.type === 'add_standard') {
            if (!selectedStandardIds.includes(action.payload)) {
                 toggleStandardSelection(action.payload);
            }
            setMessages((prev) => [...prev, {
                id: Date.now(),
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: `Successfully added standard **${action.payload.replace(/_/g, ' ')}** to your draft.`
            }]);
            return;
        }

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

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMessages((prev) => [...prev, {
                id: Date.now(),
                sender: 'user',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: `Uploaded: ${file.name}`
            }]);
            setIsTyping(true);
            setTimeout(() => {
                setMessages((prev) => [...prev, {
                    id: Date.now() + 1,
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    text: `I've successfully parsed **${file.name}**. I detected 14 BOQ items. I am resolving IS Codes now...`
                }]);
                setIsTyping(false);
            }, 1000);
        }
    };

    return (
        <>
            {/* ========================================================================= */}
            {/* FLOATING MASCOT LAUNCHER — refined vector orb + contextual tooltip          */}
            {/* ========================================================================= */}
            {!isOpen && (
                <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[90] flex items-center gap-3">
                    {/* Contextual Invite Tooltip (anchored to the orb with a notch) */}
                    <motion.button
                        onClick={() => setIsOpen(true)}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                        className="group/tip relative hidden sm:flex items-center gap-2.5 rounded-2xl py-2.5 pl-4 pr-2.5 text-slate-800 dark:text-slate-100 bg-white/95 dark:bg-[#0E1830]/95 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-[0_14px_36px_-12px_rgba(2,6,23,0.3)] cursor-pointer transition-all duration-300 hover:-translate-x-0.5 hover:border-blue-400/60 hover:shadow-[0_14px_36px_-10px_rgba(37,99,235,0.35)]"
                    >
                        {/* Tooltip notch pointing at the orb */}
                        <span className="absolute -right-[5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 bg-white dark:bg-[#0E1830] border-r border-t border-slate-200/90 dark:border-white/10" />
                        <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/15" />
                        <span className="whitespace-nowrap text-[12.5px] font-semibold">
                            Need help with <span className="font-bold text-slate-900 dark:text-white">IS Codes &amp; QCOs?</span>
                        </span>
                    </motion.button>

                    {/* Mascot Orb — branded robot artwork with a clean gradient ring */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={hasAlert
                            ? { opacity: 1, scale: 1, y: [0, -12, 0, -7, 0] }
                            : { opacity: 1, scale: 1, y: 0 }}
                        transition={hasAlert
                            ? { duration: 0.6, ease: 'easeInOut' }
                            : { duration: 0.35, ease: 'easeOut' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setIsOpen(true);
                            setIsMinimized(false);
                            setHasAlert(false);
                        }}
                        aria-label="Open CORA Chatbot"
                        title="Ask CORA"
                        className="relative block h-[70px] w-[70px] shrink-0 rounded-full outline-none transition-shadow duration-300 hover:shadow-[0_14px_34px_-10px_rgba(37,99,235,0.45)] focus-visible:ring-2 focus-visible:ring-blue-400/70"
                    >
                        {/* Gradient ring + artwork disc */}
                        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#3B82F6] via-[#5B5FFF] to-[#8B5CF6] shadow-[0_12px_30px_-8px_rgba(37,99,235,0.45),0_2px_10px_rgba(2,6,23,0.18)] ring-1 ring-white/60 dark:ring-white/15" />
                        <span className="absolute inset-[3px] overflow-hidden rounded-full bg-gradient-to-br from-[#4F83FF] via-[#5B5FFF] to-[#7A3CFF] ring-1 ring-inset ring-white/40 dark:ring-white/10">
                            <img
                                src={MASCOT_SRC}
                                alt="CORA — AI procurement copilot"
                                draggable="false"
                                style={{ objectPosition: '50% 45%', transform: 'scale(1.18)' }}
                                className="h-full w-full object-cover"
                            />
                        </span>

                        {/* Online / alert status badge (static) */}
                        <span className={`pointer-events-none absolute -right-0.5 -top-0.5 h-[18px] w-[18px] rounded-full border-[2.5px] border-white shadow-sm dark:border-[#0A1122] ${hasAlert ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    </motion.button>
                </div>
            )}

            {/* ========================================================================= */}
            {/* CORA COPILOT WINDOW — branded chrome, refined message feed & composer      */}
            {/* ========================================================================= */}
            <AnimatePresence>
                {isOpen && !isMinimized && (
                    <motion.div
                        key="cora-window"
                        style={{ transformOrigin: 'bottom right' }}
                        initial={{ opacity: 0, scale: 0.86, y: 26 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.86, y: 26 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        className='fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[90] flex h-[min(660px,calc(100dvh_-_2rem))] w-[calc(100vw_-_2rem)] flex-col overflow-hidden rounded-[26px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-[0_30px_80px_-18px_rgba(2,6,23,0.5),0_14px_30px_-14px_rgba(37,99,235,0.3)] sm:w-[400px]'
                    >
                        {/* "Thinking" shimmer while CORA composes a reply */}
                        {isTyping && (
                            <motion.span
                                aria-hidden="true"
                                initial={{ x: '-140%' }}
                                animate={{ x: '440%' }}
                                transition={{ repeat: Infinity, duration: 1.15, ease: 'linear' }}
                                className='absolute left-0 top-0 z-20 h-[2.5px] w-1/3 rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent'
                            />
                        )}

                        {/* Branded Header Bar */}
                        <header className='relative shrink-0 overflow-hidden bg-gradient-to-br from-[#0A1122] via-[#12204A] to-[#1E3A8A] px-4 pb-3.5 pt-3.5 dark:from-[#070D1C] dark:via-[#0C1630] dark:to-[#14245C]'>
                            {/* Decorative layers */}
                            <span aria-hidden='true' className='cora-dotgrid pointer-events-none absolute inset-0 opacity-60 dark:opacity-40' />
                            <span aria-hidden='true' className='pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full bg-blue-500/25 blur-3xl' />
                            <span aria-hidden='true' className='pointer-events-none absolute -bottom-24 -left-14 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl' />

                            <div className='relative flex items-center justify-between gap-3'>
                                {/* Identity */}
                                <div className='flex items-center gap-3'>
                                    <MascotAvatar size={42} className='ring-white/35' />
                                    <div className='min-w-0'>
                                        <div className='flex items-center gap-2'>
                                            <h3 className='text-[15px] font-extrabold leading-none tracking-tight text-white'>CORA</h3>
                                            <span className='rounded-md bg-white/[0.12] px-1.5 py-[3px] font-mono text-[8.5px] font-bold uppercase tracking-[0.14em] text-sky-200 ring-1 ring-inset ring-white/20 backdrop-blur-sm'>Copilot</span>
                                        </div>
                                        <p className='mt-1.5 flex items-center gap-1.5 text-[10.5px] font-medium text-slate-300/90'>
                                            <span className='h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/15' />
                                            Online · Procurement Intelligence Copilot
                                        </p>
                                    </div>
                                </div>

                                {/* Window controls (glass) */}
                                <div className='flex items-center gap-0.5'>
                                    <button
                                        onClick={() => {
                                            setMessages([
                                                {
                                                    id: Date.now(),
                                                    sender: 'bot',
                                                    timestamp: 'Just now',
                                                    text: 'Chat history cleared. I am CORA, how can I assist you with Bureau of Indian Standards (BIS) compliance or GFR 2017 rules today?',
                                                }
                                            ]);
                                        }}
                                        title='Clear Chat'
                                        className='grid h-8 w-8 place-items-center rounded-xl text-slate-300/90 transition hover:bg-white/10 hover:text-white active:scale-95'
                                    >
                                        <RefreshCw className='h-[15px] w-[15px]' />
                                    </button>
                                    <button
                                        onClick={() => setIsMinimized(true)}
                                        title='Minimize'
                                        className='grid h-8 w-8 place-items-center rounded-xl text-slate-300/90 transition hover:bg-white/10 hover:text-white active:scale-95'
                                    >
                                        <Minimize2 className='h-[15px] w-[15px]' />
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        title='Close'
                                        className='grid h-8 w-8 place-items-center rounded-xl text-slate-300/90 transition hover:bg-rose-500/25 hover:text-rose-200 active:scale-95'
                                    >
                                        <X className='h-[16px] w-[16px]' />
                                    </button>
                                </div>
                            </div>
                        </header>

                        {/* =============================================================== */}
                        {/* Window body: message feed + chips + composer dock              */}
                        {/* =============================================================== */}
                        <div className='relative flex min-h-0 flex-1 flex-col'>
                            {/* Message Feed */}
                            <div className='relative min-h-0 flex-1 overflow-hidden bg-[#F2F4F8] dark:bg-[#090E1C]'>
                                <span aria-hidden='true' className='cora-dotgrid pointer-events-none absolute inset-0 opacity-80 dark:opacity-100' />
                                <div className='cora-scroll relative h-full space-y-3.5 overflow-y-auto px-3.5 pb-4 pt-4 text-[12.5px] leading-relaxed sm:px-4'>
                                    {messages.map((msg, index) => {
                                        const isUser = msg.sender === 'user';
                                        return (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                                className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                                            >
                                                {/* Bot avatar chip */}
                                                {!isUser && (
                                                    <MascotAvatar size={26} className='mb-0.5' />
                                                )}

                                                <div className={`flex min-w-0 max-w-[86%] flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                                                    <div
                                                        className={`px-3.5 py-3 ${isUser
                                                                ? 'rounded-[18px] rounded-br-[6px] bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.6)]'
                                                                : 'rounded-[18px] rounded-bl-[6px] border border-slate-200/70 bg-white text-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-[#151E3B] dark:text-slate-100'
                                                            }`}
                                                    >
                                                        {/* Text content (markdown for bot) */}
                                                        {msg.text && (
                                                            <div className='whitespace-pre-wrap'>
                                                                {msg.sender === 'bot' ? (
                                                                    <div className='prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 prose-ul:list-disc prose-ul:ml-4 prose-ol:list-decimal prose-ol:ml-4 max-w-none'>
                                                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                                                    </div>
                                                                ) : (
                                                                    <p>{msg.text}</p>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Inline action */}
                                                        {msg.inlineAction && (
                                                            <button
                                                                onClick={() => handleActionClick(msg.inlineAction)}
                                                                className='mt-3 w-full rounded-xl bg-blue-100 py-2 px-3 text-[11px] font-bold text-blue-700 transition hover:bg-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:hover:bg-blue-500/25'
                                                            >
                                                                {msg.inlineAction.label}
                                                            </button>
                                                        )}

                                                        {/* Rich knowledge card (general or standard) */}
                                                        {msg.card && (
                                                            <div className='mt-1.5 space-y-2.5'>
                                                                <div className='flex items-center gap-1.5 text-xs font-extrabold text-blue-700 dark:text-blue-300'>
                                                                    <ShieldCheck className='h-4 w-4 shrink-0' />
                                                                    <span>{msg.card.title}</span>
                                                                </div>

                                                                <div className='text-[11.5px] text-slate-600 dark:text-slate-300'>
                                                                    <div className='prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 prose-ul:list-disc prose-ul:ml-4 max-w-none'>
                                                                        <ReactMarkdown>{msg.card.content}</ReactMarkdown>
                                                                    </div>
                                                                </div>

                                                                {msg.card.qco && (
                                                                    <div className='flex items-start gap-1.5 rounded-xl border border-amber-500/25 bg-amber-500/10 p-2 text-[11px] font-semibold text-amber-800 dark:text-amber-300'>
                                                                        <AlertTriangle className='mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500' />
                                                                        <span>{msg.card.qco}</span>
                                                                    </div>
                                                                )}

                                                                {msg.card.tests && (
                                                                    <div className='space-y-1'>
                                                                        <p className='text-[9.5px] font-bold uppercase tracking-wider text-slate-400'>
                                                                            Mandatory Reference Tests
                                                                        </p>
                                                                        {msg.card.tests.map((test, i) => (
                                                                            <div
                                                                                key={i}
                                                                                className='flex items-center gap-1.5 rounded-lg border border-slate-200/70 bg-slate-50/80 p-1.5 font-mono text-[10px] text-slate-700 dark:border-white/5 dark:bg-black/30 dark:text-slate-300'
                                                                            >
                                                                                <span className='h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500' />
                                                                                <span className='truncate'>{test}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {(msg.card.actionLabel || msg.card.action) && (
                                                                    <button
                                                                        onClick={() => handleActionClick(msg.card.actionLabel ? msg.card : msg.card.action)}
                                                                        className='mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2 px-3 text-[11px] font-bold text-white shadow-sm transition hover:from-blue-500 hover:to-indigo-500'
                                                                    >
                                                                        <span>{msg.card.actionLabel || msg.card.action.label}</span>
                                                                        <ArrowRight className='h-3.5 w-3.5' />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Generic navigation action */}
                                                        {msg.action && (
                                                            <button
                                                                onClick={() => handleActionClick(msg.action)}
                                                                className='mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2 px-3 text-[11px] font-bold text-white shadow-sm transition hover:from-blue-500 hover:to-indigo-500'
                                                            >
                                                                <span>{msg.action.label}</span>
                                                                <ArrowRight className='h-3.5 w-3.5' />
                                                            </button>
                                                        )}

                                                        {/* Meta row: time + copy */}
                                                        <div className={`mt-2 flex items-center justify-between gap-3 border-t pt-1.5 text-[9.5px] ${isUser
                                                                ? 'border-white/15 text-blue-100/80'
                                                                : 'border-slate-200/60 text-slate-400 dark:border-white/10 dark:text-slate-500'
                                                            }`}>
                                                            <span>{msg.timestamp}</span>
                                                            {msg.sender === 'bot' && (
                                                                <button
                                                                    onClick={() => handleCopyText(msg.text || (msg.card ? msg.card.title + '\n' + msg.card.content : ''), index)}
                                                                    className={`flex items-center gap-1 transition ${isUser ? '' : 'hover:text-blue-500'}`}
                                                                >
                                                                    {copiedIndex === index ? (
                                                                        <Check className='h-3 w-3 text-emerald-500' />
                                                                    ) : (
                                                                        <Copy className='h-3 w-3' />
                                                                    )}
                                                                    <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}

                                    {/* Typing indicator with mascot */}
                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className='flex items-end gap-2'
                                        >
                                            <MascotAvatar size={26} className='mb-0.5' />
                                            <div className='flex items-center gap-1.5 rounded-[18px] rounded-bl-[6px] border border-slate-200/70 bg-white px-4 py-3.5 shadow-sm dark:border-white/10 dark:bg-[#151E3B]'>
                                                <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500' />
                                                <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 [animation-delay:0.2s]' />
                                                <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500 [animation-delay:0.4s]' />
                                            </div>
                                        </motion.div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            {/* Bottom dock: contextual chips + composer */}
                            <div className='shrink-0 border-t border-slate-200/80 bg-white/95 px-3.5 pb-2.5 pt-2.5 dark:border-white/[0.08] dark:bg-[#0D1526]/95'>
                                {/* Dynamic context-aware chips */}
                                {!isTyping && messages.length > 0 && messages[messages.length - 1].sender === 'bot' && (
                                    <div className='flex flex-wrap gap-1.5 pb-2.5'>
                                        {getContextSuggestions().map((sug, sIdx) => (
                                            <button
                                                key={sIdx}
                                                onClick={() => handleSendMessage(sug)}
                                                className='inline-flex max-w-full items-center rounded-full border border-slate-300/70 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm transition hover:border-blue-400/70 hover:bg-blue-50 hover:text-blue-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-blue-400/40 dark:hover:bg-blue-500/10 dark:hover:text-sky-300'
                                            >                                                    {sug}
                                                </button>
                                        ))}
                                    </div>
                                )}

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }}
                                    className='flex items-center gap-2'
                                >
                                    <div className='relative min-w-0 flex-1'>
                                        <button
                                            type='button'
                                            onClick={() => fileInputRef.current?.click()}
                                            className='absolute left-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-200/70 hover:text-blue-600 dark:hover:bg-white/10'
                                            title='Attach tender / BOQ document'
                                        >
                                            <Paperclip className='h-4 w-4' />
                                        </button>
                                        <input
                                            type='file'
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            className='hidden'
                                            accept='.pdf,.doc,.docx,.xlsx'
                                        />

                                        <input
                                            type='text'
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            placeholder='Ask about IS codes, QCOs, or platform guide...'
                                            className='h-11 w-full rounded-2xl border border-transparent bg-slate-100/90 pl-11 pr-11 text-[12.5px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500/60 focus:bg-white focus:ring-[3px] focus:ring-blue-500/15 dark:bg-white/[0.07] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400/50 dark:focus:bg-white/[0.1]'
                                        />

                                        <button
                                            type='button'
                                            onClick={handleVoiceInput}
                                            title={isListening ? 'Stop Listening' : 'Voice Input'}
                                            className={`absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-xl transition ${isListening
                                                    ? 'bg-rose-500 text-white animate-pulse'
                                                    : 'text-slate-400 hover:bg-slate-200/70 hover:text-blue-600 dark:hover:bg-white/10'
                                                }`}
                                        >
                                            {isListening ? <MicOff className='h-4 w-4' /> : <Mic className='h-4 w-4' />}
                                        </button>
                                    </div>

                                    <button
                                        type='submit'
                                        disabled={!inputText.trim()}
                                        className='grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-[0_8px_18px_-6px_rgba(37,99,235,0.55)] transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none'
                                        title='Send message'
                                    >
                                        <Send className='h-4 w-4' />
                                    </button>
                                </form>

                                <div className='mt-2 flex items-center justify-between px-1 text-[9px] font-medium text-slate-400 dark:text-slate-500'>
                                    <span className='flex items-center gap-1'>
                                        <Lock className='h-[10px] w-[10px]' />
                                        NIC-BIS 768-D Vector Index Node
                                    </span>
                                    <span>Press Enter ↵</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Minimized launcher pill */}
                {isOpen && isMinimized && (
                    <motion.div
                        key='cora-mini'
                        style={{ transformOrigin: 'bottom right' }}
                        initial={{ opacity: 0, y: 18, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 18, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 340, damping: 26 }}
                        className='fixed bottom-4 right-4 z-[90] flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white py-1.5 pl-1.5 pr-1.5 shadow-[0_18px_44px_-12px_rgba(2,6,23,0.4)] sm:bottom-6 sm:right-6 dark:border-white/10 dark:bg-[#0D1526]'
                    >
                        <MascotAvatar size={40} className='ring-white/25' />
                        <div className='pr-1 leading-none'>
                            <p className='text-[12.5px] font-extrabold text-slate-900 dark:text-white'>CORA Copilot</p>
                            <p className='mt-1 flex items-center gap-1 text-[9.5px] font-semibold text-emerald-600 dark:text-emerald-400'>
                                <span className='h-1 w-1 rounded-full bg-emerald-500' />
                                Session active
                            </p>
                        </div>
                        <div className='ml-1 flex items-center gap-0.5'>
                            <button
                                onClick={() => setIsMinimized(false)}
                                title='Expand'
                                className='grid h-8 w-8 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200'
                            >
                                <Maximize2 className='h-4 w-4' />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                title='Close'
                                className='grid h-8 w-8 place-items-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400'
                            >
                                <X className='h-4 w-4' />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default ChatbotWidget;
