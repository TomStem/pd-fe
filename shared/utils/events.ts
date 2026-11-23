/** An event counts as upcoming until its start moment has passed. */
export function isUpcoming(start: string, now: Date = new Date()): boolean {
  return new Date(start).getTime() >= now.getTime();
}

/** Upcoming items first (soonest first), then past items (most recent first). */
export function sortByStart<T>(items: T[], getStart: (item: T) => string, now: Date = new Date()): T[] {
  const time = (item: T) => new Date(getStart(item)).getTime();
  const upcoming = items.filter(item => isUpcoming(getStart(item), now)).sort((a, b) => time(a) - time(b));
  const past = items.filter(item => !isUpcoming(getStart(item), now)).sort((a, b) => time(b) - time(a));
  return [...upcoming, ...past];
}
