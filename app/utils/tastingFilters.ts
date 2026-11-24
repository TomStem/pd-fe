import { formatYear } from './format';

export interface TastingFilters {
  year?: string;
  country?: string;
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

const inCountry = (tasting: TastingView, slug: string) => tastingCountries(tasting).some(c => c.slug === slug);

export const filterTastings = (tastings: TastingView[], { year, country }: TastingFilters) =>
  tastings.filter(t => (!year || formatYear(t.date) === year) && (!country || inCountry(t, country)));

/** Only facets with at least two options are returned: a single option cannot narrow anything. Counts respect the other filter. */
export function tastingFacets(tastings: TastingView[], filters: TastingFilters = {}): TastingFacets {
  const countryNames = new Map<string, string>();
  for (const tasting of tastings) {
    for (const country of tastingCountries(tasting)) countryNames.set(country.slug, country.name);
  }
  const years = [...new Set(tastings.map(t => formatYear(t.date)))].sort((a, b) => b.localeCompare(a));
  const inYear = filterTastings(tastings, { year: filters.year });
  const inChosenCountry = filterTastings(tastings, { country: filters.country });

  const facets: TastingFacets = {
    years: years.map(value => ({ value, label: value, count: inChosenCountry.filter(t => formatYear(t.date) === value).length })),
    countries: [...countryNames]
      .map(([value, label]) => ({ value, label, count: inYear.filter(t => inCountry(t, value)).length }))
      .sort((a, b) => collator.compare(a.label, b.label)),
  };
  return {
    years: facets.years.length > 1 ? facets.years : [],
    countries: facets.countries.length > 1 ? facets.countries : [],
  };
}

/** Takes the filters from a query string; values that are not an option are ignored. */
export function parseFilters(query: Record<string, unknown>, facets: TastingFacets): TastingFilters {
  const pick = (value: unknown, options: FacetOption[]) => {
    const first = Array.isArray(value) ? value[0] : value;
    return typeof first === 'string' && options.some(o => o.value === first) ? first : undefined;
  };
  return { year: pick(query.year, facets.years), country: pick(query.country, facets.countries) };
}
