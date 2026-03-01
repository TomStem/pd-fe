<template>
  <header
    class="flex items-center justify-between py-6 px-8 bg-charcoal z-top-layer sticky"
  >
    <NuxtLink to="/">
      <img src="/logo.png" alt="Pour Decisions Whisky Club" class="h-16" />
    </NuxtLink>
    <nav class="space-x-6 text-cream uppercase tracking-widest">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/whiskies">Whiskies</NuxtLink>
      <NuxtLink to="/distilleries">Distilleries</NuxtLink>
    </nav>
  </header>
</template>
