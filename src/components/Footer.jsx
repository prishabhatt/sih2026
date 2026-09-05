import React from 'react';
import { ShieldCheck, Lock, CheckCircle, Database } from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';

export function Footer() {
  const { certificateId, shaHash } = useProcurement();

  return (
    <footer className="relative z-10 border-t border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#090A0F]/80 backdrop-blur-xl text-slate-600 dark:text-slate-400 text-xs py-10 no-print mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200/80 dark:border-white/[0.08]">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1C1917] to-[#292524] flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                I<span className="text-[#292524] dark:text-[#A8A29E] font-serif italic">Sync</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
              AI-Powered Recommendation Gateway for Identifying Applicable Indian Standards for Public Procurement Specifications.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-slate-200 font-bold uppercase tracking-wider text-[11px] mb-3">Statutory Frameworks</h4>
            <ul className="space-y-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium">
              <li>• BIS Act 2016 (Section 16 QCO Enforcement)</li>
              <li>• General Financial Rules (GFR) 2017 Rule 144(xi)</li>
              <li>• Public Procurement Order 2017 (Make in India)</li>
              <li>• GeM Technical Specifications Guidelines v4.2</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-slate-200 font-bold uppercase tracking-wider text-[11px] mb-3">System Telemetry</h4>
            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <p className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-[#292524] dark:text-[#A8A29E] shrink-0" />
                <span>Vector Index: <strong className="font-bold text-slate-800 dark:text-slate-200">22,410 Standards</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-[#059669] shrink-0" />
                <span>Gazette QCO Registry: <strong className="text-emerald-600 dark:text-[#059669] font-bold">Active & Synced</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>SHA-256 Non-Repudiation Enabled</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-slate-200 font-bold uppercase tracking-wider text-[11px] mb-3">Session Verification</h4>
            <div className="p-3 rounded-2xl glass-card text-xs">
              <p className="font-bold text-emerald-600 dark:text-[#059669] truncate">
                {certificateId}
              </p>
              <p className="text-[10px] text-slate-400 font-semibold mt-1 truncate">
                SHA: {shaHash.substring(0, 24)}...
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-xs">
          <p>© 2026 ISync. Ministry of Consumer Affairs, Food & Public Distribution.</p>
          <p className="font-semibold text-[11px] text-slate-400">Simulated NIC e-Gov Cloud Gateway</p>
        </div>
      </div>
    </footer>
  );
}
