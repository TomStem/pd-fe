<script setup lang="ts">
const tastings = await useContentFetch<TastingView[]>('/api/tastings');
usePageSeo({ title: 'Tastings', description: 'The themes Pour Decisions has tasted, newest first.' });

const { choice: sort, setChoice: setSort } = useChoiceParam('sort', tastingSorts);
const { choice: view, setChoice: setView } = useChoiceParam('view', tastingViews);
const sorted = computed(() => sortTastings(tastings.value, sort.value));
const filters = useFacetFilters(sorted, tastingFilterGroups, tastingSearchText);
</script>

<template>
  <div>
    <PageHeader
      title="Tastings"
      kicker="Our evenings"
      intro="Every theme we’ve explored so far."
    />

    <FilterLayout
      :filters="filters"
      search-label="Search tastings"
      :count-label="`${filters.visible.length} ${filters.visible.length === 1 ? 'tasting' : 'tastings'}`"
    >
      <template
        v-if="tastings.length > 1"
        #toolbar
      >
        <div class="ml-auto flex flex-wrap items-center gap-x-4 gap-y-2">
          <SegmentedControl
            :model-value="view"
            :options="tastingViews"
            label="View"
            @update:model-value="setView"
          />
          <SortSelect
            :model-value="sort"
            :options="tastingSorts"
            @update:model-value="setSort"
          />
        </div>
      </template>

      <template #default="{ hasGroups }">
        <Transition
          name="view"
          mode="out-in"
        >
          <TastingTimeline
            v-if="view === 'timeline' && filters.visible.length"
            key="timeline"
            :tastings="filters.visible"
            :class="hasGroups ? 'mt-4' : 'mt-6'"
          />
          <AnimatedGrid
            v-else
            key="grid"
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
        </Transition>
      </template>
    </FilterLayout>
  </div>
</template>
