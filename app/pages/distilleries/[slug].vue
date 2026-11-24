<script setup lang="ts">
const route = useRoute();
const data = await useContentFetch<DistilleryDetail>(`/api/distilleries/${route.params.slug}`);
const distillery = computed(() => data.value.distillery);
const country = computed(() => distillery.value.country);
const region = computed(() => distillery.value.region);
const single = computed(() => [distillery.value]);

const crumbs = computed(() => [
  { label: 'Distilleries', to: '/distilleries' },
  { label: country.value.name, to: `/countries/${country.value.slug}` },
  ...(region.value ? [{ label: region.value.name, to: `/countries/${country.value.slug}/${region.value.slug}` }] : []),
  { label: distillery.value.name },
]);

usePageSeo({
  title: distillery.value.name,
  description: distillery.value.summary,
  seo: distillery.value,
});
</script>

<template>
  <div class="container-page grid gap-8 py-8 lg:grid-cols-[1.4fr_1fr] lg:py-12">
    <div>
      <Breadcrumbs :items="crumbs" />
      <h1 class="mt-6 text-4xl font-bold">
        {{ distillery.name }}
      </h1>
      <p
        v-if="distillery.summary"
        class="mt-3 text-lg text-smoke"
      >
        {{ distillery.summary }}
      </p>
      <RichText
        v-if="distillery.story"
        :html="distillery.story"
        class="mt-6"
      />
      <EmptyNote
        v-else
        class="mt-6"
      >
        No description available yet.
      </EmptyNote>

      <NuxtImg
        v-if="distillery.image"
        :src="distillery.image"
        :alt="`Photo of ${distillery.name}`"
        width="1200"
        height="450"
        sizes="sm:100vw md:100vw lg:1100px"
        loading="lazy"
        class="mt-8 aspect-[8/3] w-full rounded-card object-cover"
      />

      <section
        class="mt-10"
        aria-labelledby="whiskies-heading"
      >
        <h2
          id="whiskies-heading"
          class="text-2xl font-bold"
        >
          Whiskies from {{ distillery.name }}
        </h2>
        <div
          v-if="data.whiskies.length"
          class="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <WhiskyCard
            v-for="whisky in data.whiskies"
            :key="whisky.slug"
            :whisky="whisky"
          />
        </div>
        <EmptyNote
          v-else
          class="mt-3"
        >
          No whiskies from this distillery yet.
        </EmptyNote>
      </section>

      <section
        class="mt-10"
        aria-labelledby="tastings-heading"
      >
        <h2
          id="tastings-heading"
          class="text-2xl font-bold"
        >
          Tastings featuring {{ distillery.name }}
        </h2>
        <div
          v-if="data.tastings.length"
          class="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <TastingCard
            v-for="tasting in data.tastings"
            :key="tasting.slug"
            :tasting="tasting"
          />
        </div>
        <EmptyNote
          v-else
          class="mt-3"
        >
          No tastings featuring this distillery yet.
        </EmptyNote>
      </section>

      <section
        class="mt-10"
        aria-labelledby="trips-heading"
      >
        <h2
          id="trips-heading"
          class="text-2xl font-bold"
        >
          Trips along {{ distillery.name }}
        </h2>
        <div
          v-if="data.trips.length"
          class="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <TripCard
            v-for="trip in data.trips"
            :key="trip.slug"
            :trip="trip"
          />
        </div>
        <EmptyNote
          v-else
          class="mt-3"
        >
          No trips along this distillery yet.
        </EmptyNote>
      </section>
    </div>

    <aside class="h-fit space-y-5">
      <div class="rounded-card border border-line bg-paper p-5">
        <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt class="text-smoke">
            {{ region ? 'Region' : 'Country' }}
          </dt>
          <dd>
            <NuxtLink
              :to="region ? `/countries/${country.slug}/${region.slug}` : `/countries/${country.slug}`"
              class="text-sherry hover:underline"
            >
              {{ region ? `${region.name}, ${country.name}` : country.name }}
            </NuxtLink>
          </dd>
          <dt class="text-smoke">
            Town
          </dt>
          <dd>
            <template v-if="distillery.town">
              {{ distillery.town }}
            </template>
            <EmptyNote v-else>
              Unknown
            </EmptyNote>
          </dd>
          <dt class="text-smoke">
            Founded
          </dt>
          <dd>
            <span
              v-if="distillery.founded"
              class="font-mono"
            >{{ distillery.founded }}</span>
            <EmptyNote v-else>
              Unknown
            </EmptyNote>
          </dd>
          <template v-if="distillery.visitable !== undefined">
            <dt class="text-smoke">
              Open to visitors
            </dt>
            <dd>{{ distillery.visitable ? 'Yes' : 'No' }}</dd>
          </template>
          <dt class="text-smoke">
            Website
          </dt>
          <dd>
            <a
              v-if="distillery.website"
              :href="distillery.website"
              class="break-all text-sherry hover:underline"
              target="_blank"
              rel="noopener"
            >{{ distillery.website.replace(/^https?:\/\/(www\.)?/, '') }}</a>
            <EmptyNote v-else>
              Unknown
            </EmptyNote>
          </dd>
        </dl>
      </div>
      <DistilleryMap
        v-if="distillery.location"
        :distilleries="single"
      />
      <EmptyNote v-else>
        No location known yet.
      </EmptyNote>
    </aside>
  </div>
</template>
