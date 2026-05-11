<script setup>
const route = useRoute();
const { client } = useContentful();

const { data: whisky } = await useAsyncData(
  `whisky-${route.params.slug}`,
  async () => {
    const res = await client.getEntries({
      content_type: "whiskies",
      "fields.slug": route.params.slug,
      include: 2,
    });
    return res.items[0];
  },
);

const getImg = (f) =>
  f?.fields?.file?.url
    ? `https:${f.fields.file.url}`
    : "https://images.unsplash.com/photo-1599490659223-930b95c64372?w=800";
</script>

<template>
  <div class="max-w-7xl mx-auto py-12 px-6">
    <div v-if="whisky" class="py-12">
      <div class="grid lg:grid-cols-12 gap-16 items-start">
        <!-- Left: Massive Bottle Image -->
        <div class="lg:col-span-5 sticky top-32">
          <div
            class="bg-stone-900 rounded-3xl p-12 flex justify-center border border-stone-800 shadow-2xl overflow-hidden relative group"
          >
            <div
              class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent"
            ></div>
            <img
              :src="getImg(whisky.fields.image)"
              class="max-h-[600px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        <!-- Right: Content -->
        <div class="lg:col-span-7">
          <header class="mb-12">
            <NuxtLink
              :to="`/distilleries/${whisky.fields.Distillery?.fields.slug}`"
              class="text-amber-500 font-mono tracking-widest uppercase text-sm hover:text-white transition"
            >
              {{ whisky.fields.Distillery?.fields.name }}
            </NuxtLink>
            <h1 class="text-7xl font-serif text-white mt-4 mb-6 leading-none">
              {{ whisky.fields.name }}
            </h1>
            <div class="flex gap-4">
              <span
                class="px-4 py-1 border border-stone-700 rounded-full text-stone-400 text-xs uppercase tracking-widest"
              >
                {{ whisky.fields.Region?.fields.regionName }}
              </span>
              <span
                class="px-4 py-1 border border-stone-700 rounded-full text-stone-400 text-xs uppercase tracking-widest"
              >
                {{ whisky.fields.Country?.fields.name }}
              </span>
            </div>
          </header>

          <!-- Stats Grid -->
          <div
            class="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8 border-y border-stone-800 mb-12"
          >
            <div
              v-for="(val, label) in {
                ABV: whisky.fields.alchoholPercentage + '%',
                Age: whisky.fields.isNAS ? 'NAS' : whisky.fields.age + ' Years',
                Cask: whisky.fields.cask?.[0],
                Ref: '#' + (whisky.fields.sl || '000'),
              }"
              :key="label"
            >
              <span
                class="block text-[10px] text-stone-500 uppercase tracking-tighter mb-1"
                >{{ label }}</span
              >
              <span class="text-xl font-serif text-amber-50">{{ val }}</span>
            </div>
          </div>

          <section class="mb-12">
            <h3 class="text-xl font-serif text-white mb-4 italic">
              Tasting Notes
            </h3>
            <div
              class="prose prose-invert prose-amber max-w-none text-stone-400 leading-loose"
            >
              <!-- Simplified rendering: replace with RichText component for production -->
              {{
                whisky.fields.notes?.content?.[0]?.content?.[0]?.value ||
                "No notes available yet."
              }}
            </div>
          </section>

          <!-- Related Reviews (Component we discussed earlier) -->
          <div v-if="whisky" class="max-w-7xl mx-auto px-6 py-12">
            <!-- ... Your existing Whisky Detail Code (Image, Stats, etc.) ... -->

            <!-- ADD THE REVIEW LIST HERE -->
            <!-- Place it at the bottom of the content column or across the full width -->
            <div class="mt-12">
              <ReviewList :whiskyId="whisky.sys.id" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
