export interface StatTile {
  key: 'tastings' | 'whiskies' | 'distilleries' | 'countries';
  value: number;
  label: string;
}

const defs = [
  { key: 'tastings', one: 'Tasting', many: 'Tastings' },
  { key: 'whiskies', one: 'Whisky', many: 'Whiskies' },
  { key: 'distilleries', one: 'Distillery', many: 'Distilleries' },
  { key: 'countries', one: 'Country', many: 'Countries' },
] as const;

/** Tiles for the home stats strip; empty (zero) stats are left out. */
export function statTiles(stats: HomeStats): StatTile[] {
  return defs
    .map(({ key, one, many }) => ({ key, value: stats[key], label: stats[key] === 1 ? one : many }))
    .filter(tile => tile.value > 0);
}
