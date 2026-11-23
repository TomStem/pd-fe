<script setup lang="ts">
defineProps<{
  /** Region/country slugs used to pick the gradient. */
  slugs?: (string | undefined)[];
}>();
</script>

<template>
  <div
    class="size-full"
    role="presentation"
    :style="{ background: placeholderGradient(...(slugs ?? [])) }"
  />
</template>
