import { defineStore } from 'pinia';

export const useFiltersStore = defineStore('modalActive', {
  state: () => ({
    filter: '',
  }),
  actions: {
    setFilter(filter: 'Approved' | 'Rejected' | 'Pending' | '') {
      this.filter = filter;
    },
  },
});
