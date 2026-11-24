/** Multi-select filters for a list, kept in the query string: `?key=a,b` per group. Other query parameters are left alone. */
export function useFacetFilters<T>(items: MaybeRefOrGetter<T[]>, definitions: FilterGroup<T>[]) {
  const route = useRoute();
  const router = useRouter();
  const keys = definitions.map(definition => definition.key);

  const options = computed(() => facetGroups(toValue(items), definitions));
  const selection = computed(() => parseSelection(route.query, options.value));
  const groups = computed(() => facetGroups(toValue(items), definitions, selection.value));
  const visible = computed(() => filterItems(toValue(items), definitions, selection.value));
  const selectedCount = computed(() => selectedTotal(selection.value));

  function apply(next: FilterSelection) {
    const others = Object.fromEntries(Object.entries(route.query).filter(([key]) => !keys.includes(key)));
    return router.replace({ query: { ...others, ...selectionToQuery(next) } });
  }

  return {
    groups,
    selection,
    visible,
    selectedCount,
    toggle: (key: string, value: string) => apply(toggleValue(selection.value, key, value)),
    clear: () => apply({}),
  };
}
