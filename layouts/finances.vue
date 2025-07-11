<template>
  <div
    class="page-content grid grid-rows-[auto_1fr] gap-16 h-screen w-screen overflow-hidden"
  >
    <div class="blob fixed z-0"></div>
    <div class="flex justify-between items-center">
      <NuxtLink href="/" class="logo flex gap-2 items-center mr-auto">
        <NuxtImg class="h-[1.35rem]" src="/bintel.png" />
        <span
          style="font-family: 'Sora', san-serif"
          class="font-semibold"
        ></span>
      </NuxtLink>

      <button class="menu-button flex items-center justify-center">
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.125 7.29167H21.875"
            stroke="#145993"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            opacity="0.34"
            d="M3.125 12.5H21.875"
            stroke="#145993"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M3.125 17.7083H21.875"
            stroke="#145993"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Finances',
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

.page-content {
  padding: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

.menu-button {
  background: #fcfcfd;
  border: 1px solid rgba(61, 68, 77, 0.1);
  padding: 0.35rem;
  border-radius: calc(var(--radius-s) * 0.65);
}
</style>


<style>

</style>
