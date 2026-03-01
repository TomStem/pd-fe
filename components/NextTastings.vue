<script setup>
defineProps(['tasting'])
</script>

<template>
  
<section class="py-24 border-b border-gold/10 grid md:grid-cols-2 gap-16 items-center">
  <img v-if="tasting.attributes.featuredImage?.data" :src="tasting.attributes.featuredImage.data.attributes.url" class="w-full rounded-sm"/>
  <div>
    <p class="uppercase tracking-widest text-sm text-gold mb-4">Next Gathering</p>
    <h2 class="text-4xl mb-4">{{ tasting.attributes.title }}</h2>
    <p class="mb-2 text-cream/70">{{ new Date(tasting.attributes.date).toLocaleDateString() }}</p>
    <p class="mb-6 text-cream/70">{{ tasting.attributes.venue }}</p>
    <NuxtLink :to="`/tastings/${tasting.attributes.slug}`" class="btn-gold">View Details</NuxtLink>
  </div>
</section>
</template>