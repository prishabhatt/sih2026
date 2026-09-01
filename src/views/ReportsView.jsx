import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  Award, 
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProcurement } from '../context/ProcurementContext';
import { MOCK_STANDARDS } from '../data/mockStandardsData';

export function ReportsView() {
  const navigate = useNavigate();
  const { 
    t, 
    orgProfile, 
    selectedStandardIds, 
    selectedNormativeTests,
    analysisTimestamp,
    certificateId,
    shaHash,
    complianceStats,
    auditLogs
  } = useProcurement();

  const selectedStds = MOCK_STANDARDS.filter((s) => selectedStandardIds.includes(s.id));

  const handlePrint = () => {
    confetti({ particleCount: 30, spread: 40, origin: { y: 0.9 } });
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between no-print">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.reports.btnBackDashboard}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.reports.btnPrint}</span>
          </button>
        </div>

        {/* Certificate Card (White paper styling for printing) */}
        <div className="bg-white text-slate-900 rounded-2xl border border-slate-300 p-8 sm:p-10 shadow-lg print-page space-y-6">
          <div className="text-center pb-5 border-b border-slate-300 space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 font-bold text-slate-700 text-[10px] uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              GOVERNMENT OF INDIA • SMART INDIA HACKATHON 2026
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight uppercase">
              {t.reports.certificateTitle}
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              {t.reports.certificateSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{t.reports.certificateId}</p>
              <p className="font-mono font-bold text-blue-700 text-xs mt-0.5">{certificateId}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{t.reports.issuedOn}</p>
              <p className="font-medium text-slate-900 mt-0.5">{analysisTimestamp.substring(0, 19).replace('T', ' ')}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{t.reports.officer}</p>
              <p className="font-semibold text-slate-900 mt-0.5">{orgProfile.applicantName}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{t.reports.issuedTo}</p>
              <p className="font-semibold text-slate-900 mt-0.5 truncate">{orgProfile.businessName}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{t.reports.gstin}</p>
              <p className="font-mono font-medium text-slate-800 mt-0.5">{orgProfile.gstin}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{t.reports.overallStatus}</p>
              <span className="inline-block mt-0.5 font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                {t.reports.statusCompliant} ({complianceStats.overallScore}%)
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              {t.reports.standardsSectionTitle}
            </h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left divide-y divide-slate-200">
                <thead className="bg-slate-100 font-semibold text-slate-700 text-[11px]">
                  <tr>
                    <th className="p-2.5">Standard Code</th>
                    <th className="p-2.5">Title & Scope</th>
                    <th className="p-2.5">Certification Scheme</th>
                    <th className="p-2.5">Statutory QCO Mandate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-xs">
                  {selectedStds.map((std) => (
                    <tr key={std.id}>
                      <td className="p-2.5 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {std.code}
                      </td>
                      <td className="p-2.5 text-slate-800">
                        <strong>{std.title}</strong>
                        <p className="text-[10px] text-slate-500 mt-0.5">{std.latestAmendment}</p>
                      </td>
                      <td className="p-2.5 text-slate-700 whitespace-nowrap text-[11px]">
                        {std.certificationScheme}
                      </td>
                      <td className="p-2.5 text-emerald-800 font-medium text-[11px]">
                        {std.qcoMandatory ? std.qcoGazetteOrder : 'Voluntary BIS Code'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              {t.reports.normativeSectionTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {selectedStds.map((std) => {
                const tests = selectedNormativeTests[std.id] || [];
                return (
                  <div key={std.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-mono font-bold text-slate-900 mb-1 text-[11px]">{std.code}</p>
                    <ul className="space-y-1 text-slate-700 text-[11px]">
                      {tests.map((tCode, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{tCode}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 text-slate-200 p-4 rounded-xl space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>{t.reports.shaTitle}</span>
            </div>
            <p className="text-[10px] text-slate-400">{t.reports.shaDesc}</p>
            <p className="font-mono text-[10px] text-emerald-300 bg-slate-800 p-2 rounded border border-slate-700 break-all select-all">
              {shaHash}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-slate-900">{orgProfile.applicantName}</p>
              <p className="text-slate-500 text-[11px]">Authorized Procurement Official</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{orgProfile.businessName}</p>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                DIGITALLY SEALED & VERIFIED
              </div>
              <p className="text-[10px] text-slate-500 font-mono">NIC-BIS-AI-PIPELINE-v4.2</p>
            </div>
          </div>
        </div>

        {/* Historical Logs */}
        <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 shadow-sm no-print space-y-3">
          <div className="flex items-center gap-1.5 pb-2.5 border-b border-slate-800">
            <Award className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-200">
              {t.reports.historyTitle}
            </h3>
          </div>

          <div className="divide-y divide-slate-800/80 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-300 text-xs">{log.id}</span>
                    <span className="text-slate-200 text-xs">{log.tenderRef}</span>
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                      {log.division}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {log.date} • {log.officer}
                  </p>
                </div>

                <span className="font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-xs font-semibold">
                  {log.score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
