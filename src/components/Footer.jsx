import React from 'react';
import { ShieldCheck, Lock, CheckCircle, Database } from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';

export function Footer() {
  const { certificateId, shaHash } = useProcurement();

  return (
    <footer className="bg-slate-100 dark:bg-[#0B1120] text-slate-600 dark:text-slate-400 text-xs py-8 border-t border-slate-200 dark:border-slate-800/80 no-print mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-200 dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-semibold text-sm mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>BISEngine</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
              AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Public Procurement Specifications.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-slate-200 font-semibold mb-2">Statutory Frameworks</h4>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
              <li>• BIS Act 2016 (Section 16 QCO Enforcement)</li>
              <li>• General Financial Rules (GFR) 2017 Rule 144(xi)</li>
              <li>• Public Procurement Order 2017 (Make in India)</li>
              <li>• GeM Technical Specifications Guidelines v4.2</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-slate-200 font-semibold mb-2">System Telemetry</h4>
            <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
              <p className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Vector Index: <strong>22,410 Standards Synced</strong></span>
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Gazette QCO Registry: <strong>Active & Verified</strong></span>
              </p>
              <p className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Non-Repudiation SHA-256 Enabled</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-slate-200 font-semibold mb-2">Active Session Certificate</h4>
            <p className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-300 dark:border-slate-800">
              {certificateId}
            </p>
            <p className="text-[10px] text-slate-500 font-mono mt-1 truncate">
              SHA: {shaHash.substring(0, 24)}...
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
          <p>© BISEngine. Ministry of Consumer Affairs, Food & Public Distribution.</p>
          <p className="mt-2 sm:mt-0 font-mono">Simulated NIC e-Gov Cloud Gateway</p>
        </div>
      </div>
    </footer>
  );
}
