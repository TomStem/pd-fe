<script setup>
const route = useRoute();
const { client } = useContentful();

const { data: regionData } = await useAsyncData(
  `region-${route.params.slug}`,
  async () => {
    // 1. Find the Region by its name/slug
    const regionRes = await client.getEntries({
      content_type: "regions",
      // Check Contentful to see if the ID is 'regionName' or 'name'
      "fields.regionName[match]": route.params.slug,
      limit: 1,
    });

    if (!regionRes.items.length) return null;
    const region = regionRes.items[0];

    // 2. Find Whiskies associated with this specific Region
    const whiskiesRes = await client.getEntries({
      content_type: "whiskies",
      "fields.Region.sys.id": region.sys.id,
      include: 2,
    });

    return { region, whiskies: whiskiesRes.items };
  },
);

const getRichText = (node) => node?.content?.[0]?.content?.[0]?.value || "";
</script>

<template>
  <div v-if="regionData" class="py-12">
    <!-- Breadcrumb & Header -->
    <header class="mb-16">
      <nav
        class="flex gap-2 text-xs font-mono uppercase tracking-widest text-stone-500 mb-6"
      >
        <NuxtLink to="/countries" class="hover:text-amber-500"
          >Origins</NuxtLink
        >
        <span>/</span>
        <span class="text-stone-300">{{
          regionData.region.fields.country?.fields.name
        }}</span>
      </nav>

      <h1 class="text-7xl font-serif text-white mb-6 italic">
        {{ regionData.region.fields.regionName }}
      </h1>

      <div
        class="max-w-2xl text-stone-400 leading-relaxed text-lg font-light border-l border-amber-900 pl-8"
      >
        {{ getRichText(regionData.region.fields.description) }}
      </div>
    </header>

    <!-- Spirits from this Region -->
    <section>
      <div class="flex items-center gap-4 mb-12">
        <h2 class="text-xs uppercase tracking-[0.4em] text-amber-600 font-bold">
          Regional Expressions
        </h2>
        <div class="flex-1 h-[1px] bg-stone-800"></div>
      </div>

      <div
        v-if="regionData.whiskies.length"
        class="grid grid-cols-1 md:grid-cols-3 gap-10"
      >
        <NuxtLink
          v-for="w in regionData.whiskies"
          :key="w.sys.id"
          :to="`/whiskies/${w.fields.slug}`"
          class="group"
        >
          <div
            class="aspect-[3/4] bg-stone-900 border border-stone-800 mb-6 flex items-center justify-center p-8 overflow-hidden relative"
          >
            <!-- Background shadow glow -->
            <div
              class="absolute inset-0 bg-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            ></div>

            <img
              v-if="w.fields.image"
              :src="'https:' + w.fields.image.fields.file.url"
              class="max-h-full object-contain transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3"
            />
          </div>
          <p
            class="text-amber-600 font-mono text-[10px] uppercase tracking-widest mb-1"
          >
            {{ w.fields.Distillery?.fields.name }}
          </p>
          <h4
            class="text-xl font-serif text-white group-hover:text-amber-500 transition-colors"
          >
            {{ w.fields.name }}
          </h4>
        </NuxtLink>
      </div>

      <div
        v-else
        class="py-20 text-center bg-stone-900/20 border border-dashed border-stone-800 rounded-sm"
      >
        <p class="text-stone-500 font-serif italic text-lg">
          No bottles from {{ regionData.region.fields.regionName }} currently in
          the archive.
        </p>
      </div>
    </section>
  </div>
</template>
