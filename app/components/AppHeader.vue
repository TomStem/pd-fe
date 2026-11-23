<script setup lang="ts">
const links = [
  { label: 'Tastings', to: '/tastings' },
  { label: 'Trips', to: '/trips' },
  { label: 'Countries', to: '/countries' },
  { label: 'Distilleries', to: '/distilleries' },
  { label: 'Whiskies', to: '/whiskies' },
  { label: 'About', to: '/about' },
];

const route = useRoute();
const open = ref(false);
const toggle = useTemplateRef<HTMLButtonElement>('toggle');

watch(() => route.fullPath, () => (open.value = false));

function onEscape() {
  if (!open.value) return;
  open.value = false;
  toggle.value?.focus();
}
</script>

<template>
  <header
    class="dark-zone sticky top-0 z-40 border-b border-ember bg-peat text-malt"
    @keydown.esc="onEscape"
  >
    <div class="container-page flex flex-wrap items-center gap-x-2 gap-y-3 py-3 md:flex-nowrap">
      <NuxtLink
        to="/"
        class="mr-auto rounded-md"
        aria-label="Pour Decisions, back to the homepage"
      >
        <LogoMark />
      </NuxtLink>

      <button
        ref="toggle"
        type="button"
        class="inline-flex items-center gap-2 rounded-full border border-ember px-4 py-2 text-sm md:hidden"
        :aria-expanded="open"
        aria-controls="main-nav"
        @click="open = !open"
      >
        {{ open ? 'Close' : 'Menu' }}
      </button>

      <nav
        id="main-nav"
        aria-label="Main menu"
        class="w-full flex-col gap-1 md:flex md:w-auto md:flex-row md:items-center"
        :class="open ? 'flex' : 'hidden'"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
        >
          {{ link.label }}
        </NuxtLink>
        <NuxtLink
          to="/contact"
          class="btn btn-primary mt-2 md:ml-3 md:mt-0"
        >
          Contact
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
