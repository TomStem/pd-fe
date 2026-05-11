<script setup>
const { client } = useContentful();
const { data: whiskies } = await useAsyncData("whiskies", () =>
  client.getEntries({
    content_type: "whiskies",
    order: "-sys.createdAt",
    include: 2,
  }),
);

const placeholder =
  "https://images.unsplash.com/photo-1599490659223-930b95c64372?q=80&w=800&auto=format&fit=crop";
const getImg = (f) =>
  f?.fields?.file?.url ? `https:${f.fields.file.url}` : placeholder;
</script>

<template>
  <div class="max-w-7xl mx-auto py-12 px-6">
    <div class="py-12">
      <div
        class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
      >
        <div class="max-w-2xl">
          <h2
            class="text-amber-500 font-mono tracking-[0.4em] uppercase text-xs mb-4 font-bold"
          >
            The Collection
          </h2>
          <h1 class="text-6xl font-serif text-white leading-tight">Whiskies</h1>
        </div>
        <div
          class="text-stone-500 font-serif italic text-xl border-l border-stone-800 pl-6"
        >
          "Whisky is liquid sunshine."
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <NuxtLink
          v-for="w in whiskies.items"
          :key="w.sys.id"
          :to="`/whiskies/${w.fields.slug}`"
          class="group relative flex bg-stone-900 border border-stone-800 rounded-sm hover:border-amber-900/50 transition-all duration-500 overflow-hidden"
        >
          <!-- Bottle Image Section -->
          <div
            class="w-1/3 bg-stone-950 p-4 flex items-center justify-center border-r border-stone-800"
          >
            <img
              :src="getImg(w.fields.image)"
              class="max-h-64 object-contain transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-2"
            />
          </div>

          <!-- Info Section -->
          <div class="w-2/3 p-8 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-4">
                <span
                  class="text-amber-600 text-[10px] uppercase tracking-[0.2em] font-bold"
                >
                  {{ w.fields.Distillery?.fields.name }}
                </span>
                <span class="text-stone-600 text-xs font-mono"
                  >#{{ w.fields.sl || "INV" }}</span
                >
              </div>
              <h3
                class="text-2xl font-serif text-white mb-2 group-hover:text-amber-500 transition"
              >
                {{ w.fields.name }}
              </h3>
              <p
                class="text-stone-500 text-sm line-clamp-2 font-light leading-relaxed mb-4"
              >
                Cask: {{ w.fields.cask?.join(", ") || "Traditional Oak" }}
              </p>
            </div>

            <div class="flex items-center gap-6 border-t border-stone-800 pt-6">
              <div class="text-center">
                <span
                  class="block text-[10px] uppercase text-stone-600 tracking-widest"
                  >ABV</span
                >
                <span class="text-stone-300 font-serif"
                  >{{ w.fields.alchoholPercentage }}%</span
                >
              </div>
              <div class="h-8 w-[1px] bg-stone-800"></div>
              <div class="text-center">
                <span
                  class="block text-[10px] uppercase text-stone-600 tracking-widest"
                  >Age</span
                >
                <span class="text-stone-300 font-serif">{{
                  w.fields.isNAS ? "NAS" : w.fields.age + "yr"
                }}</span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
