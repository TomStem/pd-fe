import { describe, expect, it } from 'vitest';
import { formatYear } from '../app/utils/format';
import { filterTastings, parseFilters, tastingFacets } from '../app/utils/tastingFilters';

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
    const scotland = tastingFacets(tastings).countries.find(c => c.value === 'scotland');
    expect(scotland?.count).toBe(2);
  });

  it('lets counts follow the other active filter', () => {
    const facets = tastingFacets(tastings, { country: 'scotland' });
    expect(facets.years.map(y => [y.value, y.count])).toEqual([['2025', 2], ['2024', 0], ['2023', 0]]);
    expect(tastingFacets(tastings, { year: '2024' }).countries.map(c => [c.value, c.count]))
      .toEqual([['japan', 0], ['scotland', 0], ['united-states', 1]]);
  });

  it('omits a facet without at least two options', () => {
    expect(tastingFacets(tastings.slice(3)).years).toEqual([]);
    expect(tastingFacets(tastings.slice(3)).countries).toEqual([]);
    expect(tastingFacets(tastings.slice(0, 1)).countries).toEqual([]);
    expect(tastingFacets([]).years).toEqual([]);
  });
});

describe('filtering tastings', () => {
  it('filters by year, by country and by both, keeping the order', () => {
    expect(filterTastings(tastings, {}).map(t => t.slug)).toEqual(['a', 'b', 'c', 'd']);
    expect(filterTastings(tastings, { year: '2025' }).map(t => t.slug)).toEqual(['a', 'b']);
    expect(filterTastings(tastings, { country: 'scotland' }).map(t => t.slug)).toEqual(['a', 'b']);
    expect(filterTastings(tastings, { country: 'japan', year: '2025' }).map(t => t.slug)).toEqual(['b']);
    expect(filterTastings(tastings, { country: 'japan', year: '2024' })).toEqual([]);
  });
});

describe('parsing filters from the query', () => {
  const facets = tastingFacets(tastings);

  it('accepts known values', () => {
    expect(parseFilters({ year: '2025', country: 'scotland' }, facets)).toEqual({ year: '2025', country: 'scotland' });
    expect(parseFilters({ year: ['2024', '2025'] }, facets)).toEqual({ year: '2024', country: undefined });
  });

  it('ignores invalid values', () => {
    expect(parseFilters({ year: '1999', country: 'atlantis' }, facets)).toEqual({ year: undefined, country: undefined });
    expect(parseFilters({ year: 2025, country: null }, facets)).toEqual({ year: undefined, country: undefined });
    expect(parseFilters({}, facets)).toEqual({ year: undefined, country: undefined });
  });

  it('ignores values of a facet that is not shown', () => {
    expect(parseFilters({ country: 'scotland' }, tastingFacets(tastings.slice(0, 1)))).toEqual({ year: undefined, country: undefined });
  });
});
