import { describe, expect, it } from 'vitest';
import { facetGroups, filterItems, parseSelection, searchItems } from '../app/utils/facetFilters';
import { ageBucket, ratingBuckets, sortWhiskies, whiskyFilterGroups, whiskySearchText, whiskySorts } from '../app/utils/whiskyFilters';
import { moreFromTitle, whiskyLabel } from '../app/utils/whiskyLabels';

const whisky = (name: string, extra: Partial<WhiskyView> = {}) =>
  ({
    slug: name.toLowerCase().replace(/ /g, '-'), name, isNas: false, casks: [], distilleries: [{ slug: 'd1', name: 'Distillery One' }], isBlend: false, countries: [], regions: [], reviewCount: 0, ...extra,
  }) as WhiskyView;

const scotland = { slug: 'scotland', name: 'Scotland', flag: undefined };
const islay = { slug: 'islay', name: 'Islay', country: scotland };

const whiskies = [
  whisky('Ardbeg 5', { age: 5, abv: 40, distilleries: [{ slug: 'ardbeg', name: 'Ardbeg' }], countries: [scotland], regions: [islay], casks: ['Bourbon', 'Oloroso Sherry'], averageRating: 4.5, reviewCount: 2 }),
  whisky('Jura 10', { age: 10, abv: 43, distilleries: [{ slug: 'jura', name: 'Jura' }], countries: [scotland], casks: ['bourbon'], averageRating: 3.2, reviewCount: 1 }),
  whisky('Oban 14', { age: 14, abv: 43, distilleries: [{ slug: 'oban', name: 'Oban' }], casks: ['Hogshead'] }),
  whisky('Old 21', { age: 21, abv: 46, casks: [] }),
  whisky('Young NAS', { isNas: true, abv: 46.3, casks: ['Bourbon'] }),
  whisky('Mystery'),
];

const options = (key: string, selection = {}) => facetGroups(whiskies, whiskyFilterGroups, selection).find(g => g.key === key)?.options.map(o => [o.label, o.count]);
const names = (selection: Record<string, string[]>) => filterItems(whiskies, whiskyFilterGroups, selection).map(w => w.name);

describe('age buckets', () => {
  it('puts NAS first and groups the years', () => {
    expect(ageBucket({ isNas: true, age: undefined })?.label).toBe('NAS');
    expect(ageBucket({ isNas: true, age: 12 })?.label).toBe('NAS');
    expect([5, 9, 10, 14, 15, 20, 21, 30].map(age => ageBucket({ isNas: false, age })?.label)).toEqual(['Under 10', 'Under 10', '10–14', '10–14', '15–20', '15–20', '21+', '21+']);
    expect(ageBucket({ isNas: false, age: undefined })).toBeUndefined();
  });

  it('lists only the buckets that occur, in a fixed order', () => {
    expect(options('age')).toEqual([['NAS', 1], ['Under 10', 1], ['10–14', 2], ['21+', 1]]);
  });
});

describe('rating buckets', () => {
  it('makes the buckets cumulative and marks whiskies without reviews as unrated', () => {
    expect(ratingBuckets({ averageRating: 4.5 }).map(b => b.label)).toEqual(['4+ stars', '3+ stars']);
    expect(ratingBuckets({ averageRating: 3 }).map(b => b.label)).toEqual(['3+ stars']);
    expect(ratingBuckets({ averageRating: 2 })).toEqual([]);
    expect(ratingBuckets({ averageRating: undefined }).map(b => b.label)).toEqual(['Unrated']);
  });

  it('is not offered when nothing is rated', () => {
    expect(facetGroups(whiskies.map(w => ({ ...w, averageRating: undefined })), whiskyFilterGroups).map(g => g.key)).not.toContain('rating');
    expect(options('rating')).toEqual([['4+ stars', 1], ['3+ stars', 2], ['Unrated', 4]]);
  });
});

describe('whisky filter groups', () => {
  it('merges casks that differ only in case and matches any selected cask', () => {
    expect(options('cask')).toEqual([['Bourbon', 3], ['Hogshead', 1], ['Oloroso Sherry', 1]]);
    expect(names({ cask: ['oloroso-sherry', 'hogshead'] })).toEqual(['Ardbeg 5', 'Oban 14']);
  });

  it('derives distillery, country and region and leaves out groups with one option', () => {
    expect(options('distillery')).toEqual([['Ardbeg', 1], ['Distillery One', 3], ['Jura', 1], ['Oban', 1]]);
    expect(options('country')).toBeUndefined();
    expect(options('region')).toBeUndefined();
  });

  it('combines groups with AND', () => {
    expect(names({ cask: ['bourbon'], age: ['nas', '10-14'] })).toEqual(['Jura 10', 'Young NAS']);
    expect(names({ rating: ['3-plus'], distillery: ['jura'] })).toEqual(['Jura 10']);
    expect(options('distillery', { rating: ['4-plus'] })).toEqual([['Ardbeg', 1], ['Distillery One', 0], ['Jura', 0], ['Oban', 0]]);
  });

  it('parses the query per group and drops invalid items', () => {
    const shown = facetGroups(whiskies, whiskyFilterGroups);
    expect(parseSelection({ age: 'nas,99', cask: ['bourbon,nope'], rating: 'unrated' }, shown)).toMatchObject({ age: ['nas'], cask: ['bourbon'], rating: ['unrated'] });
  });
});

describe('sorting whiskies', () => {
  const sorted = (sort: Parameters<typeof sortWhiskies>[1]) => sortWhiskies(whiskies, sort).map(w => w.name);

  it('sorts by name by default, ignoring case', () => {
    expect(whiskySorts[0].value).toBe('name');
    expect(sorted('name')).toEqual(['Ardbeg 5', 'Jura 10', 'Mystery', 'Oban 14', 'Old 21', 'Young NAS']);
  });

  it('sorts high to low with missing values last, then by name', () => {
    expect(sorted('age')).toEqual(['Old 21', 'Oban 14', 'Jura 10', 'Ardbeg 5', 'Mystery', 'Young NAS']);
    expect(sorted('abv')).toEqual(['Young NAS', 'Old 21', 'Jura 10', 'Oban 14', 'Ardbeg 5', 'Mystery']);
    expect(sorted('rating')).toEqual(['Ardbeg 5', 'Jura 10', 'Mystery', 'Oban 14', 'Old 21', 'Young NAS']);
  });

  it('does not change the input order', () => {
    const before = whiskies.map(w => w.name);
    sortWhiskies(whiskies, 'abv');
    expect(whiskies.map(w => w.name)).toEqual(before);
  });
});

describe('whisky search text', () => {
  it('covers name, distillery, region, country and casks', () => {
    expect(whiskySearchText(whiskies[0]!)).toEqual(['Ardbeg 5', 'Ardbeg', 'Islay', 'Scotland', 'Bourbon', 'Oloroso Sherry']);
    expect(whiskySearchText(whiskies[5]!)).toEqual(['Mystery', 'Distillery One']);
  });
});

describe('blends', () => {
  const ardbeg = { slug: 'ardbeg', name: 'Ardbeg' };
  const jura = { slug: 'jura', name: 'Jura' };
  const oban = { slug: 'oban', name: 'Oban' };
  const ireland = { slug: 'ireland', name: 'Ireland', flag: undefined };
  const antrim = { slug: 'antrim', name: 'Antrim', country: ireland };
  const mixed = [
    whisky('Ardbeg 5', { distilleries: [ardbeg], countries: [scotland], regions: [islay] }),
    whisky('Harbour', { distilleries: [ardbeg, jura, oban], isBlend: true, brand: 'Foggy Quay', countries: [scotland, ireland], regions: [islay, antrim] }),
    whisky('Nameless', { distilleries: [jura, oban], isBlend: true, countries: [scotland] }),
  ];
  const groups = facetGroups(mixed, whiskyFilterGroups);
  const optionsOf = (key: string) => groups.find(g => g.key === key)?.options.map(o => [o.label, o.count]);
  const names = (selection: Record<string, string[]>) => filterItems(mixed, whiskyFilterGroups, selection).map(w => w.name);

  it('offers the type with the single distillery option first, and only when both occur', () => {
    expect(optionsOf('type')).toEqual([['Single distillery', 1], ['Blend', 2]]);
    expect(names({ type: ['blend'] })).toEqual(['Harbour', 'Nameless']);
    expect(facetGroups(mixed.slice(0, 1), whiskyFilterGroups).map(g => g.key)).not.toContain('type');
  });

  it('offers brands only when at least two differ', () => {
    expect(optionsOf('brand')).toBeUndefined();
    const other = whisky('Other', { brand: 'Salt & Oak' });
    const branded = [...mixed, other];
    expect(facetGroups(branded, whiskyFilterGroups).find(g => g.key === 'brand')?.options.map(o => o.value)).toEqual(['foggy-quay', 'salt-oak']);
    expect(filterItems(branded, whiskyFilterGroups, { brand: ['salt-oak'] }).map(w => w.name)).toEqual(['Other']);
  });

  it('matches any distillery, country and region of a whisky', () => {
    expect(optionsOf('distillery')).toEqual([['Ardbeg', 2], ['Jura', 2], ['Oban', 2]]);
    expect(names({ distillery: ['oban'] })).toEqual(['Harbour', 'Nameless']);
    expect(names({ country: ['ireland'] })).toEqual(['Harbour']);
    expect(names({ country: ['scotland'] })).toEqual(['Ardbeg 5', 'Harbour', 'Nameless']);
    expect(names({ region: ['antrim', 'islay'] })).toEqual(['Ardbeg 5', 'Harbour']);
  });

  it('searches the brand and all distillery names', () => {
    const found = (query: string) => searchItems(mixed, whiskySearchText, query).map(w => w.name);
    expect(found('foggy')).toEqual(['Harbour']);
    expect(found('oban')).toEqual(['Harbour', 'Nameless']);
    expect(found('ardbeg quay')).toEqual(['Harbour']);
  });

  it('labels a whisky with its brand, else its distillery, else the number of distilleries', () => {
    expect(whiskyLabel(mixed[1]!)).toBe('Foggy Quay');
    expect(whiskyLabel(mixed[0]!)).toBe('Ardbeg');
    expect(whiskyLabel(mixed[2]!)).toBe('2 distilleries');
    expect(whiskyLabel({ brand: 'Salt & Oak', distilleries: [ardbeg] })).toBe('Salt & Oak');
  });

  it('titles the other bottles after the brand they share, else the distillery or distilleries', () => {
    expect(moreFromTitle(mixed[1]!, [{ brand: 'foggy quay' }])).toBe('More from Foggy Quay');
    expect(moreFromTitle(mixed[1]!, [{ brand: undefined }])).toBe('More from these distilleries');
    expect(moreFromTitle(mixed[0]!, [{ brand: undefined }])).toBe('More from Ardbeg');
    expect(moreFromTitle({ brand: 'Salt & Oak', distilleries: [ardbeg] }, [{ brand: undefined }])).toBe('More from Ardbeg');
  });
});
