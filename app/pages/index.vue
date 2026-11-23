<script setup lang="ts">
const home = await useContentFetch<HomeData>('/api/home');
usePageSeo({ title: 'Bad decisions. Good whisky.' });

const next = computed(() => home.value.nextTasting);
const nextPlaces = computed(() => next.value && placeTag(tastingPlaces(next.value)));
</script>

<template>
  <div>
    <HeroSection>
      <p class="label-mono inline-block rounded-full border border-amber/60 px-3 py-1 text-amber">
        Whisky club
      </p>
      <h1 class="mt-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
        Bad decisions.<br><em class="font-medium text-amber">Good whisky.</em>
      </h1>
      <p class="mt-4 max-w-[46ch] text-ash">
        We taste, travel and argue about whisky. From Islay smoke to Japanese finesse: pull up a chair for the next dram.
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <NuxtLink
          to="/tastings"
          class="btn btn-primary"
        >
          View the schedule
        </NuxtLink>
        <NuxtLink
          to="/trips"
          class="btn btn-ghost"
        >
          Our trips
        </NuxtLink>
      </div>

      <template #aside>
        <article
          v-if="next"
          class="relative rounded-2xl border border-ember bg-cask p-5"
        >
          <p class="label-mono text-amber">
            Next tasting · {{ formatDayMonth(next.date) }}
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
            {{ [next.location, formatTime(next.date)].filter(Boolean).join(' · ') }}
          </p>
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
      title="Upcoming tastings"
      to="/tastings"
    >
      <div
        v-if="home.upcomingTastings.length"
        class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <TastingCard
          v-for="tasting in home.upcomingTastings"
          :key="tasting.slug"
          :tasting="tasting"
        />
      </div>
      <p
        v-else
        class="mt-4 text-smoke"
      >
        No tasting planned yet.
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

    <SectionBlock title="Explore by country">
      <ul
        v-if="home.countries.length"
        class="mt-5 flex flex-wrap gap-2"
      >
        <li
          v-for="country in home.countries"
          :key="country.slug"
        >
          <NuxtLink
            :to="`/countries/${country.slug}`"
            class="pill hover:border-sherry"
          >
            <span
              v-if="country.flag"
              aria-hidden="true"
            >{{ country.flag }}</span> {{ country.name }}
            <b
              v-if="country.regionCount"
              class="font-semibold text-sherry"
            >{{ country.regionCount }} {{ country.regionCount === 1 ? 'region' : 'regions' }}</b>
          </NuxtLink>
        </li>
      </ul>
      <EmptyNote
        v-else
        class="mt-4"
      >
        No countries with content yet.
      </EmptyNote>
    </SectionBlock>
  </div>
</template>
