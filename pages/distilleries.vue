<script setup>
defineOptions({
  name: "Distilleries",
});

const { $contentful } = useNuxtApp();

const distilleries = ref([]);

await onMounted(async () => {
  const response = await $contentful.getEntries({
    content_type: "distilleries",
    order: "-sys.createdAt",
  });
  distilleries.value = response.items;
});
</script>

<template>
  <div class="container mx-auto px-4 py-4 pt-28">
    <h1 class="text-3xl font-bold mb-6">Distilleries</h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <DistilleriesCard
        v-for="distillery in distilleries"
        :key="distillery.sys.id"
        :distillery="distillery.fields"
      />
    </div>
  </div>
</template>
