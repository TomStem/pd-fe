/** One of a fixed set of choices kept in the query string as `?key=value`; the first option is the default and leaves no trace in the URL. */
export function useChoiceParam<K extends string>(key: string, options: readonly { value: K; label: string }[]) {
  const route = useRoute();
  const router = useRouter();
  const fallback = options[0]!.value;

  const choice = computed(() => options.find(option => option.value === route.query[key])?.value ?? fallback);
  const setChoice = (value: K) => router.replace({ query: { ...route.query, [key]: value === fallback ? undefined : value } });

  return { choice, setChoice };
}
