<script setup lang="ts">
defineProps<{ groups: FacetGroup[]; selection: FilterSelection; active: boolean }>();
const emit = defineEmits<{ toggle: [key: string, value: string]; clear: [] }>();
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
          v-for="option in group.options"
          :key="option.value"
          type="button"
          class="filter-pill"
          :class="{ 'opacity-50': option.count === 0 && !selection[group.key]?.includes(option.value) }"
          :aria-pressed="selection[group.key]?.includes(option.value) ?? false"
          @click="emit('toggle', group.key, option.value)"
        >
          {{ option.label }} <span class="opacity-60">{{ option.count }}</span>
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
