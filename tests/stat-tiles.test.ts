import { describe, expect, it } from 'vitest';
import { statTiles } from '../app/utils/statTiles';
import type { HomeStats } from '../shared/types/views';

const stats: HomeStats = { tastings: 5, countries: 1, whiskies: 0, distilleries: 17, trips: 3 };

describe('statTiles', () => {
  it('hides zero values and ignores trips', () => {
    expect(statTiles(stats).map(t => t.key)).toEqual(['tastings', 'distilleries', 'countries']);
  });

  it('uses singular and plural labels', () => {
    expect(statTiles(stats).map(t => t.label)).toEqual(['Tastings', 'Distilleries', 'Country']);
  });

  it('is empty when everything is zero', () => {
    expect(statTiles({ tastings: 0, countries: 0, whiskies: 0, distilleries: 0, trips: 0 })).toEqual([]);
  });
});
