<script setup lang="ts">
import { motion } from 'motion-v';
import { useAddTaskStepsStore } from '~/stores/addTaskSteps';
import type { RepoTypes } from '~/types/repoTypes';

const steps = useAddTaskStepsStore();

const GITHUB_ACCESS_TOKEN = useRuntimeConfig().public.GITHUB_ACCESS_TOKEN;
const ORG_NAME = useRuntimeConfig().public.ORG_NAME;

const { data: repos, status } = useFetch(
  `https://api.github.com/orgs/${ORG_NAME}/repos?sort=updated&&per_page=15`,
  {
    lazy: true,
    server: false,
    headers: {
      authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
    },
    transform: (repos: RepoTypes[]) => {
      return repos.map((repo) => ({
        id: repo.id,
        name: repo.name,
        updated_at: repo.updated_at,
        html_url: repo.html_url,
      }));
    },
  }
);
</script>

<template>
  <motion.div
    v-if="steps.currentStep === 1"
    :transition="{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }"
  >
    <div class="flex gap-4 flex-col">
      <div class="modal-input-group relative justify-center search-input">
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
        <input type="text" placeholder="Search for a project..." />
      </div>

      <div class="projects-container flex flex-wrap gap-2 mb-2 w-full">
        <template v-if="status === 'pending'">
          <span class="loading">Getting projects...</span>
        </template>

        <template v-else-if="status === 'error'">
          <span class="error">Something went wrong</span>
        </template>

        <template v-else-if="status === 'success'">
          <span
            class="repo cursor-pointer"
            v-if="repos && repos.length > 0"
            v-for="repo in repos"
          >
            {{ repo.name }}
          </span>
        </template>
      </div>
    </div>
  </motion.div>
</template>

<style scoped>
.repo {
  padding: 0.65rem 1.5rem;
  border-radius: 2rem;
  line-height: normal;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid var(--border);
}
</style>
