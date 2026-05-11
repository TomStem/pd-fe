<script setup>
const { client } = useContentful();

// Fetch all regions and include the country reference
const { data: regions } = await useAsyncData("regions-index", () =>
  client.getEntries({
    content_type: "regions",
    order: "fields.regionName",
    include: 1,
  }),
);

const getRichText = (node) =>
  node?.content?.[0]?.content?.[0]?.value ||
  "Exploring the unique terroir of this spirit-producing area.";
</script>

<template>
  <div class="max-w-7xl mx-auto py-12 px-6">
    <!-- Header -->
    <header class="mb-20 text-center">
      <h2
        class="text-amber-500 font-mono tracking-[0.4em] uppercase text-xs mb-4 font-bold"
      >
        The Atlas
      </h2>
      <h1 class="text-7xl font-serif text-white italic">Regions</h1>
      <p
        class="text-stone-500 mt-6 max-w-xl mx-auto font-light leading-relaxed"
      >
        From the peated shores of Islay to the rolling hills of Speyside,
        explore the distinct regional characteristics that define every dram.
      </p>
    </header>

    <!-- Grid Layout -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-800 border border-stone-800"
    >
      <NuxtLink
        v-for="r in regions.items"
        :key="r.sys.id"
        :to="`/regions/${r.fields.regionName.toLowerCase()}`"
        class="group relative bg-stone-950 p-12 transition-all duration-500 hover:bg-stone-900"
      >
        <div class="relative z-10">
          <span
            class="text-amber-700 font-mono text-[10px] uppercase tracking-widest mb-4 block group-hover:text-amber-500 transition-colors"
          >
            {{ r.fields.country?.fields.name || "Global" }}
          </span>

          <h3
            class="text-4xl font-serif text-white mb-6 group-hover:translate-x-2 transition-transform duration-500"
          >
            {{ r.fields.regionName }}
          </h3>

          <p
            class="text-stone-500 font-light leading-relaxed line-clamp-2 max-w-md mb-8"
          >
            {{ getRichText(r.fields.description) }}
          </p>

          <div
            class="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold"
          >
            <span>Explore Terroir</span>
            <span
              class="w-6 h-[1px] bg-stone-700 group-hover:w-12 group-hover:bg-amber-600 transition-all duration-500"
            ></span>
          </div>
        </div>

        <!-- Decorative background element -->
        <div
          class="absolute right-10 top-1/2 -translate-y-1/2 text-9xl font-serif font-black text-stone-900/40 select-none pointer-events-none group-hover:text-amber-900/10 transition-colors"
        >
          {{ r.fields.regionName.charAt(0) }}
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
