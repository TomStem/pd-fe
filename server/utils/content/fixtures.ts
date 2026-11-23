import countries from '../../../content/fixtures/countries.json';
import regions from '../../../content/fixtures/regions.json';
import distilleries from '../../../content/fixtures/distilleries.json';
import whiskies from '../../../content/fixtures/whiskies.json';
import reviews from '../../../content/fixtures/reviews.json';
import tastings from '../../../content/fixtures/tastings.json';
import trips from '../../../content/fixtures/trips.json';
import type { ContentStore, Country, Distillery, Region, Review, Tasting, Trip, Whisky } from '#shared/types/content';
import { plainTextToHtml } from './text';

type RawTasting = (typeof tastings)[number] & { report?: string };
type RawReview = (typeof reviews)[number] & { description?: string };

export function loadFixtureStore(): ContentStore {
  return {
    countries: countries.map(c => ({ ...c, intro: plainTextToHtml(c.intro) })) as Country[],
    regions: regions.map(r => ({ ...r, intro: plainTextToHtml(r.intro) })) as Region[],
    distilleries: distilleries.map(d => ({ ...d, story: plainTextToHtml(d.story) })) as Distillery[],
    whiskies: whiskies.map(w => ({ ...w, notes: plainTextToHtml(w.notes) })) as Whisky[],
    reviews: reviews.map((r: RawReview) => ({ ...r, description: plainTextToHtml(r.description ?? '') })) as Review[],
    tastings: tastings.map((t: RawTasting) => ({
      ...t,
      description: plainTextToHtml(t.description),
      report: t.report && plainTextToHtml(t.report),
    })) as Tasting[],
    trips: trips.map(t => ({ ...t, report: plainTextToHtml(t.report) })) as Trip[],
  };
}
