<script setup lang="ts">
defineProps<{
  title: string;
  kicker?: string;
  intro?: string;
}>();
</script>

<template>
  <div class="container-page pb-6 pt-10 sm:pt-14">
    <p
      v-if="kicker"
      class="label-mono text-sherry"
    >
      {{ kicker }}
    </p>
    <h1 class="mt-2 text-4xl font-bold sm:text-5xl">
      {{ title }}
    </h1>
    <p
      v-if="intro"
      class="mt-4 max-w-prose text-lg text-smoke"
    >
      {{ intro }}
    </p>
    <slot />
  </div>
</template>
