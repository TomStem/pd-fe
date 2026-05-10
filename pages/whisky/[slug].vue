<script setup>
defineOptions({
  name: "WhiskyShow",
});

const route = useRoute();
const { $contentful } = useNuxtApp();

const whisky = ref(null);
const reviews = ref([]);

onMounted(async () => {
  const whiskies = await $contentful.getEntries({
    content_type: "whiskies",
    "fields.slug": route.params.slug,
    limit: 1,
  });

  whisky.value = whiskies.items[0]?.fields;

  // // Example reviews fetch (adjust content_type + field reference)
  // const reviewEntries = await $contentful.getEntries({
  //   content_type: "reviews",
  //   "fields.whiskySlug": route.params.slug,
  // });

  // reviews.value = reviewEntries.items.map((r) => r.fields);
});
</script>

<template>
  <div class="bg-[#2b1d14] min-h-screen flex justify-center p-6">
    <div
      v-if="whisky"
      class="bg-black text-white rounded-2xl shadow-xl max-w-md w-full p-6"
    >
      <!-- Image -->
      <div class="flex justify-center mb-6">
        <img
          :src="whisky.image?.fields?.file?.url"
          class="h-72 object-contain"
        />
      </div>

      <!-- Title -->
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-3xl font-semibold">{{ whisky.name }}</h1>
        <span
          class="border border-yellow-500 text-yellow-400 px-3 py-1 rounded-full text-sm"
        >
          {{ whisky.age }} Years
        </span>
      </div>

      <div class="border-t border-gray-700 my-4"></div>

      <!-- Strength + Cask -->
      <div class="flex justify-between mb-4">
        <div>
          <p class="text-gray-400 text-sm">STRENGTH</p>
          <p class="text-xl font-semibold">{{ whisky.strength }}%</p>
        </div>

        <div class="text-right">
          <p class="text-gray-400 text-sm">CASK TYPE</p>
          <span class="bg-gray-800 px-3 py-1 rounded-md text-sm">
            {{ whisky.caskType }}
          </span>
        </div>
      </div>

      <div class="border-t border-gray-700 my-4"></div>

      <!-- Tasting Notes -->
      <div class="mb-6">
        <p class="text-gray-400 text-sm mb-2">TASTING NOTES</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="note in whisky.tastingNotes"
            :key="note"
            class="bg-gray-800 px-3 py-1 rounded-md text-sm"
          >
            {{ note }}
          </span>
        </div>
      </div>

      <!-- Reviews -->
      <div class="border-t border-gray-700 pt-4">
        <p class="text-gray-400 text-sm mb-3">REVIEWS</p>

        <div v-if="reviews.length === 0" class="text-gray-500 text-sm">
          No reviews yet.
        </div>

        <div v-for="(review, index) in reviews" :key="index" class="mb-4">
          <div class="flex items-center justify-between">
            <p class="font-semibold">{{ review.author }}</p>

            <!-- Read-only stars -->
            <div class="text-yellow-400 text-sm">
              <span v-for="i in 5" :key="i">
                {{ i <= review.rating ? "★" : "☆" }}
              </span>
            </div>
          </div>

          <p class="text-gray-300 text-sm mt-1">
            {{ review.comment }}
          </p>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center mt-6">
        <button class="text-yellow-400 font-semibold hover:underline">
          View distillery
        </button>
      </div>
    </div>
  </div>
</template>
