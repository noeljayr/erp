<template>
  <div v-if="steps.currentStep === 3" class="flex gap-4 flex-col">
    <div class="modal-input-group">
      <label for="">Priority</label>
      <div class="checkbox-container flex gap-4 items-center">
        <span v-for="priority in priorities" class="check-box flex gap-2 items-center">
          <span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_563_347)">
                <path
                  d="M2.08398 5.00002L4.16732 7.08335L8.33398 2.91669"
                  stroke="white"
                  stroke-opacity="0.8"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_563_347">
                  <rect width="10" height="10" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>

          {{ priority.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAddTaskStepsStore } from '~/stores/addTaskSteps';

const steps = useAddTaskStepsStore();

const priorities = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
];

const selectedPriority = ref('medium');
const handlePriorityChange = (priority: string) => {
  selectedPriority.value = priority;
};
</script>

<style scoped>
.check-box span{
    height: 2rem;
    width: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid var(--border-2);
}
</style>
