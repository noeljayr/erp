<template>
  <div
    class="top-nav py-4 flex gap-4 items-center h-fit justify-between w-full"
  >
    <NuxtLink href="/" class="logo flex gap-2 items-center mr-auto">
      <NuxtImg class="h-[1.75rem]" src="/bintel.png" />
      <span style="font-family: 'Sora', san-serif" class="font-semibold"
        >Bintel Analytics</span
      >
    </NuxtLink>

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
      <input type="text" placeholder="Search for anything..." />
      <span class="shortcut">
        <span class="opacity-60"> CTRL + K </span>
      </span>
    </div>
    <button class="menu-button flex items-center justify-center">
      <svg
        width="25"
        height="25"
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.125 7.29167H21.875"
          stroke="#145993"
          stroke-width="2"
          stroke-linecap="round"
        />
        <path
          opacity="0.34"
          d="M3.125 12.5H21.875"
          stroke="#145993"
          stroke-width="2"
          stroke-linecap="round"
        />
        <path
          d="M3.125 17.7083H21.875"
          stroke="#145993"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </button>
    <div class="cursor-pointer flex items-center justify-center"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.top-nav {
  border-bottom: 1px solid var(--border-2);
}

.menu-button {
  height: 2.5rem;
  width: 2.5rem;
  border-radius: var(--radius-s);
  background-color: var(--component-bg);
  border: 1px solid var(--border-2);
}

.menu-button svg {
  height: 1.5rem;
  width: 1.5rem;
}

.logo * {
  font-size: var(--h4);
}
</style>
