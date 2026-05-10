<script setup>
const isMenuOpen = ref(false);

const menuItems = [
  { name: "Home", path: "/" },
  { name: "Whiskies", path: "/whiskies" },
  { name: "Distilleries", path: "/distilleries" },
];

watch(isMenuOpen, (val) => {
  if (val) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});
</script>

<template>
  <div class="bg-[#fff9f4] min-h-screen font-sans text-slate-800">
    <header
      class="sticky top-0 z-50 bg-[#2D2520] bg-grain backdrop-blur-md p-4 shadow-sm"
    >
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <NuxtLink
          :to="'/'"
          class="relative z-[60] self-start !border-none !bg-transparent"
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

        <div class="items-center gap-8 hidden desktop:flex">
          <nav class="flex gap-2">
            <NuxtLink
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 text-white hover:bg-white/20 border border-transparent hover:border-white/30"
            >
              {{ item.name }}
            </NuxtLink>
          </nav>
        </div>

        <button
          aria-label="Toggle Menu"
          class="z-[60] relative w-10 h-10 items-center justify-center focus:outline-none flex desktop:hidden"
          @click="isMenuOpen = !isMenuOpen"
        >
          <div class="relative w-6 h-5">
            <span
              :class="[
                'absolute block h-0.5 w-6 bg-white transition-all duration-300 ease-in-out',
                isMenuOpen ? 'top-2 rotate-45' : 'top-0',
              ]"
            />
            <span
              :class="[
                'absolute block h-0.5 w-6 bg-white transition-opacity duration-300',
                isMenuOpen ? 'opacity-0' : 'top-2 opacity-100',
              ]"
            />
            <span
              :class="[
                'absolute block h-0.5 w-6 bg-white transition-all duration-300 ease-in-out',
                isMenuOpen ? 'top-2 -rotate-45' : 'top-4',
              ]"
            />
          </div>
        </button>

        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <div
            v-if="isMenuOpen"
            class="fixed top-[64px] left-0 w-full h-[calc(100vh-64px)] bg-[#2D2520] p-6 pt-20 flex flex-col items-center gap-4 shadow-xl border-t border-white/10 overflow-y-auto desktop:hidden"
          >
            <nav class="flex flex-col items-center gap-4 w-full">
              <NuxtLink
                v-for="item in menuItems"
                :key="item.path"
                :to="item.path"
                class="w-full text-center px-4 py-3 rounded-xl font-medium text-white hover:bg-white/10"
                @click="isMenuOpen = false"
              >
                {{ item.name }}
              </NuxtLink>
            </nav>
          </div>
        </Transition>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <footer class="bg-[#2D2520] bg-grain mt-20">
      <div
        class="max-w-7xl mx-auto px-6 py-16 grid gap-12 grid-cols-1 desktop:grid-cols-5"
      >
        <div class="space-y-4">
          <img src="/logo.webp" alt="Logo" class="h-32 opacity-80" />
        </div>

        <div class="hidden desktop:flex desktop:flex-col">
          <h4 class="font-bold mb-3 text-[11px] tracking-[0.2em] text-white">
            Menu
          </h4>
          <ul class="space-y-3 text-white">
            <li>
              <NuxtLink to="/" class="hover:text-[#93a9c6] transition">
                Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/whiskies" class="hover:text-[#93a9c6] transition">
                Whiskies
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/distilleries"
                class="hover:text-[#93a9c6] transition"
              >
                Distilleries
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="flex-col desktop:flex-row max-w-7xl mx-auto px-6 py-8 border-t border-slate-100 flex justify-between items-center gap-4 text-white text-xs"
      >
        <p>&copy; {{ new Date().getFullYear() }} Pour decisions</p>
      </div>
    </footer>
  </div>
</template>

<style>
.router-link-active,
.router-link-exact-active {
  @apply bg-white/20 border border-white/30;
}
</style>
