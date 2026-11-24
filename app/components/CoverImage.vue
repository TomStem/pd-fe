<script setup lang="ts">
const props = withDefaults(defineProps<{
  src?: string;
  alt?: string;
  slugs?: (string | undefined)[];
  tags?: (string | undefined)[];
  heightClass?: string;
  imageWidth?: number;
  imageHeight?: number;
  sizes?: string;
}>(), { alt: '', heightClass: 'h-32', src: undefined, slugs: () => [], tags: () => [], imageWidth: 800, imageHeight: 450, sizes: 'sm:100vw md:50vw lg:400px' });

const visibleTags = computed(() => props.tags.filter(Boolean));
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
      :sizes="sizes"
      loading="lazy"
      class="size-full object-cover"
    />
    <slot
      v-else
      name="placeholder"
    >
      <PlaceholderImage :slugs="slugs" />
    </slot>
    <div
      v-if="visibleTags.length"
      class="absolute inset-x-3 bottom-2.5 flex flex-wrap gap-1.5"
    >
      <span
        v-for="tag in visibleTags"
        :key="tag"
        class="rounded-full bg-black/65 px-2.5 py-1 text-xs text-white"
      >{{ tag }}</span>
    </div>
  </div>
</template>
