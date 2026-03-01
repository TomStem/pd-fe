<script setup>
defineProps(['distillery'])
</script>

<template>
<section class="py-32 bg-deepgreen text-center">
  <p class="uppercase tracking-widest text-sm text-gold mb-6">Featured Distillery</p>
  <h2 class="text-4xl mb-6">{{ distillery.name }}</h2>
  <NuxtLink :to="`/distilleries/${distillery.slug}`" class="btn-gold">Discover Distillery</NuxtLink>
</section>
</template>