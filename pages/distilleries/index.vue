<script setup>
const { client } = useContentful();
const { data: distilleries } = await useAsyncData("distilleries", () =>
  client.getEntries({ content_type: "distilleries", order: "fields.name" }),
);

const placeholder = "/logo.webp";

const getImg = (field) =>
  field?.fields?.file?.url ? `https:${field.fields.file.url}` : placeholder;
</script>

<template>
  <div class="max-w-7xl mx-auto py-12 px-6">
    <section class="py-2">
      <div class="mb-16 text-center">
        <h2
          class="text-amber-500 font-mono tracking-[0.4em] uppercase text-xs mb-4"
        >
          The Makers
        </h2>
        <h1 class="text-6xl font-serif text-white">Distilleries</h1>
        <div class="w-24 h-1 bg-amber-900 mx-auto mt-8"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <NuxtLink
          v-for="d in distilleries.items"
          :key="d.sys.id"
          :to="`/distilleries/${d.fields.slug}`"
          class="group relative block bg-stone-900 border border-stone-800 rounded-sm overflow-hidden transition-all duration-500 hover:border-amber-600/50"
        >
          <div class="relative h-80 overflow-hidden">
            <img
              :src="getImg(d.fields.image)"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"
            ></div>

            <div
              class="absolute top-4 right-4 bg-stone-950/80 backdrop-blur-md border border-stone-700 px-3 py-1 rounded-full"
            >
              <span
                class="text-[10px] uppercase tracking-widest text-stone-300 font-bold"
              >
                {{ d.fields.Country?.fields.name }}
              </span>
            </div>
          </div>

          <div class="p-8 text-center -mt-12 relative z-10">
            <div class="bg-stone-900 p-6 border border-stone-800 shadow-2xl">
              <h2
                class="text-2xl font-serif text-white mb-2 group-hover:text-amber-500 transition-colors"
              >
                {{ d.fields.name }}
              </h2>
              <p class="text-stone-500 text-sm font-light italic mb-4">
                {{
                  d.fields.Region?.fields.regionName || "Heritage Distillery"
                }}
              </p>

              <div
                class="flex justify-center items-center gap-2 text-amber-600 uppercase tracking-widest text-[10px] font-bold"
              >
                <span>View distillery</span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Optional: Adds a subtle vignette to the card hover */
.group:hover {
  box-shadow: 0 0 40px -10px rgba(217, 119, 6, 0.15);
}
</style>
