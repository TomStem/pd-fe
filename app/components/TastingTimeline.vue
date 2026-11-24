<script setup lang="ts">
const props = defineProps<{ tastings: TastingView[] }>();

const sections = computed(() => timelineSections(props.tastings));
const MAX_PLACES = 3;
const placesOf = (tasting: TastingView) => tastingPlaces(tasting);
</script>

<template>
  <ol
    class="relative space-y-8 border-l-2 border-line pl-6"
    aria-label="Tastings timeline"
  >
    <li
      v-for="section in sections"
      :key="`${section.year}-${section.tastings[0]!.slug}`"
    >
      <h2 class="relative font-display text-2xl font-bold">
        <span
          class="absolute -left-[2.1rem] top-1/2 size-3.5 -translate-y-1/2 rounded-full border-2 border-sherry bg-cream"
          aria-hidden="true"
        />
        {{ section.year }}
      </h2>
      <ul class="mt-4 space-y-3">
        <li
          v-for="tasting in section.tastings"
          :key="tasting.slug"
          class="relative"
        >
          <span
            class="absolute -left-[1.9rem] top-6 size-2.5 rounded-full bg-sherry"
            aria-hidden="true"
          />
          <article class="card flex gap-3 p-3 sm:gap-4">
            <CoverImage
              :src="tasting.image"
              :alt="tasting.title"
              height-class="aspect-[3/2]"
              :image-width="400"
              :image-height="267"
              class="w-28 shrink-0 rounded-lg sm:w-40"
            >
              <template #placeholder>
                <TastingPlaceholder :slug="tasting.slug" />
              </template>
            </CoverImage>
            <div class="min-w-0 flex-1">
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
                v-if="tasting.location"
                class="mt-0.5 text-sm text-smoke"
              >
                {{ tasting.location }}
              </p>
              <ul
                v-if="placesOf(tasting).length"
                class="mt-2 flex flex-wrap gap-1.5"
                aria-label="Places"
              >
                <li
                  v-for="place in placesOf(tasting).slice(0, MAX_PLACES)"
                  :key="place.key"
                  class="dram"
                >
                  {{ place.label }}
                </li>
                <li
                  v-if="placesOf(tasting).length > MAX_PLACES"
                  class="dram"
                >
                  +{{ placesOf(tasting).length - MAX_PLACES }}
                </li>
              </ul>
            </div>
          </article>
        </li>
      </ul>
    </li>
  </ol>
</template>
