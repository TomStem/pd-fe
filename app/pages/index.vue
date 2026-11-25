<script setup lang="ts">
const home = await useContentFetch<HomeData>('/api/home');
usePageSeo({ title: 'Pour decisions. Good whisky.' });

const next = computed(() => home.value.nextTasting ?? home.value.latestTasting);
const nextLabel = computed(() =>
  home.value.nextTasting ? 'Next tasting' : 'Latest tasting',
);
const nextPlaces = computed(
  () => next.value && placeTag(tastingPlaces(next.value)),
);
const showTastings = computed(
  () => home.value.tastings.length > 0 || !next.value,
);
</script>

<template>
  <div>
    <HeroSection image="/hero-glencoe.jpg">
      <p
        class="label-mono inline-block rounded-full border border-amber/60 px-3 py-1 text-amber"
      >
        Whisky club
      </p>
      <h1 class="mt-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
        Pour decisions.<br><em class="font-medium text-amber">Good whisky.</em>
      </h1>
      <p class="mt-4 max-w-[46ch] text-ash">
        We taste, travel and argue about whisky. From Islay smoke to Japanese
        finesse: pull up a chair for the next dram.
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <NuxtLink
          to="/tastings"
          class="btn btn-primary"
        >
          View tastings
        </NuxtLink>
        <NuxtLink
          to="/trips"
          class="btn btn-ghost"
        > Our trips </NuxtLink>
      </div>

      <template #aside>
        <article
          v-if="next"
          class="relative rounded-2xl border border-ember bg-cask p-5"
        >
          <div class="flex gap-4">
            <CoverImage
              :src="next.image"
              :alt="next.title"
              height-class="size-24"
              class="shrink-0 rounded-xl"
              :image-width="192"
              :image-height="192"
              sizes="96px"
              priority
            >
              <template #placeholder>
                <TastingPlaceholder :slug="next.slug" />
              </template>
            </CoverImage>
            <div class="min-w-0">
              <p class="label-mono text-amber">
                {{ nextLabel }} · {{ formatDayMonth(next.date) }}
              </p>
              <h2 class="mt-2 text-xl font-bold">
                <NuxtLink
                  :to="`/tastings/${next.slug}`"
                  class="stretched-link"
                >
                  {{ next.title }}
                </NuxtLink>
              </h2>
              <p class="mt-1 text-sm text-ash">
                {{
                  [next.location, formatTime(next.date)].filter(Boolean).join(' · ')
                }}
              </p>
            </div>
          </div>
          <p
            v-if="nextPlaces"
            class="mt-3 text-sm text-amber"
          >
            {{ nextPlaces }}
          </p>
          <span class="btn btn-primary mt-5">View details</span>
        </article>
      </template>
    </HeroSection>

    <SectionBlock
      v-if="showTastings"
      title="Tastings"
      to="/tastings"
      link-label="All tastings"
    >
      <div
        v-if="home.tastings.length"
        class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <TastingCard
          v-for="(tasting, index) in home.tastings"
          :key="tasting.slug"
          :tasting="tasting"
          :priority="index < 3"
        />
      </div>
      <p
        v-else
        class="mt-4 text-smoke"
      >
        No tastings yet.
      </p>
    </SectionBlock>

    <SectionBlock
      title="Whisky trips"
      to="/trips"
      link-label="All trips"
    >
      <div
        v-if="home.trips.length"
        class="mt-5 grid gap-4 sm:grid-cols-2"
      >
        <TripCard
          v-for="trip in home.trips"
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
    </SectionBlock>

    <SectionBlock
      title="Explore by country"
      to="/countries"
      link-label="All countries"
    >
      <div
        v-if="home.countries.length"
        class="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <CountryCard
          v-for="country in home.countries"
          :key="country.slug"
          :country="country"
        />
      </div>
      <EmptyNote
        v-else
        class="mt-4"
      >
        No countries with content yet.
      </EmptyNote>
    </SectionBlock>

    <StatTiles :stats="home.stats" />
  </div>
</template>
