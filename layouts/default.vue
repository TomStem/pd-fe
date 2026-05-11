<template>
  <div class="min-h-screen bg-[#2D2520] text-stone-200 font-sans">
    <nav
      class="border-b border-[#2D2520]/80 p-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-50"
    >
      <NuxtLink
        to="/"
        class="text-2xl font-serif font-bold tracking-tighter text-amber-500"
      >
        <div
          class="rounded-xl mb-[-4.5rem] transition-all duration-300 hover:scale-105"
        >
          <img
            src="/logo.webp"
            alt="Logo"
            class="w-auto object-contain h-24 desktop:h-32"
          />
        </div>
      </NuxtLink>
      <div class="space-x-8 text-sm uppercase tracking-widest font-medium">
        <NuxtLink to="/whiskies" class="hover:text-amber-400 transition"
          >Whiskies</NuxtLink
        >
        <NuxtLink to="/tastings" class="hover:text-amber-400 transition"
          >Tastings</NuxtLink
        >
        <NuxtLink to="/distilleries" class="hover:text-amber-400 transition"
          >Distilleries</NuxtLink
        >

        <NuxtLink to="/countries" class="hover:text-amber-400 transition"
          >Countries</NuxtLink
        >

        <NuxtLink to="/regions" class="hover:text-amber-400 transition"
          >Regions</NuxtLink
        >
      </div>
    </nav>
    <main>
      <slot />
    </main>
  </div>
</template>
