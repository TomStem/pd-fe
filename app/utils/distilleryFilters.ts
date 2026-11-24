import { byFixedOrder, type FilterGroup } from './facetFilters';

export const distilleryFilterGroups: FilterGroup<DistilleryView>[] = [
  { key: 'country', label: 'Country', values: d => [{ value: d.country.slug, label: d.country.name }] },
  { key: 'region', label: 'Region', values: d => (d.region ? [{ value: d.region.slug, label: d.region.name }] : []) },
  {
    key: 'visitable',
    label: 'Visiting',
    values: d => (d.visitable === undefined ? [] : [d.visitable ? { value: 'yes', label: 'Open to visitors' } : { value: 'no', label: 'Not open to visitors' }]),
    compare: byFixedOrder(['yes', 'no']),
  },
];
