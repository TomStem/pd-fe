<script setup>
const { $contentful } = useNuxtApp();

const whiskies = ref([]);

await onMounted(async () => {
  const response = await $contentful.getEntries({
    content_type: "whiskies", // your Contentful content type
    order: "-sys.createdAt",
  });
  whiskies.value = response.items;
});
</script>

<template>
  <div class="container mx-auto px-4 py-4">
    <h1 class="text-3xl font-bold mb-6">Whiskies</h1>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
    >
      <WhiskiesCard
        v-for="whisky in whiskies"
        :key="whisky.id"
        :whisky="whisky.fields"
      />
    </div>
  </div>
</template>
