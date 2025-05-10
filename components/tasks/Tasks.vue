<script setup lang="ts">
import { motion } from 'motion-v';
import { taskData } from '~/data/taskData';
import NotStarted from './NotStarted.vue';
import InProgress from './InProgress.vue';
import Complete from './Complete.vue';
</script>

<template>
  <motion.div
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
    :exit="{ opacity: 0 }"
    :transition="{ motionTranstion }"
    class="grid gap-4 grid-cols-[1fr_auto_1fr_auto_1fr] h-full pb-4 overflow-hidden tasks pr-4"
  >
    <NotStarted />
    <hr />
    <InProgress />
    <hr />
    <Complete />
  </motion.div>
</template>
 
<style>
.tasks hr {
  width: 1px;
  height: 100%;
  border-left: 2px dashed var(--border-2);
  opacity: 0.7;
}
.title {
  font-family: 'Sora', sans-serif;
}
.title svg {
  height: 1.35rem;
  width: 1.35rem;
}

.empty svg {
  height: 5rem;
  width: 5rem;
}

.empty p {
  font-size: var(--p2);
}
</style>
