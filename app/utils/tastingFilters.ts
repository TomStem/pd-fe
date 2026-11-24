import { byValueDescending, texts, type FilterGroup } from './facetFilters';
import { formatYear } from './format';

/** Countries a tasting belongs to: linked directly or through any linked region. */
function tastingCountries({ countries, regions }: Pick<TastingView, 'countries' | 'regions'>) {
  return [...new Map([...countries, ...regions.map(r => r.country)].map(c => [c.slug, c])).values()];
}

/** The place names of a tasting: its regions, their countries and the countries linked directly. */
export const tastingSearchText = (t: TastingView) =>
  texts(t.title, t.location, t.summary, ...t.regions.flatMap(r => [r.name, r.country.name]), ...t.countries.map(c => c.name));

export const tastingFilterGroups: FilterGroup<TastingView>[] = [
  { key: 'year', label: 'Year', values: t => [{ value: formatYear(t.date), label: formatYear(t.date) }], compare: byValueDescending },
  { key: 'country', label: 'Country', values: t => tastingCountries(t).map(c => ({ value: c.slug, label: c.name })) },
];

export const tastingSorts = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title', label: 'Title A–Z' },
] as const;

export type TastingSort = (typeof tastingSorts)[number]['value'];

const titleCollator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });

/** By date, or by title with numbers in their natural order ("#2" before "#11"); the input stays as it is. */
export function sortTastings(tastings: TastingView[], sort: TastingSort): TastingView[] {
  const byDate = (a: TastingView, b: TastingView) => Date.parse(a.date) - Date.parse(b.date);
  const compare: Record<TastingSort, (a: TastingView, b: TastingView) => number> = {
    newest: (a, b) => byDate(b, a),
    oldest: byDate,
    title: (a, b) => titleCollator.compare(a.title, b.title),
  };
  return [...tastings].sort(compare[sort]);
}
