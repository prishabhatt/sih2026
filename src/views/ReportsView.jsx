import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  Award, 
  Lock,
  Download,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProcurement } from '../context/ProcurementContext';
import { MOCK_STANDARDS } from '../data/mockStandardsData';
import { DigitalPassportQR } from '../components/DigitalPassportQR';
import { AppleStripeBackground } from '../components/AppleStripeBackground';

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
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-6 transition-colors duration-500 relative font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Living Aurora Background */}
      <AppleStripeBackground />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* Actions Bar */}
        <div className="flex items-center justify-between no-print">
          <button
            onClick={() => navigate('/dashboard')}
            className="glass-btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.reports.btnBackDashboard}</span>
          </button>

          <button
            onClick={handlePrint}
            className="glass-btn-primary shimmer-sweep inline-flex items-center gap-2 px-5 py-2 rounded-full text-white text-xs font-extrabold transition-all shadow-md cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.reports.btnPrint}</span>
          </button>
        </div>

        {/* Certificate Card (Elevated Paper Structure for Clean Printing) */}
        <div className="bg-white text-slate-900 rounded-3xl border border-slate-300 dark:border-white/20 p-8 sm:p-12 shadow-2xl print-page space-y-6">
          <div className="text-center pb-6 border-b border-slate-200 space-y-2">
            <div className="flex items-center justify-center gap-2 font-bold text-slate-600 text-[10px] uppercase tracking-widest font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              GOVERNMENT OF INDIA • SMART INDIA HACKATHON 2026
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
              {t.reports.certificateTitle}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {t.reports.certificateSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.reports.certificateId}</p>
              <p className="font-mono font-bold text-blue-700 text-xs mt-0.5">{certificateId}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.reports.issuedOn}</p>
              <p className="font-semibold text-slate-800 mt-0.5">{analysisTimestamp.substring(0, 19).replace('T', ' ')}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.reports.officer}</p>
              <p className="font-bold text-slate-900 mt-0.5">{orgProfile.applicantName}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.reports.issuedTo}</p>
              <p className="font-bold text-slate-900 mt-0.5 truncate">{orgProfile.businessName}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.reports.gstin}</p>
              <p className="font-mono font-bold text-slate-800 mt-0.5">{orgProfile.gstin}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.reports.overallStatus}</p>
              <span className="inline-block mt-0.5 font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[10px]">
                {t.reports.statusCompliant} ({complianceStats.overallScore}%)
              </span>
            </div>
          </div>

          {/* Section 1: Standards Registry */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              {t.reports.standardsSectionTitle}
            </h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left divide-y divide-slate-200">
                <thead className="bg-slate-50 font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Standard Code</th>
                    <th className="p-3">Title & Scope</th>
                    <th className="p-3">Certification Scheme</th>
                    <th className="p-3">Statutory QCO Mandate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-xs">
                  {selectedStds.map((std) => (
                    <tr key={std.id}>
                      <td className="p-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {std.code}
                      </td>
                      <td className="p-3 text-slate-800">
                        <strong className="block">{std.title}</strong>
                        <p className="text-[10px] text-slate-500 mt-0.5">{std.latestAmendment}</p>
                      </td>
                      <td className="p-3 text-slate-700 whitespace-nowrap text-[11px] font-medium">
                        {std.certificationScheme}
                      </td>
                      <td className="p-3 text-emerald-800 font-semibold text-[11px]">
                        {std.qcoMandatory ? std.qcoGazetteOrder : 'Voluntary BIS Code'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Normative Test Methods */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              {t.reports.normativeSectionTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {selectedStds.map((std) => {
                const tests = selectedNormativeTests[std.id] || [];
                return (
                  <div key={std.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="font-mono font-bold text-slate-900 mb-1.5 text-[11px]">{std.code}</p>
                    <ul className="space-y-1.5 text-slate-700 text-[11px]">
                      {tests.map((tCode, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-medium">{tCode}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Physical Audit & Inventory QR Pass */}
          <div className="pt-2">
            <DigitalPassportQR isDarkTheme={false} />
          </div>

          {/* Section 4: Cryptographic Non-Repudiation Hash */}
          <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Lock className="w-4 h-4" />
              <span>{t.reports.shaTitle}</span>
            </div>
            <p className="text-[10px] text-slate-400">{t.reports.shaDesc}</p>
            <p className="font-mono text-[10px] text-emerald-300 bg-slate-800 p-2.5 rounded-xl border border-slate-700 break-all select-all">
              {shaHash}
            </p>
          </div>

          {/* Section 5: Authorized Sign-off */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-900">{orgProfile.applicantName}</p>
              <p className="text-slate-500 text-[11px]">Authorized Procurement Official</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{orgProfile.businessName}</p>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                DIGITALLY SEALED & VERIFIED
              </div>
              <p className="text-[10px] text-slate-400 font-mono">NIC-BIS-AI-PIPELINE-v4.2</p>
            </div>
          </div>
        </div>

        {/* Historical Logs */}
        <div className="glass-card rounded-3xl p-6 shadow-xl no-print space-y-4 border border-white/70 dark:border-white/10">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200/80 dark:border-white/10">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              {t.reports.historyTitle}
            </h3>
          </div>

          <div className="divide-y divide-slate-200/80 dark:divide-white/10 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">{log.id}</span>
                    <span className="text-slate-700 dark:text-slate-300 text-xs font-semibold">{log.tenderRef}</span>
                    <span className="text-[10px] font-mono glass-pill-container px-2 py-0.5 rounded-full font-bold">
                      {log.division}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {log.date} • {log.officer}
                  </p>
                </div>

                <span className="font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full text-xs font-bold">
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

export default ReportsView;
