<script setup>
const route = useRoute();
const { client } = useContentful();

const { data: distillery } = await useAsyncData(
  `distillery-${route.params.slug}`,
  async () => {
    const res = await client.getEntries({
      content_type: "distilleries",
      // Ensure 'fields.slug' matches your Contentful Field ID exactly
      "fields.slug": route.params.slug,
      include: 2,
    });

    // LOG THIS to your terminal/browser console to see if anything returns
    console.log("Contentful Response:", res.items);

    return {
      info: res.items[0],
      // This part might fail if res.items[0] is undefined
      whiskies: [],
    };
  },
);

const getImg = (f) =>
  f?.fields?.file?.url
    ? `https:${f.fields.file.url}`
    : "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=1200";
</script>

<template>
  <div class="max-w-7xl mx-auto py-12 px-6">
    <div v-if="distillery" class="space-y-20 mt-20">
      <!-- Hero Banner -->
      <header
        class="relative h-[60vh] -mx-6 md:-mx-12 overflow-hidden flex items-end"
      >
        <img
          :src="getImg(distillery.info.fields.image)"
          class="absolute inset-0 w-full h-full object-cover grayscale opacity-40"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"
        ></div>
        <div class="relative z-10 p-12 max-w-7xl mx-auto w-full">
          <h1 class="text-8xl font-serif text-white mb-4 leading-none">
            {{ distillery.info.fields.name }}
          </h1>
          <p class="text-amber-500 font-mono tracking-widest uppercase">
            Est. {{ distillery.info.fields.Country?.fields.name }} /
            {{ distillery.info.fields.Region?.fields.regionName }}
          </p>
        </div>
      </header>
    </div>
  </div>
</template>
