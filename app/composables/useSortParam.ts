/** A sort order kept in the query string as `?sort=value`; the first option is the default and leaves no trace in the URL. */
export function useSortParam<K extends string>(options: readonly { value: K; label: string }[]) {
  const route = useRoute();
  const router = useRouter();
  const fallback = options[0]!.value;

  const sort = computed(() => options.find(option => option.value === route.query.sort)?.value ?? fallback);
  const setSort = (value: K) => router.replace({ query: { ...route.query, sort: value === fallback ? undefined : value } });

  return { sort, setSort };
}
