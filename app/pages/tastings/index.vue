<script setup lang="ts">
const tastings = await useContentFetch<TastingView[]>('/api/tastings');
usePageSeo({ title: 'Tastings', description: 'The themes Pour Decisions has tasted, newest first.' });

const route = useRoute();
const router = useRouter();

const filters = computed(() => parseFilters(route.query, tastingFacets(tastings.value)));
const facets = computed(() => tastingFacets(tastings.value, filters.value));
const hasFilters = computed(() => facets.value.years.length > 0 || facets.value.countries.length > 0);
const active = computed(() => Boolean(filters.value.year || filters.value.country));
const visible = computed(() => filterTastings(tastings.value, filters.value));

const grid = useTemplateRef<{ $el: HTMLElement }>('grid');
let releaseHeight: ReturnType<typeof setTimeout> | undefined;
let boxes = new WeakMap<Element, Record<'left' | 'top' | 'width' | 'height', string>>();

const boxOf = (card: HTMLElement) => ({
  left: `${card.offsetLeft}px`,
  top: `${card.offsetTop}px`,
  width: `${card.offsetWidth}px`,
  height: `${card.offsetHeight}px`,
});

/** Remembers where the cards are before a filter change, because leaving cards are only noticed after the grid has reflowed. */
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

function setFilters({ year, country }: TastingFilters) {
  rememberCardBoxes();
  router.replace({ query: { ...(year && { year }), ...(country && { country }) } });
}
</script>

<template>
  <div>
    <PageHeader
      title="Tastings"
      kicker="Our evenings"
      intro="The themes we've tasted, newest first."
    />

    <div
      class="container-page pb-14"
      :class="hasFilters && 'lg:grid lg:grid-cols-[15rem_1fr] lg:items-start lg:gap-8'"
    >
      <template v-if="hasFilters">
        <details class="card mt-6 lg:hidden">
          <summary class="flex cursor-pointer items-center justify-between p-4 font-semibold">
            Filter
            <span
              v-if="active"
              class="text-sm font-normal text-sherry"
            >Active</span>
          </summary>
          <TastingFilters
            :facets="facets"
            :filters="filters"
            class="border-t border-line p-4"
            @change="setFilters"
          />
        </details>
        <aside class="sticky top-24 mt-6 hidden lg:block">
          <div class="card p-5">
            <h2 class="text-lg font-bold">
              Filter
            </h2>
            <TastingFilters
              :facets="facets"
              :filters="filters"
              class="mt-4"
              @change="setFilters"
            />
          </div>
        </aside>
      </template>

      <div class="min-w-0">
        <p
          v-if="hasFilters"
          class="mt-4 text-sm text-smoke lg:mt-6"
          aria-live="polite"
        >
          {{ visible.length }} {{ visible.length === 1 ? 'tasting' : 'tastings' }}
        </p>
        <div
          class="relative min-h-24"
          :class="hasFilters ? 'mt-4' : 'mt-6'"
        >
          <TransitionGroup
            ref="grid"
            tag="div"
            name="card-list"
            class="card-list grid content-start gap-4 sm:grid-cols-2"
            :class="hasFilters ? 'xl:grid-cols-3' : 'lg:grid-cols-3'"
            @before-leave="pinLeavingCard"
          >
            <TastingCard
              v-for="(tasting, index) in visible"
              :key="tasting.slug"
              :tasting="tasting"
              :style="{ '--i': Math.min(index, 8) }"
            />
          </TransitionGroup>
          <Transition name="note">
            <div
              v-if="!visible.length"
              class="absolute inset-x-0 top-0"
            >
              <EmptyNote>
                {{ tastings.length ? 'No tastings match these filters.' : 'No tastings yet.' }}
              </EmptyNote>
              <button
                v-if="active"
                type="button"
                class="mt-2 text-sm text-sherry underline underline-offset-2 hover:no-underline"
                @click="setFilters({})"
              >
                Clear filters
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>
