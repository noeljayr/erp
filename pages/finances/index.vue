<template>
  <div class="grid grid-rows-[auto_1fr] gap-8 pt-2">
    <div class="quick-actions grid grid-cols-4 gap-2 w-[50rem]">
      <div
        @click="modal.setFundsModalActive()"
        class="action flex flex-col gap-2 p-2 pb-3 relative"
      >
        <span class="icon">
          <SvgPlus />
        </span>
        <span class="title px-1 font-semibold opacity-90 font-p-2"
          >Request funds</span
        >
        <span class="absolute right-2 top-2">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.75">
              <path
                d="M11.2938 9.01875L7.5 12.8125L3.70625 9.01875"
                stroke="#145993"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                opacity="0.4"
                d="M7.5 2.1875V12.7062"
                stroke="#145993"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>
        </span>
      </div>

      <FinancesFilters />
    </div>

    <RequestsTable />
    <ModalsRequestFunds />
    <ModalsRequestFundsViewRequest />
  </div>
</template>

<script setup lang="ts">
import RequestsTable from '~/components/finances/RequestsTable.vue';
import { jwtDecode } from 'jwt-decode';
import type { TokenTypes } from '~/types/TokenTypes';

const userRole = ref('');

const token = useCookie('bintel_auth_token');

onMounted(() => {
  if (token && token.value) {
    let decoded: TokenTypes = jwtDecode(token.value);
    userRole.value = decoded.role;
  }
});

const modal = useFundsModalStore();

definePageMeta({
  layout: 'finances',
});



</script>

<style scoped>
.action {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid #ffffff;
  border-radius: var(--radius);
  cursor: pointer;
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
</style>
