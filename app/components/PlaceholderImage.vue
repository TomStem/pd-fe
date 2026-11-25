<script setup lang="ts">
withDefaults(defineProps<{
  /** Region/country slugs used to pick the gradient. */
  slugs?: (string | undefined)[];
  /** Silhouette drawn on the gradient; none by default. */
  variant?: 'whisky' | 'distillery';
}>(), { slugs: () => [], variant: undefined });
</script>

<template>
  <div
    class="flex size-full items-center justify-center"
    aria-hidden="true"
    :style="{ background: placeholderGradient(...slugs) }"
  >
    <svg
      v-if="variant === 'whisky'"
      class="h-4/5 max-w-full"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid meet"
      fill="#14110f"
      fill-opacity="0.45"
      stroke="#f1e7d3"
      stroke-opacity="0.28"
      stroke-width="2"
      stroke-linejoin="round"
    >
      <!-- Bottle -->
      <path d="M176 18h28v6h-3v50c0 14 22 26 22 50v156c0 5-4 8-8 8h-46c-4 0-8-3-8-8V124c0-24 22-36 22-50V24h-3z" />
      <path
        d="M159 160h62v70h-62z"
        fill="#f1e7d3"
        fill-opacity="0.12"
        stroke="none"
      />
      <!-- Glass -->
      <path d="M268 190h62l-6 100c0 4-3 6-6 6h-38c-3 0-6-2-6-6z" />
      <path
        d="M272.5 226h53l-1.500 28h-50z"
        fill="#d98a1f"
        fill-opacity="0.35"
        stroke="none"
      />
    </svg>
    <svg
      v-else-if="variant === 'distillery'"
      class="h-4/5 max-w-full"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid meet"
      fill="#14110f"
      fill-opacity="0.45"
      stroke="#f1e7d3"
      stroke-opacity="0.28"
      stroke-width="2"
      stroke-linejoin="round"
    >
      <!-- Warehouse with chimney -->
      <path d="M96 296V150l80-44 80 44v146z" />
      <path d="M300 296V70h22v226z" />
      <!-- Pagoda kiln -->
      <path d="M232 296V170h72v126z" />
      <path d="M214 170l54-34 54 34z" />
      <path d="M244 136l24-44 24 44z" />
      <path d="M268 92V74" />
      <!-- Windows and door -->
      <path
        d="M124 196h28v28h-28zM200 196h28v28h-28z"
        fill="#d98a1f"
        fill-opacity="0.35"
        stroke="none"
      />
      <path
        d="M156 296v-44h28v44z"
        fill="#d98a1f"
        fill-opacity="0.2"
        stroke="none"
      />
      <path d="M60 296h300" />
    </svg>
  </div>
</template>
