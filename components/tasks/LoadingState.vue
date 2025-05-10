<template>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</template>

<script lang="ts"></script>

<style scoped>
div {
  background-color: var(--white);
  height: 6rem;
  width: 100%;
  border-radius: var(--radius);
  animation: pulse 1.5s ease infinite;
  opacity: 0.5;
}

@keyframes pulse {
  0% {
    opacity: 0.1;
  }
  100% {
    opacity: 0.5;
  }
}
</style>
