<script setup lang="ts">
const props = defineProps<{
  filters: FacetFilters;
  /** Names what is searched, e.g. "Search tastings". */
  searchLabel: string;
  /** Result count, e.g. "17 tastings". */
  countLabel: string;
}>();

const hasPanel = computed(() => props.filters.groups.length > 0);
</script>

<template>
  <div
    class="container-page pb-14"
    :class="hasPanel && 'lg:grid lg:grid-cols-[15rem_1fr] lg:items-start lg:gap-8'"
  >
    <template v-if="hasPanel">
      <div class="mt-6 space-y-3 lg:hidden">
        <SearchField
          v-if="filters.searchable"
          :model-value="filters.searchInput"
          :label="searchLabel"
          @update:model-value="filters.setSearch"
        />
        <details class="card">
          <summary class="flex cursor-pointer items-center justify-between p-4 font-semibold">
            Filter
            <span
              v-if="filters.activeCount"
              class="text-sm font-normal text-sherry"
            >{{ filters.activeCount }} selected</span>
          </summary>
          <FilterPanel
            :groups="filters.groups"
            :selection="filters.selection"
            :active="filters.activeCount > 0"
            class="border-t border-line p-4"
            @toggle="filters.toggle"
            @clear="filters.clear"
          />
        </details>
      </div>
      <aside class="sticky top-24 mt-6 hidden lg:block">
        <div class="card max-h-[calc(100vh-7.5rem)] overflow-y-auto p-5">
          <h2 class="text-lg font-bold">
            Filter
          </h2>
          <SearchField
            v-if="filters.searchable"
            :model-value="filters.searchInput"
            :label="searchLabel"
            class="mt-4"
            @update:model-value="filters.setSearch"
          />
          <FilterPanel
            :groups="filters.groups"
            :selection="filters.selection"
            :active="filters.activeCount > 0"
            class="mt-5"
            @toggle="filters.toggle"
            @clear="filters.clear"
          />
        </div>
      </aside>
    </template>

    <div class="min-w-0">
      <SearchField
        v-if="!hasPanel && filters.searchable"
        :model-value="filters.searchInput"
        :label="searchLabel"
        class="mt-6 max-w-md"
        @update:model-value="filters.setSearch"
      />
      <div
        v-if="hasPanel || filters.searchable || $slots.toolbar"
        class="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 lg:mt-6"
      >
        <p
          v-if="hasPanel || filters.searchable"
          class="text-sm text-smoke"
          aria-live="polite"
        >
          {{ countLabel }}
        </p>
        <slot name="toolbar" />
      </div>
      <slot :has-groups="hasPanel" />
    </div>
  </div>
</template>
