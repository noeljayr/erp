import { defineStore } from 'pinia';

export const useAddTaskModalStore = defineStore('modalActive', {
  state: () => ({
    active: false,
  }),
  actions: {
    setModalActive() {
      this.active = !this.active;
    },
  },
});
