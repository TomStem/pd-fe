<script setup lang="ts">
defineProps<{ chips: FilterChip[] }>();
const emit = defineEmits<{ remove: [chip: FilterChip]; clear: [] }>();
</script>

<template>
  <div
    class="flex flex-wrap items-center gap-x-3 gap-y-2"
    aria-label="Active filters"
    role="group"
  >
    <TransitionGroup
      tag="ul"
      name="chip"
      class="flex flex-wrap gap-1.5"
    >
      <li
        v-for="chip in chips"
        :key="chip.id"
      >
        <button
          type="button"
          class="filter-pill"
          :aria-label="chip.ariaLabel"
          @click="emit('remove', chip)"
        >
          {{ chip.label }} <span aria-hidden="true">×</span>
        </button>
      </li>
    </TransitionGroup>
    <button
      type="button"
      class="text-sm text-sherry underline underline-offset-2 hover:no-underline"
      @click="emit('clear')"
    >
      Clear filters
    </button>
  </div>
</template>
