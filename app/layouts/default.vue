<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#main"
      class="sr-only z-50 rounded-full bg-amber px-4 py-2 font-semibold text-peat focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Naar de inhoud
    </a>
    <AppHeader />
    <main
      id="main"
      class="flex-1"
      tabindex="-1"
    >
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
