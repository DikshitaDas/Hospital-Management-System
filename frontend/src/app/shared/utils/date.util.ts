/** Today as yyyy-MM-dd in local timezone */
export function todayIsoDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function isPastDate(isoDate: string): boolean {
  if (!isoDate) return true;
  return isoDate < todayIsoDate();
}

/** Backend LocalDate — use date portion only */
export function toApiDate(value: string): string {
  return value?.includes('T') ? value.split('T')[0]! : value;
}

/** Normalize API date for date input */
export function toInputDate(value: string | null | undefined): string {
  if (!value) return '';
  return value.includes('T') ? value.split('T')[0]! : value.slice(0, 10);
}
