<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{ error: NuxtError }>();

const notFound = computed(() => props.error.statusCode === 404);
useSeoMeta({ title: notFound.value ? 'Page not found' : 'Something went wrong', robots: 'noindex' });
</script>

<template>
  <NuxtLayout>
    <section class="container-page py-24 text-center">
      <p class="label-mono text-sherry">
        Error {{ error.statusCode }}
      </p>
      <h1 class="mt-3 text-4xl font-bold sm:text-5xl">
        {{ notFound ? 'This bottle is empty.' : 'That was not a good decision.' }}
      </h1>
      <p class="mx-auto mt-4 max-w-prose text-smoke">
        {{ notFound ? 'The page you are looking for does not exist (anymore). Maybe it moved, or someone drank it.' : 'Something went wrong on our side. Please try again later.' }}
      </p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          class="btn btn-sherry"
          @click="clearError({ redirect: '/' })"
        >
          Back to the homepage
        </button>
        <NuxtLink
          to="/tastings"
          class="btn btn-ghost-light"
          @click="clearError()"
        >
          See the tastings
        </NuxtLink>
      </div>
    </section>
  </NuxtLayout>
</template>
