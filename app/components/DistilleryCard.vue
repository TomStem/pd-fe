<script setup lang="ts">
const props = defineProps<{ distillery: DistilleryView }>();

const place = computed(() => [props.distillery.region?.name, props.distillery.country.name].filter(Boolean).join(' · '));
const facts = computed(() => [props.distillery.town, props.distillery.founded].filter(Boolean));
</script>

<template>
  <article class="card flex h-full flex-col">
    <CoverImage
      :src="distillery.image"
      :alt="distillery.name"
      :slugs="[distillery.region?.slug, distillery.country.slug]"
      height-class="h-24"
    />
    <div class="flex flex-1 flex-col p-4">
      <p class="label-mono text-sherry">
        {{ place }}
      </p>
      <h3 class="mt-1 text-lg font-bold">
        <NuxtLink
          :to="`/distilleries/${distillery.slug}`"
          class="stretched-link"
        >
          {{ distillery.name }}
        </NuxtLink>
      </h3>
      <p
        v-if="distillery.summary"
        class="mt-1 text-sm text-smoke"
      >
        {{ distillery.summary }}
      </p>
      <p
        v-if="facts.length"
        class="mt-auto pt-3 text-sm text-smoke"
      >
        {{ facts.join(' · ') }}
      </p>
    </div>
  </article>
</template>
