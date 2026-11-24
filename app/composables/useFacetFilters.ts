/** The part of the filter state the filter layout needs. */
export interface FacetFilters {
  groups: FacetGroup[];
  selection: FilterSelection;
  /** Filters and search term in use. */
  activeCount: number;
  /** Whether searching is offered. */
  searchable: boolean;
  /** What is in the search box, which runs ahead of the URL while typing. */
  searchInput: string;
  toggle: (key: string, value: string) => void;
  setSearch: (value: string) => void;
  clear: () => void;
}

const SEARCH_DELAY = 150;

/**
 * Multi-select filters and a search for a list, kept in the query string: `?key=a,b` per group and `?q=text`.
 * Other query parameters are left alone.
 */
export function useFacetFilters<T>(items: MaybeRefOrGetter<T[]>, definitions: FilterGroup<T>[], searchText?: (item: T) => string[]) {
  const route = useRoute();
  const router = useRouter();
  const keys = definitions.map(definition => definition.key);

  const searchTerm = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''));
  const searchInput = ref(searchTerm.value);
  const searched = computed(() => searchItems(toValue(items), searchText, searchTerm.value));

  const options = computed(() => facetGroups(toValue(items), definitions));
  const selection = computed(() => parseSelection(route.query, options.value));
  const groups = computed(() => facetGroups(toValue(items), definitions, selection.value, searched.value));
  const visible = computed(() => filterItems(searched.value, definitions, selection.value));
  const activeCount = computed(() => selectedTotal(selection.value) + (searchTerm.value ? 1 : 0));

  function apply(next: FilterSelection, term: string) {
    const others = Object.fromEntries(Object.entries(route.query).filter(([key]) => key !== 'q' && !keys.includes(key)));
    return router.replace({ query: { ...others, ...selectionToQuery(next), ...(term && { q: term }) } });
  }

  let pendingSearch: ReturnType<typeof setTimeout> | undefined;

  function setSearch(value: string) {
    searchInput.value = value;
    clearTimeout(pendingSearch);
    pendingSearch = setTimeout(() => apply(selection.value, value.trim()), value.trim() ? SEARCH_DELAY : 0);
  }

  watch(searchTerm, (term) => {
    if (term !== searchInput.value.trim()) searchInput.value = term;
  });

  return reactive({
    groups,
    selection,
    visible,
    activeCount,
    searchable: computed(() => toValue(items).length > 1 && searchText !== undefined),
    searchInput,
    toggle: (key: string, value: string) => apply(toggleValue(selection.value, key, value), searchTerm.value),
    setSearch,
    clear: () => {
      clearTimeout(pendingSearch);
      searchInput.value = '';
      return apply({}, '');
    },
  });
}
