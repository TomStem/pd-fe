import { describe, expect, it } from 'vitest';
import { loadFixtureStore } from '../server/utils/content/fixtures';
import { getSitemapPaths } from '../server/utils/content/queries';
import { plainTextToHtml } from '../server/utils/content/text';

const store = loadFixtureStore();

const slugs = (items: { slug: string }[]) => items.map(item => item.slug);
const unique = (values: string[]) => new Set(values).size === values.length;

describe('fixture integrity', () => {
  it('has unique slugs per content type', () => {
    const { reviews: _reviews, ...entities } = store;
    for (const items of Object.values(entities)) expect(unique(slugs(items))).toBe(true);
  });

  it('resolves every reference', () => {
    const countries = new Set(slugs(store.countries));
    const regions = new Set(slugs(store.regions));
    const distilleries = new Set(slugs(store.distilleries));
    const whiskies = new Set(slugs(store.whiskies));

    expect(store.regions.filter(r => !countries.has(r.countrySlug))).toEqual([]);
    expect(store.distilleries.filter(d => d.regionSlug && !regions.has(d.regionSlug))).toEqual([]);
    expect(store.reviews.filter(r => !whiskies.has(r.whiskySlug))).toEqual([]);
    expect(store.whiskies.filter(w => !distilleries.has(w.distillerySlug))).toEqual([]);
    for (const tasting of store.tastings) {
      expect(tasting.whiskySlugs.every(s => whiskies.has(s))).toBe(true);
      expect(tasting.countrySlugs.every(s => countries.has(s))).toBe(true);
      expect(tasting.regionSlugs.every(s => regions.has(s))).toBe(true);
    }
    for (const trip of store.trips) {
      expect(trip.regionSlugs.every(s => regions.has(s))).toBe(true);
      expect(trip.distillerySlugs.every(s => distilleries.has(s))).toBe(true);
    }
  });

  it('has valid coordinates and sequential itineraries', () => {
    for (const { location } of store.distilleries) {
      expect(Math.abs(location!.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(location!.lng)).toBeLessThanOrEqual(180);
    }
    for (const trip of store.trips) {
      expect(trip.itinerary.map(d => d.day)).toEqual(trip.itinerary.map((_, i) => i + 1));
      expect(trip.endDate >= trip.startDate).toBe(true);
    }
  });

  it('contains the expected amount of content', () => {
    expect(store.countries).toHaveLength(4);
    expect(store.tastings).toHaveLength(5);
    expect(store.trips).toHaveLength(3);
  });

  it('has no price, capacity or status on tastings', () => {
    for (const tasting of store.tastings) {
      expect(tasting).not.toHaveProperty('price');
      expect(tasting).not.toHaveProperty('maxParticipants');
      expect(tasting).not.toHaveProperty('status');
    }
  });

  it('lists every detail page in the sitemap', () => {
    const paths = getSitemapPaths(store);
    expect(paths).toContain('/countries/schotland/islay');
    expect(paths).toContain('/whiskies/ardbeg-10');
    expect(unique(paths)).toBe(true);
  });
});

describe('plainTextToHtml', () => {
  it('wraps paragraphs and escapes markup', () => {
    expect(plainTextToHtml('Een & twee\n\n<b>Drie</b>')).toBe('<p>Een &amp; twee</p><p>&lt;b&gt;Drie&lt;/b&gt;</p>');
  });
});
