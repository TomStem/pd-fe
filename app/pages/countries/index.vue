<script setup lang="ts">
const [countries, distilleries] = await Promise.all([
  useContentFetch<CountryView[]>('/api/countries'),
  useContentFetch<DistilleryView[]>('/api/distilleries'),
]);
usePageSeo({ title: 'Countries', description: 'Whisky by country, with its regions and distilleries.' });
</script>

<template>
  <div>
    <PageHeader
      title="Countries"
      kicker="Explore"
      intro="From country to region to distillery: where does your dram come from?"
    />
    <div class="container-page pb-14">
      <div
        v-if="countries.length"
        class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <CountryCard
          v-for="country in countries"
          :key="country.slug"
          :country="country"
        />
      </div>
      <EmptyNote
        v-else
        class="mt-4"
      >
        No countries added yet.
      </EmptyNote>
      <h2 class="mt-12 text-2xl font-bold">
        All distilleries on the map
      </h2>
      <DistilleryMap
        v-if="distilleries.length"
        :distilleries="distilleries"
        class="mt-4"
      />
      <EmptyNote
        v-else
        class="mt-3"
      >
        No distilleries added yet.
      </EmptyNote>
    </div>
  </div>
</template>
