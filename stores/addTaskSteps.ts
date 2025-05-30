import { defineStore } from 'pinia';

export const useAddTaskStepsStore = defineStore('currenctSteps', {
  state: () => ({
    currentStep: 0,
  }),
  actions: {
    setNextStep() {
      if (this.currentStep <= 4) {
        this.currentStep = this.currentStep + 1;
      }
    },
    setPrevStep() {
      this.currentStep = this.currentStep - 1;
    },
  },
});
