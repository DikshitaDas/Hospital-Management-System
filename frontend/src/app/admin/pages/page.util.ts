export function statusBadgeClass(status: string): string {
  const s = status.toUpperCase();
  if (['APPROVED', 'BOOKED', 'PAID', 'ADMITTED', 'AVAILABLE', 'COMPLETED'].includes(s)) return 'mint';
  if (['PENDING', 'RESCHEDULED'].includes(s)) return 'warm';
  if (['CANCELLED', 'REJECTED', 'DISCHARGED'].includes(s)) return 'rose';
  return 'sky';
}

export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]): void {
  const lines = [headers, ...rows].map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  );
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function isFutureDate(dateStr: string): boolean {
  const d = new Date(dateStr);
  return !Number.isNaN(d.getTime()) && d >= new Date(new Date().toDateString());
}

/** Backend emergency admission matches wardType exactly (GENERAL, ICU, PRIVATE). */
export function normalizeWardType(value: string): string {
  const v = value.trim().toUpperCase();
  if (v.includes('ICU')) return 'ICU';
  if (v.includes('PRIVATE')) return 'PRIVATE';
  return 'GENERAL';
}

export function wardTypeMatches(wardType: string, filter: 'ICU' | 'GENERAL' | 'PRIVATE'): boolean {
  return normalizeWardType(wardType) === filter;
}

export function downloadPrintableHtml(filename: string, title: string, bodyHtml: string): void {
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(`
    <!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
    <style>
      body{font-family:Segoe UI,Arial,sans-serif;padding:32px;color:#102a3a}
      h1{font-size:20px;margin:0 0 8px}
      .meta{color:#6f8190;font-size:12px;margin-bottom:24px}
      table{width:100%;border-collapse:collapse;font-size:13px}
      th,td{border:1px solid #dde5ea;padding:8px;text-align:left}
      th{background:#f4fbfb;text-transform:uppercase;font-size:11px}
      .footer{margin-top:32px;font-size:11px;color:#6f8190}
    </style></head><body>
    <h1>${title}</h1>
    <div class="meta">Generated ${new Date().toLocaleString()}</div>
    ${bodyHtml}
    <div class="footer">MediCare Hub — Hospital Management System</div>
    </body></html>`);
  win.document.close();
  win.focus();
  win.print();
}

export function downloadBillInvoice(bill: {
  id: number;
  patient?: { name?: string; uhid?: string; mobile?: string };
  amount: number;
  billType: string;
  status: string;
  billDate: string;
  paymentMethod?: string;
}): void {
  const html = `
    <table>
      <tr><th>Invoice #</th><td>${bill.id}</td></tr>
      <tr><th>Patient</th><td>${bill.patient?.name ?? '—'}</td></tr>
      <tr><th>UHID</th><td>${bill.patient?.uhid ?? '—'}</td></tr>
      <tr><th>Mobile</th><td>${bill.patient?.mobile ?? '—'}</td></tr>
      <tr><th>Bill type</th><td>${bill.billType}</td></tr>
      <tr><th>Amount</th><td>Rs. ${bill.amount}</td></tr>
      <tr><th>Date</th><td>${bill.billDate}</td></tr>
      <tr><th>Status</th><td>${bill.status}</td></tr>
      ${bill.paymentMethod ? `<tr><th>Payment method</th><td>${bill.paymentMethod}</td></tr>` : ''}
    </table>`;
  downloadPrintableHtml(`invoice-${bill.id}.pdf`, `Invoice #${bill.id}`, html);
}

export function downloadMedicalRecordPdf(patient: {
  name: string;
  uhid: string;
  gender: string;
  age: number;
  mobile: string;
}, prescriptions: { diagnosis: string; medicines: string; dosageInstructions: string; appointment?: { appointmentDate?: string } }[]): void {
  const rows = prescriptions.length
    ? prescriptions
        .map(
          (p, i) => `<tr><td>${i + 1}</td><td>${p.appointment?.appointmentDate ?? '—'}</td>
        <td>${p.diagnosis}</td><td>${p.medicines}</td><td>${p.dosageInstructions}</td></tr>`
        )
        .join('')
    : '<tr><td colspan="5">No prescriptions on file.</td></tr>';
  const html = `
    <table><tr><th>Name</th><td>${patient.name}</td><th>UHID</th><td>${patient.uhid}</td></tr>
    <tr><th>Gender</th><td>${patient.gender}</td><th>Age</th><td>${patient.age}</td></tr>
    <tr><th>Mobile</th><td colspan="3">${patient.mobile}</td></tr></table>
    <h2 style="font-size:14px;margin:24px 0 8px">Prescriptions / Medical records</h2>
    <table><thead><tr><th>#</th><th>Date</th><th>Diagnosis</th><th>Medicines</th><th>Instructions</th></tr></thead>
    <tbody>${rows}</tbody></table>`;
  downloadPrintableHtml(`medical-record-${patient.uhid}.pdf`, `Medical Record — ${patient.name}`, html);
}

export function showSnackbar(
  open: { set: (v: boolean) => void },
  message: { set: (v: string) => void },
  text: string
): void {
  message.set(text);
  open.set(true);
  window.setTimeout(() => open.set(false), 3200);
}
