<script setup lang="ts">
const tastings = await useContentFetch<TastingView[]>('/api/tastings');
usePageSeo({ title: 'Tastings', description: 'The themes Pour Decisions has tasted, newest first.' });

const { groups, selection, visible, selectedCount, toggle, clear } = useFacetFilters(tastings, tastingFilterGroups);
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
      :groups="groups"
      :selection="selection"
      :count-label="`${visible.length} ${visible.length === 1 ? 'tasting' : 'tastings'}`"
      @toggle="toggle"
      @clear="clear"
    >
      <AnimatedGrid
        :narrow="hasGroups"
        :empty="!visible.length"
        :empty-text="tastings.length ? 'No tastings match these filters.' : 'No tastings yet.'"
        :clearable="selectedCount > 0"
        @clear="clear"
      >
        <TastingCard
          v-for="(tasting, index) in visible"
          :key="tasting.slug"
          :tasting="tasting"
          :style="{ '--i': Math.min(index, 8) }"
        />
      </AnimatedGrid>
    </FilterLayout>
  </div>
</template>
