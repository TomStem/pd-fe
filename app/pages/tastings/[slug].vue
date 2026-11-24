<script setup lang="ts">
const route = useRoute();
const data = await useContentFetch<TastingDetail>(`/api/tastings/${route.params.slug}`);
const tasting = computed(() => data.value.tasting);

const crumbs = computed(() => [{ label: 'Tastings', to: '/tastings' }, { label: tasting.value.title }]);
const siteUrl = useSiteConfig().url;

usePageSeo({
  title: tasting.value.title,
  description: tasting.value.summary,
  image: tasting.value.image,
  seo: tasting.value,
});

const eventJsonLd = computed(() => {
  const t = tasting.value;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    'name': t.title,
    'description': t.summary,
    'startDate': t.date,
    'eventStatus': 'https://schema.org/EventScheduled',
    'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
    'location': t.location && {
      '@type': 'Place',
      'name': t.location,
      'address': { '@type': 'PostalAddress', 'addressLocality': t.location, 'addressCountry': 'NL' },
    },
    'image': t.image ? [t.image] : undefined,
    'organizer': { '@type': 'Organization', 'name': 'Pour Decisions', 'url': siteUrl },
  };
});

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: () => JSON.stringify(eventJsonLd.value).replace(/</g, '\\u003c'),
  }],
});
</script>

<template>
  <div class="container-page grid gap-8 py-8 lg:grid-cols-[1.4fr_1fr] lg:py-12">
    <div>
      <Breadcrumbs :items="crumbs" />
      <p class="label-mono mt-6 text-sherry">
        {{ tasting.isUpcoming ? 'Upcoming tasting' : 'Past tasting' }}
      </p>
      <h1 class="mt-2 text-4xl font-bold">
        {{ tasting.title }}
      </h1>
      <p
        v-if="tasting.summary"
        class="mt-3 text-lg text-smoke"
      >
        {{ tasting.summary }}
      </p>

      <ul
        v-if="tasting.regions.length || tasting.countries.length"
        class="mt-4 flex flex-wrap gap-2"
      >
        <li
          v-for="region in tasting.regions"
          :key="`region-${region.slug}`"
        >
          <NuxtLink
            :to="`/countries/${region.country.slug}/${region.slug}`"
            class="pill hover:border-sherry"
          >
            <span aria-hidden="true">📍</span> <b class="font-semibold text-sherry">{{ region.name }}</b>
          </NuxtLink>
        </li>
        <li
          v-for="country in tasting.countries"
          :key="`country-${country.slug}`"
        >
          <NuxtLink
            :to="`/countries/${country.slug}`"
            class="pill hover:border-sherry"
          >
            {{ country.flag }} {{ country.name }}
          </NuxtLink>
        </li>
      </ul>

      <CoverImage
        :src="tasting.image"
        :alt="tasting.title"
        height-class="aspect-[8/3]"
        :image-width="1200"
        :image-height="450"
        sizes="sm:100vw md:100vw lg:640px"
        class="mt-6 rounded-card"
      >
        <template #placeholder>
          <TastingPlaceholder :slug="tasting.slug" />
        </template>
      </CoverImage>

      <RichText
        v-if="tasting.description"
        :html="tasting.description"
        class="mt-6"
      />
      <EmptyNote
        v-else
        class="mt-6"
      >
        No description available yet.
      </EmptyNote>

      <p
        v-if="tasting.isUpcoming"
        class="mt-8 rounded-card border border-dashed border-sherry p-4 text-smoke"
      >
        <span aria-hidden="true">🤫</span> We keep the whiskies secret until afterwards. Bad decisions, good surprises.
      </p>

      <section
        v-if="!tasting.isUpcoming"
        class="mt-10"
        aria-labelledby="whiskies-heading"
      >
        <h2
          id="whiskies-heading"
          class="text-2xl font-bold"
        >
          The lineup
        </h2>
        <div
          v-if="tasting.whiskies.length"
          class="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <WhiskyCard
            v-for="whisky in tasting.whiskies"
            :key="whisky.slug"
            :whisky="whisky"
          />
        </div>
        <EmptyNote
          v-else
          class="mt-3"
        >
          No whiskies added yet.
        </EmptyNote>
      </section>

      <section
        v-if="tasting.report"
        class="mt-10"
        aria-labelledby="report-heading"
      >
        <h2
          id="report-heading"
          class="text-2xl font-bold"
        >
          Report
        </h2>
        <RichText
          :html="tasting.report"
          class="mt-3"
        />
      </section>

      <div
        v-if="tasting.photos.length"
        class="mt-10 grid gap-3 sm:grid-cols-2"
      >
        <NuxtImg
          v-for="photo in tasting.photos"
          :key="photo"
          :src="photo"
          :alt="`Photo of ${tasting.title}`"
          width="800"
          height="600"
          loading="lazy"
          class="rounded-card"
        />
      </div>
      <EmptyNote
        v-else-if="!tasting.isUpcoming"
        class="mt-10"
      >
        No photos available yet.
      </EmptyNote>
    </div>

    <aside class="h-fit rounded-card border border-line bg-paper p-5">
      <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <dt class="text-smoke">
          Date
        </dt>
        <dd><time :datetime="tasting.date">{{ formatLongDate(tasting.date) }}</time></dd>
        <dt class="text-smoke">
          Time
        </dt>
        <dd>{{ formatTime(tasting.date) }}</dd>
        <template v-if="tasting.location">
          <dt class="text-smoke">
            Location
          </dt>
          <dd>{{ tasting.location }}</dd>
        </template>
      </dl>
    </aside>
  </div>
</template>
