<script setup lang="ts">
defineProps<{ rating: number }>();
</script>

<template>
  <span class="inline-flex text-sherry">
    <span aria-hidden="true">{{ '★'.repeat(Math.round(rating)) }}<span class="text-line">{{ '★'.repeat(5 - Math.round(rating)) }}</span></span>
    <span class="sr-only">{{ formatRating(rating) }} out of 5</span>
  </span>
</template>
