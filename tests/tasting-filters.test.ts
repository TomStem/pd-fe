import { describe, expect, it } from 'vitest';
import { formatYear } from '../app/utils/format';
import { filterTastings, filtersToQuery, parseFilters, tastingFacets } from '../app/utils/tastingFilters';

const country = (slug: string, name: string) => ({ slug, name });
const region = (slug: string, countrySlug: string, countryName: string) => ({ slug, name: slug, country: country(countrySlug, countryName) });

const tasting = (slug: string, date: string, links: { countries?: ReturnType<typeof country>[]; regions?: ReturnType<typeof region>[] } = {}) =>
  ({ slug, date, countries: links.countries ?? [], regions: links.regions ?? [] }) as unknown as TastingView;

const tastings = [
  tasting('a', '2025-06-01T17:00+02:00', { regions: [region('islay', 'scotland', 'Scotland'), region('speyside', 'scotland', 'Scotland')] }),
  tasting('b', '2025-01-10T17:00+01:00', { countries: [country('japan', 'Japan'), country('scotland', 'Scotland')] }),
  tasting('c', '2024-03-02T17:00+01:00', { regions: [region('kentucky', 'united-states', 'United States')] }),
  tasting('d', '2023-03-02T17:00+01:00'),
];

describe('formatYear', () => {
  it('uses the year in the club timezone', () => {
    expect(formatYear('2024-12-31T23:30:00+00:00')).toBe('2025');
    expect(formatYear('2025-01-01T00:30:00+02:00')).toBe('2024');
    expect(formatYear('2024-09-28T17:00+02:00')).toBe('2024');
  });
});

describe('tasting facets', () => {
  it('lists years newest first and countries alphabetically, with counts', () => {
    const { years, countries } = tastingFacets(tastings);
    expect(years.map(y => [y.value, y.count])).toEqual([['2025', 2], ['2024', 1], ['2023', 1]]);
    expect(countries.map(c => [c.label, c.count])).toEqual([['Japan', 1], ['Scotland', 2], ['United States', 1]]);
  });

  it('counts a country once per tasting, whether linked directly or through regions', () => {
    expect(tastingFacets(tastings).countries.find(c => c.value === 'scotland')?.count).toBe(2);
  });

  it('takes each count within the selection of the other filter', () => {
    const byCountry = tastingFacets(tastings, { countries: ['scotland', 'united-states'] });
    expect(byCountry.years.map(y => [y.value, y.count])).toEqual([['2025', 2], ['2024', 1], ['2023', 0]]);
    const byYear = tastingFacets(tastings, { years: ['2024', '2025'] });
    expect(byYear.countries.map(c => [c.value, c.count])).toEqual([['japan', 1], ['scotland', 2], ['united-states', 1]]);
    expect(tastingFacets(tastings, { years: ['2023'] }).countries.map(c => c.count)).toEqual([0, 0, 0]);
  });

  it('omits a facet without at least two options', () => {
    expect(tastingFacets(tastings.slice(3)).years).toEqual([]);
    expect(tastingFacets(tastings.slice(3)).countries).toEqual([]);
    expect(tastingFacets(tastings.slice(0, 1)).countries).toEqual([]);
    expect(tastingFacets([]).years).toEqual([]);
  });
});

describe('filtering tastings', () => {
  const slugs = (filters: Parameters<typeof filterTastings>[1]) => filterTastings(tastings, filters).map(t => t.slug);

  it('does not restrict without a selection and keeps the order', () => {
    expect(slugs({})).toEqual(['a', 'b', 'c', 'd']);
    expect(slugs({ years: [], countries: [] })).toEqual(['a', 'b', 'c', 'd']);
  });

  it('matches any selected year and any selected country', () => {
    expect(slugs({ years: ['2025', '2023'] })).toEqual(['a', 'b', 'd']);
    expect(slugs({ countries: ['japan', 'united-states'] })).toEqual(['b', 'c']);
    expect(slugs({ countries: ['scotland'] })).toEqual(['a', 'b']);
  });

  it('requires both filters to match', () => {
    expect(slugs({ years: ['2025'], countries: ['japan', 'united-states'] })).toEqual(['b']);
    expect(slugs({ years: ['2024', '2023'], countries: ['scotland'] })).toEqual([]);
  });
});

describe('parsing filters from the query', () => {
  const facets = tastingFacets(tastings);

  it('accepts comma-separated and repeated values', () => {
    expect(parseFilters({ year: '2024,2025', country: 'scotland,japan' }, facets)).toEqual({ years: ['2024', '2025'], countries: ['scotland', 'japan'] });
    expect(parseFilters({ year: ['2024', '2025,2023'] }, facets)).toEqual({ years: ['2024', '2025', '2023'], countries: [] });
  });

  it('drops invalid and duplicate items but keeps the valid ones', () => {
    expect(parseFilters({ year: '1999,2025,2025,abc', country: 'atlantis,japan' }, facets)).toEqual({ years: ['2025'], countries: ['japan'] });
    expect(parseFilters({ year: '1999', country: 'atlantis' }, facets)).toEqual({ years: [], countries: [] });
    expect(parseFilters({ year: 2025, country: null }, facets)).toEqual({ years: [], countries: [] });
    expect(parseFilters({}, facets)).toEqual({ years: [], countries: [] });
  });

  it('ignores values of a facet that is not shown', () => {
    expect(parseFilters({ country: 'scotland' }, tastingFacets(tastings.slice(0, 1)))).toEqual({ years: [], countries: [] });
  });

  it('round-trips through the query', () => {
    expect(filtersToQuery({ years: ['2024', '2025'], countries: [] })).toEqual({ year: '2024,2025' });
    expect(filtersToQuery({ years: [], countries: [] })).toEqual({});
    const filters = { years: ['2025'], countries: ['scotland', 'japan'] };
    expect(parseFilters(filtersToQuery(filters), facets)).toEqual(filters);
  });
});
