<template>
  <div class="grid grid-rows-[auto_1fr] overflow-hidden gap-4">
    <Projects />
    <Tasks />

    <!-- modals -->
    <AddTask />
  </div>
</template>

<script setup lang="ts">
import AddTask from '~/components/modals/add-task/AddTask.vue';

definePageMeta({
  layout: 'projects',
});
</script>

<style scoped></style>
