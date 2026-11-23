<script setup lang="ts">
const distilleries = await useContentFetch<DistilleryView[]>('/api/distilleries');
usePageSeo({ title: 'Distilleries', description: 'All distilleries on the map and in the list, filterable by country and region.' });

const country = ref('');
const region = ref('');

const countries = computed(() => [...new Map(distilleries.value.map(d => [d.country.slug, d.country])).values()]);
const regions = computed(() => [...new Map(
  distilleries.value
    .filter(d => d.region && (!country.value || d.country.slug === country.value))
    .map(d => [d.region!.slug, d.region!]),
).values()]);

const filtered = computed(() => distilleries.value.filter(d =>
  (!country.value || d.country.slug === country.value) && (!region.value || d.region?.slug === region.value),
));

watch(country, () => (region.value = ''));
</script>

<template>
  <div>
    <PageHeader
      title="Distilleries"
      kicker="Explore"
      intro="Where the whisky comes from. Filter by country and region, or use the map."
    />

    <div class="container-page pb-14">
      <form
        class="mt-4 flex flex-wrap gap-4"
        @submit.prevent
      >
        <label class="flex flex-col gap-1 text-sm font-medium">
          Country
          <select
            v-model="country"
            class="rounded-full border border-line bg-paper px-4 py-2 text-base font-normal"
          >
            <option value="">All countries</option>
            <option
              v-for="c in countries"
              :key="c.slug"
              :value="c.slug"
            >{{ c.name }}</option>
          </select>
        </label>
        <label class="flex flex-col gap-1 text-sm font-medium">
          Region
          <select
            v-model="region"
            class="rounded-full border border-line bg-paper px-4 py-2 text-base font-normal"
          >
            <option value="">All regions</option>
            <option
              v-for="r in regions"
              :key="r.slug"
              :value="r.slug"
            >{{ r.name }}</option>
          </select>
        </label>
      </form>

      <p
        class="mt-4 text-sm text-smoke"
        aria-live="polite"
      >
        {{ filtered.length }} {{ filtered.length === 1 ? 'distillery' : 'distilleries' }}
      </p>

      <template v-if="filtered.length">
        <DistilleryMap
          :distilleries="filtered"
          class="mt-4"
        />

        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DistilleryCard
            v-for="distillery in filtered"
            :key="distillery.slug"
            :distillery="distillery"
          />
        </div>
      </template>
      <EmptyNote
        v-else
        class="mt-4"
      >
        {{ distilleries.length ? 'No distilleries found for these filters.' : 'No distilleries added yet.' }}
      </EmptyNote>
    </div>
  </div>
</template>
