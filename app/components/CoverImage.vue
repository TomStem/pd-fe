<script setup lang="ts">
withDefaults(defineProps<{
  src?: string;
  alt?: string;
  slugs?: (string | undefined)[];
  tag?: string;
  heightClass?: string;
  imageWidth?: number;
  imageHeight?: number;
}>(), { alt: '', heightClass: 'h-32', src: undefined, slugs: () => [], tag: undefined, imageWidth: 800, imageHeight: 450 });
</script>

<template>
  <div
    class="relative overflow-hidden"
    :class="heightClass"
  >
    <NuxtImg
      v-if="src"
      :src="src"
      :alt="alt"
      :width="imageWidth"
      :height="imageHeight"
      sizes="sm:100vw md:50vw lg:400px"
      loading="lazy"
      class="size-full object-cover"
    />
    <slot
      v-else
      name="placeholder"
    >
      <PlaceholderImage :slugs="slugs" />
    </slot>
    <span
      v-if="tag"
      class="absolute bottom-2.5 left-3 rounded-full bg-black/65 px-2.5 py-1 text-xs text-white"
    >{{ tag }}</span>
  </div>
</template>
