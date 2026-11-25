<script setup lang="ts">
usePageSeo({
  title: 'Contact',
  description:
    'Contact whisky club Pour Decisions: email us or follow us on Instagram.',
});
</script>

<template>
  <div>
    <PageHeader
      title="Contact"
      kicker="Say hello"
      intro="Something to say about whisky or about us? Send us a message."
    />
    <div class="container-page pb-14">
      <dl
        class="mt-4 grid max-w-xl grid-cols-[auto_1fr] gap-x-6 gap-y-3 rounded-card border border-line bg-paper p-6"
      >
        <dt class="text-smoke">Instagram</dt>
        <dd>
          <a
            href="https://www.instagram.com/pourdecisionswhiskyclub/"
            target="_blank"
            rel="noopener"
            class="text-sherry hover:underline"
            >@pourdecisionswhiskyclub</a
          >
        </dd>
      </dl>
    </div>
  </div>
</template>
