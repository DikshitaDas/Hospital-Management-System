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

export function showSnackbar(
  open: { set: (v: boolean) => void },
  message: { set: (v: string) => void },
  text: string
): void {
  message.set(text);
  open.set(true);
  window.setTimeout(() => open.set(false), 3200);
}
