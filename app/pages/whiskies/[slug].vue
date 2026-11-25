<script setup lang="ts">
const route = useRoute();
const data = await useContentFetch<WhiskyDetail>(`/api/whiskies/${route.params.slug}`);
const whisky = computed(() => data.value.whisky);

const crumbs = computed(() => [{ label: 'Whiskies', to: '/whiskies' }, { label: whisky.value.name }]);
const place = computed(() => [...(whisky.value.isBlend ? [] : whisky.value.regions), ...whisky.value.countries].map(p => p.name).join(', '));
const single = computed(() => (whisky.value.isBlend ? undefined : whisky.value.distilleries[0]));
const distilleryPlace = (d: DistilleryRef) => [d.region?.name, d.country?.name].filter(Boolean).join(', ');

usePageSeo({
  title: whisky.value.name,
  description: `${whisky.value.name} by ${whisky.value.brand ?? whisky.value.distilleries.map(d => d.name).join(', ')}.`,
  image: whisky.value.image,
  seo: whisky.value,
});
</script>

<template>
  <div class="container-page py-8 lg:py-12">
    <Breadcrumbs :items="crumbs" />
    <p class="label-mono mt-6 text-sherry">
      <template v-if="whisky.brand">
        {{ whisky.brand }}
      </template>
      <NuxtLink
        v-else-if="single"
        :to="`/distilleries/${single.slug}`"
        class="hover:underline"
      >
        {{ single.name }}
      </NuxtLink>
      <template v-if="place">
        <template v-if="whisky.brand || single">
          ·
        </template>
        {{ place }}
      </template>
    </p>
    <h1 class="mt-2 text-4xl font-bold">
      {{ whisky.name }}
    </h1>
    <ul class="mt-4 flex flex-wrap gap-2 font-mono text-sm">
      <li
        v-if="whisky.isBlend"
        class="pill"
      >
        Blend
      </li>
      <li
        v-if="whisky.isNas"
        class="pill"
      >
        NAS
      </li>
      <li
        v-else-if="whisky.age"
        class="pill"
      >
        {{ whisky.age }} years
      </li>
      <li
        v-else
        class="pill italic text-smoke"
      >
        Age unknown
      </li>
      <li
        v-if="whisky.abv !== undefined"
        class="pill"
      >
        {{ formatAbv(whisky.abv) }}
      </li>
      <li
        v-else
        class="pill italic text-smoke"
      >
        ABV unknown
      </li>
    </ul>
    <ul
      v-if="whisky.casks.length"
      class="mt-3 flex flex-wrap gap-1.5"
      aria-label="Casks"
    >
      <li
        v-for="cask in whisky.casks"
        :key="cask"
        class="dram"
      >
        {{ caskLabel(cask) }}
      </li>
    </ul>
    <EmptyNote
      v-else
      class="mt-3 text-sm"
    >
      Casks unknown
    </EmptyNote>

    <CoverImage
      :src="whisky.image"
      :alt="whisky.name"
      :slugs="[whisky.regions[0]?.slug, whisky.countries[0]?.slug]"
      height-class="aspect-[4/3] md:aspect-[16/9]"
      placeholder="whisky"
      priority
      object-class="object-[50%_10%]"
      :image-width="1200"
      :image-height="675"
      sizes="sm:100vw md:100vw lg:1100px"
      class="mt-6 rounded-card"
    />

    <section
      v-if="whisky.isBlend || whisky.brand"
      class="mt-10"
      aria-labelledby="distilleries-heading"
    >
      <h2
        id="distilleries-heading"
        class="text-2xl font-bold"
      >
        {{ whisky.isBlend ? 'Distilleries' : 'Distillery' }}
      </h2>
      <ul
        v-if="whisky.isBlend"
        class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        <li
          v-for="distillery in whisky.distilleries"
          :key="distillery.slug"
          class="rounded-card border border-line bg-paper p-4"
        >
          <NuxtLink
            :to="`/distilleries/${distillery.slug}`"
            class="font-bold hover:underline"
          >
            {{ distillery.name }}
          </NuxtLink>
          <p
            v-if="distilleryPlace(distillery)"
            class="mt-1 text-sm text-smoke"
          >
            {{ distilleryPlace(distillery) }}
          </p>
        </li>
      </ul>
      <p
        v-else-if="single"
        class="mt-3"
      >
        <NuxtLink
          :to="`/distilleries/${single.slug}`"
          class="font-bold hover:underline"
        >
          {{ single.name }}
        </NuxtLink>
        <span
          v-if="distilleryPlace(single)"
          class="text-smoke"
        > · {{ distilleryPlace(single) }}</span>
      </p>
    </section>

    <section
      class="mt-10"
      aria-labelledby="notes-heading"
    >
      <h2
        id="notes-heading"
        class="text-2xl font-bold"
      >
        Tasting notes
      </h2>
      <RichText
        v-if="whisky.notes"
        :html="whisky.notes"
        class="mt-3"
      />
      <EmptyNote
        v-else
        class="mt-3"
      >
        No tasting notes available yet.
      </EmptyNote>
    </section>

    <section
      class="mt-10"
      aria-labelledby="reviews-heading"
    >
      <h2
        id="reviews-heading"
        class="text-2xl font-bold"
      >
        Reviews
      </h2>
      <p
        v-if="whisky.averageRating !== undefined"
        class="mt-2 text-smoke"
      >
        <StarRating :rating="whisky.averageRating" /> average, {{ whisky.reviewCount }} {{ whisky.reviewCount === 1 ? 'review' : 'reviews' }}
      </p>
      <ul
        v-if="data.reviews.length"
        class="mt-4 grid gap-4 md:grid-cols-2"
      >
        <li
          v-for="review in data.reviews"
          :key="review.id"
          class="rounded-card border border-line bg-paper p-5"
        >
          <StarRating :rating="review.rating" />
          <h3 class="mt-1 text-lg font-bold">
            {{ review.title }}
          </h3>
          <RichText
            :html="review.description"
            class="mt-2"
          />
        </li>
      </ul>
      <EmptyNote
        v-else
        class="mt-3"
      >
        No reviews yet.
      </EmptyNote>
    </section>

    <section
      class="mt-12"
      aria-labelledby="tastings-heading"
    >
      <h2
        id="tastings-heading"
        class="text-2xl font-bold"
      >
        Poured at
      </h2>
      <div
        v-if="data.tastings.length"
        class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <TastingCard
          v-for="tasting in data.tastings"
          :key="tasting.slug"
          :tasting="tasting"
        />
      </div>
      <EmptyNote
        v-else
        class="mt-3"
      >
        Not poured at a tasting yet.
      </EmptyNote>
    </section>

    <section
      v-if="data.siblings.length"
      class="mt-12"
      aria-labelledby="siblings-heading"
    >
      <h2
        id="siblings-heading"
        class="text-2xl font-bold"
      >
        {{ moreFromTitle(whisky, data.siblings) }}
      </h2>
      <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <WhiskyCard
          v-for="sibling in data.siblings"
          :key="sibling.slug"
          :whisky="sibling"
        />
      </div>
    </section>
  </div>
</template>
