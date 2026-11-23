/** An event counts as upcoming until its start moment has passed. */
export function isUpcoming(start: string, now: Date = new Date()): boolean {
  return new Date(start).getTime() >= now.getTime();
}
