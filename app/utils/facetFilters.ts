export interface FacetValue {
  value: string;
  label: string;
}

export interface FilterGroup<T> {
  /** Query parameter and selection key. */
  key: string;
  label: string;
  /** The option values of an item; an item can have several (a tasting in more countries) or none. */
  values: (item: T) => FacetValue[];
  /** Orders the options; alphabetical by label when omitted. */
  compare?: (a: FacetValue, b: FacetValue) => number;
}

export interface FacetOption extends FacetValue {
  count: number;
}

export interface FacetGroup {
  key: string;
  label: string;
  options: FacetOption[];
}

export type FilterSelection = Record<string, string[]>;

const collator = new Intl.Collator('en', { sensitivity: 'base' });

export const byLabel = (a: FacetValue, b: FacetValue) => collator.compare(a.label, b.label);
export const byValueDescending = (a: FacetValue, b: FacetValue) => b.value.localeCompare(a.value);
export const byFixedOrder = (order: string[]) => (a: FacetValue, b: FacetValue) => order.indexOf(a.value) - order.indexOf(b.value);

/** Query-safe option value for a free text label; case and punctuation do not matter. */
export const facetValue = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');

/** Within a group any selected value matches; between groups all selected groups must match. A group without selection does not restrict. */
function matches<T>(item: T, groups: FilterGroup<T>[], selection: FilterSelection, skip?: string) {
  return groups.every((group) => {
    const selected = selection[group.key];
    return group.key === skip || !selected?.length || group.values(item).some(v => selected.includes(v.value));
  });
}

export const filterItems = <T>(items: T[], groups: FilterGroup<T>[], selection: FilterSelection) =>
  items.filter(item => matches(item, groups, selection));

/**
 * The groups worth showing: a group with fewer than two options cannot narrow anything and is left out.
 * An option's count is the number of items that have it within the selection of the other groups.
 */
export function facetGroups<T>(items: T[], groups: FilterGroup<T>[], selection: FilterSelection = {}): FacetGroup[] {
  return groups.flatMap((group) => {
    const labels = new Map<string, string>();
    for (const item of items) {
      for (const { value, label } of group.values(item)) if (!labels.has(value)) labels.set(value, label);
    }
    if (labels.size < 2) return [];
    const others = items.filter(item => matches(item, groups, selection, group.key));
    const options = [...labels]
      .map(([value, label]) => ({ value, label, count: others.filter(item => group.values(item).some(v => v.value === value)).length }))
      .sort(group.compare ?? byLabel);
    return [{ key: group.key, label: group.label, options }];
  });
}

/** Takes the selection from comma-separated query values; items that are not an option are dropped. */
export function parseSelection(query: Record<string, unknown>, groups: FacetGroup[]): FilterSelection {
  return Object.fromEntries(groups.map(({ key, options }) => {
    const raw = query[key];
    const items = (Array.isArray(raw) ? raw : [raw]).flatMap(v => (typeof v === 'string' ? v.split(',') : []));
    return [key, [...new Set(items.filter(item => options.some(o => o.value === item)))]];
  }));
}

/** Query string values for a selection, without the empty groups. */
export const selectionToQuery = (selection: FilterSelection) =>
  Object.fromEntries(Object.entries(selection).filter(([, values]) => values.length).map(([key, values]) => [key, values.join(',')]));

export const selectedTotal = (selection: FilterSelection) => Object.values(selection).reduce((sum, values) => sum + values.length, 0);

export function toggleValue(selection: FilterSelection, key: string, value: string): FilterSelection {
  const selected = selection[key] ?? [];
  return { ...selection, [key]: selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value] };
}
