<script setup lang="ts">
usePageSeo({
  title: 'About',
  description:
    'Pour Decisions is a whisky club with a wink: we taste, travel and argue about whisky.',
});
</script>

<template>
  <div>
    <PageHeader
      title="About"
      kicker="The club"
      intro="A bit of fun, seriously about whisky."
    />
    <div class="container-page pb-14">
      <div class="rich-text mt-4 space-y-4">
        <p>
          Pour Decisions is a whisky club for people who like to taste and like
          talking about what they taste even more. No snobbery, plenty of
          curiosity: we start with the basics and end with a debate that runs
          over.
        </p>
        <p>
          We host tastings around a theme (a region, a country, a style) and
          travel a few times a year to the places where the whisky comes from.
          Everything we taste and visit can be found on this site.
        </p>
      </div>

      <div class="mt-10 grid gap-4 sm:grid-cols-3">
        <div class="rounded-card border border-line bg-paper p-5">
          <h2 class="text-lg font-bold">
            Tastings
          </h2>
          <p class="mt-1 text-sm text-smoke">
            Themed evenings with four or five whiskies, for beginners and
            connoisseurs.
          </p>
        </div>
        <div class="rounded-card border border-line bg-paper p-5">
          <h2 class="text-lg font-bold">
            Trips
          </h2>
          <p class="mt-1 text-sm text-smoke">
            Reports of our multi-day trips to distilleries in Scotland.
          </p>
        </div>
        <div class="rounded-card border border-line bg-paper p-5">
          <h2 class="text-lg font-bold">
            Sharing knowledge
          </h2>
          <p class="mt-1 text-sm text-smoke">
            Countries, regions, distilleries and bottles: everything with
            tasting notes in one place.
          </p>
        </div>
      </div>

      <div class="mt-8">
        <a
          class="btn btn-sherry"
          href="https://www.instagram.com/pourdecisionswhiskyclub/"
          target="_blank"
          rel="noopener"
        >Get in touch
        </a>
      </div>
    </div>
  </div>
</template>
