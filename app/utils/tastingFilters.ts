import { byValueDescending, type FilterGroup } from './facetFilters';
import { formatYear } from './format';

/** Countries a tasting belongs to: linked directly or through any linked region. */
function tastingCountries({ countries, regions }: Pick<TastingView, 'countries' | 'regions'>) {
  return [...new Map([...countries, ...regions.map(r => r.country)].map(c => [c.slug, c])).values()];
}

export const tastingFilterGroups: FilterGroup<TastingView>[] = [
  { key: 'year', label: 'Year', values: t => [{ value: formatYear(t.date), label: formatYear(t.date) }], compare: byValueDescending },
  { key: 'country', label: 'Country', values: t => tastingCountries(t).map(c => ({ value: c.slug, label: c.name })) },
];
