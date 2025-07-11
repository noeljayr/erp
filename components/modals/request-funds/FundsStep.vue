<template>
  <motion.div
    layout="position"
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
    :exit="{ opacity: 0 }"
    key="funds"
    :transition="{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }"
    class="flex flex-col gap-4"
  >
    <div class="funds-input flex flex-col gap-2">
      <span class="font-semibold opacity-70">Amount</span>
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          :transition="{ ease: [0.25, 0.1, 0.25, 1.0], duration: 0.5 }"
          class="grid grid-cols-[auto_1fr]"
        >
          <motion.span
            v-if="currency == 'MWK'"
            layout="position"
            :transition="{ ease: [0.25, 0.1, 0.25, 1.0], duration: 0.5 }"
            class="font-extrabold font-h-1 mr-1.5"
            >K</motion.span
          >
          <motion.span
            v-if="currency == 'USD'"
            layout="position"
            :transition="{ ease: [0.25, 0.1, 0.25, 1.0], duration: 0.5 }"
            class="font-extrabold font-h-1 mr-1.5"
            >$</motion.span
          >
          <input
            layout="position"
            :transition="{ ease: [0.25, 0.1, 0.25, 1.0], duration: 0.5 }"
            type="text"
            :value="amount"
            @beforeinput="onInput"
            @keydown="onInput"
            @input="onInput"
            class="font-extrabold font-h-1 outline-none"
            placeholder="0.00"
          />
        </motion.div>
      </AnimatePresence>

      <div class="flex flex-col gap-2 mb-3 mt-2">
        <span class="font-semibold opacity-70">Currency</span>
        <div class="flex items-center gap-8">
          <span
            @click="setCurrency('MWK')"
            :class="`radio-btn-container ${
              currency == 'MWK' ? 'selected-radio-btn' : ''
            }`"
          >
            <span className="radio-btn">
              <svg
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
            <span className="radio-btn-label">Malawi Kwacha</span>
          </span>

          <span
            @click="setCurrency('USD')"
            :class="`radio-btn-container ${
              currency == 'USD' ? 'selected-radio-btn' : ''
            }`"
          >
            <span className="radio-btn">
              <svg
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
            <span className="radio-btn-label">US Dollars</span>
          </span>
        </div>
      </div>
    </div>

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
        @click="modal.setFundsModalActive()"
        class="cta-3"
        >Cancel</motion.button
      >

      <motion.button
        :disabled="formData.amount < 1"
        layout="position"
        :transition="{ ease: [0.25, 0.1, 0.25, 1.0], duration: 0.5 }"
        @click="modalSteps.setNextStep()"
        :class="`cta ${
          formData.amount < 1 ? 'opacity-50 cursor-not-allowed' : ''
        }`"
      >
        Next
      </motion.button>
    </motion.div>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v';
import { useRequestFormData } from '#imports';
const modal = useFundsModalStore();
const modalSteps = useFundsStepStore();

const formData = useRequestFormData();

const currency = ref(formData.currency);
const amount = ref<string>(
  formData.amount < 1 ? '' : formData.amount.toString()
);

function setCurrency(curr: string) {
  currency.value = curr;
  formData.setCurrency(curr);
}

function onInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  let rawValue = input.value;

  // Remove all characters except digits and periods
  rawValue = rawValue.replace(/[^0-9.]/g, '');

  // Allow only one decimal point
  const parts = rawValue.split('.');
  if (parts.length > 2) {
    rawValue = parts[0] + '.' + parts.slice(1).join('');
  }

  // Format integer part with commas
  const [integerPart, decimalPart] = rawValue.split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formattedValue =
    decimalPart !== undefined
      ? `${formattedInteger}.${decimalPart}`
      : formattedInteger;

  // Update the input field and amount display
  input.value = formattedValue;
  amount.value = formattedValue;

  // Update the underlying model with numeric value (without commas)
  if (rawValue.length > 0) {
    formData.setAmount(parseFloat(rawValue));
  } else {
    formData.setAmount(0);
    input.value = '';
    amount.value = '';
  }
}
</script>

<style scoped>
input {
  background-color: transparent;
}

input::placeholder {
  color: var(--black);
  opacity: 0.5;
}
</style>
