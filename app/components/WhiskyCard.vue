<script setup lang="ts">
defineProps<{ whisky: WhiskyView }>();
</script>

<template>
  <article class="card flex h-full flex-col">
    <CoverImage
      :src="whisky.image"
      :alt="whisky.name"
      :slugs="[whisky.regions[0]?.slug, whisky.countries[0]?.slug]"
      :tags="[whisky.isBlend ? 'Blend' : undefined]"
      height-class="aspect-[8/3]"
      :image-width="1200"
      :image-height="450"
    />
    <div class="flex flex-1 flex-col p-4">
      <p class="label-mono text-sherry">
        {{ whiskyLabel(whisky) }}
      </p>
      <h3 class="mt-1 text-lg font-bold">
        <NuxtLink
          :to="`/whiskies/${whisky.slug}`"
          class="stretched-link"
        >
          {{ whisky.name }}
        </NuxtLink>
      </h3>
      <p class="mt-auto flex flex-wrap gap-2 pt-3 font-mono text-xs text-smoke">
        <span v-if="whisky.isNas">NAS</span>
        <span v-else-if="whisky.age">{{ whisky.age }} years</span>
        <span v-if="whisky.abv !== undefined">{{ formatAbv(whisky.abv) }}</span>
        <span v-if="whisky.averageRating !== undefined"><span
          class="text-sherry"
          aria-hidden="true"
        >★</span> {{ formatRating(whisky.averageRating) }}<span class="sr-only"> out of 5</span></span>
      </p>
    </div>
  </article>
</template>
