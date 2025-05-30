<template>
  <motion.div
    v-if="steps.currentStep === 0"
    :transition="{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }"
    class="options flex flex-col gap-2"
  >
    <motion.div class="option grid items-center grid-cols-[1fr_auto]">
      <div class="flex gap-2 items-center">
        <span class="icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.85">
              <path
                d="M7.5 15.8333C3.91667 17 3.91667 13.75 2.5 13.3333M12.5 17.5V14.5833C12.5 13.75 12.5833 13.4167 12.0833 12.9167C14.4167 12.6667 16.6667 11.75 16.6667 7.91666C16.6657 6.9208 16.2771 5.96442 15.5833 5.25C15.9087 4.38497 15.8788 3.42635 15.5 2.58333C15.5 2.58333 14.5833 2.33333 12.5833 3.66666C10.8894 3.22549 9.11064 3.22549 7.41667 3.66666C5.41667 2.33333 4.5 2.58333 4.5 2.58333C4.12123 3.42635 4.09128 4.38497 4.41667 5.25C3.72288 5.96442 3.33435 6.9208 3.33333 7.91666C3.33333 11.75 5.58333 12.6667 7.91667 12.9167C7.41667 13.4167 7.41667 13.9167 7.5 14.5833V17.5"
                stroke="#313131"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>
        </span>

        <span class="flex flex-col justify-center h-full">
          <span class="font-medium">Project</span>
          <span class="font-p-3 opacity-50 font-medium"
            >A GitHub repository progress is tracked using GitHub issues</span
          >
        </span>
      </div>

      <span class="flex gap-2 h-full items-center">
        <span class="bg-[var(--border-2)] w-[1px] h-[55%]"></span>
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
        >
          <g opacity="0.5">
            <path
              d="M7.42578 17.1L12.8591 11.6667C13.5008 11.025 13.5008 9.97499 12.8591 9.33333L7.42578 3.89999"
              stroke="#313131"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        </svg>
      </span>
    </motion.div>

    <motion.div
      @click="steps.setNextStep()"
      class="option grid items-center grid-cols-[1fr_auto]"
    >
      <div class="flex gap-2 items-center">
        <span class="icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
          >
            <g opacity="0.85">
              <path
                opacity="0.4"
                d="M6.66602 10.1667H12.4993M6.66602 13.5H10.316"
                stroke="#313131"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.33268 5.00001H11.666C13.3327 5.00001 13.3327 4.16667 13.3327 3.33334C13.3327 1.66667 12.4993 1.66667 11.666 1.66667H8.33268C7.49935 1.66667 6.66602 1.66667 6.66602 3.33334C6.66602 5.00001 7.49935 5.00001 8.33268 5.00001Z"
                stroke="#313131"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.3333 3.35001C16.1083 3.50001 17.5 4.52501 17.5 8.33334V13.3333C17.5 16.6667 16.6667 18.3333 12.5 18.3333H7.5C3.33333 18.3333 2.5 16.6667 2.5 13.3333V8.33334C2.5 4.53334 3.89167 3.50001 6.66667 3.35001"
                stroke="#313131"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>
        </span>

        <span class="flex flex-col justify-center h-full">
          <span class="font-medium">Task</span>
          <span class="font-p-3 opacity-50 font-medium"
            >A GitHub issue, assigned to a collaborator (team member).</span
          >
        </span>
      </div>

      <span class="flex gap-2 h-full items-center">
        <span class="bg-[var(--border-2)] w-[1px] h-[55%]"></span>
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
        >
          <g opacity="0.5">
            <path
              d="M7.42578 17.1L12.8591 11.6667C13.5008 11.025 13.5008 9.97499 12.8591 9.33333L7.42578 3.89999"
              stroke="#313131"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        </svg>
      </span>
    </motion.div>

    <motion.div class="option grid items-center grid-cols-[1fr_auto]">
      <div class="flex gap-2 items-center">
        <span class="icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
          >
            <g opacity="0.85">
              <path
                d="M10.0007 10C11.1057 10 12.1655 9.56102 12.9469 8.77962C13.7283 7.99822 14.1673 6.93841 14.1673 5.83334C14.1673 4.72827 13.7283 3.66846 12.9469 2.88706C12.1655 2.10566 11.1057 1.66667 10.0007 1.66667C8.89558 1.66667 7.83577 2.10566 7.05437 2.88706C6.27297 3.66846 5.83398 4.72827 5.83398 5.83334C5.83398 6.93841 6.27297 7.99822 7.05437 8.77962C7.83577 9.56102 8.89558 10 10.0007 10Z"
                stroke="#313131"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                opacity="0.4"
                d="M17.1585 18.3333C17.1585 15.1083 13.9501 12.5 10.0001 12.5C6.05013 12.5 2.8418 15.1083 2.8418 18.3333"
                stroke="#313131"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>
        </span>

        <span class="flex flex-col justify-center h-full">
          <span class="font-medium">Team member</span>
          <span class="font-p-3 opacity-50 font-medium"
            >A collaborator that you can assign tasks to.</span
          >
        </span>
      </div>

      <span class="flex gap-2 h-full items-center">
        <span class="bg-[var(--border-2)] w-[1px] h-[55%]"></span>
        <svg
          width="20"
          height="21"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
        >
          <g opacity="0.5">
            <path
              d="M7.42578 17.1L12.8591 11.6667C13.5008 11.025 13.5008 9.97499 12.8591 9.33333L7.42578 3.89999"
              stroke="#313131"
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        </svg>
      </span>
    </motion.div>
  </motion.div>
</template>

<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v';
import { useAddTaskStepsStore } from '~/stores/addTaskSteps';

const steps = useAddTaskStepsStore();
</script>

<style scoped>

.option {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid #f5f5f5;
  border-radius: calc(var(--radius) * 0.9);
  padding: 0.35rem;
  cursor: pointer;
}

.option .icon {
  background-color: #f9f9fb;
  height: 3rem;
  width: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.options .icon svg {
  height: 1.25rem;
  width: 1.25rem;
}

.options .icon svg path {
  stroke-width: 1.5px;
}

</style>
