<script setup lang="ts">
const distilleries = await useContentFetch<DistilleryView[]>('/api/distilleries');
usePageSeo({ title: 'Distilleries', description: 'All distilleries on the map and in the list, filterable by country, region and visiting.' });

const { groups, selection, visible, selectedCount, toggle, clear } = useFacetFilters(distilleries, distilleryFilterGroups);
</script>

<template>
  <div>
    <PageHeader
      title="Distilleries"
      kicker="Explore"
      intro="Where the whisky comes from. Filter by country and region, or use the map."
    />

    <FilterLayout
      :groups="groups"
      :selection="selection"
      :count-label="`${visible.length} ${visible.length === 1 ? 'distillery' : 'distilleries'}`"
      @toggle="toggle"
      @clear="clear"
    >
      <template #default="{ hasGroups }">
        <DistilleryMap
          v-if="visible.length"
          :distilleries="visible"
          :class="hasGroups ? 'mt-4' : 'mt-6'"
        />
        <AnimatedGrid
          :narrow="hasGroups"
          :empty="!visible.length"
          :empty-text="distilleries.length ? 'No distilleries match these filters.' : 'No distilleries added yet.'"
          :clearable="selectedCount > 0"
          @clear="clear"
        >
          <DistilleryCard
            v-for="(distillery, index) in visible"
            :key="distillery.slug"
            :distillery="distillery"
            :style="{ '--i': Math.min(index, 8) }"
          />
        </AnimatedGrid>
      </template>
    </FilterLayout>
  </div>
</template>
