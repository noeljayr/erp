<template>
  <div class="spinner"></div>
</template>

<script setup lang="ts"></script>

<style scoped>
.spinner {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: radial-gradient(farthest-side, #ffffff 94%, #0000) top/4px 4px
      no-repeat,
    conic-gradient(#0000 30%, #ffffff);
  mask: radial-gradient(farthest-side, #0000 calc(100% - 4px), #000 0);
  -webkit-mask: radial-gradient(
    farthest-side,
    #0000 calc(100% - 4px),
    #000 0
  );
  animation: spinner-c7wet2 1s infinite linear;
  position: relative;
  z-index: 99;
}

@keyframes spinner-c7wet2 {
  100% {
    transform: rotate(1turn);
  }
}

.primary-loader {
  background: radial-gradient(farthest-side, #145993 94%, #0000) top/3.8px 3.8px
      no-repeat,
    conic-gradient(#0000 30%, #145993);
  mask: radial-gradient(farthest-side, #0000 calc(100% - 3.8px), #000 0);
}
</style>
