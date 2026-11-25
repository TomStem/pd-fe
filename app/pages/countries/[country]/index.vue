<script setup lang="ts">
const route = useRoute();
const data = await useContentFetch<CountryDetail>(`/api/countries/${route.params.country}`);
const country = computed(() => data.value.country);

const crumbs = computed(() => [{ label: 'Countries', to: '/countries' }, { label: country.value.name }]);

usePageSeo({
  title: country.value.name,
  description: country.value.summary,
  image: country.value.image,
  seo: country.value,
});
</script>

<template>
  <div class="container-page py-8 lg:py-12">
    <Breadcrumbs :items="crumbs" />
    <CoverImage
      :src="country.image"
      :alt="country.name"
      :slugs="[country.slug]"
      height-class="aspect-[8/3]"
      :image-width="1200"
      :image-height="450"
      sizes="sm:100vw md:100vw lg:1100px"
      priority
      class="mt-6 rounded-card"
    />
    <h1 class="mt-6 text-4xl font-bold">
      <span
        v-if="country.flag"
        aria-hidden="true"
      >{{ country.flag }}</span> {{ country.name }}
    </h1>
    <p
      v-if="country.summary"
      class="mt-3 max-w-prose text-lg text-smoke"
    >
      {{ country.summary }}
    </p>
    <RichText
      v-if="country.intro"
      :html="country.intro"
      class="mt-6"
    />
    <EmptyNote
      v-else
      class="mt-6"
    >
      No description available yet.
    </EmptyNote>

    <h2 class="mt-12 text-2xl font-bold">
      Regions
    </h2>
    <div
      v-if="data.regions.length"
      class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <RegionCard
        v-for="region in data.regions"
        :key="region.slug"
        :region="region"
      />
    </div>
    <EmptyNote
      v-else
      class="mt-3"
    >
      No regions added yet.
    </EmptyNote>

    <h2 class="mt-12 text-2xl font-bold">
      Tastings about {{ country.name }}
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
      No tastings about this country yet.
    </EmptyNote>

    <h2 class="mt-12 text-2xl font-bold">
      Distilleries in {{ country.name }}
    </h2>
    <template v-if="data.distilleries.length">
      <DistilleryMap
        :distilleries="data.distilleries"
        class="mt-4"
      />
      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DistilleryCard
          v-for="distillery in data.distilleries"
          :key="distillery.slug"
          :distillery="distillery"
        />
      </div>
    </template>
    <EmptyNote
      v-else
      class="mt-3"
    >
      No distilleries added yet.
    </EmptyNote>
  </div>
</template>
