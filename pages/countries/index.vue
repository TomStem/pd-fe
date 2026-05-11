<script setup>
const { client } = useContentful();
const { data: countries } = await useAsyncData("countries", () =>
  client.getEntries({ content_type: "countries", order: "fields.name" }),
);
</script>

<template>
  <div class="max-w-7xl mx-auto py-12 px-6">
    <div class="text-center mb-16">
      <h1 class="text-6xl font-serif text-white mb-4 tracking-tight">
        Countries
      </h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="c in countries.items"
        :key="c.sys.id"
        class="group relative h-64 bg-stone-900 border border-stone-800 flex items-center justify-center overflow-hidden rounded-sm hover:border-amber-600/50 transition-all duration-500"
      >
        <div class="relative z-10 text-center px-8">
          <h2
            class="text-4xl font-serif text-white group-hover:text-amber-500 transition-colors duration-300"
          >
            {{ c.fields.name }}
          </h2>
          <div
            class="w-0 group-hover:w-full h-[1px] bg-amber-600 mx-auto mt-2 transition-all duration-500"
          ></div>
        </div>

        <!-- Subtle background text for design flare -->
        <span
          class="absolute bottom-[-20%] left-0 text-9xl font-serif font-bold text-stone-800/20 whitespace-nowrap pointer-events-none uppercase italic"
        >
          {{ c.fields.name }}
        </span>
      </div>
    </div>
  </div>
</template>
