<template>
  <motion.div
    key="approval"
    layout="position"
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
    :exit="{ opacity: 0 }"
    :transition="{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }"
    class="flex flex-col gap-4"
  >
    <motion.div
      layout="position"
      class="relative grid grid-rows-[auto_2.45rem] gap-2 w-full"
    >
      <span class="font-semibold opacity-70">General purpose </span>
      <div
        ref="selectRef"
        :class="`select-purpose absolute ${
          showOptions
            ? 'h-[19rem] grid grid-rows-[auto_1fr] overflow-hidden rounded-[var(--radius-m)] backdrop-blur-[5px]'
            : 'h-[2.45rem] rounded-[var(--radius-s)]'
        } backdrop-blur-[0px] top-[40%] w-full z-[2]`"
      >
        <span
          @click="setShowOptions(!showOptions)"
          class="w-full px-3 py-[0.6rem] cursor-pointer grid grid-cols-[1fr_auto]"
        >
          <span class="truncate font-semibold">{{
            selectedPurpose.length < 2 ? 'Select' : selectedPurpose
          }}</span>
          <span
            class="flex items-center pl-2 border-l-[1px] border-l-[var(--border)]"
          >
            <svg
              width="15"
              height="16"
              viewBox="0 0 15 16"
              fill="none"
              :class="`opacity-50 h-4 w-4 ${
                showOptions ? 'rotate-180' : 'rotate-0'
              }`"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  d="M12.4498 6.09375L8.37481 10.1687C7.89356 10.65 7.10606 10.65 6.62481 10.1687L2.5498 6.09375"
                  stroke="#313131"
                  stroke-width="1.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </svg>
          </span>
        </span>
        <AnimatePresence mode="popLayout">
          <motion.div
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="{ ease: [0.25, 0.1, 0.25, 1.0], duration: 0.5 }"
            v-if="showOptions"
            class="flex flex-col gap-2 h-full w-full px-2 py-2 overflow-y-auto hide-scrollbar border-t-[1px] border-t-[var(--border)]"
          >
            <template v-for="purpose in purposes">
              <span
                @click="setSelectedPurpose(purpose.name)"
                v-if="
                  user?.role.toLowerCase() == 'employee' &&
                  purpose.role != 'partners'
                "
                class="flex py-2.5 pr-4 pl-2 bg-[var(--white)] cursor-pointer rounded-[var(--radius-s)] items-center gap-2 font-semibold border-[1px] border-[rgba(61,68,77,0.07)]"
              >
                <span
                  class="h-4 w-4 border-[1px] border-[var(--border)] rounded-full"
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    :class="`h-4 w-4 ${
                      selectedPurpose == purpose.name
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-0'
                    }`"
                  >
                    <rect width="19" height="19" rx="9.5" fill="#145993" />
                    <path
                      d="M6.58325 9.50001L8.66659 11.5833L12.8333 7.41667"
                      stroke="#FEF6F7"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <span class="opacity-80">{{ purpose.name }}</span>
              </span>

              <span
                @click="setSelectedPurpose(purpose.name)"
                v-else-if="user?.role.toLowerCase() == 'partner'"
                class="flex py-2.5 pr-4 pl-2 bg-[var(--white)] cursor-pointer rounded-[var(--radius-s)] items-center gap-2 font-semibold border-[1px] border-[rgba(61,68,77,0.07)]"
              >
                <span
                  class="h-4 w-4 border-[1px] border-[var(--border)] rounded-full"
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 19 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    :class="`h-4 w-4 ${
                      selectedPurpose == purpose.name
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-0'
                    }`"
                  >
                    <rect width="19" height="19" rx="9.5" fill="#145993" />
                    <path
                      d="M6.58325 9.50001L8.66659 11.5833L12.8333 7.41667"
                      stroke="#FEF6F7"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <span class="opacity-80">{{ purpose.name }}</span>
              </span>
            </template>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>

    <motion.div layout="position" class="flex gap-2 flex-col w-full">
      <span class="font-semibold opacity-70 flex gap-2 items-center"
        >Description 

        <span class="opacity-50 font-semibold font-p-2">(Optional)</span>
      </span>

      <textarea
        @beforeinput="setDescription"
        @keydown="setDescription"
        @input="setDescription"
        placeholder="Requisition details"
        name=""
        id=""
        :value="description"
        class="font-semibold resize-none h-[7rem] rounded-[var(--radius-m)] p-3 pt-2 outline-none border-[1px] border-[var(--border)] bg-transparent"
      ></textarea>
    </motion.div>

    <motion.div
      layout="position"
      v-if="status === 'success' && partners"
      class="flex gap-2 flex-col w-full"
    >
      <span class="font-semibold opacity-70 flex gap-2 items-center"
        >To be approved by:
      </span>

      <div class="flex gap-2 items-center">
        <template v-for="partner in partners">
          <span
            v-if="partner.user_id != user?.user_id"
            style="transition: var(--transition)"
            @click="setApprover(partner.user_id)"
            :class="`cursor-pointer grow text-center px-4 py-1.5 font-semibold rounded-[2rem] border-[1px] ${
              approver == partner.user_id
                ? 'border-[rgba(20,89,147,0.15)] text-[var(--primary)] bg-[rgba(20,89,147,0.1)]'
                : 'text-[var(--black)] border-[var(--border)] bg-transparent'
            }`"
          >
            {{ partner.first_name }}
          </span>
        </template>
      </div>
    </motion.div>
    <motion.div
      layout="position"
      key="cta-container"
      :transition="{ ease: [0.25, 0.1, 0.25, 1.0], duration: 0.5 }"
      class="cta-container items-center"
    >
      <motion.button
        layout="position"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ ease: [0.25, 0.1, 0.25, 1.0], duration: 0.5 }"
        @click="modalSteps.setPrevStep()"
        class="cta-3"
        >Back</motion.button
      >

      <motion.button
        :disabled="
          formData.purpose.length < 2 || formData.approverId.length < 1
        "
        layout="position"
        :transition="{ ease: [0.25, 0.1, 0.25, 1.0], duration: 0.5 }"
        @click="modalSteps.setNextStep()"
        :class="`cta ${
          formData.purpose.length < 2 || formData.approverId.length < 1
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`"
      >
        Next
      </motion.button>
    </motion.div>
  </motion.div>
</template>

<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v';
import { purposes } from '~/data/purposes';
import { useRequestFormData } from '#imports';
import type { TokenTypes } from '~/types/TokenTypes';
import { useCookie } from '#imports';
import { COOKIE_NAME } from '~/constants/COOKIE_NAME';
import { BASE_URL } from '~/constants/BASE_URL';
import { jwtDecode } from 'jwt-decode';

const token = useCookie(COOKIE_NAME);

const { data: partners, status } = useFetch(`${BASE_URL}/users?role=Partner`, {
  lazy: true,
  server: false,
  headers: {
    authorization: `Bearer ${token.value}`,
  },
  transform: (approver: TokenTypes[]) => {
    return approver.map((approver) => ({
      user_id: approver.user_id,
      first_name: approver.first_name,
    }));
  },
});

const modalSteps = useFundsStepStore();
const formData = useRequestFormData();

const user = ref<TokenTypes>();

onMounted(() => {
  if (token && token.value) {
    const decodedToken: TokenTypes = jwtDecode(token.value);
    user.value = decodedToken;
  }
});

const showOptions = ref(false);
const selectRef = ref<HTMLElement | null>(null);
const selectedPurpose = ref(formData.purpose);
const approver = ref(formData.approverId);
const description = ref(formData.description);

const setShowOptions = (show: boolean) => {
  showOptions.value = show;
};

const setSelectedPurpose = (option: string) => {
  selectedPurpose.value = option;
  formData.setPurpose(option);
  window.setTimeout(() => {
    setShowOptions(false);
  }, 500);
};

const setDescription = (e: Event) => {
  const input = e.target as HTMLInputElement;
  description.value = input.value;
  if (input.value.length < 1) {
    formData.setDescription(null);
  } else {
    formData.setDescription(input.value);
  }
};

useClickOutside(selectRef, () => {
  setShowOptions(false);
});

const setApprover = (id: string) => {
  approver.value = id;
  formData.setApprover(id);
};
</script>

<style scoped>
.select-purpose {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(61, 68, 77, 0.1);
  transition: var(--transition);
}
svg {
  transition: var(--transition);
}

textarea::placeholder {
  color: var(--black);
  opacity: 0.5;
}
</style>
