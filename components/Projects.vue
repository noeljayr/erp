<script setup lang="ts">
const GITHUB_ACCESS_TOKEN = useRuntimeConfig().public.GITHUB_ACCESS_TOKEN;
const ORG_NAME = useRuntimeConfig().public.ORG_NAME;
import { ref, onMounted, onUnmounted } from 'vue';
import type { RepoTypes } from '~/types/repoTypes';


const width = ref(0);

const updateWidth = () => {
  width.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});

const { data: repos, status } = useFetch(
  `https://api.github.com/orgs/${ORG_NAME}/repos?sort=updated&&per_page=${
    width.value >= 1440 ? 5 : 4
  }`,
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
  <div
    class="grid relative grid-cols-1 grid-rows-[auto_1fr] overflow-hidden h-full gap-4 w-full pb-6 projects-container"
  >
    <span class="content-title">
      <SvgGitProjectRepo />
      Projects
      <span class="count">{{ repos?.length }}</span>
    </span>

    <div class="projects hide-scrollbar grid grid-rows-[auto] gap-4 w-full">
      <template v-if="status == 'pending'">
        <div class="card-loading h-[13rem] bg-[var(--white)]"></div>
        <div class="card-loading h-[13rem] bg-[var(--white)]"></div>
        <div class="card-loading h-[13rem] bg-[var(--white)]"></div>
        <div class="card-loading h-[13rem] bg-[var(--white)]"></div>
      </template>
      <template v-else-if="status == 'error'">
        <div class="something went wrong"></div>
      </template>
      <template v-else-if="status == 'success'">
        <template v-if="repos && repos.length > 0" v-for="repo in repos">
          <Project :repo="repo" />
        </template>
        <template v-else>
          <div
            class="w-full empty absolute flex flex-col h-full items-center justify-center"
          >
            <SvgGitProjectRepo />
            <span class="opacity-75" style="font-size: var(--p3)"
              >No Projects found</span
            >
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.projects-container {
  border-bottom: 1px solid var(--border-2);
}

.projects {
  grid-auto-columns: 22rem;
  grid-template-rows: auto;
  grid-auto-flow: column;
  overflow-x: auto;
  border-radius: var(--radius);
}

.card-loading {
  border: 1px solid var(--border-2);
  border-radius: var(--radius);
  opacity: 0.5;
  animation: pulse 1.5s ease infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.1;
  }
  100% {
    opacity: 0.5;
  }
}

.content-title svg {
  stroke-width: 0;
  height: 1.75rem;
  width: 1.75rem;
}

.empty svg{
  height: 1.5rem;
  width: 1.5rem;
}
</style>
