<template>
  <section
    class="dark-zone bg-peat text-malt"
    style="background-image: radial-gradient(600px 300px at 80% 20%, color-mix(in srgb, var(--color-amber) 28%, transparent), transparent 70%)"
  >
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
