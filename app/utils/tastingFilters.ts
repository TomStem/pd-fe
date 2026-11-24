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
