<script setup>
const { find } = useStrapi()

const { data: distilleries } = await useAsyncData('all-distilleries', () =>
  find('distilleries', { populate: '*' })
)
</script>

<template>
  <div class="grid md:grid-cols-3 gap-12">
    <div v-for="distillery in distilleries.data" :key="distillery.id" class="bg-charcoal p-6 rounded-lg">
      <!-- <img v-if="dist.attributes.logo?.data" :src="dist.attributes.logo.data.attributes.url" class="mb-4"/> -->
      <h3 class="text-2xl text-gold mb-2">{{ distillery.name }}</h3>
      <p class="text-cream/80">{{ distillery.notes }}</p>
      <!-- <NuxtLink :to="`/distilleries/${dist.attributes.slug}`" class="btn-gold mt-4 inline-block">Learn More</NuxtLink> -->
    </div>
  </div>
</template>