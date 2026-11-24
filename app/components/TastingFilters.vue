<script setup lang="ts">
const props = defineProps<{ facets: TastingFacets; filters: TastingFilters }>();
const emit = defineEmits<{ change: [filters: TastingFilters] }>();

const groups = computed(() => [
  { key: 'year', label: 'Year', options: props.facets.years },
  { key: 'country', label: 'Country', options: props.facets.countries },
] as const);

const active = computed(() => Boolean(props.filters.year || props.filters.country));

const choose = (key: 'year' | 'country', value: string | undefined) => emit('change', { ...props.filters, [key]: value });
</script>

<template>
  <div class="space-y-5">
    <div
      v-for="group in groups.filter(g => g.options.length)"
      :key="group.key"
      role="group"
      :aria-label="group.label"
    >
      <p class="label-mono text-sherry">
        {{ group.label }}
      </p>
      <div class="mt-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          class="filter-pill"
          :aria-pressed="!filters[group.key]"
          @click="choose(group.key, undefined)"
        >
          All
        </button>
        <button
          v-for="option in group.options"
          :key="option.value"
          type="button"
          class="filter-pill"
          :aria-pressed="filters[group.key] === option.value"
          :disabled="option.count === 0 && filters[group.key] !== option.value"
          @click="choose(group.key, option.value)"
        >
          {{ option.label }} <span class="opacity-60">{{ option.count }}</span>
        </button>
      </div>
    </div>
    <button
      v-if="active"
      type="button"
      class="text-sm text-sherry underline underline-offset-2 hover:no-underline"
      @click="emit('change', {})"
    >
      Clear filters
    </button>
  </div>
</template>
