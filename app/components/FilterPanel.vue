<script setup lang="ts">
defineProps<{ groups: FacetGroup[]; selection: FilterSelection; active: boolean }>();
const emit = defineEmits<{ toggle: [key: string, value: string]; clear: [] }>();

const expandedKeys = ref<string[]>([]);
const isExpanded = (key: string) => expandedKeys.value.includes(key);
const toggleExpanded = (key: string) => {
  expandedKeys.value = isExpanded(key) ? expandedKeys.value.filter(k => k !== key) : [...expandedKeys.value, key];
};
</script>

<template>
  <div class="space-y-5">
    <div
      v-for="group in groups"
      :key="group.key"
      role="group"
      :aria-label="group.label"
    >
      <p class="label-mono text-sherry">
        {{ group.label }}
      </p>
      <div class="mt-2 flex flex-wrap gap-1.5">
        <button
          v-for="option in visibleOptions(group.options, selection[group.key], isExpanded(group.key))"
          :key="option.value"
          type="button"
          class="filter-pill filter-pill-in"
          :class="{ 'opacity-50': option.count === 0 && !selection[group.key]?.includes(option.value) }"
          :aria-pressed="selection[group.key]?.includes(option.value) ?? false"
          @click="emit('toggle', group.key, option.value)"
        >
          {{ option.label }} <span class="shrink-0 opacity-60">{{ option.count }}</span>
        </button>
        <button
          v-if="group.options.length > COLLAPSED_OPTION_LIMIT"
          type="button"
          class="px-2 py-1 text-sm text-sherry underline underline-offset-2 hover:no-underline"
          :aria-expanded="isExpanded(group.key)"
          @click="toggleExpanded(group.key)"
        >
          {{ isExpanded(group.key)
            ? 'Show less'
            : `Show more (${group.options.length - visibleOptions(group.options, selection[group.key]).length})` }}
          <span class="sr-only"> {{ group.label }} options</span>
        </button>
      </div>
    </div>
    <button
      v-if="active"
      type="button"
      class="text-sm text-sherry underline underline-offset-2 hover:no-underline"
      @click="emit('clear')"
    >
      Clear filters
    </button>
  </div>
</template>
