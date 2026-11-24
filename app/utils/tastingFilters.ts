import { formatYear } from './format';

export interface TastingFilters {
  years: string[];
  countries: string[];
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface TastingFacets {
  years: FacetOption[];
  countries: FacetOption[];
}

const collator = new Intl.Collator('en', { sensitivity: 'base' });

/** Countries a tasting belongs to: linked directly or through any linked region. */
function tastingCountries({ countries, regions }: Pick<TastingView, 'countries' | 'regions'>) {
  return [...new Map([...countries, ...regions.map(r => r.country)].map(c => [c.slug, c])).values()];
}

const inAny = (selected: string[], values: string[]) => !selected.length || values.some(value => selected.includes(value));
const yearOf = (tasting: TastingView) => formatYear(tasting.date);
const countrySlugsOf = (tasting: TastingView) => tastingCountries(tasting).map(c => c.slug);

/** A tasting matches when its year is in the selected years and one of its countries is in the selected countries; an empty selection does not restrict. */
export const filterTastings = (tastings: TastingView[], { years = [], countries = [] }: Partial<TastingFilters>) =>
  tastings.filter(t => inAny(years, [yearOf(t)]) && inAny(countries, countrySlugsOf(t)));

/** Only facets with at least two options are returned: a single option cannot narrow anything. Each count is taken within the selection of the other filter. */
export function tastingFacets(tastings: TastingView[], filters: Partial<TastingFilters> = {}): TastingFacets {
  const countryNames = new Map<string, string>();
  for (const tasting of tastings) {
    for (const country of tastingCountries(tasting)) countryNames.set(country.slug, country.name);
  }
  const years = [...new Set(tastings.map(yearOf))].sort((a, b) => b.localeCompare(a));
  const inSelectedYears = filterTastings(tastings, { years: filters.years });
  const inSelectedCountries = filterTastings(tastings, { countries: filters.countries });

  const facets: TastingFacets = {
    years: years.map(value => ({ value, label: value, count: inSelectedCountries.filter(t => yearOf(t) === value).length })),
    countries: [...countryNames]
      .map(([value, label]) => ({ value, label, count: inSelectedYears.filter(t => countrySlugsOf(t).includes(value)).length }))
      .sort((a, b) => collator.compare(a.label, b.label)),
  };
  return {
    years: facets.years.length > 1 ? facets.years : [],
    countries: facets.countries.length > 1 ? facets.countries : [],
  };
}

/** Takes the filters from comma-separated query values; items that are not an option are dropped. */
export function parseFilters(query: Record<string, unknown>, facets: TastingFacets): TastingFilters {
  const pick = (value: unknown, options: FacetOption[]) => {
    const items = (Array.isArray(value) ? value : [value]).flatMap(v => (typeof v === 'string' ? v.split(',') : []));
    return [...new Set(items.filter(item => options.some(o => o.value === item)))];
  };
  return { years: pick(query.year, facets.years), countries: pick(query.country, facets.countries) };
}

/** Query string values for a selection, without the empty filters. */
export const filtersToQuery = ({ years, countries }: TastingFilters) => ({
  ...(years.length && { year: years.join(',') }),
  ...(countries.length && { country: countries.join(',') }),
});
