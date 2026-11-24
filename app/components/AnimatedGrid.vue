<script setup lang="ts">
defineProps<{
  /** The layout has a filter sidebar, so there is less room for columns. */
  narrow: boolean;
  empty: boolean;
  emptyText: string;
  /** Offer to clear the filters in the empty state. */
  clearable: boolean;
}>();
const emit = defineEmits<{ clear: [] }>();

const grid = useTemplateRef<{ $el: HTMLElement }>('grid');
let releaseHeight: ReturnType<typeof setTimeout> | undefined;
let boxes = new WeakMap<Element, Record<'left' | 'top' | 'width' | 'height', string>>();

const boxOf = (card: HTMLElement) => ({
  left: `${card.offsetLeft}px`,
  top: `${card.offsetTop}px`,
  width: `${card.offsetWidth}px`,
  height: `${card.offsetHeight}px`,
});

/** Remembers where the cards are when the route changes, before the grid re-renders, because leaving cards are only noticed after the grid has reflowed. */
function rememberCardBoxes() {
  boxes = new WeakMap([...grid.value?.$el.children ?? []].map(card => [card, boxOf(card as HTMLElement)]));
  setTimeout(() => (boxes = new WeakMap()), 500);
}

/** Takes a leaving card out of the grid flow where it was, and holds the grid height while the cards animate. */
function pinLeavingCard(el: Element) {
  const card = el as HTMLElement;
  const container = card.parentElement!;
  container.style.transition = 'none';
  container.style.minHeight = `${container.offsetHeight}px`;
  void container.offsetHeight;
  container.style.transition = '';
  clearTimeout(releaseHeight);
  releaseHeight = setTimeout(() => (container.style.minHeight = ''), 350);
  Object.assign(card.style, boxes.get(card) ?? boxOf(card));
}

const route = useRoute();
watch(() => route.fullPath, rememberCardBoxes, { flush: 'sync' });
</script>

<template>
  <div
    class="relative min-h-24"
    :class="narrow ? 'mt-4' : 'mt-6'"
  >
    <TransitionGroup
      ref="grid"
      tag="div"
      name="card-list"
      class="card-list grid content-start gap-4 sm:grid-cols-2"
      :class="narrow ? 'xl:grid-cols-3' : 'lg:grid-cols-3'"
      @before-leave="pinLeavingCard"
    >
      <slot />
    </TransitionGroup>
    <Transition name="note">
      <div
        v-if="empty"
        class="absolute inset-x-0 top-0"
      >
        <EmptyNote>
          {{ emptyText }}
        </EmptyNote>
        <button
          v-if="clearable"
          type="button"
          class="mt-2 text-sm text-sherry underline underline-offset-2 hover:no-underline"
          @click="emit('clear')"
        >
          Clear filters
        </button>
      </div>
    </Transition>
  </div>
</template>
