<script setup lang="ts">
const props = defineProps<{
  groups: FacetGroup[];
  selection: FilterSelection;
  /** Result count, e.g. "17 tastings". */
  countLabel: string;
}>();
const emit = defineEmits<{ toggle: [key: string, value: string]; clear: [] }>();

const hasGroups = computed(() => props.groups.length > 0);
const selectedCount = computed(() => selectedTotal(props.selection));
</script>

<template>
  <div
    class="container-page pb-14"
    :class="hasGroups && 'lg:grid lg:grid-cols-[15rem_1fr] lg:items-start lg:gap-8'"
  >
    <template v-if="hasGroups">
      <details class="card mt-6 lg:hidden">
        <summary class="flex cursor-pointer items-center justify-between p-4 font-semibold">
          Filter
          <span
            v-if="selectedCount"
            class="text-sm font-normal text-sherry"
          >{{ selectedCount }} selected</span>
        </summary>
        <FilterPanel
          :groups="groups"
          :selection="selection"
          class="border-t border-line p-4"
          @toggle="(key, value) => emit('toggle', key, value)"
          @clear="emit('clear')"
        />
      </details>
      <aside class="sticky top-24 mt-6 hidden lg:block">
        <div class="card max-h-[calc(100vh-7.5rem)] overflow-y-auto p-5">
          <h2 class="text-lg font-bold">
            Filter
          </h2>
          <FilterPanel
            :groups="groups"
            :selection="selection"
            class="mt-4"
            @toggle="(key, value) => emit('toggle', key, value)"
            @clear="emit('clear')"
          />
        </div>
      </aside>
    </template>

    <div class="min-w-0">
      <div
        v-if="hasGroups || $slots.toolbar"
        class="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 lg:mt-6"
      >
        <p
          v-if="hasGroups"
          class="text-sm text-smoke"
          aria-live="polite"
        >
          {{ countLabel }}
        </p>
        <slot name="toolbar" />
      </div>
      <slot :has-groups="hasGroups" />
    </div>
  </div>
</template>
