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
});
</script>

<template>
  <div
    class="bg-stone-950 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 font-sans p-8"
  >
    <h1 class="text-3xl font-bold mb-2">{{ whisky.name }}</h1>
  </div>
</template>
