<script setup></script>

<template>
  <div>
    <div
      class="relative w-full h-[70vh] desktop:h-[85vh] overflow-hidden flex items-center justify-center"
    >
      <!-- Background Image with subtle zoom for depth -->
      <img
        src="/images/group.jpeg"
        alt="Whisky Club Group"
        class="absolute inset-0 w-full h-full object-cover scale-105"
      />

      <!-- Sophisticated Overlay: Darkens bottom/center for text pop -->
      <div
        class="absolute inset-0 bg-black/20 bg-gradient-to-t from-black/40 via-transparent to-black/10"
      ></div>

      <!-- Content Container -->
      <div class="relative z-10 text-center px-6 max-w-5xl">
        <div class="space-y-4">
          <!-- Title: Uppercase + Tracking (Letter Spacing) adds a premium feel -->
          <h1
            class="font-serif text-4xl md:text-6xl lg:text-7xl text-white font-bold tracking-tight uppercase leading-tight"
          >
            Pour Decisions
            <span class="block md:inline text-amber-400">Whisky Club</span>
          </h1>

          <!-- Divider: A small visual element adds "designed" polish -->
          <div class="w-24 h-1 bg-amber-500 mx-auto my-6"></div>

          <!-- Tagline: Clean sans-serif with wide tracking -->
          <p
            class="text-lg md:text-2xl text-gray-100 font-light tracking-[0.2em] uppercase italic"
          >
            Wisdom shared one dram at a time
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
