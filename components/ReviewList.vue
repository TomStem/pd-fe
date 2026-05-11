<script setup>
const props = defineProps(["whiskyId"]);
const { client } = useContentful();

const { data: reviews } = await useAsyncData(`reviews-${props.whiskyId}`, () =>
  client.getEntries({
    content_type: "reviews",
    "fields.whisky.sys.id": props.whiskyId,
    include: 2,
  }),
);

// Helper to extract text from Rich Text if description is not a simple string
const getReviewText = (desc) => {
  if (typeof desc === "string") return desc;
  return (
    desc?.content?.[0]?.content?.[0]?.value || "No written review provided."
  );
};
</script>

<template>
  <div class="mt-20 pt-12 border-t border-stone-800">
    <div class="flex items-center justify-between mb-10">
      <h3 class="text-3xl font-serif text-white italic">Member Impressions</h3>
      <span
        v-if="reviews?.items.length"
        class="text-stone-500 text-xs uppercase tracking-widest"
      >
        {{ reviews.items.length }} Review{{
          reviews.items.length > 1 ? "s" : ""
        }}
      </span>
    </div>

    <div v-if="reviews?.items.length" class="grid gap-6">
      <div
        v-for="rev in reviews.items"
        :key="rev.sys.id"
        class="bg-stone-900/30 border border-stone-800 p-8 rounded-sm relative overflow-hidden group"
      >
        <!-- Score Watermark -->
        <div
          class="absolute -right-4 -bottom-4 text-8xl font-serif font-bold text-stone-800/20 group-hover:text-amber-900/20 transition-colors"
        >
          {{ rev.fields.rating }}
        </div>

        <div class="relative z-10">
          <div class="flex items-center gap-4 mb-4">
            <div
              class="bg-amber-600 text-black font-mono text-sm font-bold px-2 py-1"
            >
              {{ rev.fields.rating }}/100
            </div>
            <h4 class="text-xl font-serif text-amber-50">
              {{ rev.fields.title }}
            </h4>
          </div>

          <blockquote
            class="text-stone-400 leading-relaxed italic border-l-2 border-stone-800 pl-6 my-4"
          >
            "{{ getReviewText(rev.fields.description) }}"
          </blockquote>
        </div>
      </div>
    </div>

    <div
      v-else
      class="bg-stone-900/20 border border-dashed border-stone-800 p-12 text-center rounded-lg"
    >
      <p class="text-stone-500 font-serif italic">
        This bottle hasn't been reviewed by the club members yet.
      </p>
    </div>
  </div>
</template>
