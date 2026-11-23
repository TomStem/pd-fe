<script setup lang="ts">
defineProps<{
  title: string;
  to?: string;
  linkLabel?: string;
}>();
</script>

<template>
  <section class="container-page border-t border-line py-10">
    <div class="flex items-baseline justify-between gap-4">
      <h2 class="text-2xl font-bold">
        {{ title }}
      </h2>
      <NuxtLink
        v-if="to"
        :to="to"
        class="shrink-0 text-sm font-medium text-sherry hover:underline"
      >
        {{ linkLabel ?? 'View all' }} →
      </NuxtLink>
    </div>
    <slot />
  </section>
</template>
