<script setup>
const route = useRoute();
const { client } = useContentful();

const { data: geoData, error } = await useAsyncData(
  `geo-${route.params.slug}`,
  async () => {
    // 1. Fetch Country (Using [match] for case-insensitivity)
    // If your URL is /countries/scotland, this will find "Scotland"
    const countryRes = await client.getEntries({
      content_type: "countries",
      "fields.name[match]": route.params.slug,
      limit: 1,
    });

    if (!countryRes.items.length) {
      console.error("No country found for slug:", route.params.slug);
      return null;
    }

    const country = countryRes.items[0];

    // 2. Fetch Regions and Whiskies in parallel using the Country's SYSTEM ID
    const [regionsRes, whiskiesRes] = await Promise.all([
      client.getEntries({
        content_type: "regions",
        "fields.country.sys.id": country.sys.id, // Links Region -> Country
      }),
      client.getEntries({
        content_type: "whiskies",
        "fields.Country.sys.id": country.sys.id, // Links Whisky -> Country
        include: 2,
      }),
    ]);

    return {
      country,
      regions: regionsRes.items,
      whiskies: whiskiesRes.items,
    };
  },
);

// Helper for image URLs
const getImg = (f) =>
  f?.fields?.file?.url
    ? `https:${f.fields.file.url}`
    : "https://images.unsplash.com/photo-1527030280862-64139fba04ca?w=800";
</script>

<template>
  <div v-if="geoData" class="py-12 space-y-24">
    <!-- Header Section -->
    <header class="max-w-3xl">
      <NuxtLink
        to="/countries"
        class="text-amber-600 text-xs font-mono uppercase tracking-widest mb-8 inline-block hover:text-white transition"
        >← All Origins</NuxtLink
      >
      <h1 class="text-7xl font-serif text-white mb-6 leading-none">
        {{ geoData.country.fields.name }}
      </h1>
      <p class="text-xl text-stone-400 font-light leading-relaxed italic">
        {{ getRichText(geoData.country.fields.description) }}
      </p>
    </header>

    <!-- Regions Grid -->
    <section v-if="geoData.regions.length">
      <h3
        class="text-xs uppercase tracking-[0.3em] text-stone-500 mb-8 font-bold border-b border-stone-800 pb-4"
      >
        Distinction by Region
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="r in geoData.regions"
          :key="r.sys.id"
          class="p-6 bg-stone-900 border border-stone-800"
        >
          <h4 class="text-xl font-serif text-amber-50 mb-2">
            {{ r.fields.regionName }}
          </h4>
          <p class="text-stone-500 text-sm font-light line-clamp-3">
            {{ getRichText(r.fields.description) }}
          </p>
        </div>
      </div>
    </section>

    <!-- Whisky List -->
    <section>
      <h3
        class="text-xs uppercase tracking-[0.3em] text-stone-500 mb-12 font-bold border-b border-stone-800 pb-4"
      >
        The Spirits of {{ geoData.country.fields.name }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <NuxtLink
          v-for="w in geoData.whiskies"
          :key="w.sys.id"
          :to="`/whiskies/${w.fields.slug}`"
          class="flex gap-6 items-center bg-stone-900/40 p-4 border border-stone-800 hover:border-amber-900/50 transition group"
        >
          <div
            class="w-24 h-32 bg-stone-950 flex-shrink-0 p-2 flex items-center justify-center"
          >
            <img
              :src="'https:' + w.fields.image?.fields?.file?.url"
              class="max-h-full object-contain group-hover:scale-110 transition duration-500"
              v-if="w.fields.image"
            />
          </div>
          <div>
            <span
              class="text-[10px] text-amber-600 uppercase font-mono tracking-tighter"
              >{{ w.fields.Distillery?.fields.name }}</span
            >
            <h4
              class="text-xl font-serif text-white group-hover:text-amber-500 transition"
            >
              {{ w.fields.name }}
            </h4>
            <p class="text-stone-500 text-xs mt-2">
              {{ w.fields.alchoholPercentage }}% ABV •
              {{ w.fields.isNAS ? "NAS" : w.fields.age + "yr" }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
