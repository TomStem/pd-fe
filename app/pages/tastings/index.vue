<script setup lang="ts">
const tastings = await useContentFetch<TastingView[]>('/api/tastings');
usePageSeo({ title: 'Tastings', description: 'The themes Pour Decisions has tasted, newest first.' });
</script>

<template>
  <div>
    <PageHeader
      title="Tastings"
      kicker="Our evenings"
      intro="The themes we've tasted, newest first."
    />

    <div class="container-page pb-14">
      <div
        v-if="tastings.length"
        class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <TastingCard
          v-for="tasting in tastings"
          :key="tasting.slug"
          :tasting="tasting"
        />
      </div>
      <p
        v-else
        class="mt-6 text-smoke"
      >
        No tastings yet.
      </p>
    </div>
  </div>
</template>
