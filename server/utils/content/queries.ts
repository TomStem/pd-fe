import type { ContentStore, Country, Distillery, Region, Tasting, Trip, Whisky } from '#shared/types/content';
import type {
  CountryDetail, CountryRef, CountryView, DistilleryDetail, DistilleryView, HomeData, RegionDetail, RegionRef,
  RegionView, TastingView, TripView, WhiskyDetail, WhiskyView,
} from '#shared/types/views';
import { isUpcoming } from '../../../shared/utils/events';

const isDefined = <T>(value: T | undefined): value is T => value !== undefined;
const collator = new Intl.Collator('en', { sensitivity: 'base' });
const byName = <T extends { name: string }>(items: T[]) => [...items].sort((a, b) => collator.compare(a.name, b.name));
const bySlug = <T extends { slug: string }>(items: T[]) => new Map(items.map(item => [item.slug, item]));

/** Resolves references and reverse lookups over an in-memory content store. */
function createLookup(store: ContentStore, now: Date) {
  const countries = bySlug(store.countries);
  const regions = bySlug(store.regions);
  const distilleries = bySlug(store.distilleries);
  const whiskies = bySlug(store.whiskies);

  const countryRef = (country: Country): CountryRef => ({ slug: country.slug, name: country.name, flag: country.flag });

  const regionRef = (region: Region): RegionRef | undefined => {
    const country = countries.get(region.countrySlug);
    return country && { slug: region.slug, name: region.name, country: countryRef(country) };
  };

  const regionView = (region: Region): RegionView | undefined => {
    const country = countries.get(region.countrySlug);
    return country && {
      ...region,
      country: countryRef(country),
      distilleryCount: store.distilleries.filter(d => d.regionSlug === region.slug).length,
    };
  };

  /** Country and region of an entity; a missing country is taken from its region. */
  const placeOf = ({ countrySlug, regionSlug }: { countrySlug?: string; regionSlug?: string }) => {
    const region = regionSlug ? regions.get(regionSlug) : undefined;
    const country = countries.get(countrySlug ?? region?.countrySlug ?? '');
    return { country: country && countryRef(country), region: region && regionRef(region) };
  };

  const countryView = (country: Country): CountryView => ({
    ...country,
    regionCount: store.regions.filter(r => r.countrySlug === country.slug).length,
    distilleryCount: store.distilleries.filter(d => placeOf(d).country?.slug === country.slug).length,
  });

  const distilleryView = (distillery: Distillery): DistilleryView | undefined => {
    const { country, region } = placeOf(distillery);
    return country && { ...distillery, country, region, whiskyCount: store.whiskies.filter(w => w.distillerySlug === distillery.slug).length };
  };

  const whiskyView = (whisky: Whisky): WhiskyView | undefined => {
    const distillery = distilleries.get(whisky.distillerySlug);
    if (!distillery) return undefined;
    const own = placeOf(whisky);
    const inherited = placeOf(distillery);
    const ratings = store.reviews.filter(r => r.whiskySlug === whisky.slug).map(r => r.rating);
    return {
      ...whisky,
      distillery: { slug: distillery.slug, name: distillery.name },
      country: own.country ?? inherited.country,
      region: own.region ?? inherited.region,
      reviewCount: ratings.length,
      averageRating: ratings.length ? Math.round(ratings.reduce((sum, r) => sum + r, 0) / ratings.length * 10) / 10 : undefined,
    };
  };

  const tastingView = (tasting: Tasting): TastingView => {
    const upcoming = isUpcoming(tasting.date, now);
    const whiskySlugs = upcoming ? [] : tasting.whiskySlugs;
    return {
      ...tasting,
      isUpcoming: upcoming,
      whiskySlugs,
      whiskies: whiskySlugs.map(slug => whiskies.get(slug)).filter(isDefined).map(whiskyView).filter(isDefined),
      countries: [...new Set(tasting.countrySlugs)].map(slug => countries.get(slug)).filter(isDefined).map(countryRef),
      regions: [...new Set(tasting.regionSlugs)].map(slug => regions.get(slug)).filter(isDefined).map(regionRef).filter(isDefined),
    };
  };

  const tripView = (trip: Trip): TripView => ({
    ...trip,
    regions: trip.regionSlugs.map(slug => regions.get(slug)).filter(isDefined).map(regionRef).filter(isDefined),
    distilleries: trip.distillerySlugs.map(slug => distilleries.get(slug)).filter(isDefined).map(distilleryView).filter(isDefined),
  });

  const tastings = () => [...store.tastings].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).map(tastingView);
  const trips = () => [...store.trips].sort((a, b) => b.startDate.localeCompare(a.startDate)).map(tripView);

  return { countries, regions, distilleries, whiskies, regionView, countryView, distilleryView, whiskyView, tastingView, tripView, tastings, trips };
}

export function getHome(store: ContentStore, now = new Date()): HomeData {
  const lookup = createLookup(store, now);
  const tastings = lookup.tastings();
  const withContent = new Set([
    ...store.regions.map(r => r.countrySlug),
    ...store.distilleries.map(d => lookup.distilleryView(d)?.country.slug),
    ...store.whiskies.map(w => lookup.whiskyView(w)?.country?.slug),
    ...tastings.flatMap(t => [...t.countries.map(c => c.slug), ...t.regions.map(r => r.country.slug)]),
  ]);
  const nextTasting = tastings.filter(t => t.isUpcoming).at(-1);
  const latestTasting = tastings.find(t => !t.isUpcoming);
  const hero = nextTasting ?? latestTasting;
  return {
    nextTasting,
    latestTasting,
    tastings: tastings.filter(t => t.slug !== hero?.slug).slice(0, 3),
    trips: lookup.trips().slice(0, 2),
    countries: byName(store.countries.filter(c => withContent.has(c.slug))).map(lookup.countryView),
  };
}

export function getCountries(store: ContentStore): CountryView[] {
  return byName(store.countries).map(createLookup(store, new Date()).countryView);
}

export function getCountryDetail(store: ContentStore, slug: string, now = new Date()): CountryDetail | undefined {
  const lookup = createLookup(store, now);
  const country = lookup.countries.get(slug);
  if (!country) return undefined;
  const regions = store.regions.filter(r => r.countrySlug === slug).map(lookup.regionView).filter(isDefined);
  return {
    country: lookup.countryView(country),
    regions,
    distilleries: store.distilleries.flatMap((d) => {
      const view = lookup.distilleryView(d);
      return view?.country.slug === slug ? [view] : [];
    }),
    tastings: lookup.tastings().filter(t => t.countries.some(c => c.slug === slug) || t.regions.some(r => r.country.slug === slug)),
  };
}

export function getRegionDetail(store: ContentStore, countrySlug: string, regionSlug: string, now = new Date()): RegionDetail | undefined {
  const lookup = createLookup(store, now);
  const region = lookup.regions.get(regionSlug);
  if (!region || region.countrySlug !== countrySlug) return undefined;
  const view = lookup.regionView(region);
  if (!view) return undefined;
  return {
    region: view,
    distilleries: store.distilleries.filter(d => d.regionSlug === regionSlug).map(lookup.distilleryView).filter(isDefined),
    tastings: lookup.tastings().filter(t => t.regions.some(r => r.slug === regionSlug)),
    trips: lookup.trips().filter(t => t.regionSlugs.includes(regionSlug)),
  };
}

export function getDistilleries(store: ContentStore): DistilleryView[] {
  return store.distilleries.map(createLookup(store, new Date()).distilleryView).filter(isDefined);
}

export function getDistilleryDetail(store: ContentStore, slug: string, now = new Date()): DistilleryDetail | undefined {
  const lookup = createLookup(store, now);
  const distillery = lookup.distilleries.get(slug);
  const view = distillery && lookup.distilleryView(distillery);
  if (!view) return undefined;
  const whiskies = store.whiskies.filter(w => w.distillerySlug === slug);
  const whiskySlugs = new Set(whiskies.map(w => w.slug));
  return {
    distillery: view,
    whiskies: whiskies.map(lookup.whiskyView).filter(isDefined),
    tastings: lookup.tastings().filter(t => t.whiskySlugs.some(s => whiskySlugs.has(s))),
    trips: lookup.trips().filter(t => t.distillerySlugs.includes(slug)),
  };
}

export function getWhiskies(store: ContentStore): WhiskyView[] {
  return store.whiskies.map(createLookup(store, new Date()).whiskyView).filter(isDefined);
}

export function getWhiskyDetail(store: ContentStore, slug: string, now = new Date()): WhiskyDetail | undefined {
  const lookup = createLookup(store, now);
  const whisky = lookup.whiskies.get(slug);
  const view = whisky && lookup.whiskyView(whisky);
  if (!view) return undefined;
  return {
    whisky: view,
    reviews: store.reviews.filter(r => r.whiskySlug === slug),
    siblings: store.whiskies.filter(w => w.distillerySlug === whisky.distillerySlug && w.slug !== slug).map(lookup.whiskyView).filter(isDefined),
    tastings: lookup.tastings().filter(t => t.whiskySlugs.includes(slug)),
  };
}

export function getTastings(store: ContentStore, now = new Date()): TastingView[] {
  return createLookup(store, now).tastings();
}

export function getTasting(store: ContentStore, slug: string, now = new Date()): TastingView | undefined {
  const lookup = createLookup(store, now);
  const tasting = store.tastings.find(t => t.slug === slug);
  return tasting && lookup.tastingView(tasting);
}

export function getTrips(store: ContentStore): TripView[] {
  return createLookup(store, new Date()).trips();
}

export function getTrip(store: ContentStore, slug: string): TripView | undefined {
  const lookup = createLookup(store, new Date());
  const trip = store.trips.find(t => t.slug === slug);
  return trip && lookup.tripView(trip);
}

export function getSitemapPaths(store: ContentStore): string[] {
  const countrySlugs = new Set(store.countries.map(c => c.slug));
  const regionPaths = store.regions.filter(r => countrySlugs.has(r.countrySlug)).map(r => `/countries/${r.countrySlug}/${r.slug}`);
  return [
    ...store.tastings.map(t => `/tastings/${t.slug}`),
    ...store.trips.map(t => `/trips/${t.slug}`),
    ...store.countries.map(c => `/countries/${c.slug}`),
    ...regionPaths,
    ...getDistilleries(store).map(d => `/distilleries/${d.slug}`),
    ...getWhiskies(store).map(w => `/whiskies/${w.slug}`),
  ];
}
