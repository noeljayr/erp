<script setup lang="ts">
import { useFiltersStore } from '#imports';
import { BASE_URL } from '~/constants/BASE_URL';
import { COOKIE_NAME } from '~/constants/COOKIE_NAME';
import type { RequestTypes } from '~/types/requestTypes';

const requests = ref<RequestTypes[]>([]);
const pending = ref(0);
const approved = ref(0);
const rejected = ref(0);

type Response = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  statusCounts: {
    Pending: number;
    Approved: number;
    Rejected: number;
  };
  data: RequestTypes[];
};

const token = useCookie(COOKIE_NAME);

const filters = useFiltersStore();

const { status, refresh } = useFetch(() => `${BASE_URL}/requests`, {
  lazy: true,
  headers: {
    authorization: `Bearer ${token.value}`,
  },
  transform: (data: Response) => {
    requests.value = data.data;
    pending.value = data.statusCounts.Pending;
    approved.value = data.statusCounts.Approved;
    rejected.value = data.statusCounts.Rejected;
  },
});

const refreshStore = useRefreshStore();

watch(
  () => refreshStore.refresh,
  (newState, oldState) => {
    if (newState && !oldState) {
      refresh();
    } else if (newState && oldState && newState !== oldState) {
      refresh();
    }
  },
  { immediate: true }
);

const toggleFilter = (filter: 'Approved' | 'Rejected' | 'Pending' | '')=>{
  if(filter === filters.filter){
    filters.setFilter('')
  }else{
    filters.setFilter(filter)
  }
}
</script>

<template>
  <template v-if="status === 'success'">
    <div
      @click="toggleFilter('Pending')"
      :class="`${filters.filter === 'Pending' ? 'active-filter' : ''} action pending-action flex flex-col gap-2 p-2 pb-3 relative`"
    >
      <span class="icon icon-pending font-extrabold font-p-1">
        {{ pending }}
      </span>
      <span class="title px-1 font-semibold opacity-90 font-p-2"
        >Pending requests</span
      >
      <span class="absolute right-2 top-2">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.75">
            <path
              d="M18.3334 10C18.3334 14.6 14.6 18.3333 10 18.3333C5.40002 18.3333 1.66669 14.6 1.66669 10C1.66669 5.4 5.40002 1.66666 10 1.66666C14.6 1.66666 18.3334 5.4 18.3334 10Z"
              stroke="#FCC11E"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              opacity="0.4"
              d="M13.0917 12.6517L10.5083 11.11C10.0583 10.8433 9.69165 10.2017 9.69165 9.67667V6.26"
              stroke="#FCC11E"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        </svg>
      </span>
    </div>

    <div
      @click="toggleFilter('Approved')"
      :class="`${filters.filter === 'Approved' ? 'active-filter' : ''} action approved-action flex flex-col gap-2 p-2 pb-3 relative`"
    >
      <span class="icon completed-icon font-extrabold font-p-1">
        {{ approved }}
      </span>
      <span class="title px-1 font-semibold opacity-90 font-p-2"
        >Approved requests</span
      >
      <span class="absolute right-2 top-2">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.7">
            <path
              opacity="0.75"
              d="M10 18.3333C14.5834 18.3333 18.3334 14.5833 18.3334 10C18.3334 5.41666 14.5834 1.66666 10 1.66666C5.41669 1.66666 1.66669 5.41666 1.66669 10C1.66669 14.5833 5.41669 18.3333 10 18.3333Z"
              stroke="#02B34C"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              opacity="0.34"
              d="M6.45831 10.0017L8.81665 12.36L13.5416 7.64333"
              stroke="#02B34C"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        </svg>
      </span>
    </div>

    <div
      @click="toggleFilter('Rejected')"
      :class="`${filters.filter === 'Rejected' ? 'active-filter' : ''} action rejected-action flex flex-col gap-2 p-2 pb-3 relative`"
    >
      <span class="icon rejected-icon font-extrabold font-p-1">
        {{ rejected }}
      </span>
      <span class="title px-1 font-semibold opacity-90 font-p-2"
        >Rejected requests</span
      >
      <span class="absolute right-2 top-2">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.75">
            <path
              d="M9.99996 18.3333C14.5833 18.3333 18.3333 14.5833 18.3333 10C18.3333 5.41666 14.5833 1.66666 9.99996 1.66666C5.41663 1.66666 1.66663 5.41666 1.66663 10C1.66663 14.5833 5.41663 18.3333 9.99996 18.3333Z"
              stroke="#FC4A1E"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <g opacity="0.4">
              <path
                d="M7.64172 12.36L12.3584 7.64333M12.3584 12.36L7.64172 7.64333"
                stroke="#FC4A1E"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </g>
        </svg>
      </span>
    </div>
  </template>
</template>

<style scoped>
.action {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid #ffffff;
  border-radius: var(--radius);
  cursor: pointer;
  position: relative;
}

.action::before {
  content: '';
  position: absolute;
  height: 60%;
  width: 4px;
  border-radius: 10px;
  left: -2px;
  top: 20%;
  transition: var(--transition);
  opacity: 0;
}

.active-filter::before{
  opacity: 1;
}

.icon {
  height: 2.25rem;
  width: 2.25rem;
  border-radius: var(--radius-s);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 89, 147, 0.1);
  border: 1px solid rgba(20, 89, 147, 0.05);
  color: var(--primary);
}

.icon svg {
  height: 1.25rem;
  width: 1.25rem;
}

.icon-pending {
  background: rgba(252, 193, 30, 0.08);
  border: 1px solid rgba(252, 193, 30, 0.08);
  color: rgba(252, 193, 30, 1);
}

.pending-action::before {
  background-color: rgba(252, 193, 30, 1);
}

.approved-action::before {
  background-color: rgba(2, 179, 76, 1);
}

.completed-icon {
  background: rgba(2, 179, 76, 0.08);
  border: 1px solid rgba(2, 179, 76, 0.08);
  color: rgba(2, 179, 76, 1);
}

.rejected-icon {
  background: rgba(252, 74, 30, 0.08);
  border: 1px solid rgba(252, 74, 30, 0.08);
  color: rgba(252, 74, 30, 1);
}

.rejected-action::before {
  background-color: rgba(252, 74, 30, 1);
}
</style>
