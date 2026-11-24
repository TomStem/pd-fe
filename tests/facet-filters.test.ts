import { describe, expect, it } from 'vitest';
import {
  byFixedOrder, byLabel, byValueDescending, facetGroups, facetValue, filterItems, parseSelection, selectedTotal, selectionToQuery, toggleValue,
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
