import { jsPDF } from 'jspdf';

export function downloadModelNITClausePDF(clauseText, certificateId = 'CERT-IS-GOV-2026-98442') {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  doc.setFillColor(11, 30, 54);
  doc.rect(0, 0, pageWidth, 55, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('GOVERNMENT OF INDIA — PUBLIC PROCUREMENT GATEWAY', margin, 26);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(218, 165, 32);
  doc.text('MODEL NOTICE INVITING TENDER (NIT) TECHNICAL SPECIFICATIONS', margin, 42);

  y = 75;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 38, 4, 4, 'FD');

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Reference ID: ' + certificateId, margin + 12, y + 16);
  doc.text('Generated: ' + new Date().toLocaleString(), margin + 12, y + 28);
  doc.text('Statutory Basis: BIS Act 2016 & GFR 2017 Rule 144(xi)', pageWidth - margin - 12, y + 22, { align: 'right' });

  y += 55;

  doc.setTextColor(15, 23, 42);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8.5);

  const lines = doc.splitTextToSize(clauseText || '', contentWidth);
  const lineHeight = 12.5;

  lines.forEach((line) => {
    if (y + lineHeight > pageHeight - 45) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Page ' + doc.internal.getNumberOfPages() + ' • ISync Indian Standards Engine', pageWidth / 2, pageHeight - 20, { align: 'center' });

      doc.addPage();
      y = margin;
      doc.setFont('courier', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
    }

    if (line.startsWith('===') || line.startsWith('---')) {
      doc.setTextColor(148, 163, 184);
    } else if (line.match(/^[0-9]\.[0-9]/) || line.startsWith('GOVERNMENT') || line.startsWith('MODEL NOTICE') || line.startsWith('TENDER SPECIFICATION')) {
      doc.setFont('courier', 'bold');
      doc.setTextColor(11, 30, 54);
    } else {
      doc.setFont('courier', 'normal');
      doc.setTextColor(30, 41, 59);
    }

    doc.text(line, margin, y);
    y += lineHeight;
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Page ' + doc.internal.getNumberOfPages() + ' • ISync Indian Standards Engine • Verified Compliance Dossier', pageWidth / 2, pageHeight - 20, { align: 'center' });

  doc.save('Model_NIT_Clause_' + certificateId + '.pdf');
}

export function downloadTenderSchedulePDF({
  project = 'National Metro Rail Corporation Ltd',
  standards = [],
  testsEnrolled = {},
  certificateId = 'CERT-IS-GOV-2026-98442',
  status = 'VERIFIED_QCO_COMPLIANT'
}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  doc.setFillColor(11, 30, 54);
  doc.rect(0, 0, pageWidth, 60, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('ISync — BIS TENDER COMPLIANCE DOSSIER', margin, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(218, 165, 32);
  doc.text('OFFICIAL STATUTORY STANDARDS & NORMATIVE TEST SCHEDULE', margin, 46);

  y = 80;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 55, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Procuring Entity: ' + project, margin + 12, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Dossier Certificate: ' + certificateId, margin + 12, y + 33);
  doc.text('Generated On: ' + new Date().toLocaleString(), margin + 12, y + 46);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text('Status: ' + status, pageWidth - margin - 12, y + 18, { align: 'right' });

  y += 75;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(11, 30, 54);
  doc.text('1. APPLICABLE BUREAU OF INDIAN STANDARDS (IS CODES)', margin, y);
  y += 14;

  if (!standards || standards.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('No specific standards enrolled in current selection.', margin, y);
    y += 20;
  } else {
    standards.forEach((std, idx) => {
      if (y > pageHeight - 60) {
        doc.addPage();
        y = margin;
      }

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 36, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text((idx + 1) + '. ' + (std.code || std.id) + ' — ' + (std.title || std.name), margin + 8, y + 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      const qcoStatus = std.qcoMandatory ? 'MANDATORY QCO ORDER (Section 16 BIS Act)' : 'Voluntary Compliance Standard';
      const localContent = std.localContentRequired ? (' • Min Local Content: ' + std.localContentRequired + '%') : '';
      doc.text(qcoStatus + localContent, margin + 8, y + 27);

      y += 42;
    });
  }

  y += 12;

  if (y > pageHeight - 80) {
    doc.addPage();
    y = margin;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(11, 30, 54);
  doc.text('2. ENROLLED NORMATIVE LABORATORY TEST PROTOCOLS', margin, y);
  y += 16;

  const testEntries = Object.entries(testsEnrolled || {});
  const activeTests = testEntries.filter(([, v]) => !!v);

  if (activeTests.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('Standard prescribed factory & field tests apply as per respective IS specifications.', margin, y);
    y += 20;
  } else {
    activeTests.forEach(([testName]) => {
      if (y > pageHeight - 40) {
        doc.addPage();
        y = margin;
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text('• ' + testName, margin + 8, y);
      y += 14;
    });
  }

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Page ' + i + ' of ' + totalPages + ' • ISync Statutory Procurement Gateway • ISO 9001 / BIS Act 2016 Compliant', pageWidth / 2, pageHeight - 20, { align: 'center' });
  }

  doc.save('Tender_Schedule_' + certificateId + '.pdf');
}
