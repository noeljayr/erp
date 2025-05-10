<template>
  <div class="flex flex-col pr-4 schedule pl-4 gap-4 pt-4">
    <span class="font-semibold content-title">
      <SvgCalendarIcon />
      Schedule
    </span>

    <div class="flex flex-col gap-1">
      <Week />
      <Activities />
    </div>
  </div>
</template>

<script setup></script>

<style lang="css" scoped>
.schedule {
  border-right: 1px solid var(--border-2);
}
</style>
