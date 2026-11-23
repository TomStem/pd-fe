<script setup lang="ts">
useHead({
  titleTemplate: title => (title ? `${title} · Pour Decisions` : 'Pour Decisions · Slechte beslissingen. Goede whisky.'),
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
