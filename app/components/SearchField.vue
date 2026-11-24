<script setup lang="ts">
defineProps<{ modelValue: string; label: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <form
    role="search"
    class="relative"
    @submit.prevent
  >
    <input
      type="search"
      name="q"
      :value="modelValue"
      :aria-label="label"
      :placeholder="`${label}…`"
      autocomplete="off"
      enterkeyhint="search"
      class="w-full rounded-full border border-line bg-paper py-2 pl-4 pr-10 text-sm placeholder:text-smoke [&::-webkit-search-cancel-button]:appearance-none"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown.esc="emit('update:modelValue', '')"
    >
    <button
      v-if="modelValue"
      type="button"
      aria-label="Clear search"
      class="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-smoke hover:text-sherry"
      @click="emit('update:modelValue', '')"
    >
      <span aria-hidden="true">×</span>
    </button>
  </form>
</template>
