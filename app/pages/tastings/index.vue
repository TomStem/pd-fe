<script setup lang="ts">
const tastings = await useContentFetch<TastingView[]>('/api/tastings');
usePageSeo({ title: 'Tastings', description: 'The themes Pour Decisions has tasted, newest first.' });

const filters = useFacetFilters(tastings, tastingFilterGroups, tastingSearchText);
</script>

<template>
  <div>
    <PageHeader
      title="Tastings"
      kicker="Our evenings"
      intro="Every theme we’ve explored so far."
    />

    <FilterLayout
      v-slot="{ hasGroups }"
      :filters="filters"
      search-label="Search tastings"
      :count-label="`${filters.visible.length} ${filters.visible.length === 1 ? 'tasting' : 'tastings'}`"
    >
      <AnimatedGrid
        :narrow="hasGroups"
        :empty="!filters.visible.length"
        :empty-text="tastings.length ? 'No tastings match these filters.' : 'No tastings yet.'"
        :clearable="filters.activeCount > 0"
        @clear="filters.clear"
      >
        <TastingCard
          v-for="(tasting, index) in filters.visible"
          :key="tasting.slug"
          :tasting="tasting"
          :style="{ '--i': Math.min(index, 8) }"
        />
      </AnimatedGrid>
    </FilterLayout>
  </div>
</template>
