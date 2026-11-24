import { describe, expect, it } from 'vitest';
import { formatYear } from '../app/utils/format';
import { facetGroups, filterItems, parseSelection, selectionToQuery } from '../app/utils/facetFilters';
import { tastingFilterGroups } from '../app/utils/tastingFilters';

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

const groupsOf = (selection = {}, items = tastings) => facetGroups(items, tastingFilterGroups, selection);
const optionsOf = (key: string, selection = {}, items = tastings) => groupsOf(selection, items).find(g => g.key === key)?.options.map(o => [o.value, o.count]);

describe('tasting facets', () => {
  it('lists years newest first and countries alphabetically, with counts', () => {
    expect(optionsOf('year')).toEqual([['2025', 2], ['2024', 1], ['2023', 1]]);
    expect(groupsOf().find(g => g.key === 'country')!.options.map(o => [o.label, o.count])).toEqual([['Japan', 1], ['Scotland', 2], ['United States', 1]]);
  });

  it('counts a country once per tasting, whether linked directly or through regions', () => {
    expect(optionsOf('country')).toContainEqual(['scotland', 2]);
  });

  it('takes each count within the selection of the other group', () => {
    expect(optionsOf('year', { country: ['scotland', 'united-states'] })).toEqual([['2025', 2], ['2024', 1], ['2023', 0]]);
    expect(optionsOf('country', { year: ['2024', '2025'] })).toEqual([['japan', 1], ['scotland', 2], ['united-states', 1]]);
    expect(optionsOf('country', { year: ['2023'] })!.map(([, count]) => count)).toEqual([0, 0, 0]);
  });

  it('omits a group without at least two options', () => {
    expect(groupsOf({}, tastings.slice(3))).toEqual([]);
    expect(optionsOf('country', {}, tastings.slice(0, 1))).toBeUndefined();
    expect(groupsOf({}, [])).toEqual([]);
  });
});

describe('filtering tastings', () => {
  const slugs = (selection: Record<string, string[]>) => filterItems(tastings, tastingFilterGroups, selection).map(t => t.slug);

  it('does not restrict without a selection and keeps the order', () => {
    expect(slugs({})).toEqual(['a', 'b', 'c', 'd']);
    expect(slugs({ year: [], country: [] })).toEqual(['a', 'b', 'c', 'd']);
  });

  it('matches any selected year and any selected country', () => {
    expect(slugs({ year: ['2025', '2023'] })).toEqual(['a', 'b', 'd']);
    expect(slugs({ country: ['japan', 'united-states'] })).toEqual(['b', 'c']);
    expect(slugs({ country: ['scotland'] })).toEqual(['a', 'b']);
  });

  it('requires both groups to match', () => {
    expect(slugs({ year: ['2025'], country: ['japan', 'united-states'] })).toEqual(['b']);
    expect(slugs({ year: ['2024', '2023'], country: ['scotland'] })).toEqual([]);
  });
});

describe('tasting filters in the query', () => {
  const groups = groupsOf();

  it('parses comma-separated values, dropping what is not an option', () => {
    expect(parseSelection({ year: '2024,1999,2025', country: 'scotland,atlantis' }, groups)).toEqual({ year: ['2024', '2025'], country: ['scotland'] });
  });

  it('round-trips through the query', () => {
    const selection = { year: ['2025'], country: ['scotland', 'japan'] };
    expect(parseSelection(selectionToQuery(selection), groups)).toEqual(selection);
  });
});
