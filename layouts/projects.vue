<template>
  <div class="page-content grid gap-8 h-screen w-screen overflow-hidden">
    <!-- <LeftPanel /> -->
    <div class="grid grid-cols-1 grid-rows-[auto_1fr] gap-8 overflow-hidden">
      <TopNav />
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import LeftPanel from '~/components/LeftPanel.vue';

useSeoMeta({
  title: 'Bintel Project Management',
});


useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/ico',
      href: '/favicon.ico',
    },
  ],
});
</script>
