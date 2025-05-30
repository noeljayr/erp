<template>
  <div class="page-content grid gap-8 h-screen w-screen overflow-hidden">
    <!-- <LeftPanel /> -->
    <div
      class="grid relative z-[1] grid-cols-1 grid-rows-[auto_1fr] gap-4 overflow-hidden"
    >
      <TopNav />
      <slot />
    </div>

    <div class="blob fixed z-0"></div>
  </div>
</template>

<script lang="ts" setup>
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

<style lang="css" scoped>
.blob {
  background-color: #f9d157;
  height: calc(100vh - 15rem);
  width: calc(100vw - 20rem);
  align-self: center;
  justify-self: center;
  opacity: 0.15;
  filter: blur(30vh);
}
</style>
