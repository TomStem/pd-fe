<script setup lang="ts">
const whiskies = await useContentFetch<WhiskyView[]>('/api/whiskies');
usePageSeo({ title: 'Whiskies', description: 'The whiskies from our tastings, with tasting notes and reviews.' });

const { sort, setSort } = useSortParam(whiskySorts);
const sorted = computed(() => sortWhiskies(whiskies.value, sort.value));
const { groups, selection, visible, selectedCount, toggle, clear } = useFacetFilters(sorted, whiskyFilterGroups);
</script>

<template>
  <div>
    <PageHeader
      title="Whiskies"
      kicker="In the glass"
      intro="The bottles from our tastings, with tasting notes and reviews."
    />

    <FilterLayout
      :groups="groups"
      :selection="selection"
      :count-label="`${visible.length} ${visible.length === 1 ? 'whisky' : 'whiskies'}`"
      @toggle="toggle"
      @clear="clear"
    >
      <template
        v-if="whiskies.length > 1"
        #toolbar
      >
        <label class="ml-auto flex items-center gap-2 text-sm text-smoke">
          Sort by
          <select
            :value="sort"
            class="rounded-full border border-line bg-paper px-3 py-1.5 text-sm text-oak"
            @change="setSort(($event.target as HTMLSelectElement).value as WhiskySort)"
          >
            <option
              v-for="option in whiskySorts"
              :key="option.value"
              :value="option.value"
            >{{ option.label }}</option>
          </select>
        </label>
      </template>

      <template #default="{ hasGroups }">
        <AnimatedGrid
          :narrow="hasGroups"
          :empty="!visible.length"
          :empty-text="whiskies.length ? 'No whiskies match these filters.' : 'No whiskies added yet.'"
          :clearable="selectedCount > 0"
          @clear="clear"
        >
          <WhiskyCard
            v-for="(whisky, index) in visible"
            :key="whisky.slug"
            :whisky="whisky"
            :style="{ '--i': Math.min(index, 8) }"
          />
        </AnimatedGrid>
      </template>
    </FilterLayout>
  </div>
</template>
