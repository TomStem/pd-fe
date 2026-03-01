<script setup>
defineOptions({
  name: "DistilleryShow",
});

const route = useRoute();
const { $contentful } = useNuxtApp();

const distillery = ref([]);

await onMounted(async () => {
  const response = await $contentful.getEntries({
    content_type: "distilleries",
    "fields.slug": route.params.slug,
    limit: 1,
  });
  distillery.value = response.items[0].fields;
});
</script>

<template>
  <div
    class="bg-stone-950 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 font-sans p-8"
  >
    <h1 class="text-3xl font-bold mb-2">{{ distillery.name }}</h1>
    <p class="text-gray-500 mb-1">
      {{ distillery?.region?.fields.regionName }},
      {{ distillery?.country?.fields.name }}
    </p>

    <h2 class="text-xl font-semibold mb-2">Location</h2>
    <DistilleriesMapLocation :location="distillery?.location" />
  </div>
</template>
