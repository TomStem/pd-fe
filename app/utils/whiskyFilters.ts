import { byFixedOrder, facetValue, texts, type FacetValue, type FilterGroup } from './facetFilters';

const AGE_BUCKETS: FacetValue[] = [
  { value: 'nas', label: 'NAS' },
  { value: 'under-10', label: 'Under 10' },
  { value: '10-14', label: '10–14' },
  { value: '15-20', label: '15–20' },
  { value: '21-plus', label: '21+' },
];

const RATING_BUCKETS: FacetValue[] = [
  { value: '4-plus', label: '4+ stars' },
  { value: '3-plus', label: '3+ stars' },
  { value: 'unrated', label: 'Unrated' },
];

const bucket = (values: FacetValue[], value: string) => values.find(b => b.value === value)!;

/** Age statement bucket: NAS bottles first, then by years; a bottle without an age statement that is not marked NAS has none. */
export function ageBucket({ isNas, age }: Pick<WhiskyView, 'isNas' | 'age'>): FacetValue | undefined {
  if (isNas) return bucket(AGE_BUCKETS, 'nas');
  if (age === undefined) return undefined;
  if (age < 10) return bucket(AGE_BUCKETS, 'under-10');
  if (age < 15) return bucket(AGE_BUCKETS, '10-14');
  return bucket(AGE_BUCKETS, age <= 20 ? '15-20' : '21-plus');
}

/** The rating buckets are cumulative: a 4.5 average is both "4+ stars" and "3+ stars". */
export function ratingBuckets({ averageRating }: Pick<WhiskyView, 'averageRating'>): FacetValue[] {
  if (averageRating === undefined) return [bucket(RATING_BUCKETS, 'unrated')];
  return RATING_BUCKETS.filter(({ value }) => (value === '4-plus' && averageRating >= 4) || (value === '3-plus' && averageRating >= 3));
}

export const whiskySearchText = (w: WhiskyView) => texts(w.name, w.distillery.name, w.region?.name, w.country?.name, ...w.casks);

const optional = <T>(value: T | undefined): T[] => (value === undefined ? [] : [value]);

export const whiskyFilterGroups: FilterGroup<WhiskyView>[] = [
  { key: 'distillery', label: 'Distillery', values: w => [{ value: w.distillery.slug, label: w.distillery.name }] },
  { key: 'country', label: 'Country', values: w => optional(w.country).map(c => ({ value: c.slug, label: c.name })) },
  { key: 'region', label: 'Region', values: w => optional(w.region).map(r => ({ value: r.slug, label: r.name })) },
  { key: 'age', label: 'Age', values: w => optional(ageBucket(w)), compare: byFixedOrder(AGE_BUCKETS.map(b => b.value)) },
  { key: 'cask', label: 'Cask', values: w => w.casks.filter(c => facetValue(c)).map(c => ({ value: facetValue(c), label: c })) },
  { key: 'rating', label: 'Rating', values: w => ratingBuckets(w), compare: byFixedOrder(RATING_BUCKETS.map(b => b.value)) },
];

export const whiskySorts = [
  { value: 'name', label: 'Name A–Z' },
  { value: 'age', label: 'Age (high to low)' },
  { value: 'abv', label: 'ABV (high to low)' },
  { value: 'rating', label: 'Rating (high to low)' },
] as const;

export type WhiskySort = (typeof whiskySorts)[number]['value'];

const collator = new Intl.Collator('en', { sensitivity: 'base' });

/** Highest first; whiskies without the value go last. */
const descending = (a: number | undefined, b: number | undefined) => (b ?? -Infinity) - (a ?? -Infinity);

export function sortWhiskies(whiskies: WhiskyView[], sort: WhiskySort): WhiskyView[] {
  const byName = (a: WhiskyView, b: WhiskyView) => collator.compare(a.name, b.name);
  const compare: Record<WhiskySort, (a: WhiskyView, b: WhiskyView) => number> = {
    name: byName,
    age: (a, b) => descending(a.age, b.age) || byName(a, b),
    abv: (a, b) => descending(a.abv, b.abv) || byName(a, b),
    rating: (a, b) => descending(a.averageRating, b.averageRating) || byName(a, b),
  };
  return [...whiskies].sort(compare[sort]);
}
