<script setup>
const { client } = useContentful();
const { data: tastings } = await useAsyncData("tastings", () =>
  client.getEntries({
    content_type: "tastings",
    order: "-fields.date",
    include: 3,
  }),
);

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const getImg = (f) =>
  f?.fields?.file?.url ? `https:${f.fields.file.url}` : "/logo.webp";
</script>

<template>
  <div class="max-w-7xl mx-auto py-12 px-6">
    <div class="py-12 max-w-5xl mx-auto">
      <div class="text-center mb-20">
        <h1 class="text-7xl font-serif mb-6 italic">Tastings</h1>
        <p class="text-stone-500 uppercase tracking-[0.3em] text-sm">
          Past & Upcoming Gatherings
        </p>
      </div>

      <div class="space-y-32">
        <article
          v-for="(event, index) in tastings.items"
          :key="event.sys.id"
          class="relative grid md:grid-cols-12 gap-12 items-center"
        >
          <!-- Date Marker (Desktop) -->
          <div
            class="hidden md:block absolute -left-24 top-0 text-stone-800 text-8xl font-serif font-bold opacity-20"
          >
            0{{ index + 1 }}
          </div>

          <!-- Content -->
          <div
            class="md:col-span-5"
            :class="index % 2 !== 0 ? 'md:order-2' : ''"
          >
            <div class="mb-4 flex items-center gap-4">
              <span
                class="bg-amber-900/30 text-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full"
              >
                {{ formatDate(event.fields.date) }}
              </span>
              <span class="text-stone-600 text-sm italic">{{
                event.fields.location
              }}</span>
            </div>
            <h2 class="text-4xl font-serif text-white mb-6 leading-tight">
              {{ event.fields.name }}
            </h2>
            <div
              class="prose prose-invert prose-stone text-stone-400 mb-8 line-clamp-3"
            >
              <!-- Use your Rich Text renderer here eventually -->
              {{ event.fields.description?.content?.[0]?.content?.[0]?.value }}
            </div>

            <div class="flex flex-wrap gap-2 mb-8">
              <span
                v-for="w in event.fields.whiskies"
                :key="w.sys.id"
                class="text-[11px] border border-stone-800 px-3 py-1 rounded-sm text-stone-500 uppercase tracking-tighter"
              >
                {{ w.fields.name }}
              </span>
            </div>
          </div>

          <!-- Image Gallery Stack -->
          <div
            class="md:col-span-7 relative"
            :class="index % 2 !== 0 ? 'md:order-1' : ''"
          >
            <div class="relative aspect-video group">
              <!-- Main Image -->
              <img
                :src="getImg(event.fields.images?.[0])"
                class="w-full h-full object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl"
              />
              <!-- Secondary Overlapping Image -->
              <div
                class="absolute -bottom-10 -right-10 w-1/2 aspect-square hidden md:block border-8 border-stone-950 shadow-2xl"
              >
                <img
                  :src="
                    getImg(event.fields.images?.[1]) ||
                    getImg(event.fields.images?.[0])
                  "
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
