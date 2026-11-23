<script setup lang="ts">
const props = defineProps<{ country: CountryView }>();

const facts = computed(() => [
  props.country.regionCount && `${props.country.regionCount} ${props.country.regionCount === 1 ? 'region' : 'regions'}`,
  props.country.distilleryCount && `${props.country.distilleryCount} ${props.country.distilleryCount === 1 ? 'distillery' : 'distilleries'}`,
].filter(Boolean));
</script>

<template>
  <article class="card flex h-full flex-col">
    <CoverImage
      :src="country.image"
      :alt="country.name"
      :slugs="[country.slug]"
      height-class="aspect-[8/3]"
      :image-width="1200"
      :image-height="450"
    />
    <div class="flex flex-1 flex-col p-4">
      <h3 class="text-lg font-bold">
        <NuxtLink
          :to="`/countries/${country.slug}`"
          class="stretched-link"
        >
          <span
            v-if="country.flag"
            aria-hidden="true"
          >{{ country.flag }}</span> {{ country.name }}
        </NuxtLink>
      </h3>
      <p
        v-if="country.summary"
        class="mt-1 text-sm text-smoke"
      >
        {{ country.summary }}
      </p>
      <p
        v-if="facts.length"
        class="mt-auto pt-3 font-mono text-xs text-smoke"
      >
        {{ facts.join(' · ') }}
      </p>
    </div>
  </article>
</template>
