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

onMounted(() => {
  const el = image.value?.$el;
  if (!el?.complete) state.value = 'loading';
  else state.value = el.naturalWidth > 0 ? 'loaded' : 'failed';
});

const onLoad = () => (state.value = 'loaded');
const onError = () => (state.value = 'failed');
</script>

<template>
  <div class="relative overflow-hidden bg-ember">
    <template v-if="state !== 'loaded'">
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
