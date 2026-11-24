<script setup lang="ts">
const route = useRoute();
const data = await useContentFetch<RegionDetail>(`/api/regions/${route.params.country}/${route.params.region}`);
const region = computed(() => data.value.region);

const crumbs = computed(() => [
  { label: 'Countries', to: '/countries' },
  { label: region.value.country.name, to: `/countries/${region.value.country.slug}` },
  { label: region.value.name },
]);

usePageSeo({
  title: `${region.value.name}, ${region.value.country.name}`,
  description: region.value.summary,
  image: region.value.image,
  seo: region.value,
});
</script>

<template>
  <div class="container-page py-8 lg:py-12">
    <Breadcrumbs :items="crumbs" />
    <CoverImage
      :src="region.image"
      :alt="region.name"
      :slugs="[region.slug, region.country.slug]"
      height-class="aspect-[8/3]"
      :image-width="1200"
      :image-height="450"
      sizes="sm:100vw md:100vw lg:1100px"
      class="mt-6 rounded-card"
    />
    <h1 class="mt-6 text-4xl font-bold">
      {{ region.name }}
    </h1>
    <p
      v-if="region.summary"
      class="mt-3 max-w-prose text-lg text-smoke"
    >
      {{ region.summary }}
    </p>
    <ul
      v-if="region.flavourProfile.length"
      class="mt-4 flex flex-wrap gap-1.5"
      aria-label="Flavour profile"
    >
      <li
        v-for="flavour in region.flavourProfile"
        :key="flavour"
        class="dram"
      >
        {{ flavour }}
      </li>
    </ul>
    <RichText
      v-if="region.intro"
      :html="region.intro"
      class="mt-6"
    />
    <EmptyNote
      v-else
      class="mt-6"
    >
      No description available yet.
    </EmptyNote>

    <h2 class="mt-12 text-2xl font-bold">
      Distilleries
    </h2>
    <div
      v-if="data.distilleries.length"
      class="mt-4 grid gap-6 lg:grid-cols-[1.1fr_1fr]"
    >
      <ul>
        <li
          v-for="distillery in data.distilleries"
          :key="distillery.slug"
          class="border-b border-line"
        >
          <NuxtLink
            :to="`/distilleries/${distillery.slug}`"
            class="flex items-baseline justify-between gap-3 py-3 hover:text-sherry"
          >
            <b>{{ distillery.name }}</b>
            <span
              v-if="distillery.town || distillery.founded"
              class="text-right text-sm text-smoke"
            >{{ [distillery.town, distillery.founded].filter(Boolean).join(' · ') }}</span>
          </NuxtLink>
        </li>
      </ul>
      <DistilleryMap :distilleries="data.distilleries" />
    </div>
    <EmptyNote
      v-else
      class="mt-3"
    >
      No distilleries added yet.
    </EmptyNote>

    <h2 class="mt-12 text-2xl font-bold">
      Tastings about {{ region.name }}
    </h2>
    <div
      v-if="data.tastings.length"
      class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
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
      No tastings about this region yet.
    </EmptyNote>

    <h2 class="mt-12 text-2xl font-bold">
      Trips to {{ region.name }}
    </h2>
    <div
      v-if="data.trips.length"
      class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
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
      No trips to this region yet.
    </EmptyNote>
  </div>
</template>
