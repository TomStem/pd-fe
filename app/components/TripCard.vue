<script setup lang="ts">
const props = defineProps<{ trip: TripView }>();

const primaryRegion = computed(() => props.trip.regions[0]);
const tag = computed(() => [primaryRegion.value?.name, `${tripLength(props.trip.startDate, props.trip.endDate)} dagen`].filter(Boolean).join(' · '));
</script>

<template>
  <article class="card flex h-full flex-col">
    <CoverImage
      :src="trip.image"
      :alt="trip.title"
      :slugs="[primaryRegion?.slug, primaryRegion?.country.slug]"
      :tag="tag"
      height-class="h-40"
    />
    <div class="flex flex-1 flex-col p-4">
      <h3 class="text-lg font-bold">
        <NuxtLink
          :to="`/trips/${trip.slug}`"
          class="stretched-link"
        >
          {{ trip.title }}
        </NuxtLink>
      </h3>
      <p
        v-if="trip.summary"
        class="mt-1 text-sm text-smoke"
      >
        {{ trip.summary }}
      </p>
      <p class="mt-auto pt-3 text-sm text-smoke">
        {{ formatDateRange(trip.startDate, trip.endDate) }}
      </p>
    </div>
  </article>
</template>
