type Labelled = Pick<WhiskyView, 'brand' | 'distilleries'>;

/** The line above a whisky's name: its brand, else the distillery, else how many distilleries went into the blend. */
export function whiskyLabel({ brand, distilleries }: Labelled): string {
  if (brand) return brand;
  return distilleries.length === 1 ? distilleries[0]!.name : `${distilleries.length} distilleries`;
}

/** Heading for the other bottles shown with a whisky: its brand when they share it, else the distillery or distilleries. */
export function moreFromTitle(whisky: Labelled, siblings: Pick<WhiskyView, 'brand'>[]): string {
  const sharesBrand = whisky.brand && siblings.every(s => s.brand?.toLowerCase() === whisky.brand!.toLowerCase());
  if (sharesBrand) return `More from ${whisky.brand}`;
  return whisky.distilleries.length === 1 ? `More from ${whisky.distilleries[0]!.name}` : 'More from these distilleries';
}

/** Cask names are free text; sentence case ("American oak"), keeping all-caps words such as "PX" or "VS". */
export function caskLabel(cask: string): string {
  const text = cask.trim().split(/\s+/).map(word => (word.length > 1 && word === word.toUpperCase() && word !== word.toLowerCase() ? word : word.toLowerCase())).join(' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
}
