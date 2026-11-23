<script setup lang="ts">
defineProps<{ distilleries: DistilleryView[] }>();

const unavailable = ref(false);
</script>

<template>
  <div>
    <div
      class="overflow-hidden rounded-card border border-line bg-paper"
      role="region"
      aria-label="Map of distilleries"
    >
      <div class="h-80 sm:h-[26rem]">
        <p
          v-if="unavailable"
          class="flex size-full items-center justify-center p-4 text-center text-sm text-smoke"
        >
          The map can't be shown in this browser. See the list below.
        </p>
        <ClientOnly v-else>
          <DistilleryMapCanvas
            :distilleries="distilleries"
            @unavailable="unavailable = true"
          />
          <template #fallback>
            <div class="flex size-full items-center justify-center text-sm text-smoke">
              Loading map…
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
    <ul
      :class="unavailable ? 'mt-3 space-y-1 text-sm' : 'sr-only'"
      aria-label="Distilleries on the map"
    >
      <li
        v-for="distillery in distilleries"
        :key="distillery.slug"
      >
        <NuxtLink
          :to="`/distilleries/${distillery.slug}`"
          :class="{ 'text-sherry hover:underline': unavailable }"
        >
          {{ [distillery.name, distillery.town].filter(Boolean).join(', ') }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
