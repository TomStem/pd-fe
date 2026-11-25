<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  sizes?: string;
  /** Tailwind object-position class for the image. */
  objectClass?: string;
  /** Load right away with high fetch priority; use for images above the fold. */
  priority?: boolean;
}>(), { alt: '', width: undefined, height: undefined, sizes: undefined, objectClass: 'object-center', priority: false });

/**
 * idle: server render and no-JS; the image shows as soon as it has loaded, the skeleton is only visible behind it until then.
 * loading: the image is hidden after hydration and fades in once loaded; loaded; failed: the skeleton stays.
 */
const state = ref<'idle' | 'loading' | 'loaded' | 'failed'>('idle');
const image = useTemplateRef<{ $el: HTMLImageElement }>('image');
const $img = useImage();

const preview = computed(() => previewBackground($img(props.src, PREVIEW_MODIFIERS)));

// Server render and hydration show the skeleton from the first paint; on client navigation it waits until the image is really slow.
const initialRender = import.meta.server || useNuxtApp().isHydrating;
const showSkeleton = computed(() => state.value === 'loading' || state.value === 'failed' || (state.value === 'idle' && initialRender));
const SKELETON_DELAY_MS = 120;
let skeletonTimer: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
  const el = image.value?.$el;
  if (el?.complete) {
    state.value = el.naturalWidth > 0 ? 'loaded' : 'failed';
    return;
  }
  const delay = initialRender ? 0 : SKELETON_DELAY_MS;
  skeletonTimer = setTimeout(() => {
    if (state.value === 'idle') state.value = 'loading';
  }, delay);
});

onBeforeUnmount(() => clearTimeout(skeletonTimer));

const onLoad = () => {
  clearTimeout(skeletonTimer);
  state.value = 'loaded';
};
const onError = () => {
  clearTimeout(skeletonTimer);
  state.value = 'failed';
};
</script>

<template>
  <div
    class="relative overflow-hidden"
    :class="{ 'bg-ember': showSkeleton }"
  >
    <template v-if="showSkeleton">
      <div
        v-if="preview"
        class="absolute inset-0 scale-110 bg-cover bg-center blur-lg"
        :style="{ backgroundImage: preview }"
        aria-hidden="true"
      />
      <div
        v-if="state !== 'failed'"
        class="img-shimmer absolute inset-0"
        aria-hidden="true"
      />
    </template>
    <NuxtImg
      ref="image"
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :sizes="sizes"
      format="webp"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : undefined"
      class="relative size-full overflow-hidden text-[0px] text-transparent object-cover"
      :class="[
        objectClass,
        state === 'idle' ? '' : 'transition-opacity duration-300 motion-reduce:transition-none',
        state === 'loading' || state === 'failed' ? 'opacity-0' : '',
      ]"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>
