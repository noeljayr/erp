<template>
  <div
    @click="modal.setFundsModalActive()"
    :class="`modal-overlay fixed ${
      modal.active ? 'opacity-100' : 'opacity-0 invisible pointer-events-none'
    }`"
  ></div>
  <AnimatePresence mode="popLayout">
    <motion.div
      layout="position"
      :transition="{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }"
      :class="[
        `modal select-none ${
          modal.active ? 'modal-active' : ''
        }`,
      ]"
    >
      <motion.div
        layout="position"
        key="progress"
        :transition="{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }"
        class="progress grid w-full gap-4 grid-cols-3 items-center"
      >
        <div v-for="step in steps" class="step flex flex-col gap-1 w-full">
          <span
            :class="`progress-bar w-full h-[0.25rem] grid grid-cols-1 rounded-[2rem]`"
          >
            <span
              :class="`bg-[var(--primary)] h-[0.25rem] ${
                modalSteps.currentStep >= step.step ? 'w-full' : 'w-0'
              }`"
            ></span>
          </span>
          <span
            style="transition: var(--transition)"
            :class="`step-title font-p-3 ${
              modalSteps.currentStep >= step.step
                ? 'text-[var(--primary)] font-extrabold'
                : 'font-semibold'
            }`"
            >{{ step.name }}</span
          >
        </div>
      </motion.div>

      <!-- steps -->

      <ModalsRequestFundsStep v-if="modalSteps.currentStep == 1" />
      <ModalsRequestFundsApproval v-if="modalSteps.currentStep == 2" />
      <ModalsRequestFundsDate v-if="modalSteps.currentStep == 3" />
      <!-- steps -->

     
    </motion.div>
  </AnimatePresence>
</template>

<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v';

const modal = useFundsModalStore();
const modalSteps = useFundsStepStore();


const steps = [
  {
    name: 'Funds',
    step: 1,
  },
  {
    name: 'Approval',
    step: 2,
  },
  {
    name: 'Date',
    step: 3,
  },
];


</script>

<style>
@import url('../../../assets/css/modals.css');

.progress-bar {
  background-color: #ebeaea;
  transition: var(--transition);
  overflow: hidden;
}

.progress-bar span {
  transition: var(--transition);
}
</style>
