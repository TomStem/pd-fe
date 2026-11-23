import { createClient } from 'contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { BLOCKS, type Document } from '@contentful/rich-text-types';
import type {
  ContentStore, Country, Distillery, Region, Review, Seo, Tasting, Trip, TripDay, Whisky,
} from '#shared/types/content';
import { flagForCountry } from './flags';
import { slugify, teaser } from './text';

export interface ContentfulSource {
  spaceId: string;
  environment: string;
  accessToken: string;
  preview: boolean;
}

type Fields = Record<string, unknown>;

interface Entry {
  sys: { id: string; createdAt?: string };
  fields: Fields;
}

const CONTENT_TYPES = ['countries', 'regions', 'distilleries', 'whiskies', 'reviews', 'tastings', 'trips'] as const;

type ContentType = (typeof CONTENT_TYPES)[number];
export type RawContent = Record<ContentType, Entry[]>;

type SlugOf = (link: unknown) => string | undefined;

const isString = (value: unknown): value is string => typeof value === 'string';
const isDefined = <T>(value: T | undefined): value is T => value !== undefined;

function fieldsOf(entry: unknown): Fields | undefined {
  return entry && typeof entry === 'object' && 'fields' in entry ? (entry as { fields: Fields }).fields : undefined;
}

const text = (value: unknown, fallback = '') => (isString(value) ? value : fallback);
const optionalText = (value: unknown) => (isString(value) && value.trim() ? value.trim() : undefined);
const optionalNumber = (value: unknown) => (typeof value === 'number' ? value : undefined);
const html = (doc: unknown) => (doc ? documentToHtmlString(doc as Document) : '');
const slugsOf = (links: unknown, slugOf: SlugOf) => (Array.isArray(links) ? links.map(slugOf).filter(isDefined) : []);
const strings = (value: unknown) => (Array.isArray(value) ? value.filter(isString) : []);

const blockTypes = new Set<string>(Object.values(BLOCKS));

function plainText(node: unknown): string {
  const { value, content, nodeType } = (node ?? {}) as { value?: unknown; content?: unknown[]; nodeType?: string };
  if (isString(value)) return value;
  const inner = Array.isArray(content) ? content.map(plainText).join('') : '';
  return nodeType && blockTypes.has(nodeType) ? `${inner} ` : inner;
}

const summaryOf = (f: Fields) => optionalText(f.summary) ?? teaser(plainText(f.description));

function assetUrl(asset: unknown): string | undefined {
  const file = fieldsOf(asset)?.file as { url?: string } | undefined;
  if (!file?.url) return undefined;
  return file.url.startsWith('//') ? `https:${file.url}` : file.url;
}

const assetUrls = (assets: unknown) => (Array.isArray(assets) ? assets.map(assetUrl).filter(isDefined) : []);

function seo(f: Fields): Seo {
  return { seoTitle: optionalText(f.seoTitle), seoDescription: optionalText(f.seoDescription), ogImage: assetUrl(f.ogImage) };
}

function itinerary(value: unknown): TripDay[] {
  if (!Array.isArray(value)) return [];
  return value.map(item => ({
    day: Number(item?.day) || 0,
    title: text(item?.title),
    text: text(item?.text),
  }));
}

/** Countries, distilleries, whiskies, tastings and trips are named `name`; regions `regionName`. */
const nameOf = (f: Fields) => optionalText(f.name) ?? optionalText(f.regionName);

/**
 * Slug per entry id: the `slug` field when present, otherwise derived from the name.
 * Explicit slugs claim theirs first, then the oldest entry; later duplicates get a short id fragment.
 */
function assignSlugs(entries: Entry[]): Map<string, string> {
  const candidates = entries
    .flatMap(({ sys, fields }) => {
      const explicit = optionalText(fields.slug);
      const base = explicit ?? slugify(nameOf(fields) ?? '');
      return base ? [{ id: sys.id, createdAt: sys.createdAt ?? '', explicit: explicit !== undefined, base }] : [];
    })
    .sort((a, b) => Number(b.explicit) - Number(a.explicit) || a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));

  const taken = new Set<string>();
  const slugs = new Map<string, string>();
  for (const { id, base } of candidates) {
    const slug = taken.has(base) ? `${base}-${slugify(id).slice(0, 6)}` : base;
    taken.add(slug);
    slugs.set(id, slug);
  }
  return slugs;
}

const mapCountry = (f: Fields, slug: string): Country => {
  const name = nameOf(f)!;
  return {
    ...seo(f),
    slug,
    name,
    flag: optionalText(f.flag) ?? flagForCountry(name),
    intro: html(f.description),
    summary: summaryOf(f),
    image: assetUrl(f.image),
  };
};

const mapRegion = (f: Fields, slug: string, slugOf: SlugOf): Region => ({
  ...seo(f),
  slug,
  name: nameOf(f)!,
  countrySlug: slugOf(f.country) ?? '',
  summary: summaryOf(f),
  intro: html(f.description),
  flavourProfile: strings(f.flavourProfile),
  image: assetUrl(f.image),
});

const mapDistillery = (f: Fields, slug: string, slugOf: SlugOf): Distillery => {
  const { lat, lon } = (f.location ?? {}) as { lat?: unknown; lon?: unknown };
  return {
    ...seo(f),
    slug,
    name: nameOf(f)!,
    countrySlug: slugOf(f.country),
    regionSlug: slugOf(f.region),
    town: optionalText(f.town),
    location: typeof lat === 'number' && typeof lon === 'number' ? { lat, lng: lon } : undefined,
    founded: optionalNumber(f.founded),
    summary: summaryOf(f),
    story: html(f.description),
    website: optionalText(f.website),
    image: assetUrl(f.image),
    visitable: typeof f.visitable === 'boolean' ? f.visitable : undefined,
  };
};

const mapWhisky = (f: Fields, slug: string, slugOf: SlugOf): Whisky => ({
  ...seo(f),
  slug,
  name: nameOf(f)!,
  distillerySlug: slugOf(f.distillery) ?? '',
  countrySlug: slugOf(f.country),
  regionSlug: slugOf(f.region),
  age: optionalNumber(f.age),
  isNas: f.isNas === true,
  abv: optionalNumber(f.alcoholPercentage),
  casks: strings(f.cask),
  notes: html(f.notes),
  image: assetUrl(f.image),
});

function mapReview({ sys, fields: f }: Entry, slugOf: SlugOf): Review[] {
  const whiskySlug = slugOf(f.whisky);
  const rating = optionalNumber(f.rating);
  const title = optionalText(f.title);
  if (!whiskySlug || rating === undefined || !title) return [];
  return [{ id: sys.id, title, rating: Math.min(5, Math.max(1, Math.round(rating))), description: html(f.description), whiskySlug }];
}

const mapTasting = (f: Fields, slug: string, slugOf: SlugOf): Tasting => {
  const photos = assetUrls(f.images);
  return {
    ...seo(f),
    slug,
    title: nameOf(f)!,
    date: text(f.date),
    location: optionalText(f.location),
    whiskySlugs: slugsOf(f.whiskies, slugOf),
    countrySlugs: slugsOf(f.countries, slugOf),
    regionSlugs: slugsOf(f.regions, slugOf),
    summary: summaryOf(f),
    description: html(f.description),
    report: f.report ? html(f.report) : undefined,
    photos,
    image: assetUrl(f.featuredImage) ?? photos[0],
  };
};

const mapTrip = (f: Fields, slug: string, slugOf: SlugOf): Trip => {
  const photos = assetUrls(f.photos);
  const startDate = text(f.startDate).slice(0, 10);
  return {
    ...seo(f),
    slug,
    title: nameOf(f)!,
    startDate,
    endDate: text(f.endDate).slice(0, 10) || startDate,
    regionSlugs: slugsOf(f.regions, slugOf),
    distillerySlugs: slugsOf(f.distilleries, slugOf),
    itinerary: itinerary(f.itinerary),
    summary: optionalText(f.summary),
    report: html(f.report),
    photos,
    image: photos[0],
  };
};

/** Maps raw Contentful entries onto the domain; entries that cannot be shown (no name, no date) are skipped. */
export function mapStore(raw: RawContent): ContentStore {
  const slugs = new Map<string, string>();
  for (const type of CONTENT_TYPES) assignSlugs(raw[type]).forEach((slug, id) => slugs.set(id, slug));
  const slugOf: SlugOf = link => slugs.get((link as Partial<Entry> | undefined)?.sys?.id ?? '');

  const mapAll = <T>(type: ContentType, mapper: (fields: Fields, slug: string) => T) =>
    raw[type].flatMap(({ sys, fields }) => {
      const slug = slugs.get(sys.id);
      return slug ? [mapper(fields, slug)] : [];
    });

  return {
    countries: mapAll('countries', mapCountry),
    regions: mapAll('regions', (f, slug) => mapRegion(f, slug, slugOf)),
    distilleries: mapAll('distilleries', (f, slug) => mapDistillery(f, slug, slugOf)),
    whiskies: mapAll('whiskies', (f, slug) => mapWhisky(f, slug, slugOf)),
    reviews: raw.reviews.flatMap(entry => mapReview(entry, slugOf)),
    tastings: mapAll('tastings', (f, slug) => mapTasting(f, slug, slugOf)).filter(t => t.date),
    trips: mapAll('trips', (f, slug) => mapTrip(f, slug, slugOf)).filter(t => t.startDate),
  };
}

export async function fetchContentfulStore(source: ContentfulSource): Promise<ContentStore> {
  const client = createClient({
    space: source.spaceId,
    environment: source.environment,
    accessToken: source.accessToken,
    host: source.preview ? 'preview.contentful.com' : 'cdn.contentful.com',
  }).withoutUnresolvableLinks;

  // Querying a content type that does not exist is an error, so only ask for the ones the space has.
  const existing = new Set((await client.getContentTypes()).items.map(type => type.sys.id));

  async function load(type: ContentType): Promise<Entry[]> {
    if (!existing.has(type)) return [];
    const { items } = await client.getEntries({ content_type: type, include: 1, limit: 1000 });
    return items as unknown as Entry[];
  }

  const entries = await Promise.all(CONTENT_TYPES.map(load));
  return mapStore(Object.fromEntries(CONTENT_TYPES.map((type, index) => [type, entries[index]])) as RawContent);
}
