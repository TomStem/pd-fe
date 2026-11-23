<script setup lang="ts">
const whiskies = await useContentFetch<WhiskyView[]>('/api/whiskies');
usePageSeo({ title: 'Whiskies', description: 'The whiskies from our tastings, with tasting notes and reviews.' });
</script>

<template>
  <div>
    <PageHeader
      title="Whiskies"
      kicker="In the glass"
      intro="The bottles from our tastings, with tasting notes and reviews."
    />
    <div class="container-page pb-14">
      <div
        v-if="whiskies.length"
        class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <WhiskyCard
          v-for="whisky in whiskies"
          :key="whisky.slug"
          :whisky="whisky"
        />
      </div>
      <EmptyNote
        v-else
        class="mt-4"
      >
        No whiskies added yet.
      </EmptyNote>
    </div>
  </div>
</template>
