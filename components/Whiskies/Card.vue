<script setup>
defineOptions({
  name: "WhiskiesCard",
});

defineProps({
  whisky: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <NuxtLink :to="`/whisky/${whisky.slug}`" class="group block">
    <div
      class="relative bg-stone-950 rounded-3xl shadow-sm overflow-hidden border border-stone-800 transition-all duration-500 group-hover:border-amber-900/50 group-hover:shadow-[0_0_30px_rgba(120,53,15,0.2)]"
    >
      <!-- Suble Grain Overlay for Texture -->
      <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
      ></div>

      <!-- Image Section -->
      <div
        class="relative h-64 bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
      >
        <img
          :src="whisky.image.fields.file.url"
          :alt="whisky.title"
          class="h-full w-auto object-contain z-10 transform group-hover:scale-110 transition-transform duration-700 ease-out p-6"
        />

        <!-- Ambient Glow behind bottle -->
        <div
          class="absolute inset-0 bg-radial-gradient from-amber-900/20 to-transparent opacity-50"
        ></div>

        <!-- Bottle "Reflection" Shadow -->
        <div
          class="absolute bottom-4 w-1/2 h-4 bg-black/60 blur-xl rounded-full"
        ></div>
      </div>

      <!-- Content Section -->
      <div class="p-5 relative z-20">
        <!-- Header: Name & Origin -->
        <div class="mb-4">
          <p
            class="text-[10px] tracking-[0.2em] uppercase text-white font-bold mb-1"
          >
            {{ whisky.distillery?.fields.name || "Single Malt Scotch" }}
          </p>
          <h2
            class="text-xl font-serif text-white leading-tight group-hover:text-amber-200 transition-colors"
          >
            {{ whisky.name }}
          </h2>
        </div>

        <!-- Specs Bar -->
        <div
          class="flex items-center gap-4 py-3 border-y border-stone-800/50 mb-4"
        >
          <div class="flex flex-col">
            <span
              class="text-[9px] uppercase tracking-widest text-white font-bold"
              >Age</span
            >
            <span class="text-amber-500 font-serif italic text-sm"
              >{{ whisky.age }}
              <small class="text-[10px] uppercase not-italic">yrs</small></span
            >
          </div>
          <div class="w-[1px] h-8 bg-stone-800"></div>
          <div class="flex flex-col">
            <span
              class="text-[9px] uppercase tracking-widest text-white font-bold"
              >Strength</span
            >
            <span class="text-white font-serif text-sm"
              >{{ whisky.alcoholPercentage }}%
              <small class="text-[10px] uppercase">abv</small></span
            >
          </div>
        </div>

        <!-- Cask Type (Minimalist Tags) -->
        <div class="mb-4">
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="(cask, caskDx) in whisky.cask"
              :key="caskDx"
              class="text-[10px] text-white border border-stone-800 px-2 py-0.5 rounded-sm bg-stone-900/50"
            >
              {{ cask }}
            </span>
          </div>
        </div>

        <!-- Tasting Notes: Decorative Style -->
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <div class="h-[1px] flex-1 bg-stone-800"></div>
            <span class="text-[9px] uppercase tracking-[0.3em] text-white"
              >Palate</span
            >
            <div class="h-[1px] flex-1 bg-stone-800"></div>
          </div>
          <p class="text-xs text-white italic text-center leading-relaxed">
            Dark Chocolate, Dried Figs, Peat Smoke, Sea Salt
          </p>
        </div>
      </div>

      <!-- Bottom Accent Line -->
      <div
        class="h-1 w-full bg-gradient-to-r from-transparent via-amber-700/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
      ></div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.font-serif {
  font-family:
    "Playfair Display", serif; /* Or any premium serif you have loaded */
}
.bg-radial-gradient {
  background: radial-gradient(
    circle,
    var(--tw-gradient-from) 0%,
    var(--tw-gradient-to) 70%
  );
}
</style>
