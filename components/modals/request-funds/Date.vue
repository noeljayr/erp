<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFundsStepStore } from '#imports';
import { motion } from 'motion-v';

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  format,
  isSameDay,
  isBefore,
} from 'date-fns';
import { COOKIE_NAME } from '~/constants/COOKIE_NAME';
import type { TokenTypes } from '~/types/TokenTypes';
import { jwtDecode } from 'jwt-decode';
import { BASE_URL } from '~/constants/BASE_URL';
import { useRequestFormData } from '#imports';
import emailjs from '@emailjs/browser';


const refreshStore = useRefreshStore();
const modal = useFundsModalStore();

const token = useCookie(COOKIE_NAME);

const user = ref<TokenTypes>();

onMounted(() => {
  if (token && token.value) {
    const decodedToken: TokenTypes = jwtDecode(token.value);
    user.value = decodedToken;
  }
});

interface Query {
  setLoading: (state: boolean) => void;
  setError: (state: boolean) => void;
  setSuccess: (state: boolean) => void;
  setStatusMessage: (message: string) => void;
  userName: string
}

const requestFunds = async ({
  setLoading,
  setSuccess,
  setError,
  setStatusMessage,
  userName
}: Query) => {
  const token = useCookie(COOKIE_NAME);

  if (!token) throw new Error('Not authorized');

  try {
    setLoading(true);
    setSuccess(false);
    setError(false);

    if (!token) throw new Error('Not authorized');

    const formData = useRequestFormData();

    const approverId = formData.approverId;
    const amount = formData.amount;
    const currency = formData.currency;
    const description = formData.description;
    const purpose = formData.purpose;
    const requiredOn = formData.requiredOn;

    const response = await fetch(`${BASE_URL}/requests/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        approverId,
        amount,
        currency,
        description,
        purpose,
        requiredOn,
      }),
    });

    const data = await response.json();

    if (response.status == 200) {
      setSuccess(true);
      refreshStore.setRefresh();

      emailjs.init('gX3LSF-KrqtkWcAuO')

      emailjs.send('service_2jfk01f', 'template_zsumwin', {
        purpose: `${purpose}`,
        amount: `${currency === "USD" ? "$" : "K"}${amount}`,
        id: data._id,
        email: ['noeljayr01@gmail.com', 'noeljayrluhanga@gmail.com'],
        name: `${userName}`,
      });

      window.setTimeout(() => {
        modal.setFundsModalActive();
      }, 500);
    } else {
      setError(true);
      setStatusMessage(data.message);
    }
  } catch (error) {
    setError(true);
  } finally {
    setLoading(false);
  }
};



const loading = ref(false);
const error = ref(false);
const success = ref(false);
const responseMessage = ref('');


const setLoading = (state: boolean) => {
  loading.value = state;
};

const setSuccess = (state: boolean) => {
  success.value = state;
};

const setError = (state: boolean) => {
  error.value = state;
};

const setStatusMessage = (message: string) => {
  responseMessage.value = message;
};

const skip = () => {
  formData.setRequiredOn(null);
  requestFunds({
    setError,
    setLoading,
    setStatusMessage,
    setSuccess,
    userName: `${user.value?.first_name + ` ` + user.value?.last_name}`
  });
};

const modalSteps = useFundsStepStore();

const formData = useRequestFormData();

const today: Date = new Date();
const currentMonth: Ref<Date> = ref(startOfMonth(today));
const selectedDate: Ref<Date | ''> = ref('');

const shortWeekdays: string[] = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

const calendarDays = computed<Date[]>(() => {
  const start: Date = startOfWeek(startOfMonth(currentMonth.value), {
    weekStartsOn: 1,
  });
  const end: Date = endOfWeek(endOfMonth(currentMonth.value), {
    weekStartsOn: 1,
  });
  const days: Date[] = [];
  let cursor: Date = start;
  while (cursor <= end) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return days;
});

const isAtStartMonth = computed<boolean>(
  () => format(currentMonth.value, 'yyyy-MM') === format(today, 'yyyy-MM')
);

function goToPrevMonth(): void {
  if (!isAtStartMonth.value) {
    currentMonth.value = addMonths(currentMonth.value, -1);
  }
}

function goToNextMonth(): void {
  currentMonth.value = addMonths(currentMonth.value, 1);
}

function selectDate(day: Date): void {
  selectedDate.value = day;
  if (selectedDate.value.toString().length > 0) {
    formData.setRequiredOn(selectedDate.value.toString());
  } else {
    formData.setRequiredOn(null);
  }
}

type PresetType = 'today' | 'tomorrow' | 'week' | 'twoWeeks';

function getPresetDate(type: PresetType): Date {
  switch (type) {
    case 'today':
      return today;
    case 'tomorrow':
      return addDays(today, 1);
    case 'week':
      return addDays(today, 7);
    case 'twoWeeks':
      return addDays(today, 14);
    default:
      return today;
  }
}

function isPresetActive(type: PresetType): boolean {
  return (
    selectedDate.value instanceof Date &&
    isSameDay(selectedDate.value, getPresetDate(type))
  );
}

function selectPreset(type: PresetType): void {
  const d = getPresetDate(type);
  selectDate(d);
  currentMonth.value = startOfMonth(d);
}




</script>

<template>
  <div class="calendar">
    <!-- Preset buttons -->
    <div class="font-semibold opacity-85 w-full text-center">
      When are the funds required?
    </div>
    <div class="presets gap-2 pt-3">
      <button
        @click="selectPreset('tomorrow')"
        :class="{ active: isPresetActive('tomorrow') }"
      >
        Tomorrow
      </button>
      <button
        @click="selectPreset('week')"
        :class="{ active: isPresetActive('week') }"
      >
        In a Week
      </button>
      <button
        @click="selectPreset('twoWeeks')"
        :class="{ active: isPresetActive('twoWeeks') }"
      >
        In Two Weeks
      </button>
    </div>

    <div
      class="flex flex-col gap-2 p-4 px-4 border-[1px] border-[var(--border)] rounded-[var(--radius-m)]"
    >
      <div class="month-nav">
        <button @click="goToPrevMonth" :disabled="isAtStartMonth">
          <SvgChevronDown class="rotate-[90deg]" />
        </button>
        <span class="month-title sora">{{
          format(currentMonth, 'MMMM, yyyy')
        }}</span>
        <button @click="goToNextMonth">
          <SvgChevronDown class="rotate-[-90deg]" />
        </button>
      </div>

      <!-- Weekday headings -->
      <div class="weekdays opacity-50">
        <div
          v-for="d in shortWeekdays"
          :key="d"
          class="weekday sora font-semibold"
        >
          {{ d }}
        </div>
      </div>

      <!-- Calendar grid -->
      <div class="days-grid">
        <div
          v-for="day in calendarDays"
          :key="day.toString()"
          class="day sora"
          :class="{
            disabled: isBefore(day, today),
            selected: isSameDay(day, selectedDate),
          }"
          @click="!isBefore(day, today) && selectDate(day)"
        >
          {{ format(day, 'd') }}
        </div>
      </div>
    </div>
  </div>
  <motion.div
    v-if="user"
    layout="position"
    key="cta-container"
    :transition="{ ease: [0.25, 0.1, 0.25, 1.0], duration: 0.5 }"
    class="cta-container items-center"
  >
    <span
      v-if="modalSteps.currentStep == 3"
      @click="skip"
      style="transition: var(--transition)"
      :class="`mr-auto sora opacity-80 hover:opacity-80 hover:underline text-[var(--primary)] font-medium cursor-pointer ${
        loading ? 'pointer-events-none' : ''
      }`"
      >Skip this step & <b class="text-[var(--primary)] sora">submit</b></span
    >

    <motion.button
      v-if="modalSteps.currentStep > 1"
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
        (formData.requiredOn && formData.requiredOn.length < 1) || loading
      "
      style="width: 6rem"
      layout="position"
      :transition="{ ease: [0.25, 0.1, 0.25, 1.0], duration: 0.5 }"
      @click="
        requestFunds({
          setError,
          setLoading,
          setStatusMessage,
          setSuccess,
          userName: `${user.first_name + ` ` + user.last_name}`
        })
      "
      :class="`cta ${
        formData.requiredOn && formData.requiredOn.length < 1
          ? 'opacity-50 cursor-not-allowed'
          : ''
      }`"
    >
      <template v-if="loading"><UxLoader /></template>
      <template v-else>Submit</template>
    </motion.button>
  </motion.div>

  <div
    v-if="success"
    class="flex absolute bottom-[-3rem] self-center bg-green-200 font-semibold px-8 py-2 rounded-3xl font-p-3 text-green-600 border border-green-300"
  >
    Request sent
  </div>

  <div
    v-if="error"
    class="flex self-center absolute bottom-[-3rem] bg-red-100 font-semibold px-8 py-2 rounded-3xl font-p-3 text-red-600 border border-red-200"
  >
    {{ responseMessage }}.
    <span class="font-bold text-red-600 cursor-pointer">Try again</span>
  </div>
</template>

<style scoped>
.calendar {
  width: 100%;
}
.presets {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: var(--p2);
}
.presets button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  border: 1px solid var(--border);
  font-weight: 600;
  transition: var(--transition);
}
.presets .skip-btn {
  border: 1px solid transparent;
  background-color: var(--primary);
  color: var(--text-white);
  border-radius: var(--radius-s);
}
.presets button:hover {
  background: #e0e0e0;
}

.presets .skip-btn:hover {
  background: var(--primary);
  filter: var(--cta-hover);
}
.presets button.active {
  background: var(--primary);
  color: #fff;
}

.month-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}
.month-nav button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}
.month-nav button:disabled {
  opacity: 0.3;
  cursor: default;
}
.month-title {
  width: 100%;
  text-align: center;
  font-weight: bold;
}

.weekdays,
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  column-gap: 1.5rem;
  row-gap: 0.25rem;
}
.weekday {
  text-align: center;
  padding-bottom: 0.25rem;
}

.day {
  width: 100%;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0.1rem 0;
  cursor: pointer;
  border-radius: var(--radius-s);
  line-height: 0;
  transition: var(--transition);
  border: 1px solid transparent;
}
.day.disabled {
  color: #ccc;
  cursor: default;
}
.day.selected {
  background: rgba(20, 89, 147, 0.1);
  border: 1px solid rgba(20, 89, 147, 0.1);
  color: var(--primary);
  font-weight: bold;
}
.day:not(.disabled):hover {
  background: #ddd;
}
</style>
