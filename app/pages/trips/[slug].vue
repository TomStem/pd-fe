<script setup lang="ts">
const route = useRoute();
const data = await useContentFetch<TripDetail>(`/api/trips/${route.params.slug}`);
const trip = computed(() => data.value.trip);

const crumbs = computed(() => [{ label: 'Trips', to: '/trips' }, { label: trip.value.title }]);
const countries = computed(() => [...new Map(trip.value.regions.map(r => [r.country.slug, r.country])).values()]);

usePageSeo({
  title: trip.value.title,
  description: trip.value.summary,
  image: trip.value.image,
  seo: trip.value,
});
</script>

<template>
  <div class="container-page grid gap-8 py-8 lg:grid-cols-[1.4fr_1fr] lg:py-12">
    <div>
      <Breadcrumbs :items="crumbs" />
      <h1 class="mt-6 text-4xl font-bold">
        {{ trip.title }}
      </h1>
      <p
        v-if="trip.summary"
        class="mt-3 text-lg text-smoke"
      >
        {{ trip.summary }}
      </p>

      <ul class="mt-4 flex flex-wrap gap-2">
        <li
          v-for="region in trip.regions"
          :key="region.slug"
        >
          <NuxtLink
            :to="`/countries/${region.country.slug}/${region.slug}`"
            class="pill hover:border-sherry"
          >
            <span aria-hidden="true">📍</span> <b class="font-semibold text-sherry">{{ region.name }}</b>
          </NuxtLink>
        </li>
        <li
          v-for="country in countries"
          :key="country.slug"
        >
          <NuxtLink
            :to="`/countries/${country.slug}`"
            class="pill hover:border-sherry"
          >
            {{ country.flag }} {{ country.name }}
          </NuxtLink>
        </li>
      </ul>

      <RichText
        :html="trip.report"
        class="mt-6"
      />

      <div
        v-if="trip.photos.length"
        class="mt-10 grid gap-3 sm:grid-cols-2"
      >
        <NuxtImg
          v-for="(photo, index) in trip.photos"
          :key="index"
          :src="photo"
          :alt="`Photo of ${trip.title}`"
          width="800"
          height="600"
          loading="lazy"
          class="rounded-card"
        />
      </div>

      <section
        v-if="trip.itinerary.length"
        class="mt-10"
        aria-labelledby="itinerary-heading"
      >
        <h2
          id="itinerary-heading"
          class="text-2xl font-bold"
        >
          Day-by-day report
        </h2>
        <ol class="mt-4">
          <li
            v-for="day in trip.itinerary"
            :key="day.day"
            class="my-4 border-l-2 border-sherry py-0.5 pl-4"
          >
            <p class="label-mono text-sherry">
              Day {{ day.day }}
            </p>
            <h3 class="text-base font-bold">
              {{ day.title }}
            </h3>
            <p class="mt-0.5 text-sm text-smoke">
              {{ day.text }}
            </p>
          </li>
        </ol>
      </section>

      <section
        v-if="trip.distilleries.length"
        class="mt-10"
        aria-labelledby="distilleries-heading"
      >
        <h2
          id="distilleries-heading"
          class="text-2xl font-bold"
        >
          Visited distilleries
        </h2>
        <ul class="mt-4 flex flex-wrap gap-2">
          <li
            v-for="distillery in trip.distilleries"
            :key="distillery.slug"
          >
            <NuxtLink
              :to="`/distilleries/${distillery.slug}`"
              class="pill hover:border-sherry"
            >
              {{ distillery.name }}
            </NuxtLink>
          </li>
        </ul>
        <DistilleryMap
          :distilleries="trip.distilleries"
          class="mt-6"
        />
      </section>
    </div>

    <aside class="h-fit rounded-card border border-line bg-paper p-5">
      <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <dt class="text-smoke">
          Dates
        </dt>
        <dd>
          <time :datetime="trip.startDate">{{ formatDateRange(trip.startDate, trip.endDate) }}</time>
        </dd>
        <dt class="text-smoke">
          Duration
        </dt>
        <dd>{{ tripLength(trip.startDate, trip.endDate) }} days</dd>
        <dt class="text-smoke">
          Regions
        </dt>
        <dd>{{ trip.regions.map(r => r.name).join(', ') }}</dd>
        <dt class="text-smoke">
          Distilleries
        </dt>
        <dd>{{ trip.distilleries.length }}</dd>
      </dl>
    </aside>
  </div>
</template>
