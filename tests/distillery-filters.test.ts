import { describe, expect, it } from 'vitest';
import { facetGroups, filterItems } from '../app/utils/facetFilters';
import { distilleryFilterGroups } from '../app/utils/distilleryFilters';

const scotland = { slug: 'scotland', name: 'Scotland', flag: undefined };
const japan = { slug: 'japan', name: 'Japan', flag: undefined };
const distillery = (slug: string, country: typeof scotland, region?: string, visitable?: boolean) =>
  ({ slug, name: slug, country, region: region ? { slug: region, name: region, country } : undefined, visitable }) as DistilleryView;

const distilleries = [
  distillery('ardbeg', scotland, 'islay', true),
  distillery('jura', scotland, 'islands', false),
  distillery('oban', scotland),
  distillery('yamazaki', japan, 'honshu'),
];

const options = (items = distilleries, selection = {}) =>
  Object.fromEntries(facetGroups(items, distilleryFilterGroups, selection).map(g => [g.key, g.options.map(o => [o.value, o.count])]));

describe('distillery filter groups', () => {
  it('derives country, region and visiting options with counts', () => {
    expect(options()).toEqual({
      country: [['japan', 1], ['scotland', 3]],
      region: [['honshu', 1], ['islands', 1], ['islay', 1]],
      visitable: [['yes', 1], ['no', 1]],
    });
  });

  it('keeps distilleries without a region under their country', () => {
    expect(filterItems(distilleries, distilleryFilterGroups, { country: ['scotland'] }).map(d => d.slug)).toEqual(['ardbeg', 'jura', 'oban']);
    expect(filterItems(distilleries, distilleryFilterGroups, { region: ['islay', 'honshu'] }).map(d => d.slug)).toEqual(['ardbeg', 'yamazaki']);
  });

  it('hides groups with fewer than two options', () => {
    expect(Object.keys(options([distilleries[0]!, distilleries[2]!]))).toEqual([]);
    expect(Object.keys(options(distilleries.slice(0, 1)))).toEqual([]);
    expect(options(distilleries.slice(0, 3)).visitable).toEqual([['yes', 1], ['no', 1]]);
  });

  it('follows the selection of the other groups in the counts', () => {
    expect(options(distilleries, { country: ['japan'] }).region).toEqual([['honshu', 1], ['islands', 0], ['islay', 0]]);
    expect(filterItems(distilleries, distilleryFilterGroups, { country: ['scotland'], visitable: ['no'] }).map(d => d.slug)).toEqual(['jura']);
  });
});
