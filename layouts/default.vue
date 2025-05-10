<template>
  <div
    class="flex flex-col gap-8 items-center h-screen w-screen justify-center"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Bintel ERP',
});
definePageMeta({
  title: 'Bintel ERP',
  description: 'A page description',
});
</script>

<style scoped></style>
