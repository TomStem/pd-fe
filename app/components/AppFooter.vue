<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="dark-zone border-t border-ember bg-peat text-ash">
    <div class="container-page grid gap-8 py-10 sm:grid-cols-[1.3fr_1fr_1fr]">
      <div>
        <NuxtLink
          to="/"
          class="text-malt"
          aria-label="Pour Decisions, back to the homepage"
        >
          <LogoMark />
        </NuxtLink>
        <p class="mt-3 max-w-xs text-sm">
          Bad decisions. Good whisky.
        </p>
      </div>
      <nav aria-label="Explore">
        <p class="label-mono text-amber">
          Explore
        </p>
        <ul class="mt-3 space-y-1.5 text-sm">
          <li>
            <NuxtLink
              class="hover:text-white"
              to="/tastings"
            >Tastings</NuxtLink>
          </li>
          <li>
            <NuxtLink
              class="hover:text-white"
              to="/trips"
            >Trips</NuxtLink>
          </li>
          <li>
            <NuxtLink
              class="hover:text-white"
              to="/countries"
            >Countries</NuxtLink>
          </li>
          <li>
            <NuxtLink
              class="hover:text-white"
              to="/distilleries"
            >Distilleries</NuxtLink>
          </li>
          <li>
            <NuxtLink
              class="hover:text-white"
              to="/whiskies"
            >Whiskies</NuxtLink>
          </li>
        </ul>
      </nav>
      <nav aria-label="Club">
        <p class="label-mono text-amber">
          The club
        </p>
        <ul class="mt-3 space-y-1.5 text-sm">
          <li>
            <NuxtLink
              class="hover:text-white"
              to="/about"
            >About</NuxtLink>
          </li>
          <li>
            <NuxtLink
              class="hover:text-white"
              to="/contact"
            >Contact</NuxtLink>
          </li>
          <li>
            <a
              class="hover:text-white"
              href="https://www.instagram.com/pourdecisionswhiskyclub/"
              target="_blank"
              rel="noopener"
            >Instagram</a>
          </li>
        </ul>
      </nav>
    </div>
    <div class="border-t border-ember">
      <div class="container-page flex flex-wrap justify-between gap-2 py-5 text-xs">
        <span>© {{ year }} Pour Decisions</span>
        <span>Brands and distilleries mentioned belong to their owners; we are not affiliated with them.</span>
      </div>
    </div>
  </footer>
</template>
