<script setup lang="ts">
const props = defineProps<{ facets: TastingFacets; filters: TastingFilters }>();
const emit = defineEmits<{ change: [filters: TastingFilters] }>();

const groups = computed(() => [
  { key: 'years', label: 'Year', options: props.facets.years },
  { key: 'countries', label: 'Country', options: props.facets.countries },
] as const);

const active = computed(() => props.filters.years.length + props.filters.countries.length > 0);

function toggle(key: 'years' | 'countries', value: string) {
  const selected = props.filters[key];
  emit('change', { ...props.filters, [key]: selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value] });
}
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
          v-for="option in group.options"
          :key="option.value"
          type="button"
          class="filter-pill"
          :class="{ 'opacity-50': option.count === 0 && !filters[group.key].includes(option.value) }"
          :aria-pressed="filters[group.key].includes(option.value)"
          @click="toggle(group.key, option.value)"
        >
          {{ option.label }} <span class="opacity-60">{{ option.count }}</span>
        </button>
      </div>
    </div>
    <button
      v-if="active"
      type="button"
      class="text-sm text-sherry underline underline-offset-2 hover:no-underline"
      @click="emit('change', { years: [], countries: [] })"
    >
      Clear filters
    </button>
  </div>
</template>
