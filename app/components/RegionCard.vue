<script setup lang="ts">
defineProps<{ region: RegionView }>();
</script>

<template>
  <article class="card flex h-full flex-col">
    <CoverImage
      :src="region.image"
      :alt="region.name"
      :slugs="[region.slug, region.country.slug]"
      height-class="aspect-[8/3]"
      :image-width="1200"
      :image-height="450"
      :tags="[`${region.distilleryCount} ${region.distilleryCount === 1 ? 'distillery' : 'distilleries'}`]"
    />
    <div class="flex flex-1 flex-col p-4">
      <h3 class="text-lg font-bold">
        <NuxtLink
          :to="`/countries/${region.country.slug}/${region.slug}`"
          class="stretched-link"
        >
          {{ region.name }}
        </NuxtLink>
      </h3>
      <p
        v-if="region.summary"
        class="mt-1 text-sm text-smoke"
      >
        {{ region.summary }}
      </p>
      <p
        v-if="region.flavourProfile.length"
        class="mt-auto flex flex-wrap gap-1.5 pt-3"
      >
        <span
          v-for="flavour in region.flavourProfile"
          :key="flavour"
          class="dram"
        >{{ flavour }}</span>
      </p>
    </div>
  </article>
</template>
