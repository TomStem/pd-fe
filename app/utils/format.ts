const timeZone = 'Europe/Amsterdam';
const format = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { timeZone, ...options });

const dayMonth = format({ day: 'numeric', month: 'short' });
const longDate = format({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const monthYear = format({ month: 'long', year: 'numeric' });
const yearOnly = format({ year: 'numeric' });
const time = format({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

export const formatDayMonth = (iso: string) => dayMonth.format(new Date(iso));
export const formatLongDate = (iso: string) => longDate.format(new Date(iso));
export const formatMonthYear = (iso: string) => monthYear.format(new Date(iso));
export const formatYear = (iso: string) => yearOnly.format(new Date(iso));
export const formatTime = (iso: string) => time.format(new Date(iso));
export const formatAbv = (abv: number) => `${abv}%`;
export const formatRating = (rating: number) => String(rating);

/** "12–15 June 2027", or "30 Sep – 3 Oct 2027" across months. */
export function formatDateRange(start: string, end: string): string {
  const from = new Date(start);
  const to = new Date(end);
  const year = format({ year: 'numeric' }).format(to);
  const sameMonth = monthYear.format(from) === monthYear.format(to);
  if (sameMonth) return `${format({ day: 'numeric' }).format(from)}–${format({ day: 'numeric', month: 'long' }).format(to)} ${year}`;
  return `${dayMonth.format(from)} – ${dayMonth.format(to)} ${year}`;
}

export function tripLength(start: string, end: string): number {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000) + 1;
}
