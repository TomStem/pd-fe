<script setup lang="ts">
const props = defineProps<{ tasting: TastingView }>();

const tag = computed(() => placeTag(tastingPlaces(props.tasting)));
</script>

<template>
  <article class="card flex h-full flex-col">
    <CoverImage
      :src="tasting.image"
      :alt="tasting.title"
      :tag="tag"
      height-class="aspect-[8/3]"
      :image-width="1200"
      :image-height="450"
    >
      <template #placeholder>
        <TastingPlaceholder :slug="tasting.slug" />
      </template>
    </CoverImage>
    <div class="flex flex-1 flex-col p-4">
      <p class="label-mono text-sherry">
        <time :datetime="tasting.date">{{ formatDayMonth(tasting.date) }} · {{ formatTime(tasting.date) }}</time>
      </p>
      <h3 class="mt-1 text-lg font-bold">
        <NuxtLink
          :to="`/tastings/${tasting.slug}`"
          class="stretched-link"
        >
          {{ tasting.title }}
        </NuxtLink>
      </h3>
      <p
        v-if="tasting.summary"
        class="mt-1 text-sm text-smoke"
      >
        {{ tasting.summary }}
      </p>
      <p
        v-if="tasting.location"
        class="mt-auto pt-3 text-sm text-smoke"
      >
        {{ tasting.location }}
      </p>
    </div>
  </article>
</template>
