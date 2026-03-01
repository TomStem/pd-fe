<script setup>
defineProps({
  whisky: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div
    class="max-w-md mx-auto bg-stone-950 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 font-sans"
  >
    <div class="relative h-72 bg-stone-900 overflow-hidden">
      <img
        :src="whisky.image.fields.file.url"
        :alt="'whisky'"
        class="w-full h-full object-contain p-4 transform hover:scale-105 transition-transform duration-500"
      />
      <div
        class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-950 to-transparent h-24"
      ></div>
    </div>

    <div class="p-5 space-y-4">
      <div class="flex justify-between items-start">
        <h2 class="text-2xl font-serif font-bold text-stone-100">
          {{ whisky.name }}
        </h2>
        <div
          class="bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full"
        >
          <span class="text-gold text-sm font-semibold"
            >{{ whisky.age }} Years</span
          >
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 py-4 border-y border-stone-800">
        <div>
          <p class="text-stone-500 text-xs uppercase">Strength</p>
          <p class="text-stone-200 font-medium">
            {{ whisky.alcoholPercentage }}%
          </p>
        </div>
        <div>
          <p class="text-stone-500 text-xs uppercase">Cask Type</p>
          <span
            v-for="(cask, caskDx) in whisky.cask"
            :key="caskDx"
            class="px-2 py-1 bg-stone-900 text-stone-300 text-xs rounded border border-stone-700"
          >
            {{ cask }}
          </span>
        </div>
      </div>

      <div>
        <p class="text-stone-500 text-xs uppercase mb-2">Tasting Notes</p>
        <div class="flex flex-wrap gap-2">
          <span
            class="px-2 py-1 bg-stone-900 text-stone-300 text-xs rounded border border-stone-700"
            >Dark Chocolate</span
          >
          <span
            class="px-2 py-1 bg-stone-900 text-stone-300 text-xs rounded border border-stone-700"
            >Dried Figs</span
          >
          <span
            class="px-2 py-1 bg-stone-900 text-stone-300 text-xs rounded border border-stone-700"
            >Peat Smoke</span
          >
          <span
            class="px-2 py-1 bg-stone-900 text-stone-300 text-xs rounded border border-stone-700"
            >Sea Salt</span
          >
        </div>
      </div>

      <button
        class="w-full bg-amber-600 hover:bg-amber-500 text-gold font-bold py-3 rounded-lg transition-colors duration-200 mt-2"
      >
        View distillery
      </button>
    </div>
  </div>
</template>
