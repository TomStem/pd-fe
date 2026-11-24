<script setup lang="ts" generic="K extends string">
defineProps<{ modelValue: K; options: readonly { value: K; label: string }[] }>();
const emit = defineEmits<{ 'update:modelValue': [value: K] }>();
</script>

<template>
  <label class="ml-auto flex items-center gap-2 text-sm text-smoke">
    Sort by
    <select
      :value="modelValue"
      class="rounded-full border border-line bg-paper px-3 py-1.5 text-sm text-oak"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value as K)"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >{{ option.label }}</option>
    </select>
  </label>
</template>
