<script setup lang="ts">
import NumberFlow from '@number-flow/vue';
import { AnimatePresence, motion } from 'motion-v';
import { BASE_URL } from '~/constants/BASE_URL';
import type { RequestTypes } from '~/types/requestTypes';
import { formatDate2, formatDate3 } from '#imports';
import type { TokenTypes } from '~/types/TokenTypes';
import { jwtDecode } from 'jwt-decode';
import { COOKIE_NAME } from '~/constants/COOKIE_NAME';

const token = useCookie(COOKIE_NAME);

const user = ref<TokenTypes>();

onMounted(() => {
  if (token && token.value) {
    const decodedToken: TokenTypes = jwtDecode(token.value);
    user.value = decodedToken;
  }
});

const requests = ref<RequestTypes[]>([]);

type Response = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: RequestTypes[];
};

const filters = useFiltersStore();
const search = ref('');

const { status, refresh } = useFetch(
  () => `${BASE_URL}/requests?search=${search.value}&status=${filters.filter}`,
  {
    lazy: true,
    headers: {
      authorization: `Bearer ${token.value}`,
    },
    transform: (data: Response) => {
      requests.value = data.data;
    },
  }
);

watch(
  () => search.value,
  (newSearch, oldSearch) => {
    if (newSearch && !oldSearch) {
      // Initial valid ID
      refresh();
    } else if (newSearch && oldSearch && newSearch !== oldSearch) {
      // ID changed
      refresh();
    }
    // No action when ID is removed (newId becomes falsy)
  },
  { immediate: true }
);

watch(
  () => filters.filter,
  (newFilter, oldFilter) => {
    if (newFilter && !oldFilter) {
      // Initial valid ID
      refresh();
    } else if (newFilter && oldFilter && newFilter !== oldFilter) {
      // ID changed
      refresh();
    }
    // No action when ID is removed (newId becomes falsy)
  },
  { immediate: true }
);

const requestModal = useViewRequestStore();
const addRequestModal = useFundsModalStore();

const route = useRoute();
const router = useRouter();

const viewRequest = (id: string) => {
  // Update URL without reloading or pushing to history
  router.replace({
    query: {
      ...route.query,
      requestId: id,
    },
  });
};

watch(
  () => route.query.requestId,
  (newId) => {
    if (newId) {
      requestModal.setViewModalActive();
    }
  },
  { immediate: true }
);

const searchInput = ref<HTMLInputElement | null>(null);

function handleKeydown(event: KeyboardEvent): void {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    searchInput.value?.focus();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});

const onInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  search.value = input.value;
};

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

const exportLoading = ref(false);

const exportToExcel = async () => {
  exportLoading.value = true;
  try {
    const response = await fetch(`${BASE_URL}/requests/export`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download file');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'approved-requests.xlsx';
    document.body.appendChild(a);
    a.click();

    // Cleanup
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading Excel file:', error);
  } finally {
    exportLoading.value = false;
  }
};
</script>

<template>
  <div class="grid grid-rows-[auto_1fr] overflow-hidden gap-4">
    <div class="flex items-center w-full">
      <span class="font-semibold sora font-h-4">Recent requests</span>

      <div class="flex gap-4 ml-auto">
        <div class="input-group search relative">
          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.6">
              <path
                d="M9.58268 18C10.6223 18 11.6518 17.7952 12.6123 17.3974C13.5728 16.9995 14.4455 16.4164 15.1806 15.6813C15.9157 14.9461 16.4989 14.0734 16.8967 13.1129C17.2946 12.1524 17.4993 11.123 17.4993 10.0833C17.4993 9.0437 17.2946 8.01425 16.8967 7.05376C16.4989 6.09326 15.9157 5.22054 15.1806 4.48541C14.4455 3.75028 13.5728 3.16714 12.6123 2.76929C11.6518 2.37144 10.6223 2.16667 9.58268 2.16667C7.48305 2.16667 5.46942 3.00074 3.98475 4.48541C2.50009 5.97007 1.66602 7.9837 1.66602 10.0833C1.66602 12.183 2.50009 14.1966 3.98475 15.6813C5.46942 17.1659 7.48305 18 9.58268 18Z"
                stroke="#313131"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                opacity="0.4"
                d="M18.3327 18.8333L16.666 17.1667"
                stroke="#313131"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>
          <input
            @beforeinput="onInput"
            @keydown="onInput"
            @input="onInput"
            ref="searchInput"
            :value="search"
            type="text"
            placeholder="Search for a request"
          />
          <div class="flex gap-2 items-center">
            <AnimatePresence mode="popLayout">
              <span
                :transition="{
                  ease: [0.25, 0.1, 0.25, 1.0],
                  duration: 0.5,
                }"
                :initial="{ opacity: 0 }"
                :animate="{ opacity: 1 }"
                :exit="{ opacity: 0 }"
                v-if="filters.filter && filters.filter.length > 0"
                @click="filters.setFilter('')"
                class="filter bg-[#EBEBEB] rounded-[calc(var(--radius-s)_*_0.8)] h-[1.75rem] items-center px-3 cursor-pointer font-p-2 font-medium flex gap-1"
              >
                <svg
                  style="height: 0.85rem; width: 0.85rem"
                  width="10"
                  height="11"
                  viewBox="0 0 10 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.5" clip-path="url(#clip0_727_36)">
                    <path
                      d="M7.5 3L2.5 8"
                      stroke="#313131"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.5 3L7.5 8"
                      stroke="#313131"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_727_36">
                      <rect
                        width="10"
                        height="10"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>

                <span
                  style="font-weight: 600"
                  class="opacity-60 font-p-3 font-medium"
                  >{{ filters.filter }}</span
                >
              </span>
            </AnimatePresence>
            <span class="shortcut">
              <span class="opacity-60"> CTRL + K </span>
            </span>
          </div>
        </div>

        <button
          v-if="user && user.role.toLowerCase() === 'partner'"
          @click="exportToExcel()"
          class="font-semibold px-4 bg-[var(--white)] flex items-center gap-2 rounded-[var(--radius-s)] border border-[var(--border)]"
        >
          <UxLoaderPrimary v-if="exportLoading" />
          <template v-else>
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
            >
              <g opacity="0.75">
                <g opacity="0.4">
                  <path
                    d="M10 7.16667V2.16667M10 2.16667L8.33337 3.83334M10 2.16667L11.6667 3.83334"
                    stroke="#313131"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <path
                  d="M5.83333 10.5C2.5 10.5 2.5 11.9917 2.5 13.8333V14.6667C2.5 16.9667 2.5 18.8333 6.66667 18.8333H13.3333C16.6667 18.8333 17.5 16.9667 17.5 14.6667V13.8333C17.5 11.9917 17.5 10.5 14.1667 10.5C13.3333 10.5 13.1 10.675 12.6667 11L11.8167 11.9C11.583 12.1486 11.3009 12.3467 10.9877 12.4821C10.6746 12.6175 10.337 12.6873 9.99583 12.6873C9.65466 12.6873 9.3171 12.6175 9.00395 12.4821C8.6908 12.3467 8.40869 12.1486 8.175 11.9L7.33333 11C6.9 10.675 6.66667 10.5 5.83333 10.5Z"
                  stroke="#313131"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  opacity="0.4"
                  d="M4.16663 10.5V8.83334C4.16663 7.15834 4.16663 5.77501 6.66663 5.53334M15.8333 10.5V8.83334C15.8333 7.15834 15.8333 5.77501 13.3333 5.53334"
                  stroke="#313131"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>

            Export
          </template>
        </button>
      </div>
    </div>

    <div
      class="reaquests-table relative z-[1] grid grid-rows-[auto_1fr] overflow-hidden"
    >
      <div
        class="t-header font-p-2 opacity-70 border-[1px] mb-2 border-[var(rgba(20,89,147,0.5))] bg-[rgba(20,89,147,0.05)] rounded-[var(--radius-s)] grid gap-2 grid-cols-[6rem_1fr_1fr_1fr_1fr_15rem_5rem_2rem] p-2 px-4 h-fit"
      >
        <span class="font-semibold">#</span>
        <span class="font-semibold">By</span>
        <span class="font-semibold">Amount</span>
        <span class="font-semibold">Approver</span>

        <span class="font-semibold">Initiated on</span>
        <span class="font-semibold">Required on</span>
        <span class="font-semibold">Status</span>
        <span class="font-semibold"></span>
      </div>

      <div class="t-body w-full h-full grid overflow-y-auto auto-rows-min">
        <div
          v-if="status == 'pending'"
          class="flex w-full h-full items-center justify-center absolute"
        >
          <UxLoaderPrimary />
        </div>

        <div
          v-if="status == 'error'"
          class="flex w-full h-full items-center justify-center absolute"
        >
          <span
            class="error bg-red-100 font-semibold px-4 py-2 rounded-3xl font-p-3 text-red-600 border border-red-200"
          >
            Something tripped on our end.
            <span
              @click="refresh()"
              class="font-bold underline text-red-600 cursor-pointer"
              >Try again</span
            >
          </span>
        </div>

        <template v-if="status == 'success' && user">
          <motion.div
            v-if="requests.length > 0"
            :initial="{ y: -40, opacity: 0 }"
            :animate="{ y: 0, opacity: 1 }"
            :exit="{ y: -40, opacity: 0 }"
            :transition="{
              ease: [0.25, 0.1, 0.25, 1.0],
              duration: 0.5,
              delay: (index + 1) * 0.05,
            }"
            v-for="(req, index) in requests"
            @click="viewRequest(req._id)"
            class="t-row select-none font-p-2 cursor-pointer grid gap-2 grid-cols-[6rem_1fr_1fr_1fr_1fr_15rem_5rem_2rem] items-center p-2 pb-4 px-4"
          >
            <span class="font-medium">R-{{ req.requestNumber }}</span>
            <span class="font-medium"
              >{{ req.requestedBy.first_name }}
              <span
                class="font-bold opacity-20"
                v-if="req.requestedBy.user_id == user.user_id"
                >(You)</span
              >
            </span>
            <span class="font-medium">
              <template v-if="req.currency === 'MWK'"> K </template>

              <template v-if="req.currency === 'USD'"> $ </template>
              <NumberFlow
                :value="req.amount"
                :format="{ maximumFractionDigits: 2, minimumFractionDigits: 2 }"
              />
            </span>
            <span class="font-medium"
              >{{ req.approver.first_name }}
              <span
                class="font-bold opacity-20"
                v-if="req.approver.user_id == user.user_id"
                >(You)</span
              ></span
            >

            <span class="font-medium">{{ formatDate2(req.initiatedOn) }}</span>
            <span class="font-medium">{{
              req.requiredOn && req.requiredOn.length > 0
                ? formatDate3(req.requiredOn)
                : 'Not specified'
            }}</span>
            <span :class="`font-semibold ${req.status.toLowerCase()}`">{{
              req.status
            }}</span>
            <span class="font-semibold flex items-center justify-center">
              <svg
                class="h-4 w-4"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.85">
                  <path
                    opacity="0.4"
                    d="M12.985 10.0017C12.985 11.6517 11.6516 12.985 10.0016 12.985C8.35164 12.985 7.01831 11.6517 7.01831 10.0017C7.01831 8.35167 8.35164 7.01834 10.0016 7.01834C11.6516 7.01834 12.985 8.35167 12.985 10.0017Z"
                    stroke="#313131"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9.99999 16.8908C12.9417 16.8908 15.6833 15.1575 17.5917 12.1575C18.3417 10.9825 18.3417 9.00749 17.5917 7.83249C15.6833 4.83249 12.9417 3.09915 9.99999 3.09915C7.05833 3.09915 4.31666 4.83249 2.40833 7.83249C1.65833 9.00749 1.65833 10.9825 2.40833 12.1575C4.31666 15.1575 7.05833 16.8908 9.99999 16.8908Z"
                    stroke="#313131"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
              </svg>
            </span>
          </motion.div>

          <div
            v-if="requests.length == 0"
            class="flex w-full flex-col h-full items-center justify-center absolute"
          >
            <span class="font-semibold opacity-80 font-p-2"
              >Looks like there’s nothing here yet.</span
            >
            <p class="opacity-75 font-medium font-p-3 mt-1.5 mb-3 text-center">
              Try requesting some funds <br />
              or refreshing
            </p>
            <div class="flex gap-4">
              <span
                @click="refresh()"
                class="h-[2.15rem] cursor-pointer w-[2.15rem] border-[1px] border-[var(--border)] rounded-full bg-[var(--white)] justify-center font-p-2 items-center flex font-semibold"
                ><svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  class="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.4"
                    d="M19.8533 6.77335C18.6933 6.42668 17.4133 6.20001 16 6.20001C9.61333 6.20001 4.44 11.3733 4.44 17.76C4.44 24.16 9.61333 29.3333 16 29.3333C22.3867 29.3333 27.56 24.16 27.56 17.7733C27.56 15.4 26.84 13.1867 25.6133 11.3467"
                    stroke="#313131"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17.6533 2.66669L21.5067 7.09335L17.0133 10.3734"
                    stroke="#313131"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <span
                @click="addRequestModal.setFundsModalActive()"
                class="h-[2.15rem] w-[2.15rem] cursor-pointer justify-center rounded-full bg-[rgba(20,_89,_147,_0.1)] border-[1px] border-[rgba(20,89,147,0.05)] font-p-2 items-center flex font-semibold"
              >
                <SvgPlus class="h-4.5 w-4.5" />
              </span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search {
  width: 25rem;
}
.search:focus-within {
  border: 1px solid #a0cff5;
}

.approved {
  color: #02b34c;
}

.pending {
  color: #ffa500;
}

.rejected {
  color: #fc4a1e;
}

.t-row {
  border-bottom: 1px solid rgba(61, 68, 77, 0.05);
}

.t-row:last-child {
  border-bottom: 0px solid rgba(61, 68, 77, 0.05);
}
</style>
