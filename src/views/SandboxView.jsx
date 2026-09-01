import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Terminal,
  CheckCircle2,
  GitFork,
  FileText,
  Cpu,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';

import { useTheme } from '../context/ThemeContext';
import { useProcurement } from '../context/ProcurementContext';
import { BIS_DIVISIONS } from '../data/divisionsData';

export function SandboxView() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { loadScenario } = useProcurement();

  const [activePreset, setActivePreset] = useState(0);

  const demoPresets = [
    {
      id: 'cable',
      division: 'ETD',
      title: '11kV HT XLPE Metro Power Cables',
      specText: 'Supply of 11kV grade, 3-core 300 sq.mm aluminium conductor, XLPE insulated, galvanized steel strip armoured, FRLS outer sheath power cable for underground metro track substation power distribution.',
      resolvedCode: 'IS 7098 (Part 2) : 2011',
      resolvedTitle: 'XLPE Insulated Thermoplastic Sheathed Cables for Working Voltages from 3.3 kV up to 33 kV',
      qcoMandate: 'Cables & Wires (Quality Control) Order, 2023 [Mandatory ISI Mark]',
      normativeTests: ['IS 8130 : 2013 (Conductor DC Resistance)', 'IS 10810 Part 58 (Oxygen Index >= 29%)', 'IS 3975 : 1999 (Steel Armour Coverage >= 90%)'],
      scenarioId: 'underground_cable_metro',
      confidence: 99.4,
      miiLocalContent: '60% Class-I Local'
    },
    {
      id: 'rebar',
      division: 'CED',
      title: 'Fe 500D TMT Steel Rebars & OPC 53 Cement',
      specText: 'High strength thermo-mechanically treated (TMT) Fe 500D grade deformed steel reinforcement bars (8mm to 32mm dia) along with 53 Grade Ordinary Portland Cement (OPC) for pre-stressed concrete bridge deck superstructures.',
      resolvedCode: 'IS 1786 : 2008 & IS 269 : 2015',
      resolvedTitle: 'High Strength Deformed Steel Bars (Fe 500D) / Ordinary Portland Cement 53 Grade',
      qcoMandate: 'Steel & Cement (Quality Control) Orders, 2024 [Mandatory BIS License]',
      normativeTests: ['IS 1608 Part 1 (Yield Stress >= 500 N/mm²)', 'IS 1599 (180° Cold Bend Test)', 'IS 4031 Part 6 (28-day Mortar Strength >= 53 MPa)'],
      scenarioId: 'tmt_rebars_cement_nhai',
      confidence: 98.8,
      miiLocalContent: '65% Class-I Local'
    },
    {
      id: 'solar',
      division: 'LITD',
      title: 'Solar PV Water Pumping System (PM-KUSUM)',
      specText: 'Solar photovoltaic water pumping systems comprising 5 HP submersible DC solar pump with MPPT motor controller and high efficiency monocrystalline solar PV modules for agricultural irrigation under PM-KUSUM Scheme.',
      resolvedCode: 'IS 17017 & IS 14286',
      resolvedTitle: 'Solar Photovoltaic Water Pumping Systems - Design & Performance Requirements',
      qcoMandate: 'Solar Photovoltaics, Systems & Devices (Compulsory Registration Order) [CRS Scheme-II]',
      normativeTests: ['IS/IEC 61215 (Design Qualification & Type Approval)', 'IS 10322 (Luminaires / Inverter Safety)', 'MNRE Efficiency Benchmarks'],
      scenarioId: 'solar_pumps_kusum',
      confidence: 97.9,
      miiLocalContent: '75% Class-I Local'
    },
    {
      id: 'pipe',
      division: 'MTD',
      title: 'Heavy Class MS ERW Steel Pipes for Water Supply',
      specText: 'Electric resistance welded (ERW) mild steel pipes, Heavy Class (Black & Galvanized) 100mm to 300mm NB with beveled ends and minimum 400 g/m² zinc coating for municipal water transmission pipeline network.',
      resolvedCode: 'IS 1239 (Part 1) : 2004',
      resolvedTitle: 'Steel Tubes, Tubulars and Other Wrought Steel Fittings - Part 1: Steel Tubes',
      qcoMandate: 'Pipes and Tubes (Quality Control) Order, 2023 [Mandatory ISI Mark]',
      normativeTests: ['IS 4736 : 1986 (Zinc Mass Coating >= 400 g/m²)', 'IS 2328 : 2018 (Tube Flattening Test to 75%)', 'IS 5822 : 1994 (Hydro-test at 1.5x Design Pressure)'],
      scenarioId: 'erw_pipes_municipal',
      confidence: 96.5,
      miiLocalContent: '60% Class-I Local'
    }
  ];

  const handleLaunchScenario = (scenarioId) => {
    loadScenario(scenarioId);
    navigate('/input');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030712] text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-cyan-950/50 border border-blue-200 dark:border-cyan-800 text-blue-700 dark:text-cyan-300 text-xs font-bold mb-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interactive RAG Sandbox • 768-D Vector Index</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Public Procurement Standards Terminal
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Select or test natural-language tender scopes against 22,410+ Bureau of Indian Standards in real time.
            </p>
          </div>

          <button
            onClick={() => navigate('/input')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md"
          >
            <span>Open Custom Input Form</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* The Sandbox Widget Container */}
        <div className="rounded-3xl border border-slate-200/90 dark:border-white/[0.12] bg-white/95 dark:bg-[#0A0F1D]/90 backdrop-blur-2xl shadow-2xl shadow-cyan-500/5 overflow-hidden">
          {/* Terminal Top Bar */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-white/[0.08] bg-slate-100/80 dark:bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                LIVE NEURAL SANDBOX • 768-D VECTOR RETRIEVAL NODE
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                <CheckCircle2 className="w-3 h-3" />
                <span>NIC-BIS NODE 04 ACTIVE</span>
              </span>
            </div>
          </div>

          {/* Preset Selector Buttons */}
          <div className="p-6 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.01]">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Select Public Procurement Scenario to Test AI Vector Resolution:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {demoPresets.map((preset, idx) => {
                const isActive = activePreset === idx;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setActivePreset(idx)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      isActive
                        ? 'bg-blue-50/90 dark:bg-cyan-500/15 border-blue-500 dark:border-cyan-400 shadow-sm'
                        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-extrabold font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white">
                        {preset.division}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {preset.confidence}% Match
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {preset.title}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-white/[0.08]">
            {/* Left: Input BOQ Text */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-cyan-500" />
                    Draft Tender Specification / BOQ Scope
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Natural Language Input</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-black/50 border border-slate-200/80 dark:border-white/10 text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed min-h-[140px]">
                  "{demoPresets[activePreset].specText}"
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleLaunchScenario(demoPresets[activePreset].scenarioId)}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-600 hover:bg-slate-800 dark:hover:opacity-90 text-white font-bold text-xs shadow-md transition-all"
                >
                  <span>Load Preset into Active Engine</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Resolved Bureau of Indian Standards Matrix */}
            <div className="lg:col-span-6 p-6 sm:p-8 bg-slate-50/40 dark:bg-white/[0.01] flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Resolved BIS Standard & QCO Mandate
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold font-mono bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    100% GFR 2017 VERIFIED
                  </span>
                </div>

                {/* Main Standard Code */}
                <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-black font-mono text-blue-600 dark:text-cyan-400">
                      {demoPresets[activePreset].resolvedCode}
                    </p>
                    <span className="text-[10px] font-bold text-slate-500 font-mono">
                      {demoPresets[activePreset].miiLocalContent}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                    {demoPresets[activePreset].resolvedTitle}
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                    ⚖️ {demoPresets[activePreset].qcoMandate}
                  </p>
                </div>

                {/* Auto-Linked Normative Tests */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Auto-Linked Normative Reference Test Codes:
                  </p>
                  <div className="space-y-1.5">
                    {demoPresets[activePreset].normativeTests.map((tCode, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/60 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 text-[11px] font-mono text-slate-700 dark:text-slate-300"
                      >
                        <GitFork className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                        <span className="truncate">{tCode}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SandboxView;
