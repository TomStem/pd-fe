<script setup lang="ts">
defineProps<{ image?: string }>();
</script>

<template>
  <section
    class="dark-zone relative isolate overflow-hidden bg-peat text-malt"
    style="background-image: radial-gradient(600px 300px at 80% 20%, color-mix(in srgb, var(--color-amber) 28%, transparent), transparent 70%)"
  >
    <div
      v-if="image"
      class="absolute inset-0 -z-10"
      aria-hidden="true"
    >
      <div
        class="absolute inset-0 bg-cover bg-no-repeat opacity-35 grayscale-[35%]"
        :style="{ backgroundImage: `url(${image})`, backgroundPosition: 'center 70%' }"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-peat via-peat/70 to-peat/30" />
      <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-peat to-transparent" />
    </div>
    <div class="container-page grid items-center gap-8 py-14 sm:py-16 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <slot />
      </div>
      <div v-if="$slots.aside">
        <slot name="aside" />
      </div>
    </div>
  </section>
</template>
