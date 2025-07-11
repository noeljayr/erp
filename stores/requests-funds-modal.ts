import { defineStore } from 'pinia';

export const useFundsModalStore = defineStore('fundsModalActive', {
  state: () => {
    return { active: false };
  },

  actions: {
    setFundsModalActive() {
      this.active = !this.active;
    },
  },
});

export const useFundsStepStore = defineStore('currentStep', {
  state() {
    return { currentStep: 1 };
  },
  actions: {
    setNextStep() {
      if (this.currentStep < 3) {
        this.currentStep = this.currentStep + 1;
      }
    },
    setPrevStep() {
      if (this.currentStep > 1) {
        this.currentStep = this.currentStep - 1;
      }
    },
  },
});

export const useViewRequestStore = defineStore('active', {
  state() {
    return { active: false };
  },
  actions: {
    setViewModalActive(state?: 'true' | 'false') {
      if (state) {
        if (state == 'true') {
          this.active = true;
        } else {
          this.active = false;
        }
      } else {
        this.active = !this.active;
      }
    },
  },
});

export const useSelectedRequestStore = defineStore('id', {
  state() {
    return { id: '' };
  },
  actions: {
    setRequestId(id: string) {
      this.id = id;
    },
  },
});

type Request = {
  amount: number;
  currency: string;
  purpose: string;
  description: string | null;
  approverId: string;
  requiredOn: string | null;
};

export const useRequestFormData = defineStore('request', {
  state: (): Request => ({
    amount: 0.0,
    currency: 'MWK',
    purpose: '',
    description: '',
    approverId: '',
    requiredOn: '',
  }),
  actions: {
    setAmount(amount: number) {
      this.amount = amount;
    },
    setCurrency(currency: string) {
      this.currency = currency;
    },
    setPurpose(purpose: string) {
      this.purpose = purpose;
    },
    setDescription(description: string | null) {
      this.description = description;
    },
    setApprover(id: string) {
      this.approverId = id;
    },
    setRequiredOn(date: string | null) {
      this.requiredOn = date;
    },
  },
});
