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
  <div
    class="bg-stone-950 rounded-xl overflow-hidden shadow-lg border border-stone-800"
  >
    <div class="relative h-52 bg-stone-900 overflow-hidden">
      <img
        :src="whisky.image.fields.file.url"
        :alt="whisky.title"
        class="absolute inset-0 h-full w-full object-contain transform hover:scale-105 transition-transform duration-500 p-4"
      />
      <div
        class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-950 to-transparent h-16"
      ></div>
    </div>

    <div class="p-3 space-y-2">
      <div class="flex justify-between items-start">
        <h2 class="text-lg font-serif font-bold text-stone-100">
          {{ whisky.name }}
        </h2>
        <div
          class="bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full"
        >
          <span class="text-gold text-xs font-semibold"
            >{{ whisky.age }} Years</span
          >
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 py-2 border-y border-stone-800">
        <div>
          <p class="text-stone-500 text-[10px] uppercase">Strength</p>
          <p class="text-stone-200 font-medium text-sm">
            {{ whisky.alcoholPercentage }}%
          </p>
        </div>
        <div>
          <p class="text-stone-500 text-[10px] uppercase mb-1">Cask Type</p>
          <span
            v-for="(cask, caskDx) in whisky.cask"
            :key="caskDx"
            class="px-1 py-0.5 bg-stone-900 text-stone-300 text-[10px] rounded border border-stone-700"
          >
            {{ cask }}
          </span>
        </div>
      </div>

      <div>
        <p class="text-stone-500 text-[10px] uppercase mb-1">Tasting Notes</p>
        <div class="flex flex-wrap gap-1">
          <span
            class="px-1 py-0.5 bg-stone-900 text-stone-300 text-[10px] rounded border border-stone-700"
            >Dark Chocolate</span
          >
          <span
            class="px-1 py-0.5 bg-stone-900 text-stone-300 text-[10px] rounded border border-stone-700"
            >Dried Figs</span
          >
          <span
            class="px-1 py-0.5 bg-stone-900 text-stone-300 text-[10px] rounded border border-stone-700"
            >Peat Smoke</span
          >
          <span
            class="px-1 py-0.5 bg-stone-900 text-stone-300 text-[10px] rounded border border-stone-700"
            >Sea Salt</span
          >
        </div>
      </div>

      <div v-if="whisky.distillery" class="p-2 text-center">
        <NuxtLink
          :to="`/distillery/${whisky.distillery.fields.slug}`"
          class="w-full bg-amber-600 hover:bg-amber-500 text-gold font-bold rounded-lg transition-colors duration-200"
        >
          View distillery
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
