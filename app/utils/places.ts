export interface PlaceChip {
  key: string;
  label: string;
  to: string;
  kind: 'region' | 'country';
}

/** Linked regions first, then explicitly linked countries; a region's country is not added by itself. */
export function tastingPlaces({ regions, countries }: Pick<TastingView, 'regions' | 'countries'>): PlaceChip[] {
  return [
    ...regions.map(r => ({ key: `region-${r.slug}`, label: r.name, to: `/countries/${r.country.slug}/${r.slug}`, kind: 'region' as const })),
    ...countries.map(c => ({ key: `country-${c.slug}`, label: c.name, to: `/countries/${c.slug}`, kind: 'country' as const })),
  ];
}

/** "Islay · Speyside · Japan +2", undefined without places. */
export function placeTag(places: PlaceChip[], max = 3): string | undefined {
  if (!places.length) return undefined;
  const rest = places.length - max;
  return `${places.slice(0, max).map(p => p.label).join(' · ')}${rest > 0 ? ` +${rest}` : ''}`;
}
