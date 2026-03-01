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
  <div class="grid md:grid-cols-3 gap-8">
    <WhiskyBottle
      v-for="whisky in whiskies"
      :key="whisky.id"
      :whisky="whisky.fields"
    />
  </div>
</template>
