import { describe, expect, it } from 'vitest';
import type { ContentStore } from '#shared/types/content';
import { loadFixtureStore } from '../server/utils/content/fixtures';
import {
  getCountries, getCountryDetail, getDistilleryDetail, getHome, getRegionDetail, getTastings, getTrips, getWhiskyDetail,
} from '../server/utils/content/queries';
import { placeTag, tastingPlaces } from '../app/utils/places';
import { isUpcoming } from '../shared/utils/events';

const store = loadFixtureStore();
const now = new Date('2026-11-23T12:00:00+01:00');

describe('events', () => {
  it('derives upcoming from the date', () => {
    expect(isUpcoming('2026-12-12T20:00:00+01:00', now)).toBe(true);
    expect(isUpcoming('2026-11-07T20:00:00+01:00', now)).toBe(false);
  });
});

describe('queries', () => {
  it('splits fixture tastings into 1 upcoming and 4 past', () => {
    const tastings = getTastings(store, now);
    expect(tastings.filter(t => t.isUpcoming)).toHaveLength(1);
    expect(tastings.filter(t => !t.isUpcoming)).toHaveLength(4);
  });

  it('lists tastings newest first, the upcoming one before the past ones', () => {
    expect(getTastings(store, now).map(t => t.slug)).toEqual([
      'islay-night-rook-en-zeewind', 'turf-of-geen-turf', 'raad-de-dram', 'speyside-sherrybommen', 'japanse-finesse',
    ]);
  });

  it('turns upcoming tastings into past ones when time passes', () => {
    const later = new Date('2027-03-01T00:00:00+01:00');
    expect(getTastings(store, later).every(t => !t.isUpcoming)).toBe(true);
    expect(getHome(store, later).nextTasting).toBeUndefined();
  });

  it('picks the hero tasting for the home page and leaves it out of the list', () => {
    const home = getHome(store, now);
    expect(home.nextTasting?.slug).toBe('islay-night-rook-en-zeewind');
    expect(home.latestTasting?.slug).toBe('turf-of-geen-turf');
    expect(home.tastings.map(t => t.slug)).toEqual(['turf-of-geen-turf', 'raad-de-dram', 'speyside-sherrybommen']);
    expect(home.trips.map(t => t.slug)).toEqual(['japan-van-yamazaki-tot-yoichi', 'islay-pelgrimage']);
  });

  it('counts what exists for the home stats', () => {
    expect(getHome(store, now).stats).toEqual({ tastings: 5, countries: 4, whiskies: 16, distilleries: 17, trips: 3 });
  });

  it('leaves out countries without content and entities that cannot be shown from the stats', () => {
    const sparse: ContentStore = {
      ...store,
      countries: [...store.countries, { ...store.countries[0]!, slug: 'empty-land', name: 'Empty land' }],
      whiskies: [...store.whiskies, { ...store.whiskies[0]!, slug: 'dangling', distillerySlugs: ['nowhere'] }],
      trips: [],
    };
    expect(getHome(sparse, now).stats).toMatchObject({ countries: 4, whiskies: 16, trips: 0 });
  });

  it('resolves whiskies, distillery and region of a past tasting', () => {
    const speyside = getTastings(store, now).find(t => t.slug === 'speyside-sherrybommen')!;
    expect(speyside.whiskies.map(w => w.name)).toContain('Glenfarclas 15');
    expect(speyside.whiskies[0]!.countries.map(c => c.slug)).toEqual(['schotland']);
    expect(speyside.regions.map(r => r.slug)).toEqual(['speyside']);
    expect(speyside.countries.map(c => c.slug)).toEqual(['schotland']);
  });

  it('caps place tags on cards and shows nothing without places', () => {
    const multi = getTastings(store, now).find(t => t.slug === 'turf-of-geen-turf')!;
    expect(placeTag(tastingPlaces(multi), 2)).toBe('Islay · Munster +1');
    expect(placeTag(tastingPlaces(multi))).toBe('Islay · Munster · Honshu');
    expect(placeTag([])).toBeUndefined();
  });

  it('links a tasting to several regions across countries, or to none', () => {
    const tastings = getTastings(store, now);
    const multi = tastings.find(t => t.slug === 'turf-of-geen-turf')!;
    expect(multi.regions.map(r => r.country.slug)).toEqual(['schotland', 'ierland', 'japan']);
    expect(multi.countries).toEqual([]);
    const none = tastings.find(t => t.slug === 'raad-de-dram')!;
    expect(none.regions).toEqual([]);
    expect(none.countries).toEqual([]);
    expect(getCountryDetail(store, 'japan', now)!.tastings.map(t => t.slug)).toEqual(['turf-of-geen-turf', 'japanse-finesse']);
    expect(getRegionDetail(store, 'ierland', 'munster', now)!.tastings.map(t => t.slug)).toEqual(['turf-of-geen-turf']);
  });

  it('never exposes whiskies of upcoming tastings', () => {
    const leaky: ContentStore = {
      ...store,
      tastings: store.tastings.map(t => ({ ...t, whiskySlugs: ['ardbeg-10', 'laphroaig-10'] })),
    };
    for (const tasting of getTastings(leaky, now).filter(t => t.isUpcoming)) {
      expect(tasting.whiskySlugs).toEqual([]);
      expect(tasting.whiskies).toEqual([]);
    }
    expect(getTastings(leaky, now).filter(t => !t.isUpcoming).every(t => t.whiskies.length === 2)).toBe(true);
    expect(getWhiskyDetail(leaky, 'ardbeg-10', now)!.tastings.every(t => !t.isUpcoming)).toBe(true);
    expect(getDistilleryDetail(leaky, 'ardbeg', now)!.tastings.every(t => !t.isUpcoming)).toBe(true);
  });

  it('has no price or capacity in the tasting view', () => {
    for (const tasting of getTastings(store, now)) {
      expect(tasting).not.toHaveProperty('price');
      expect(tasting).not.toHaveProperty('maxParticipants');
      expect(tasting).not.toHaveProperty('status');
    }
  });

  it('lists tastings of a region and its country, upcoming and past', () => {
    expect(getRegionDetail(store, 'schotland', 'islay', now)!.tastings.map(t => t.slug)).toEqual(['islay-night-rook-en-zeewind', 'turf-of-geen-turf']);
    expect(getCountryDetail(store, 'schotland', now)!.tastings.map(t => t.slug))
      .toEqual(['islay-night-rook-en-zeewind', 'turf-of-geen-turf', 'speyside-sherrybommen']);
  });

  it('falls back to the latest tasting in the hero when none is upcoming and does not repeat it in the list', () => {
    const past: ContentStore = { ...store, tastings: store.tastings.filter(t => !isUpcoming(t.date, now)) };
    const home = getHome(past, now);
    expect(home.nextTasting).toBeUndefined();
    expect(home.latestTasting?.slug).toBe('turf-of-geen-turf');
    expect(home.tastings.map(t => t.slug)).toEqual(['raad-de-dram', 'speyside-sherrybommen', 'japanse-finesse']);
  });

  it('leaves the list empty when the only tasting is shown in the hero', () => {
    const single: ContentStore = { ...store, tastings: store.tastings.slice(0, 1) };
    expect(getHome(single, now).tastings).toEqual([]);
  });

  it('finds all tastings that pour a whisky of a distillery', () => {
    const detail = getDistilleryDetail(store, 'laphroaig', now)!;
    expect(detail.whiskies.map(w => w.slug)).toEqual(['laphroaig-10', 'harbour-lights-no-3']);
    expect(detail.tastings.map(t => t.slug).sort()).toEqual(['raad-de-dram', 'turf-of-geen-turf']);
    expect(detail.trips.map(t => t.slug)).toEqual(['islay-pelgrimage']);
  });

  it('lists all trips newest first without upcoming state or booking fields', () => {
    const trips = getTrips(store);
    expect(trips.map(t => t.slug)).toEqual(['japan-van-yamazaki-tot-yoichi', 'islay-pelgrimage', 'speyside-stoutmoedig']);
    for (const trip of trips) {
      for (const key of ['isUpcoming', 'price', 'priceNote', 'maxParticipants', 'included', 'status']) {
        expect(trip).not.toHaveProperty(key);
      }
    }
  });

  it('finds trips visiting a region and rejects a mismatched country', () => {
    expect(getRegionDetail(store, 'schotland', 'speyside', now)!.trips.map(t => t.slug)).toEqual(['speyside-stoutmoedig']);
    expect(getRegionDetail(store, 'japan', 'speyside', now)).toBeUndefined();
  });

  it('lists tastings and siblings for a whisky', () => {
    const detail = getWhiskyDetail(store, 'ardbeg-10', now)!;
    expect(detail.tastings.map(t => t.slug)).toEqual(['turf-of-geen-turf']);
    expect(detail.siblings.map(w => w.slug)).toEqual(['foggy-quay-smoke-and-sherry']);
    expect(getWhiskyDetail(store, 'nope', now)).toBeUndefined();
  });

  it('lists at most three other whiskies of the distillery as siblings, and tastings newest first', () => {
    const ardbeg = store.whiskies.find(w => w.slug === 'ardbeg-10')!;
    const more = ['a', 'b', 'c', 'd'].map(slug => ({ ...ardbeg, slug: `ardbeg-${slug}`, name: `Ardbeg ${slug}` }));
    const crowded: ContentStore = { ...store, whiskies: [...store.whiskies, ...more] };
    expect(getWhiskyDetail(crowded, 'ardbeg-10', now)!.siblings.map(w => w.slug)).toEqual(['foggy-quay-smoke-and-sherry', 'ardbeg-a', 'ardbeg-b']);
    const pouredTwice: ContentStore = { ...store, tastings: store.tastings.map(t => ({ ...t, whiskySlugs: ['ardbeg-10'] })) };
    const dates = getWhiskyDetail(pouredTwice, 'ardbeg-10', now)!.tastings.map(t => Date.parse(t.date));
    expect(dates.length).toBeGreaterThan(1);
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  it('has no tastings for a whisky that was never poured', () => {
    expect(getWhiskyDetail(store, 'buffalo-trace-bourbon', now)!.tastings.map(t => t.slug)).toEqual(['raad-de-dram']);
    expect(getWhiskyDetail({ ...store, tastings: [] }, 'ardbeg-10', now)!.tastings).toEqual([]);
  });

  it('skips entities with dangling references instead of failing', () => {
    const broken: ContentStore = { ...store, distilleries: [{ ...store.distilleries[0]!, regionSlug: 'nowhere' }] };
    expect(getTrips(broken)[0]!.distilleries).toEqual([]);
  });
});

describe('blends', () => {
  const view = (slug: string) => getWhiskyDetail(store, slug, now)!;

  it('treats a whisky with more than one distillery as a blend', () => {
    expect(view('foggy-quay-smoke-and-sherry').whisky).toMatchObject({ isBlend: true, brand: 'Foggy Quay' });
    expect(view('foggy-quay-smoke-and-sherry').whisky.distilleries.map(d => d.slug)).toEqual(['ardbeg', 'glenfarclas', 'springbank']);
    expect(view('harbour-lights-no-3').whisky.brand).toBeUndefined();
    expect(view('ardbeg-10').whisky).toMatchObject({ isBlend: false });
    expect(view('ardbeg-10').whisky.distilleries.map(d => d.slug)).toEqual(['ardbeg']);
  });

  it('derives countries and regions from all distilleries, without duplicates', () => {
    const blend = view('foggy-quay-smoke-and-sherry').whisky;
    expect(blend.countries.map(c => c.slug)).toEqual(['schotland']);
    expect(blend.regions.map(r => r.slug)).toEqual(['islay', 'speyside', 'campbeltown']);
    expect(view('ardbeg-10').whisky.regions.map(r => r.slug)).toEqual(['islay']);
  });

  it('adds the own country and region of a whisky in front of those of its distilleries', () => {
    const own: ContentStore = { ...store, whiskies: store.whiskies.map(w => (w.slug === 'ardbeg-10' ? { ...w, regionSlug: 'speyside' } : w)) };
    expect(getWhiskyDetail(own, 'ardbeg-10', now)!.whisky.regions.map(r => r.slug)).toEqual(['speyside', 'islay']);
  });

  it('lists blends with every distillery they contain', () => {
    expect(getDistilleryDetail(store, 'caol-ila', now)!.whiskies.map(w => [w.slug, w.isBlend])).toEqual([['caol-ila-12', false], ['harbour-lights-no-3', true]]);
    expect(getDistilleryDetail(store, 'ardbeg', now)!.distillery.whiskyCount).toBe(2);
  });

  it('shows other whiskies of the same brand first, otherwise those that share a distillery', () => {
    const sibling = { ...store.whiskies.find(w => w.slug === 'harbour-lights-no-3')!, slug: 'foggy-quay-2', brand: 'foggy QUAY' };
    const branded: ContentStore = { ...store, whiskies: [...store.whiskies, sibling] };
    expect(getWhiskyDetail(branded, 'foggy-quay-smoke-and-sherry', now)!.siblings.map(w => w.slug)).toEqual(['foggy-quay-2']);
    expect(getWhiskyDetail(store, 'foggy-quay-smoke-and-sherry', now)!.siblings.map(w => w.slug)).toEqual(['ardbeg-10', 'glenfarclas-15', 'springbank-10']);
    expect(getWhiskyDetail(store, 'harbour-lights-no-3', now)!.siblings.map(w => w.slug)).toEqual(['lagavulin-16', 'laphroaig-10', 'caol-ila-12']);
    expect(getWhiskyDetail(store, 'yamazaki-12', now)!.siblings).toEqual([]);
  });

  it('skips distilleries that do not exist and whiskies without any', () => {
    const [ardbeg, foggy] = [store.whiskies[0]!, store.whiskies.find(w => w.slug === 'foggy-quay-smoke-and-sherry')!];
    const broken: ContentStore = {
      ...store,
      whiskies: [{ ...foggy, distillerySlugs: ['ardbeg', 'nowhere'] }, { ...ardbeg, slug: 'orphan', distillerySlugs: [] }],
    };
    expect(getWhiskyDetail(broken, foggy.slug, now)!.whisky).toMatchObject({ isBlend: false, distilleries: [{ slug: 'ardbeg' }] });
    expect(getWhiskyDetail(broken, 'orphan', now)).toBeUndefined();
  });
});

describe('home countries', () => {
  const country = (slug: string, name: string) => ({ slug, name, intro: '' });
  const base: ContentStore = {
    countries: [
      country('zweden', 'Zweden'),
      country('region-only', 'Regio'),
      country('whisky-only', 'whisky'),
      country('tasting-only', 'Évora'),
      country('empty', 'Leeg'),
      country('direct', 'Ierland'),
    ],
    regions: [
      { slug: 'r-regio', name: 'R1', countrySlug: 'region-only', intro: '', flavourProfile: [] },
      { slug: 'r-tasting', name: 'R2', countrySlug: 'tasting-only', intro: '', flavourProfile: [] },
    ],
    distilleries: [{ slug: 'd', name: 'D', countrySlug: 'whisky-only', story: '' }],
    whiskies: [{ slug: 'w', name: 'W', distillerySlugs: ['d'], isNas: true, casks: [], notes: '' }],
    reviews: [],
    tastings: [
      { slug: 't1', title: 'T1', date: '2020-01-01T20:00:00+01:00', whiskySlugs: [], countrySlugs: [], regionSlugs: ['r-tasting'], description: '', photos: [] },
      { slug: 't2', title: 'T2', date: '2020-01-01T20:00:00+01:00', whiskySlugs: [], countrySlugs: ['direct'], regionSlugs: [], description: '', photos: [] },
    ],
    trips: [],
  };

  it('lists only countries with content, alphabetically and case-insensitively', () => {
    expect(getHome(base, now).countries.map(c => c.slug)).toEqual(['tasting-only', 'direct', 'region-only', 'whisky-only']);
  });

  it('counts each kind of content separately', () => {
    const only = (patch: Partial<ContentStore>) => getHome({ ...base, regions: [], distilleries: [], whiskies: [], tastings: [], ...patch }, now).countries.map(c => c.slug);
    expect(only({ regions: [base.regions[0]!] })).toEqual(['region-only']);
    expect(only({ distilleries: base.distilleries })).toEqual(['whisky-only']);
    expect(only({ whiskies: base.whiskies, distilleries: base.distilleries })).toEqual(['whisky-only']);
    expect(only({ tastings: [base.tastings[1]!] })).toEqual(['direct']);
  });

  it('keeps all countries on the countries page, sorted too', () => {
    expect(getCountries(base).map(c => c.name)).toEqual(['Évora', 'Ierland', 'Leeg', 'Regio', 'whisky', 'Zweden']);
  });
});
