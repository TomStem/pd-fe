<template>
  <div
    class="min-h-screen relative bg-gradient-to-br from-[#2b1d14] via-[#4a2e1f] to-[#1a120d]"
  >
    <div
      class="absolute inset-0 bg-[url('/noise.png')] mix-blend-overlay"
    ></div>

    <HeaderNav />
    <main class="mx-auto px-12 py-12 relative z-10">
      <slot />
    </main>
    <!-- <FooterSection /> -->
  </div>
</template>
