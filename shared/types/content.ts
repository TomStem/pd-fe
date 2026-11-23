/**
 * Domain model, independent of Contentful's raw entry shape.
 * References between entities are expressed as slugs. Fields documented as HTML
 * are rendered server-side (Contentful rich text or plain fixture text).
 */

export interface Seo {
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
}

export interface Country extends Seo {
  slug: string;
  name: string;
  flag?: string;
  /** HTML, empty when the country has no description. */
  intro: string;
  summary?: string;
  image?: string;
}

export interface Region extends Seo {
  slug: string;
  name: string;
  countrySlug: string;
  summary?: string;
  /** HTML, empty when the region has no description. */
  intro: string;
  flavourProfile: string[];
  image?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Distillery extends Seo {
  slug: string;
  name: string;
  /** Falls back to the country of the region when missing. */
  countrySlug?: string;
  regionSlug?: string;
  town?: string;
  location?: Coordinates;
  founded?: number;
  summary?: string;
  /** HTML, empty when the distillery has no description. */
  story: string;
  website?: string;
  image?: string;
  visitable?: boolean;
}

export interface Whisky extends Seo {
  slug: string;
  name: string;
  distillerySlug: string;
  age?: number;
  /** No age statement; shown instead of an age. */
  isNas: boolean;
  abv?: number;
  casks: string[];
  /** HTML, empty when the whisky has no notes. */
  notes: string;
  /** Falls back to the country and region of the distillery when missing. */
  countrySlug?: string;
  regionSlug?: string;
  image?: string;
}

export interface Review {
  id: string;
  title: string;
  /** 1 to 5 */
  rating: number;
  /** HTML, empty when the review has no text. */
  description: string;
  whiskySlug: string;
}

export interface Tasting extends Seo {
  slug: string;
  title: string;
  /** ISO 8601 with offset. Upcoming vs. past is derived from this. */
  date: string;
  location?: string;
  /** Only shared after the tasting has taken place; stripped from upcoming tastings in the content layer. */
  whiskySlugs: string[];
  /** Countries and regions the theme is about; none, one or many. */
  countrySlugs: string[];
  regionSlugs: string[];
  summary?: string;
  /** HTML, empty when the tasting has no description. */
  description: string;
  /** HTML */
  report?: string;
  /** Gallery. */
  photos: string[];
  /** Cover: the featured image, otherwise the first photo. */
  image?: string;
}

export interface TripDay {
  day: number;
  title: string;
  text: string;
}

export interface Trip extends Seo {
  slug: string;
  title: string;
  /** ISO date (YYYY-MM-DD) */
  startDate: string;
  /** ISO date (YYYY-MM-DD) */
  endDate: string;
  regionSlugs: string[];
  distillerySlugs: string[];
  /** Optional day-by-day report. */
  itinerary: TripDay[];
  summary?: string;
  /** HTML */
  report: string;
  photos: string[];
  /** First photo. */
  image?: string;
}

export interface ContentStore {
  countries: Country[];
  regions: Region[];
  distilleries: Distillery[];
  whiskies: Whisky[];
  reviews: Review[];
  tastings: Tasting[];
  trips: Trip[];
}
