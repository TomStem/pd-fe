import type { Country, Distillery, Region, Review, Tasting, Trip, Whisky } from './content';

/** API response shapes: domain entities with their references resolved and reverse lookups added. */

export type CountryRef = Pick<Country, 'slug' | 'name' | 'flag'>;

export interface RegionRef {
  slug: string;
  name: string;
  country: CountryRef;
}

export interface CountryView extends Country {
  regionCount: number;
  distilleryCount: number;
}

export interface RegionView extends Region {
  country: CountryRef;
  distilleryCount: number;
}

export interface DistilleryView extends Distillery {
  country: CountryRef;
  region?: RegionRef;
  whiskyCount: number;
}

export interface WhiskyView extends Whisky {
  distillery: Pick<Distillery, 'slug' | 'name'>;
  country?: CountryRef;
  region?: RegionRef;
  reviewCount: number;
  /** Rounded to one decimal; absent without reviews. */
  averageRating?: number;
}

export interface TastingView extends Tasting {
  isUpcoming: boolean;
  whiskies: WhiskyView[];
  /** Explicitly linked countries, without duplicates. */
  countries: CountryRef[];
  /** Linked regions, without duplicates. */
  regions: RegionRef[];
}

export interface TripView extends Trip {
  regions: RegionRef[];
  distilleries: DistilleryView[];
}

export interface HomeData {
  nextTasting?: TastingView;
  tastings: TastingView[];
  trips: TripView[];
  countries: CountryView[];
}

export interface CountryDetail {
  country: CountryView;
  regions: RegionView[];
  distilleries: DistilleryView[];
  tastings: TastingView[];
}

export interface RegionDetail {
  region: RegionView;
  distilleries: DistilleryView[];
  tastings: TastingView[];
  trips: TripView[];
}

export interface DistilleryDetail {
  distillery: DistilleryView;
  whiskies: WhiskyView[];
  tastings: TastingView[];
  trips: TripView[];
}

export interface WhiskyDetail {
  whisky: WhiskyView;
  reviews: Review[];
  siblings: WhiskyView[];
  tastings: TastingView[];
}

export interface TastingDetail {
  tasting: TastingView;
}

export interface TripDetail {
  trip: TripView;
}
