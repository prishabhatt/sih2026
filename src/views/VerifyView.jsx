import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  Award,
  Lock,
  FileCheck,
  Layers,
  ArrowLeft,
  ExternalLink,
  Scan
} from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export function VerifyView() {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchReport();
  }, [certificateId]);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/reports/${encodeURIComponent(certificateId)}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('CERTIFICATE_NOT_FOUND');
        }
        throw new Error(`Server error: ${res.status}`);
      }
      const data = await res.json();
      setReport(data.payload);
      setTimeout(() => setVerified(true), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-5">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center shadow-2xl animate-pulse">
            <Scan className="w-9 h-9 text-amber-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Verifying Certificate</h2>
            <p className="text-sm text-slate-500 font-medium">Authenticating compliance passport with NIC Trust Gateway...</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider">Decrypting Payload</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-rose-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900">Certificate Not Found</h2>
            <p className="text-sm text-slate-500">
              {error === 'CERTIFICATE_NOT_FOUND'
                ? `No compliance passport found for ID "${certificateId}". The report may not have been published yet, or the certificate ID is invalid.`
                : `Failed to verify: ${error}`
              }
            </p>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-700 font-bold">
            Ensure the audit report has been generated and published before scanning the QR code.
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const p = report || {};
  const score = parseInt(String(p.compliance_score || '0').replace('%', ''), 10);
  const scoreColor = score >= 85 ? 'emerald' : score >= 60 ? 'amber' : 'rose';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 py-8 px-4 sm:px-6 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className={`rounded-2xl p-4 border transition-all duration-700 ${
          verified
            ? 'bg-emerald-50 border-emerald-300 shadow-lg shadow-emerald-100'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700 ${
              verified
                ? 'bg-emerald-600 shadow-lg shadow-emerald-200'
                : 'bg-slate-300'
            }`}>
              {verified
                ? <CheckCircle2 className="w-5 h-5 text-white" />
                : <Loader2 className="w-5 h-5 text-white animate-spin" />
              }
            </div>
            <div>
              <h3 className={`font-black text-sm transition-colors duration-700 ${
                verified ? 'text-emerald-900' : 'text-slate-600'
              }`}>
                {verified ? 'AUTHENTIC COMPLIANCE PASSPORT — VERIFIED' : 'Verifying...'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Digital signature verified with NIC-BIS Trust Gateway • SHA-256 integrity confirmed
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">

          <div className="bg-slate-900 text-white px-6 py-4 sm:px-8 sm:py-5">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              GOVERNMENT OF INDIA • BUREAU OF INDIAN STANDARDS
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight">
              Compliance Audit Verification Report
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Digital Supply Chain Passport — Physical Audit & Inventory Certificate
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <MetaField label="Certificate ID" value={p.tender_id || certificateId} mono />
              <MetaField label="Issuing Organization" value={p.issuing_org || '—'} />
              <MetaField label="Procurement Officer" value={p.officer || '—'} />
              <MetaField label="Issued On" value={formatTimestamp(p.issued_on)} />
              <MetaField label="Certification Scheme" value={p.certification_scheme || '—'} />
              <MetaField label="NIC Gateway" value={p.nic_gateway || '—'} mono />
            </div>

            <div className={`p-5 rounded-2xl border-2 ${
              scoreColor === 'emerald' ? 'bg-emerald-50 border-emerald-300' :
              scoreColor === 'amber' ? 'bg-amber-50 border-amber-300' :
              'bg-rose-50 border-rose-300'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Overall Compliance Score</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-4xl font-black ${
                      scoreColor === 'emerald' ? 'text-emerald-700' :
                      scoreColor === 'amber' ? 'text-amber-700' :
                      'text-rose-700'
                    }`}>
                      {p.compliance_score || '—'}
                    </span>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  scoreColor === 'emerald' ? 'bg-emerald-600' :
                  scoreColor === 'amber' ? 'bg-amber-500' :
                  'bg-rose-500'
                }`}>
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="mt-3 w-full bg-white/60 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    scoreColor === 'emerald' ? 'bg-emerald-500' :
                    scoreColor === 'amber' ? 'bg-amber-500' :
                    'bg-rose-500'
                  }`}
                  style={{ width: verified ? `${score}%` : '0%' }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">QCO Enforcement Status</span>
              </div>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {(p.qco_status || 'MANDATORY_ENFORCED_UNDER_BIS_ACT_2016').replace(/_/g, ' ')}
              </p>
            </div>

            {p.primary_standards && p.primary_standards.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-600" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    Primary Standards Enrolled
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {p.primary_standards.map((std, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-800">{std}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {p.mandatory_tests && p.mandatory_tests.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-slate-600" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    Normative Test Methods
                  </h3>
                </div>
                <div className="space-y-1.5">
                  {p.mandatory_tests.map((test, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span className="text-[11px] font-medium text-slate-700">{test}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {p.compliance_hash && (
              <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Lock className="w-4 h-4" />
                  <span>Cryptographic Non-Repudiation Hash (SHA-256)</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  This immutable hash seals the compliance payload and detects any post-issuance tampering.
                </p>
                <p className="text-[10px] font-bold text-emerald-300 bg-slate-800 p-2.5 rounded-xl border border-slate-700 break-all select-all font-mono">
                  {p.compliance_hash}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">{p.officer || 'Procurement Official'}</p>
                <p className="text-[11px] text-slate-500">Authorized Procurement Official</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{p.issuing_org || '—'}</p>
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
        </div>

        <div className="text-center pb-8">
          <p className="text-[10px] text-slate-400 font-medium">
            This is an official digital compliance verification page. If you suspect tampering, contact the Bureau of Indian Standards.
          </p>
        </div>
      </div>
    </div>
  );
}


function MetaField({ label, value, mono = false }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`font-bold text-slate-900 text-xs mt-0.5 truncate ${mono ? 'font-mono' : ''}`}>
        {value || '—'}
      </p>
    </div>
  );
}

function formatTimestamp(iso) {
  if (!iso) return '—';
  try {
    return iso.substring(0, 19).replace('T', ' ');
  } catch {
    return iso;
  }
}

export default VerifyView;
