<script setup lang="ts">
usePageSeo({ title: 'Contact', description: 'Contact whisky club Pour Decisions: email us or follow us on Instagram.' });
</script>

<template>
  <div>
    <PageHeader
      title="Contact"
      kicker="Say hello"
      intro="Something to say about whisky or about us? Send us a message."
    />
    <div class="container-page pb-14">
      <dl class="mt-4 grid max-w-xl grid-cols-[auto_1fr] gap-x-6 gap-y-3 rounded-card border border-line bg-paper p-6">
        <dt class="text-smoke">
          Email
        </dt>
        <dd>
          <a
            href="mailto:hallo@pourdecisions.example"
            class="text-sherry hover:underline"
          >hallo@pourdecisions.example</a>
        </dd>
        <dt class="text-smoke">
          Instagram
        </dt>
        <dd>
          <a
            href="https://www.instagram.com/pourdecisionswhiskyclub/"
            target="_blank"
            rel="noopener"
            class="text-sherry hover:underline"
          >@pourdecisionswhiskyclub</a>
        </dd>
      </dl>
      <p class="mt-4 text-sm text-smoke">
        Contact details are placeholders. This site is a showcase: signing up or booking is not possible here.
      </p>
    </div>
  </div>
</template>
