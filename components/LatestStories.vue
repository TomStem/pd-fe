<script setup>
defineProps(['stories'])
</script>

<template>
<section class="py-24 border-b border-gold/10">
  <div class="text-center mb-16">
    <p class="uppercase tracking-widest text-sm text-gold mb-4">Journal</p>
    <h2 class="text-4xl">Recent Writings</h2>
  </div>
  <div class="grid md:grid-cols-3 gap-12">
    <div v-for="story in stories" :key="story.id" class="space-y-4">
      <img v-if="story.attributes.coverImage?.data" :src="story.attributes.coverImage.data.attributes.url" class="w-full"/>
      <p class="uppercase text-xs tracking-widest text-gold">{{ story.attributes.category }}</p>
      <h3 class="text-2xl">{{ story.attributes.title }}</h3>
      <p class="text-cream/70">{{ story.attributes.excerpt }}</p>
      <NuxtLink :to="`/stories/${story.attributes.slug}`" class="text-gold uppercase tracking-widest text-sm">Read More →</NuxtLink>
    </div>
  </div>
</section>
</template>