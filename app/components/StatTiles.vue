<script setup lang="ts">
const props = defineProps<{ stats: HomeStats }>();

const tiles = computed(() => [
  { key: 'tastings', value: props.stats.tastings, one: 'Tasting', many: 'Tastings' },
  { key: 'countries', value: props.stats.countries, one: 'Country', many: 'Countries' },
  { key: 'whiskies', value: props.stats.whiskies, one: 'Whisky', many: 'Whiskies' },
  { key: 'distilleries', value: props.stats.distilleries, one: 'Distillery', many: 'Distilleries' },
  { key: 'trips', value: props.stats.trips, one: 'Trip', many: 'Trips' },
].filter(tile => tile.value > 0));
</script>

<template>
  <section
    v-if="tiles.length"
    class="container-page py-8"
    aria-label="The club in numbers"
  >
    <ul
      class="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
      :style="{ '--n': tiles.length }"
    >
      <li
        v-for="tile in tiles"
        :key="tile.key"
        class="card p-4 max-sm:[&:last-child:nth-child(odd)]:col-span-2"
      >
        <p class="font-display text-4xl font-bold">
          {{ tile.value }}
        </p>
        <p class="label-mono mt-1 text-sherry">
          {{ tile.value === 1 ? tile.one : tile.many }}
        </p>
      </li>
    </ul>
  </section>
</template>
