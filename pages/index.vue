<script setup lang="ts">
import { motion } from 'motion-v';
import ArrowIcon from '~/components/svg/ArrowIcon.vue';
import { motionTranstion } from '~/utils/motionTranstion';

const routes = [
  {
    name: 'Projects',
    description: 'Visualize and track Bintel’s progects',
    link: '/projects',
  },
  {
    name: 'Finances',
    description: 'Automate finance management',
    link: '#',
  },
  {
    name: 'HR System',
    description: 'Manage employees',
    link: '#',
  },
  {
    name: 'CMS',
    description: 'Manage content',
    link: '#',
  },
];
</script>

<template>
  <div class="flex flex-col gap-8 w-fit h-full justify-center items-center">
    <h4 class="opacity-75">Bintel Analytics</h4>

    <motion.div
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="motionTranstion"
      class="portal grid grid-cols-4 gap-4 w-[55rem] pb-14"
    >
      <NuxtLink
        v-for="route in routes"
        :class="[
          'flex flex-col truncate justify-center relative name',
          route.name.toLowerCase(),
        ]"
        :to="route.link"
      >
        <div class="icon grid items-center justify-center">
          <NuxtImg src="/bintel-white.png" class="h-[1.25rem]" />
        </div>
        <span class="arrow-icon absolute top-2 right-2">
          <ArrowIcon />
        </span>
        <span
          :class="[
            'font-semibold mt-2 ml-0.5 name',
            route.name.length < 1
              ? 'bg-[#DDDDE3] w-[6rem] rounded-[1rem] h-[0.8rem]'
              : '',
          ]"
          >{{ route.name }}</span
        >
        <span
          :class="[
            'opacity-75 font-medium truncate description ',
            route.description.length < 1
              ? 'bg-[#DDDDE3] w-[10rem] ml-0.5 mt-1.5 rounded-[1rem] h-[0.8rem]'
              : '',
          ]"
          >{{ route.description }}</span
        >
      </NuxtLink>
    </motion.div>

    <motion.div
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="motionTranstion"
      class="other-links flex gap-6 mt-4"
    >
      <NuxtLink
        class="flex gap-2 font-semibold"
        href="http://Bintel.gitbook.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        <NuxtImg src="/git-book.png" />
        <span class="opacity-85"> Gitbook </span>
      </NuxtLink>

      <NuxtLink
        class="flex gap-2 font-semibold"
        href="#"
        target="_blank"
        rel="noopener noreferrer"
      >
        <NuxtImg src="/google-drive.png" />
        <span class="opacity-85"> Google drive </span>
      </NuxtLink>

      <NuxtLink
        class="flex n8n gap-2 font-semibold"
        href="https://n8n.bintelanalytics.mw/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <NuxtImg src="/n8n.png" />
        <span class="opacity-85"> n8n </span>
      </NuxtLink>

      <NuxtLink
        class="flex gap-2 font-semibold"
        href="http://"
        target="_blank"
        rel="noopener noreferrer"
      >
        <NuxtImg src="/zoom.png" />
        <span class="opacity-85"> Zoom </span>
      </NuxtLink>
    </motion.div>
  </div>
</template>

<style scoped>
.portal a {
  padding: 0.5rem;
  /* height: 6.5rem; */
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid var(--border-2);
}

.portal {
  border-bottom: 1px solid var(--border-2);
}

.icon {
  height: 2.5rem;
  width: 3.5rem;
  border-radius: var(--radius-s);
  background-color: var(--primary);
}

.arrow-icon {
  height: 1.5rem;
  width: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary);
  border-radius: 50%;
}

.arrow-icon svg {
  height: 1.25rem;
  width: 1.25rem;
}

.projects .icon {
  background-color: var(--primary);
}

.finances .icon {
  background-color: #639974;
}

.finances .arrow-icon {
  background-color: #639974;
}

.hr .icon {
  background-color: #5931c4;
}

.hr .arrow-icon {
  background-color: #5931c4;
}

.portal a:nth-child(4) .icon {
  background-color: #983b79;
}

.portal a:nth-child(4) .arrow-icon {
  background-color: #983b79;
}

.name {
  font-family: 'Sora', sans-serif;
}

.description {
  font-size: var(--p3);
}
a {
  background-color: var(--background);
  transition: var(--transition);
}

a:hover {
  filter: var(--cta-hover);
}

.other-links a {
  padding: 0.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  border-radius: 2rem;
  border: 1px solid rgba(61, 68, 77, 0.08);
  align-items: center;
}

.other-links a * {
  font-size: var(--p2);
}

.other-links img {
  width: fit-content;
  height: 1rem;
  opacity: 0.75;
}

.other-links .n8n img {
  opacity: 1;
}
</style>
