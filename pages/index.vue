<script setup>
const { client } = useContentful();

// Fetch 3 key sections in parallel
const [{ data: featuredWhiskies }, { data: nextTasting }, { data: countries }] =
  await Promise.all([
    useAsyncData("featured-whiskies", () =>
      client.getEntries({
        content_type: "whiskies",
        limit: 3,
        order: "-sys.createdAt",
      }),
    ),
    useAsyncData("next-tasting", () =>
      client.getEntries({
        content_type: "tastings",
        limit: 1,
        order: "-fields.date",
      }),
    ),
    useAsyncData("home-countries", () =>
      client.getEntries({ content_type: "countries", limit: 4 }),
    ),
  ]);

const heroImage = "/images/group.jpeg";

const getImageUrl = (imageField) => {
  console.log(imageField);

  // 1. Check if the nested Contentful structure exists
  if (imageField?.fields?.file?.url) {
    return `https:${imageField.fields.file.url}`;
  }

  // 2. Fallback: A moody, dark whisky bottle placeholder from Unsplash
  return "/logo.webp";
};
</script>

<template>
  <div class="space-y-24 pb-24">
    <section
      class="relative h-[80vh] -mt-12 flex items-center justify-center overflow-hidden"
    >
      <div class="absolute inset-0 z-0">
        <img :src="heroImage" class="w-full h-full object-cover" />
        <div
          class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#2D2520]"
        ></div>
      </div>

      <div class="relative z-10 text-center max-w-4xl px-6">
        <h1 class="text-7xl md:text-9xl font-serif mb-6 tracking-tighter">
          Pour Decisions Whisky Club
        </h1>
        <p
          class="text-xl md:text-2xl text-stone-400 font-light leading-relaxed mb-10"
        >
          Wisdom shared one dram at a time
        </p>
      </div>
    </section>

    <div class="max-w-7xl mx-auto py-12 px-6 space-y-24">
      <section>
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2
              class="text-xs uppercase tracking-[0.3em] text-amber-500 mb-2 font-bold"
            >
              New Additions
            </h2>
            <h3 class="text-4xl font-serif">Recent Acquisitions</h3>
          </div>
          <NuxtLink
            to="/whiskies"
            class="text-stone-500 hover:text-white transition border-b border-stone-800 pb-1"
            >View Full Library</NuxtLink
          >
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div
            v-for="w in featuredWhiskies.items"
            :key="w.sys.id"
            class="group"
          >
            <NuxtLink :to="`/whiskies/${w.fields.slug}`">
              <div
                class="aspect-[4/5] bg-stone-900 rounded-2xl overflow-hidden mb-6 border border-stone-800"
              >
                <img
                  :src="w.fields.image?.fields.file.url"
                  class="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
              </div>
              <p class="text-stone-500 text-sm mb-1 uppercase tracking-widest">
                {{ w.fields.Distillery?.fields.name }}
              </p>
              <h4
                class="text-2xl font-serif group-hover:text-amber-500 transition"
              >
                {{ w.fields.name }}
              </h4>
            </NuxtLink>
          </div>
        </div>
      </section>

      <section
        v-if="nextTasting.items[0]"
        class="bg-stone-900 rounded-[3rem] p-12 md:p-24 border border-stone-800 flex flex-col md:flex-row gap-16 items-center"
      >
        <div class="flex-1">
          <h2
            class="text-xs uppercase tracking-[0.3em] text-amber-500 mb-6 font-bold"
          >
            Next Event
          </h2>
          <h3 class="text-5xl font-serif mb-6">
            {{ nextTasting.items[0].fields.name }}
          </h3>
          <p class="text-lg text-stone-400 mb-8 line-clamp-3 leading-relaxed">
            Join us for our upcoming club gathering. We will be exploring a
            curated selection of rare expressions and sharing tasting notes in
            our private lounge.
          </p>
          <div class="space-y-4 mb-10">
            <div class="flex items-center gap-4 text-stone-300">
              <span class="w-8 h-[1px] bg-amber-600"></span>
              <span>{{
                new Date(nextTasting.items[0].fields.date).toLocaleDateString()
              }}</span>
            </div>
            <div class="flex items-center gap-4 text-stone-300">
              <span class="w-8 h-[1px] bg-amber-600"></span>
              <span>{{ nextTasting.items[0].fields.location }}</span>
            </div>
          </div>
          <NuxtLink
            to="/tastings"
            class="inline-block border-b-2 border-amber-600 text-amber-500 font-bold uppercase tracking-widest text-sm pb-2 hover:text-white hover:border-white transition"
          >
            Full Schedule
          </NuxtLink>
        </div>
        <div class="flex-1 w-full h-full">
          <img
            :src="getImageUrl(nextTasting.items[0].fields.images?.[0])"
            class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </div>
      </section>
    </div>
  </div>
</template>
