<template>
  <div class="calendar component p-2 flex flex-col items-center">
    <div class="header">
      <div class="title opacity-85">This week</div>
      <div class="range">({{ weekRange }})</div>
    </div>
    <div class="days">
      <div
        v-for="dateObj in weekDates"
        :key="dateObj.date.toISOString()"
        class="day"
        :class="{ active: isToday(dateObj.date) }"
      >
        <div class="weekday">{{ dateObj.label }}</div>
        <div class="date">{{ dateObj.date.getDate() }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Get today
const today = new Date();

// Calculate start of the week (Monday)
const weekStart = new Date(today);
const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
// Convert Sunday (0) to 6, Mon (1) to 0, ..., Sat (6) to 5
const diffToMonday = (dayOfWeek + 6) % 7;
weekStart.setDate(today.getDate() - diffToMonday);

// Generate array of 7 dates for the week
const weekDates = computed(() => {
  const arr = [];
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    arr.push({
      date: d,
      label: names[d.getDay()],
    });
  }
  return arr;
});

// Formatting week range, e.g. "14 - 20 Apr"
const weekRange = computed(() => {
  const start = weekDates.value[0].date;
  const end = weekDates.value[6].date;
  const opts = { month: 'short' };
  const month = new Intl.DateTimeFormat('en-US', opts).format(start);
  return `${start.getDate()} - ${end.getDate()} ${month}`;
});

// Check if given date is today
function isToday(date) {
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
</script>

<style scoped>
.calendar {
  border: 1px solid var(--border-2);
  border-radius: var(--radius);
  border-bottom-left-radius: var(--radius-s);
  border-bottom-right-radius: var(--radius-s);
  width: 100%;
  background-color: var(--);
}
.header {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
  color: #555;
  font-size: var(--p2);
}
.title {
  font-weight: bold;
}
.range {
  color: var(--black);
  opacity: 0.5;
}
.days {
  display: flex;
}
.day {
  text-align: center;
  padding: 0.75rem;
  color: var(--black);
}
.day.active {
  background-color: var(--primary);
  color: var(--white);
  border-radius: 4rem;
}

.day.active  *{
  color: var(--white);
}
.day:nth-child(6),
.day:nth-child(7) {
  opacity: 0.5;
}

.weekday {
  font-size: var(--p3);
  opacity: 0.75;
}
.date {
  font-size: var(--h4);
  font-weight: bold;
  margin-top: 0.25rem;
}
</style>
