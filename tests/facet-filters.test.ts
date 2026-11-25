import { describe, expect, it } from 'vitest';
import {
  activeChips, byFixedOrder, COLLAPSED_OPTION_LIMIT, visibleOptions, byLabel, byValueDescending, facetGroups, facetValue, filterItems, normalizeText, parseSelection, searchItems, selectedTotal, selectionToQuery, texts, toggleValue,
  type FilterGroup,
} from '../app/utils/facetFilters';

interface Item {
  id: string;
  colour?: string;
  tags: string[];
}

const items: Item[] = [
  { id: '1', colour: 'red', tags: ['Oak', 'sherry'] },
  { id: '2', colour: 'red', tags: ['oak'] },
  { id: '3', colour: 'blue', tags: ['Bourbon', 'oak'] },
  { id: '4', tags: [] },
];

const groups: FilterGroup<Item>[] = [
  { key: 'colour', label: 'Colour', values: i => (i.colour ? [{ value: i.colour, label: i.colour }] : []) },
  { key: 'tag', label: 'Tag', values: i => i.tags.map(t => ({ value: facetValue(t), label: t })) },
];

const ids = (selection: Record<string, string[]>) => filterItems(items, groups, selection).map(i => i.id);

describe('facetValue', () => {
  it('makes a query-safe value that ignores case and punctuation', () => {
    expect(facetValue('Oloroso sherry (finish)')).toBe('oloroso-sherry-finish');
    expect(facetValue('American Oak')).toBe(facetValue('american oak'));
    expect(facetValue('Sherry, finish')).not.toContain(',');
    expect(facetValue(' – ')).toBe('');
  });
});

describe('matching', () => {
  it('does not restrict without a selection', () => {
    expect(ids({})).toEqual(['1', '2', '3', '4']);
    expect(ids({ colour: [] })).toEqual(['1', '2', '3', '4']);
  });

  it('matches any selected value within a group', () => {
    expect(ids({ colour: ['red', 'blue'] })).toEqual(['1', '2', '3']);
    expect(ids({ tag: ['sherry', 'bourbon'] })).toEqual(['1', '3']);
  });

  it('requires every group with a selection to match', () => {
    expect(ids({ colour: ['red'], tag: ['sherry', 'bourbon'] })).toEqual(['1']);
    expect(ids({ colour: ['blue'], tag: ['sherry'] })).toEqual([]);
  });

  it('never matches an item without a value in a group with a selection', () => {
    expect(ids({ colour: ['red', 'blue'], tag: ['oak'] })).toEqual(['1', '2', '3']);
    expect(ids({ tag: ['oak'] })).not.toContain('4');
  });
});

describe('facet groups', () => {
  const options = (selection = {}, key = 'tag') => facetGroups(items, groups, selection).find(g => g.key === key)?.options.map(o => [o.label, o.count]);

  it('derives options from the items, merging values that are the same, with counts', () => {
    expect(options()).toEqual([['Bourbon', 1], ['Oak', 3], ['sherry', 1]]);
    expect(options({}, 'colour')).toEqual([['blue', 1], ['red', 2]]);
  });

  it('counts within the selection of the other groups only', () => {
    expect(options({ colour: ['red'] })).toEqual([['Bourbon', 0], ['Oak', 2], ['sherry', 1]]);
    expect(options({ tag: ['sherry'] }, 'colour')).toEqual([['blue', 0], ['red', 1]]);
    expect(options({ tag: ['sherry'], colour: ['blue'] }, 'colour')).toEqual([['blue', 0], ['red', 1]]);
  });

  it('leaves out groups with fewer than two options', () => {
    expect(facetGroups([items[0]!, items[1]!], groups).map(g => g.key)).toEqual(['tag']);
    expect(facetGroups([], groups)).toEqual([]);
  });

  it('orders options with the group comparator', () => {
    const ordered = (compare: FilterGroup<Item>['compare']) => facetGroups(items, [{ ...groups[0]!, compare }], {})[0]!.options.map(o => o.value);
    expect(ordered(byLabel)).toEqual(['blue', 'red']);
    expect(ordered(byValueDescending)).toEqual(['red', 'blue']);
    expect(ordered(byFixedOrder(['red', 'blue']))).toEqual(['red', 'blue']);
  });
});

describe('selection in the query', () => {
  const shown = facetGroups(items, groups);

  it('parses comma-separated and repeated values and drops invalid or duplicate items', () => {
    expect(parseSelection({ colour: 'red,green,red', tag: ['oak', 'sherry,nope'] }, shown)).toEqual({ colour: ['red'], tag: ['oak', 'sherry'] });
    expect(parseSelection({ colour: 5, tag: null }, shown)).toEqual({ colour: [], tag: [] });
    expect(parseSelection({}, shown)).toEqual({ colour: [], tag: [] });
  });

  it('ignores groups that are not shown', () => {
    expect(parseSelection({ colour: 'red' }, facetGroups([items[0]!, items[1]!], groups))).toEqual({ tag: [] });
  });

  it('writes only the groups with a selection', () => {
    expect(selectionToQuery({ colour: ['red', 'blue'], tag: [] })).toEqual({ colour: 'red,blue' });
    expect(selectionToQuery({})).toEqual({});
  });

  it('toggles values and counts the selection', () => {
    const one = toggleValue({}, 'colour', 'red');
    expect(one).toEqual({ colour: ['red'] });
    expect(toggleValue(one, 'colour', 'blue')).toEqual({ colour: ['red', 'blue'] });
    expect(toggleValue(one, 'colour', 'red')).toEqual({ colour: [] });
    expect(selectedTotal({ colour: ['red', 'blue'], tag: ['oak'] })).toBe(3);
  });
});

describe('search', () => {
  const textOf = (item: Item) => texts(item.colour, ...item.tags);
  const found = (query: string) => searchItems(items, textOf, query).map(i => i.id);

  it('normalises case and accents', () => {
    expect(normalizeText('Café ÉCOSSE')).toBe('cafe ecosse');
    expect(found('SHERRY')).toEqual(['1']);
    expect(searchItems([{ id: 'x', tags: ['Café'] }], textOf, 'cafe').length).toBe(1);
  });

  it('matches substrings and requires every word', () => {
    expect(found('ou')).toEqual(['3']);
    expect(found('oak red')).toEqual(['1', '2']);
    expect(found('oak red sherry bourbon')).toEqual([]);
  });

  it('does not restrict on an empty query or without searchable text', () => {
    expect(found('')).toEqual(['1', '2', '3', '4']);
    expect(found('   ')).toEqual(['1', '2', '3', '4']);
    expect(searchItems(items, undefined, 'zzz')).toEqual(items);
  });

  it('skips missing texts', () => {
    expect(texts('a', undefined, '', 'b')).toEqual(['a', 'b']);
  });

  it('counts only the searched items but keeps every option', () => {
    const searched = searchItems(items, textOf, 'red');
    const group = facetGroups(items, groups, {}, searched).find(g => g.key === 'tag')!;
    expect(group.options.map(o => [o.label, o.count])).toEqual([['Bourbon', 0], ['Oak', 2], ['sherry', 1]]);
  });
});

describe('active chips', () => {
  const shown = facetGroups(items, groups);

  it('lists the selected options per group followed by the search term', () => {
    expect(activeChips(shown, { tag: ['sherry', 'oak'], colour: ['red'] }, 'peat')).toEqual([
      { id: 'colour:red', key: 'colour', value: 'red', label: 'Colour: red', ariaLabel: 'Remove filter Colour red' },
      { id: 'tag:sherry', key: 'tag', value: 'sherry', label: 'Tag: sherry', ariaLabel: 'Remove filter Tag sherry' },
      { id: 'tag:oak', key: 'tag', value: 'oak', label: 'Tag: Oak', ariaLabel: 'Remove filter Tag Oak' },
      { id: 'q', label: 'Search: peat', ariaLabel: 'Remove search peat' },
    ]);
  });

  it('has no chips when nothing is active', () => {
    expect(activeChips(shown, { colour: [], tag: [] }, '')).toEqual([]);
    expect(activeChips(shown, {}, '')).toEqual([]);
  });
});

describe('visibleOptions', () => {
  const opts = Array.from({ length: 12 }, (_, i) => ({ value: `v${i}`, label: `L${i}`, count: i }));

  it('shows everything when short or expanded', () => {
    expect(visibleOptions(opts.slice(0, 8))).toHaveLength(8);
    expect(visibleOptions(opts, [], true)).toHaveLength(12);
  });

  it('collapses to the limit, keeping order', () => {
    expect(visibleOptions(opts).map(o => o.value)).toEqual(opts.slice(0, COLLAPSED_OPTION_LIMIT).map(o => o.value));
  });

  it('always keeps selected options visible in their place', () => {
    expect(visibleOptions(opts, ['v10', 'v2']).map(o => o.value)).toEqual([...opts.slice(0, 8).map(o => o.value), 'v10']);
  });
});
