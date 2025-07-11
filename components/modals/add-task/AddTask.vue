<template>
  <motion.div
    @click="modal.setModalActive"
    :class="`modal-overlay fixed ${
      modal.active ? 'opacity-100' : 'opacity-0 invisible pointer-events-none'
    }`"
  ></motion.div>

  <motion.div
    :layout="'size'"
    :animate="{ height: 'auto' }"
    :transition="{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }"
    :class="[`modal overflow-hidden ${modal.active ? 'modal-active' : ''}`]"
  >
    <div class="modal-title flex items-center justify-between">
      <span class="title">Add something new</span>
      <button @click="modal.setModalActive">
        <SvgXIcon />
      </button>
    </div>

    <ModalsAddTaskStep0 />
    <ModalsAddTaskStep1 />
    <ModalsAddTaskStep2 />
    <ModalsAddTaskStep3 />
    <ModalsAddTaskModalCTA />
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v';

const modal = useAddTaskModalStore();
</script>

<style>
@import url('../../../assets/css/modals.css');
</style>
