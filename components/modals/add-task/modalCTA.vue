<template>
  <div v-if="currentStep > 0" class="cta-container">
    <div class="step-info items-center mr-auto">
      <div class="flex flex-col">
        <span class="font-semibold">Step {{ currentStep }}</span>
        <span class="font-p-3 opacity-75"> {{ description }}</span>
      </div>
    </div>
    <button @click="steps.setPrevStep()" class="cta-3">Back</button>
    <button @click="nextStep()" class="cta">Next</button>
  </div>
</template>

<script setup lang="ts">
import { useAddTaskStepsStore } from '~/stores/addTaskSteps';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

const steps = useAddTaskStepsStore();

const stepStore = useAddTaskStepsStore();
const { currentStep } = storeToRefs(stepStore);
const description = ref('');

watch(currentStep, () => {
  if (steps.currentStep == 1) {
    description.value = 'Select project the task will belong to.';
  } else if (steps.currentStep == 2) {
    description.value = 'Basic task information';
  } else if (steps.currentStep == 3) {
    description.value = 'Priority & Status';
  } else if (steps.currentStep == 4) {
    description.value = 'Assign task to a team member';
  } else {
    description.value = '';
  }

  return description;
});

function nextStep() {
  if (currentStep.value <= 4) {
    steps.setNextStep();
  }
}
</script>

<style scoped></style>
