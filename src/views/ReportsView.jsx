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
import { useProcurement } from '../context/ProcurementContext';
import { MOCK_STANDARDS } from '../data/mockStandardsData';
import { DigitalPassportQR } from '../components/DigitalPassportQR';
import { AppleStripeBackground } from '../components/AppleStripeBackground';

export function ReportsView() {
  const navigate = useNavigate();
  const { 
    t, 
    orgProfile = {}, 
    recommendedStandards = [],
    selectedStandardIds = [], 
    selectedNormativeTests = {},
    analysisTimestamp,
    certificateId,
    shaHash,
    complianceStats = {},
    auditLogs = []
  } = useProcurement();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selectedStds = React.useMemo(() => {
    const pool = [...recommendedStandards, ...MOCK_STANDARDS];
    const map = new Map();
    pool.forEach(s => {
      if (!map.has(s.id)) map.set(s.id, s);
    });
    return selectedStandardIds
      .map(id => map.get(id))
      .filter(Boolean);
  }, [recommendedStandards, selectedStandardIds]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#090A0F] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 space-y-6 transition-colors duration-500 relative font-sans selection:bg-[#292524] selection:text-white">
      
      <AppleStripeBackground />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        <div className="flex items-center justify-between no-print">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white/70 hover:bg-white/90 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-2xl border border-white dark:border-white/20 text-slate-800 dark:text-slate-200 text-xs font-bold px-4 py-2.5 rounded-full inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.reports.btnBackDashboard}</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-[#0B1E36]/90 hover:bg-[#0B1E36] dark:bg-white/20 dark:hover:bg-white/30 text-white font-extrabold text-xs inline-flex items-center gap-2 px-6 py-2.5 rounded-full backdrop-blur-2xl border border-white/60 dark:border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-2xl transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>{t.reports.btnPrint}</span>
          </button>
        </div>

        <div className="bg-white text-slate-900 rounded-3xl border border-slate-300 dark:border-white/20 p-8 sm:p-12 shadow-2xl print-page space-y-6">
          <div className="text-center pb-6 border-b border-slate-200 space-y-2">
            <div className="flex items-center justify-center gap-2 font-bold text-slate-600 text-[10px] uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              GOVERNMENT OF INDIA • BUREAU OF INDIAN STANDARDS
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
              <p className="font-bold text-[#292524] text-xs mt-0.5">{certificateId || 'CERT-IS-GOV-2026-98442'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.reports.issuedOn}</p>
              <p className="font-semibold text-slate-800 mt-0.5">{(analysisTimestamp || new Date().toISOString()).substring(0, 19).replace('T', ' ')}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.reports.officer}</p>
              <p className="font-bold text-slate-900 mt-0.5">{orgProfile?.applicantName || 'Executive Engineer (Civil/Electrical)'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.reports.issuedTo}</p>
              <p className="font-bold text-slate-900 mt-0.5 truncate">{orgProfile?.businessName || 'National Metro Rail Corporation Ltd'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.reports.gstin}</p>
              <p className="font-bold text-slate-800 mt-0.5">{orgProfile?.gstin || '07AAAAA0000A1Z5'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.reports.overallStatus}</p>
              <span className="inline-block mt-0.5 font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[10px]">
                {complianceStats?.overallScore ?? 88}% COMPLIANT
              </span>
            </div>
          </div>

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
                      <td className="p-3 font-bold text-[#292524] whitespace-nowrap">
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

          <div className="space-y-3">
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              {t.reports.normativeSectionTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {selectedStds.map((std) => {
                const tests = selectedNormativeTests[std.id] || [];
                return (
                  <div key={std.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="font-bold text-slate-900 mb-1.5 text-[11px]">{std.code}</p>
                    <ul className="space-y-1.5 text-slate-700 text-[11px]">
                      {tests.map((tCode, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5] shrink-0" />
                          <span className="font-medium">{tCode}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <DigitalPassportQR isDarkTheme={false} />
          </div>

          <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Lock className="w-4 h-4" />
              <span>{t.reports.shaTitle}</span>
            </div>
            <p className="text-[10px] text-slate-400">{t.reports.shaDesc}</p>
            <p className="text-[10px] font-bold text-emerald-300 bg-slate-800 p-2.5 rounded-xl border border-slate-700 break-all select-all">
              {shaHash}
            </p>
          </div>

          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-900">{orgProfile?.applicantName || 'Executive Engineer (Civil/Electrical)'}</p>
              <p className="text-slate-500 text-[11px]">Authorized Procurement Official</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{orgProfile?.businessName || 'National Metro Rail Corporation Ltd'}</p>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                DIGITALLY SEALED & VERIFIED
              </div>
              <p className="text-[10px] text-slate-400 font-bold">NIC-BIS-AI-PIPELINE-v4.2</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 dark:bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-xl no-print space-y-5 border border-white dark:border-white/20">
          <div className="flex items-center gap-3 pb-4 border-b border-white/60 dark:border-white/10">
            <div className="w-9 h-9 rounded-xl bg-white/80 dark:bg-white/10 backdrop-blur-md border border-white dark:border-white/20 flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold shadow-xs">
              <Award className="w-4 h-4 text-slate-800 dark:text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                {t.reports.historyTitle}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Official immutable record of simulated procurement compliance certificates
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-md border border-white/90 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 transition-all flex items-center justify-between gap-4 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">{log.id}</span>
                    <span className="text-slate-700 dark:text-slate-300 text-xs font-semibold">{log.tenderRef}</span>
                    <span className="text-[10px] bg-white/80 dark:bg-white/10 border border-white/60 dark:border-white/20 px-2.5 py-0.5 rounded-full font-bold text-slate-700 dark:text-slate-300">
                      {log.division}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {log.date} • {log.officer}
                  </p>
                </div>

                <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-3 py-1 rounded-full text-xs">
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
