<script setup lang="ts">
const tastings = await useContentFetch<TastingView[]>('/api/tastings');
usePageSeo({ title: 'Tastings', description: 'The schedule and archive of Pour Decisions tastings.' });

const route = useRoute();
const tab = computed(() => (route.query.tab === 'archive' ? 'archive' : 'upcoming'));
const visible = computed(() => tastings.value.filter(t => t.isUpcoming === (tab.value === 'upcoming')));

const tabs = [
  { key: 'upcoming', label: 'Upcoming', to: '/tastings' },
  { key: 'archive', label: 'Archive', to: { path: '/tastings', query: { tab: 'archive' } } },
] as const;
</script>

<template>
  <div>
    <PageHeader
      title="Tastings"
      kicker="Schedule"
      intro="The next theme and what came before. Upcoming or archive follows automatically from the date."
    />

    <div class="container-page pb-14">
      <nav
        aria-label="Upcoming or archive"
        class="inline-flex gap-1 rounded-full bg-line p-1"
      >
        <NuxtLink
          v-for="item in tabs"
          :key="item.key"
          :to="item.to"
          :aria-current="tab === item.key ? 'page' : undefined"
          class="rounded-full px-4 py-2 text-sm font-semibold aria-[current=page]:bg-oak aria-[current=page]:text-white"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div
        v-if="visible.length"
        class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <TastingCard
          v-for="tasting in visible"
          :key="tasting.slug"
          :tasting="tasting"
        />
      </div>
      <p
        v-else-if="tab === 'upcoming'"
        class="mt-6 text-smoke"
      >
        No tasting planned yet.
      </p>
      <p
        v-else
        class="mt-6 text-smoke"
      >
        The archive is still empty.
      </p>
    </div>
  </div>
</template>
