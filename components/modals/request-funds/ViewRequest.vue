<script setup lang="ts">
import { useViewRequestStore } from '#imports';
import { jwtDecode } from 'jwt-decode';
import { COOKIE_NAME } from '~/constants/COOKIE_NAME';
import { formatDate2, formatDate3 } from '#imports';
import type { TokenTypes } from '~/types/TokenTypes';
import { BASE_URL } from '~/constants/BASE_URL';
import type { RequestTypes } from '~/types/requestTypes';
import LoaderPrimary from '~/components/ux/LoaderPrimary.vue';
import NumberFlow from '@number-flow/vue';

const token = useCookie(COOKIE_NAME);
const refreshStore = useRefreshStore();

const modal = useViewRequestStore();

const user = ref<TokenTypes>();

onMounted(() => {
  if (token && token.value) {
    const decodedToken: TokenTypes = jwtDecode(token.value);
    user.value = decodedToken;
  }
});

const route = useRoute();
const router = useRouter();

const selectedRequestId = computed(
  () => (route.query.requestId as string) || ''
);

const {
  data: request,
  status,
  refresh,
} = useFetch(() => `${BASE_URL}/requests/${selectedRequestId.value}`, {
  lazy: true,
  headers: {
    authorization: `Bearer ${token.value}`,
  },
  transform: (resp: RequestTypes) => resp,
});

watch(
  () => selectedRequestId.value,
  (newId, oldId) => {
    if (newId && !oldId) {
      refresh();
    } else if (newId && oldId && newId !== oldId) {
      refresh();
    }
  },
  { immediate: true }
);

watch(
  selectedRequestId,
  (id) => {
    if (id) {
      refresh();
      modal.setViewModalActive('true');
    }
  },
  { immediate: true }
);

const closeModal = () => {
  router.replace({ query: { ...route.query, requestId: undefined } });
  modal.setViewModalActive();
};

const updateLoading = ref(false);

const setUpdateLoading = (state: boolean) => {
  updateLoading.value = state;
};

const updateError = ref(false);

const setUpdateError = (state: boolean) => {
  updateError.value = state;
};

const updateSuccess = ref(false);

const setUpdateSuccess = (state: boolean) => {
  updateSuccess.value = state;
};

const update = async (status: string) => {
  setUpdateSuccess(false);
  setUpdateError(false);
  setUpdateLoading(false);

  try {
    setUpdateLoading(true);

    const response = await fetch(
      `${BASE_URL}/requests/${selectedRequestId.value}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify({
          status: status,
        }),
      }
    );

    if (response.status == 200) {
      setUpdateSuccess(true);
      refresh();
      refreshStore.setRefresh();
    } else {
      setUpdateError(true);
    }
  } catch (e: any) {
    setUpdateError(true);
    console.log(e);
  } finally {
    setUpdateLoading(false);
  }
};
</script>

<template>
  <template v-if="selectedRequestId.length > 0">
    <div
      @click="closeModal"
      :class="`modal-overlay fixed ${
        modal.active ? 'opacity-100' : 'opacity-0 invisible pointer-events-none'
      }`"
    ></div>
    <div
      v-if="user"
      :class="`modal view-modal ${modal.active ? 'modal-active' : ''}`"
    >
      <span class="close-btn">
        <SvgXIcon
          @click="modal.setViewModalActive"
          class="h-6 w-6 ml-auto cursor-pointer"
        />
      </span>
      <div
        v-if="status === 'pending'"
        class="absolute w-full h-full top-0 left-0 flex items-center justify-center"
      >
        <LoaderPrimary />
      </div>
      <template v-if="status === 'success' && request">
        <div class="section">
          <div class="flex items-center">
            <h2 class="amount text-[var(--primary)]">
              <template v-if="request.currency === 'MWK'"> K </template>

              <template v-if="request.currency === 'USD'"> $ </template>
              <NumberFlow
                style="color: var(--primary); font-size: var(--h2)"
                :value="request.amount"
                :format="{ maximumFractionDigits: 2, minimumFractionDigits: 2 }"
              />
            </h2>
            <span :class="`status ${request.status.toLowerCase()}`">
              {{ request.status }}
            </span>
          </div>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <span class="font-bold"
                >From
                <span
                  class="font-bold opacity-20"
                  v-if="request.requestedBy.user_id == user.user_id"
                  >(You)</span
                >
              </span>
              <div
                class="grid grid-cols-[auto_auto_1fr_auto_auto] gap-4 truncate"
              >
                <span class="font-medium opacity-80"
                  >{{ request.requestedBy.first_name }}
                  {{ request.requestedBy.last_name }}</span
                >
                <span class="h-[80%] w-[2px] bg-[var(--border)]"></span>
                <span class="font-medium opacity-80 w-full text-center">{{
                  request.requestedBy.email
                }}</span>
                <span class="h-[80%] w-[2px] bg-[var(--border)]"></span>
                <span class="font-medium opacity-80 w-full text-center">{{
                  request.requestedBy.phone
                }}</span>
              </div>
            </div>

            <div
              v-if="
                user.role.toLocaleLowerCase() == 'partner' &&
                user.user_id === request.approverId &&
                request.status == 'Pending'
              "
              class="cta-container items-center"
            >
              <span class="font-semibold mr-auto">
                <UxLoaderPrimary v-if="updateLoading" />
              </span>
              <button
                @click="update('Rejected')"
                :class="`cta-3 ${
                  updateLoading
                    ? 'opacity-50 pointer-events-none'
                    : 'opacity-100'
                }`"
              >
                Reject
              </button>
              <button
                @click="update('Approved')"
                :class="`cta ${
                  updateLoading
                    ? 'opacity-50 pointer-events-none'
                    : 'opacity-100'
                }`"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
        <div class="section h-[15rem] overflow-hidden relative">
          <p v-if="request.description && request.description.length > 0">
            {{ request.description }}
          </p>
          <div
            v-else
            class="flex flex-col gap-2 items-center h-full w-full justify-center"
          >
            <svg
              width="100"
              height="100"
              viewBox="0 0 101 100"
              fill="none"
              class="h-16 w-16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.7">
                <path
                  opacity="0.4"
                  d="M29.667 45.8333H63.0003M29.667 62.5H50.5003"
                  stroke="#313131"
                  stroke-width="3"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M63 91.6667H38C17.1667 91.6667 13 83.0833 13 65.9167V40.2083C13 20.625 19.9583 15.375 33.8333 14.5833H67.1667C81.0417 15.3333 88 20.625 88 40.2083V66.6667"
                  stroke="#313131"
                  stroke-width="3"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M88 66.6667L63 91.6667V79.1667C63 70.8334 67.1667 66.6667 75.5 66.6667H88Z"
                  stroke="#313131"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>

            <span class="text-center opacity-50 font-semibold font-p-3">
              No extra <br />
              details provided
            </span>
          </div>
        </div>

        <div class="section">
          <span class="font-bold opacity-85">Date</span>
          <div class="grid gap-4 grid-cols-[40%_1fr]">
            <span class="font-semibold opacity-50">Initiated on</span>
            <span class="font-medium">{{
              formatDate2(request.initiatedOn)
            }}</span>
          </div>
          <div class="grid gap-4 grid-cols-[40%_1fr]">
            <span class="font-semibold opacity-50">Required by</span>
            <span class="font-medium">
              {{
                request.requiredOn && request.requiredOn.length > 0
                  ? formatDate3(request.requiredOn)
                  : 'Not specified'
              }}
            </span>
          </div>
        </div>

        <div class="section">
          <span class="font-bold opacity-85"
            >Approver
            <span
              class="font-bold opacity-20"
              v-if="request.approver.user_id == user.user_id"
              >(You)</span
            ></span
          >
          <div class="grid gap-4 grid-cols-[40%_1fr]">
            <span class="font-semibold opacity-50">Name</span>
            <span class="font-medium"
              >{{ request.approver.first_name }}
              {{ request.approver.last_name }}</span
            >
          </div>
          <div class="grid gap-4 grid-cols-[40%_1fr]">
            <span class="font-semibold opacity-50">Email</span>
            <span class="font-medium">{{ request.approver.email }}</span>
          </div>
          <div class="grid gap-4 grid-cols-[40%_1fr]">
            <span class="font-semibold opacity-50">Phone</span>
            <span class="font-medium">{{ request.approver.phone }}</span>
          </div>
        </div>
      </template>
    </div>
  </template>
</template>

<style scoped>
@import url('../../../assets/css/modals.css');

.view-modal {
  width: 40rem;
  height: calc(100vh - 1rem);
  top: 0.5rem;
  right: -10rem;
  gap: 0.5rem;
}

.modal-active {
  top: 0.5rem;
  right: 0.5rem;
}

.section {
  padding: 1rem;
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(61, 68, 77, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

h2 {
  font-weight: 900;
}

.status {
  padding: 0.75rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 2rem;
  border: 1px solid var(--border);
  margin-left: auto;
  font-weight: bold;
  font-size: var(--p3);
  line-height: 0;
}

.pending {
  color: #ffa500;
  background: rgba(255, 165, 0, 0.15);
  border: 1px solid rgba(255, 165, 0, 0.15);
}

.approved {
  color: #02b34c;
  background-color: rgba(2, 179, 76, 0.1);
  border: 1px solid rgba(2, 179, 76, 0.15);
}

.rejected {
  color: #fc4a1e;
  background-color: rgba(252, 74, 30, 0.1);
  border: 1px solid rgba(252, 74, 30, 0.15);
}

.cta-container .cta-3,
.cta-container .cta {
  height: 2.25rem;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
