<template>
  <motion.div
    v-if="steps.currentStep === 2"
    :transition="{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }"
  >
    <div class="flex gap-4 flex-col">
      <div class="modal-input-group">
        <label for="">Title</label>
        <input type="text" placeholder="A descriptive sentence of the task" />
      </div>

      <div class="modal-input-group">
        <label for="">Description</label>
        <textarea
          name=""
          id=""
          placeholder="A short summary of the task"
        ></textarea>
      </div>
    </div>
  </motion.div>
</template>

<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v';
import { useAddTaskStepsStore } from '~/stores/addTaskSteps';

const steps = useAddTaskStepsStore();
</script>

<style scoped>
</style>
