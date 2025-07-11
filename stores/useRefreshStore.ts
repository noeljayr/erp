import { defineStore } from 'pinia';

export const useRefreshStore = defineStore('refresh', {
  state: () => {
    return { refresh: false };
  },

  actions: {
    setRefresh() {
      this.refresh = !this.refresh;
    },
  },
});
