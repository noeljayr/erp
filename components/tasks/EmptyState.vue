<template>
  <div
    class="empty flex flex-col justify-center absolute h-full w-full items-center"
  >
    <SvgClipboard />
    <h4>No tasks found</h4>
    <p class="opacity-70">{{description}}</p>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  description: string
}>()
</script>

<style lang="scss" scoped></style>
