<script setup lang="ts">
const trips = await useContentFetch<TripView[]>('/api/trips');
usePageSeo({ title: 'Whisky trips', description: 'Reports of the multi-day whisky trips of Pour Decisions: distilleries, day-by-day reports and photos.' });
</script>

<template>
  <div>
    <PageHeader
      title="Whisky trips"
      kicker="On the road"
      intro="Reports of our trips along distilleries, with one fixed rule: bad decisions, good whisky."
    />

    <div class="container-page pb-14">
      <div
        v-if="trips.length"
        class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <TripCard
          v-for="trip in trips"
          :key="trip.slug"
          :trip="trip"
        />
      </div>
      <EmptyNote
        v-else
        class="mt-4"
      >
        No trip reports yet.
      </EmptyNote>
    </div>
  </div>
</template>
