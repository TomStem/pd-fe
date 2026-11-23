<script setup lang="ts">
defineProps<{ items: { label: string; to?: string }[] }>();
</script>

<template>
  <nav
    aria-label="Breadcrumb"
    class="text-sm text-smoke"
  >
    <ol class="flex flex-wrap items-center gap-x-2 gap-y-1">
      <li
        v-for="(item, index) in items"
        :key="item.label"
        class="flex items-center gap-2"
      >
        <NuxtLink
          v-if="item.to"
          :to="item.to"
          class="hover:text-sherry hover:underline"
        >
          {{ item.label }}
        </NuxtLink>
        <span
          v-else
          class="font-medium text-sherry"
          aria-current="page"
        >{{ item.label }}</span>
        <span
          v-if="index < items.length - 1"
          aria-hidden="true"
        >›</span>
      </li>
    </ol>
  </nav>
</template>
