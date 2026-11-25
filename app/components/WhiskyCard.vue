<script setup lang="ts">
defineProps<{ whisky: WhiskyView; priority?: boolean }>();
</script>

<template>
  <article class="card flex h-full flex-col">
    <CoverImage
      :src="whisky.image"
      :alt="whisky.name"
      :slugs="[whisky.regions[0]?.slug, whisky.countries[0]?.slug]"
      :tags="[whisky.isBlend ? 'Blend' : undefined]"
      :priority="priority"
      height-class="aspect-[8/3]"
      placeholder="whisky"
      object-class="object-[50%_35%]"
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
      <ul class="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 font-mono text-xs text-smoke">
        <li
          v-if="whisky.isNas || whisky.age"
          class="flex items-center gap-1"
        >
          <svg
            class="size-3.5 shrink-0 text-sherry"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          ><path d="M4 1.500h8M4 14.500h8M5 1.500c0 4 3 4.500 3 6.500s-3 2.500-3 6.500M11 1.500c0 4-3 4.500-3 6.500s3 2.500 3 6.500" /></svg>
          <span v-if="whisky.isNas">NAS<span class="sr-only"> (no age statement)</span></span>
          <span v-else>{{ whisky.age }} years</span>
        </li>
        <li
          v-if="whisky.abv !== undefined"
          class="flex items-center gap-1"
        >
          <svg
            class="size-3.5 shrink-0 text-sherry"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          ><path d="M8 1.500S3.500 6.500 3.500 9.500a4.500 4.500 0 0 0 9 0C12.500 6.500 8 1.500 8 1.500z" /></svg>
          <span>{{ formatAbv(whisky.abv) }}<span class="sr-only"> ABV</span></span>
        </li>
        <li
          v-if="whisky.averageRating !== undefined"
          class="flex items-center gap-1"
        >
          <svg
            class="size-3.5 shrink-0 text-amber"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          ><path d="M8 1l2.200 4.600 5 .7-3.600 3.500.9 5L8 12.400 3.500 14.800l.9-5L.8 6.300l5-.7z" /></svg>
          <span>{{ formatRating(whisky.averageRating) }}<span class="sr-only"> out of 5</span></span>
        </li>
      </ul>
    </div>
  </article>
</template>
