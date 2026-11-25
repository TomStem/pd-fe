import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchContentfulStore, mapStore, type RawContent } from '../server/utils/content/contentful';
import { flagForCountry } from '../server/utils/content/flags';
import { getCountryDetail, getHome, getRegionDetail, getSitemapPaths, getTastings, getWhiskyDetail } from '../server/utils/content/queries';
import { slugify, teaser } from '../server/utils/content/text';

const client = vi.hoisted(() => ({ getContentTypes: vi.fn(), getEntries: vi.fn() }));
vi.mock('contentful', () => ({ createClient: () => ({ withoutUnresolvableLinks: client }) }));

const entry = (id: string, fields: Record<string, unknown>, createdAt = '2024-01-01T00:00:00Z') => ({ sys: { id, createdAt }, fields });
const link = (id: string) => entry(id, {});
const asset = (url: string) => ({ sys: { id: `asset-${url}` }, fields: { file: { url } } });
const doc = (...paragraphs: string[]) => ({
  nodeType: 'document',
  data: {},
  content: paragraphs.map(value => ({
    nodeType: 'paragraph',
    data: {},
    content: [{ nodeType: 'text', value, marks: [{ type: 'bold' }], data: {} }],
  })),
});

const empty: RawContent = { countries: [], regions: [], distilleries: [], whiskies: [], reviews: [], tastings: [], trips: [] };

const raw: RawContent = {
  ...empty,
  countries: [
    entry('c1', { name: 'Scotland', description: doc('Land of single malt.') }),
    entry('c2', { name: 'United States' }),
    entry('c3', { name: 'Atlantis' }),
  ],
  regions: [entry('r1', { regionName: 'Islay', country: link('c1') }), entry('r2', { regionName: 'Kentucky', country: link('c2') })],
  distilleries: [
    entry('d1', {
      name: 'Fake distillery',
      slug: 'fake-distillery',
      image: asset('//images.example.test/d1.jpg'),
      location: { lat: 55.6, lon: -6.1 },
      country: link('c1'),
      region: link('r1'),
    }),
    entry('d2', { name: 'Regionless distillery', slug: 'regionless', image: asset('//images.example.test/d2.jpg'), country: link('c2') }),
  ],
  whiskies: [
    entry('w1', {
      name: 'Fake 10 Years',
      slug: 'fake-10-years',
      age: 10,
      isNas: false,
      alcoholPercentage: 40.5,
      cask: ['Bourbon', 'Sherry'],
      notes: doc('Rook'),
      country: link('c1'),
      distillery: link('d1'),
    }),
    entry('w2', { name: 'Fake NAS', slug: 'fake-nas', isNas: true, alcoholPercentage: 46, cask: [], distillery: link('d1'), country: link('c1') }),
  ],
  reviews: [
    entry('v1', { title: 'Mooi', rating: 5, whisky: link('w1'), description: doc('Lekker') }),
    entry('v2', { title: 'Goed', rating: 4, whisky: link('w1') }),
    entry('v3', { title: 'Verweesd', rating: 3, whisky: link('missing') }),
  ],
  tastings: [
    entry('t1', { name: '#11 Cask finishes', date: '2024-09-28T17:00+02:00', location: 'Ergens', images: [asset('//images.example.test/t1a.jpg'), asset('//images.example.test/t1b.jpg')], whiskies: [link('w1'), link('missing')], description: doc('Een avond over vaten.') }),
    entry('t2', { name: 'Zonder datum' }),
    entry('t3', { name: 'Met regio', date: '2030-01-01T17:00+01:00', regions: [link('r1'), link('r2'), link('r1')], countries: [link('c1'), link('c1')], whiskies: [link('w1')] }),
  ],
};

describe('slugs', () => {
  it('derives readable slugs', () => {
    expect(slugify('United States')).toBe('united-states');
    expect(slugify('#11 Cask finishes')).toBe('11-cask-finishes');
    expect(slugify('Café Ünïcode (2nd)')).toBe('cafe-unicode-2nd');
  });

  it('uses the slug field when present and derives it otherwise', () => {
    const store = mapStore(raw);
    expect(store.countries.map(c => c.slug)).toEqual(['scotland', 'united-states', 'atlantis']);
    expect(store.regions[0]!.slug).toBe('islay');
    expect(store.distilleries[0]!.slug).toBe('fake-distillery');
    expect(store.tastings[0]!.slug).toBe('11-cask-finishes');
  });

  it('keeps the oldest duplicate plain and suffixes the others, independent of order', () => {
    const duplicates = [
      entry('Abc123xyz', { name: 'Peaty Party' }, '2024-01-01T00:00:00Z'),
      entry('Def456uvw', { name: 'Peaty Party' }, '2025-01-01T00:00:00Z'),
      entry('Ghi789rst', { name: 'peaty party!', slug: 'peaty-party' }, '2026-01-01T00:00:00Z'),
    ];
    const expected = { Ghi789rst: 'peaty-party', Abc123xyz: 'peaty-party-abc123', Def456uvw: 'peaty-party-def456' };
    for (const order of [duplicates, [...duplicates].reverse()]) {
      const { countries } = mapStore({ ...empty, countries: order });
      const bySlug = Object.fromEntries(order.map((e, i) => [e.sys.id, countries[i]!.slug]));
      expect(bySlug).toEqual(expected);
    }
  });

  it('skips entries without a name or slug', () => {
    expect(mapStore({ ...empty, countries: [entry('x', {})] }).countries).toEqual([]);
  });
});

describe('mapStore', () => {
  const store = mapStore(raw);

  it('degrades gracefully for missing optional fields', () => {
    const atlantis = store.countries[2]!;
    expect(atlantis).toMatchObject({ intro: '', summary: undefined, flag: undefined, image: undefined });
    expect(store.distilleries[1]).toMatchObject({ regionSlug: undefined, town: undefined, founded: undefined, website: undefined, story: '', location: undefined });
    expect(store.tastings.find(t => t.slug === 'met-regio')).toMatchObject({ location: undefined, summary: undefined, photos: [], image: undefined });
  });

  it('renders rich text and derives teasers', () => {
    expect(store.countries[0]).toMatchObject({ intro: '<p><b>Land of single malt.</b></p>', summary: 'Land of single malt.' });
    expect(store.whiskies[0]!.notes).toBe('<p><b>Rook</b></p>');
    expect(store.tastings[0]!.summary).toBe('Een avond over vaten.');
  });

  it('truncates long teasers at a word boundary', () => {
    const long = Array.from({ length: 60 }, () => 'woord').join(' ');
    const result = teaser(long)!;
    expect(result.length).toBeLessThanOrEqual(141);
    expect(result.endsWith('woord…')).toBe(true);
    expect(teaser('  ')).toBeUndefined();
  });

  it('prefers an explicit summary over the derived one', () => {
    const [country] = mapStore({ ...empty, countries: [entry('c', { name: 'Japan', summary: 'Eigen tekst', description: doc('Andere tekst') })] }).countries;
    expect(country!.summary).toBe('Eigen tekst');
  });

  it('normalises asset urls and takes the first tasting image as cover', () => {
    expect(store.distilleries[0]!.image).toBe('https://images.example.test/d1.jpg');
    expect(store.tastings[0]!.photos).toEqual(['https://images.example.test/t1a.jpg', 'https://images.example.test/t1b.jpg']);
    expect(store.tastings[0]!.image).toBe('https://images.example.test/t1a.jpg');
  });

  it('prefers the featured image, then the first gallery image, otherwise none', () => {
    const cover = (fields: Record<string, unknown>) =>
      mapStore({ ...empty, tastings: [entry('t', { name: 'T', date: '2024-01-01T17:00+01:00', ...fields })] }).tastings[0]!;
    const images = [asset('//images.example.test/g1.jpg'), asset('//images.example.test/g2.jpg')];
    const featured = cover({ featuredImage: asset('//images.example.test/f.jpg'), images });
    expect(featured.image).toBe('https://images.example.test/f.jpg');
    expect(featured.photos).toHaveLength(2);
    expect(cover({ images }).image).toBe('https://images.example.test/g1.jpg');
    expect(cover({}).image).toBeUndefined();
  });

  it('resolves links by entry id and ignores unresolvable ones', () => {
    expect(store.regions[0]!.countrySlug).toBe('scotland');
    expect(store.whiskies[0]).toMatchObject({ distillerySlugs: ['fake-distillery'], countrySlug: 'scotland', regionSlug: undefined });
    expect(store.tastings[0]!.whiskySlugs).toEqual(['fake-10-years']);
    expect(store.reviews.map(r => [r.title, r.whiskySlug])).toEqual([['Mooi', 'fake-10-years'], ['Goed', 'fake-10-years']]);
  });

  it('reads the distillery of a whisky from the single distillery field and skips an unresolved link', () => {
    const whiskies = (fields: Record<string, unknown>) => mapStore({ ...raw, whiskies: [entry('w9', { name: 'Mix', ...fields })] }).whiskies[0]!;
    expect(whiskies({ distillery: link('d1') }).distillerySlugs).toEqual(['fake-distillery']);
    expect(whiskies({ distillery: link('gone') }).distillerySlugs).toEqual([]);
    expect(whiskies({}).distillerySlugs).toEqual([]);
  });

  it('maps the brand and ignores a blank one', () => {
    expect(mapStore({ ...raw, whiskies: [entry('w9', { name: 'B', brand: ' Foggy Quay ' }), entry('w8', { name: 'C', brand: ' ' })] }).whiskies.map(w => w.brand)).toEqual(['Foggy Quay', undefined]);
  });

  it('maps whisky facts', () => {
    expect(store.whiskies[0]).toMatchObject({ age: 10, isNas: false, abv: 40.5, casks: ['Bourbon', 'Sherry'] });
    expect(store.whiskies[1]).toMatchObject({ age: undefined, isNas: true, casks: [] });
  });

  it('skips tastings without a date', () => {
    expect(store.tastings.map(t => t.title)).toEqual(['#11 Cask finishes', 'Met regio']);
  });

  it('maps the optional trips model', () => {
    const { trips } = mapStore({
      ...raw,
      trips: [entry('p1', {
        name: 'Islay 2027',
        startDate: '2027-06-12T00:00+02:00',
        endDate: '2027-06-15',
        summary: 'Kort',
        report: doc('Verslag'),
        photos: [asset('//images.example.test/p1.jpg')],
        regions: [link('r1')],
        distilleries: [link('d1')],
        seoDescription: 'Seo',
      })],
    });
    expect(trips[0]).toMatchObject({
      slug: 'islay-2027',
      title: 'Islay 2027',
      startDate: '2027-06-12',
      endDate: '2027-06-15',
      summary: 'Kort',
      report: '<p><b>Verslag</b></p>',
      image: 'https://images.example.test/p1.jpg',
      regionSlugs: ['islay'],
      distillerySlugs: ['fake-distillery'],
      seoDescription: 'Seo',
    });
  });

  it('looks up flags by English country name', () => {
    expect(store.countries.map(c => c.flag)).toEqual([flagForCountry('Scotland'), flagForCountry('United States'), undefined]);
    expect(flagForCountry('Japan')).toBe('🇯🇵');
    expect(flagForCountry('Scotland')).toBe('🏴󠁧󠁢󠁳󠁣󠁴󠁿');
  });
});

describe('queries on mapped content', () => {
  const store = mapStore(raw);
  const now = new Date('2026-11-23T12:00:00+01:00');

  it('averages reviews and lists them on the whisky', () => {
    const detail = getWhiskyDetail(store, 'fake-10-years', now)!;
    expect(detail.whisky).toMatchObject({ reviewCount: 2, averageRating: 4.5 });
    expect(detail.reviews).toHaveLength(2);
    const unrated = getWhiskyDetail(store, 'fake-nas', now)!;
    expect(unrated.whisky).toMatchObject({ reviewCount: 0, averageRating: undefined });
    expect(unrated.reviews).toEqual([]);
  });

  it('adds the region and country of the distillery to those of the whisky', () => {
    const whisky = getWhiskyDetail(store, 'fake-nas', now)!.whisky;
    expect(whisky.regions.map(r => r.slug)).toEqual(['islay']);
    expect(whisky.countries.map(c => c.slug)).toEqual(['scotland']);
  });

  it('shows a whisky of distilleries from several countries in each of them', () => {
    const blend = {
      ...mapStore({ ...raw, whiskies: [entry('w9', { name: 'Mix', distillery: link('d1') })] }),
    };
    blend.whiskies = blend.whiskies.map(w => ({ ...w, distillerySlugs: ['fake-distillery', 'regionless'] }));
    expect(getWhiskyDetail(blend, 'mix', now)!.whisky.countries.map(c => c.slug)).toEqual(['scotland', 'united-states']);
    expect(getHome(blend, now).countries.map(c => c.slug)).toEqual(['scotland', 'united-states']);
  });

  it('keeps distilleries without region under their country', () => {
    const paths = getSitemapPaths(store);
    expect(paths).toContain('/distilleries/regionless');
    expect(paths).toContain('/countries/scotland/islay');
  });

  it('handles tastings with many, duplicate and no place links and hides upcoming whiskies', () => {
    const tastings = getTastings(store, now);
    const withRegions = tastings.find(t => t.slug === 'met-regio')!;
    expect(withRegions).toMatchObject({ isUpcoming: true, whiskies: [] });
    expect(withRegions.regions.map(r => r.slug)).toEqual(['islay', 'kentucky']);
    expect(withRegions.countries.map(c => c.slug)).toEqual(['scotland']);
    const without = tastings.find(t => t.slug === '11-cask-finishes')!;
    expect(without.regions).toEqual([]);
    expect(without.countries).toEqual([]);
    expect(without.whiskies.map(w => w.slug)).toEqual(['fake-10-years']);
    expect(getHome(store, now).nextTasting?.slug).toBe('met-regio');
  });

  it('lists a tasting on a country page through its linked region', () => {
    expect(getCountryDetail(store, 'united-states', now)!.tastings.map(t => t.slug)).toEqual(['met-regio']);
    expect(getCountryDetail(store, 'scotland', now)!.tastings.map(t => t.slug)).toEqual(['met-regio']);
    expect(getRegionDetail(store, 'scotland', 'islay', now)!.tastings.map(t => t.slug)).toEqual(['met-regio']);
  });

  it('has no trips without a trips type', () => {
    expect(getHome(store, now).trips).toEqual([]);
  });
});

describe('fetchContentfulStore', () => {
  beforeEach(() => {
    client.getContentTypes.mockReset();
    client.getEntries.mockReset();
  });

  it('does not query content types the space does not have', async () => {
    client.getContentTypes.mockResolvedValue({ items: ['countries', 'regions'].map(id => ({ sys: { id } })) });
    client.getEntries.mockImplementation(async ({ content_type: type }: { content_type: string }) => ({
      items: type === 'countries' ? [entry('c1', { name: 'Scotland' })] : [],
    }));

    const store = await fetchContentfulStore({ spaceId: 's', environment: 'master', accessToken: 't', preview: false });

    expect(client.getEntries.mock.calls.map(([query]) => query.content_type).sort()).toEqual(['countries', 'regions']);
    expect(store.countries.map(c => c.slug)).toEqual(['scotland']);
    expect(store.trips).toEqual([]);
  });
});
