<script setup lang="ts">
const props = defineProps<{ stats: HomeStats }>();

const tiles = computed(() => statTiles(props.stats));

// 24x24 stroke icons.
const icons: Record<string, string> = {
  tastings: 'M8 3h8l-1 7a3 3 0 0 1-6 0L8 3Zm4 10v6m-3 2h6',
  whiskies: 'M6 3h12l-1.5 17a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1L6 3Zm.6 7h10.8',
  distilleries: 'M3 21V10l5-3v3l5-3v3l5-3v14H3Zm6 0v-4h3v4',
  countries: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.5 3.5 5.5 3.5 9S14.5 18.5 12 21c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3Z',
};

// SSR renders the final numbers; on the client they count up once visible (skipped with reduced motion).
const shown = ref<Record<string, number>>({});
const root = ref<HTMLElement>();
let observer: IntersectionObserver | undefined;

onMounted(() => {
  if (!root.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const targets = Object.fromEntries(tiles.value.map(t => [t.key, t.value]));
  observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return;
    observer?.disconnect();
    const start = performance.now();
    const duration = 1100;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      shown.value = Object.fromEntries(Object.entries(targets).map(([k, v]) => [k, Math.round(v * eased)]));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, { threshold: 0.4 });
  shown.value = Object.fromEntries(Object.keys(targets).map(k => [k, 0]));
  observer.observe(root.value);
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <section
    v-if="tiles.length"
    ref="root"
    class="dark-zone bg-peat text-malt"
    aria-label="The club in numbers"
  >
    <ul
      class="container-page grid grid-cols-2 gap-3 py-10 sm:gap-4 lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
      :style="{ '--n': tiles.length }"
    >
      <li
        v-for="tile in tiles"
        :key="tile.key"
        class="relative overflow-hidden rounded-2xl border border-ember bg-cask p-5 max-sm:[&:last-child:nth-child(odd)]:col-span-2"
      >
        <svg
          class="mb-3 size-6 text-amber"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path :d="icons[tile.key]" />
        </svg>
        <p class="font-display text-4xl font-bold tabular-nums sm:text-5xl">
          {{ shown[tile.key] ?? tile.value }}
        </p>
        <p class="label-mono mt-1 text-amber">
          {{ tile.label }}
        </p>
        <span
          class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-amber/0 via-amber to-amber/0"
          aria-hidden="true"
        />
      </li>
    </ul>
  </section>
</template>
