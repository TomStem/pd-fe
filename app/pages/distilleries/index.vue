<script setup lang="ts">
const distilleries = await useContentFetch<DistilleryView[]>('/api/distilleries');
usePageSeo({ title: 'Distilleries', description: 'All distilleries on the map and in the list, filterable by country, region and visiting.' });

const filters = useFacetFilters(distilleries, distilleryFilterGroups, distillerySearchText);
</script>

<template>
  <div>
    <PageHeader
      title="Distilleries"
      kicker="Explore"
      intro="Where the whisky comes from. Filter by country and region, or use the map."
    />

    <FilterLayout
      :filters="filters"
      search-label="Search distilleries"
      :count-label="`${filters.visible.length} ${filters.visible.length === 1 ? 'distillery' : 'distilleries'}`"
    >
      <template #default="{ hasGroups }">
        <DistilleryMap
          v-if="filters.visible.length"
          :distilleries="filters.visible"
          :class="hasGroups ? 'mt-4' : 'mt-6'"
        />
        <AnimatedGrid
          :narrow="hasGroups"
          :empty="!filters.visible.length"
          :empty-text="distilleries.length ? 'No distilleries match these filters.' : 'No distilleries added yet.'"
          :clearable="filters.activeCount > 0"
          @clear="filters.clear"
        >
          <DistilleryCard
            v-for="(distillery, index) in filters.visible"
            :key="distillery.slug"
            :distillery="distillery"
            :style="{ '--i': Math.min(index, 8) }"
          />
        </AnimatedGrid>
      </template>
    </FilterLayout>
  </div>
</template>
