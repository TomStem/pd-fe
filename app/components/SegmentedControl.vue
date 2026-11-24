<script setup lang="ts" generic="K extends string">
defineProps<{ modelValue: K; options: readonly { value: K; label: string }[]; label: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: K] }>();
</script>

<template>
  <div
    role="group"
    :aria-label="label"
    class="inline-flex gap-1 rounded-full bg-line p-1"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="rounded-full px-3 py-1 text-sm font-semibold transition-colors aria-pressed:bg-oak aria-pressed:text-white"
      :aria-pressed="modelValue === option.value"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
