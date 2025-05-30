<script setup lang="ts">
import type { RepoTypes } from '~/types/repoTypes';
import { formatDate } from '#imports';
import type { GithubIssue } from '~/types/taskTypes';
import type { Collaborator } from '~/types/repoTypes';

const GITHUB_ACCESS_TOKEN = useRuntimeConfig().public.GITHUB_ACCESS_TOKEN;
const ORG_NAME = useRuntimeConfig().public.ORG_NAME;
const props = defineProps<{
  repo: RepoTypes;
}>();

const { status, data: repoInfo } = useLazyAsyncData<{
  openIssues: GithubIssue[];
  closedIssues: GithubIssue[];
  team: Collaborator[];
}>(`repoInfo-${props.repo.name}`, async () => {
  const [openIssues, closedIssues, team] = await Promise.all([
    $fetch<GithubIssue[]>(
      `https://api.github.com/repos/${ORG_NAME}/${props.repo.name}/issues?filter=all&state=open`,
      {
        headers: {
          authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        },
      }
    ),
    $fetch<GithubIssue[]>(
      `https://api.github.com/repos/${ORG_NAME}/${props.repo.name}/issues?filter=all&state=closed`,
      {
        headers: {
          authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        },
      }
    ),
    $fetch<Collaborator[]>(
      `https://api.github.com/repos/${ORG_NAME}/${props.repo.name}/collaborators`,
      {
        headers: {
          authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
        },
      }
    ),
  ]);

  return {
    openIssues,
    closedIssues,
    team,
  };
});

const percentage = ref(0);
const calculatePercentage = (closed: number, open: number) => {
  if (closed > 0 || open > 0) {
    let total = closed + open;
    percentage.value = (closed / total) * 100;
  } else {
    percentage.value = 0;
  }

  return percentage.value.toFixed(0);
};
</script>

<template>
  <template v-if="status == 'pending'">
    <div class="card h-[10rem]"></div>
  </template>

  <template v-else-if="status == 'error'">
    <div>Something went wrong</div>
  </template>

  <template v-else-if="status == 'success'">
    <div class="card component p-4 gap-4 flex flex-col z-[2]">
      <div class="flex items-center gap-4 w-full">
        <span class="font-bold project-title">{{ props.repo.name }}</span>

        <span class="last-updated font-medium opacity-75 ml-auto">
          Updated {{ formatDate(repo.updated_at) }}
        </span>
      </div>

      <span
        v-if="repoInfo"
        class="grid grid-cols-[1fr_auto] items-center w-full gap-2"
      >
        <span
          :style="`grid-template-columns: ${
            repoInfo.closedIssues.length > 0 && repoInfo.openIssues.length > 0
              ? `${calculatePercentage(
                  repoInfo.closedIssues.length,
                  repoInfo.openIssues.length
                )}%`
              : 'auto'
          } 1fr`"
          :class="`progress-bar grid w-full gap-1 items-center p-[0.1rem]`"
        >
          <span class="bg-[var(--primary)] h-[0.45rem] rounded-[2rem]"></span>
          <span
            class="progress-background h-[0.45rem] rounded-[2rem] w-full"
          ></span>
        </span>
        <span class="font-bold percentage"
          >{{
            calculatePercentage(
              repoInfo.closedIssues.length,
              repoInfo.openIssues.length
            )
          }}%</span
        >
      </span>

      <div class="flex justify-between w-full items-center">
        <div class="info-graphics grid grid-cols-[auto_auto] gap-2">
          <span>
            <SvgCheckCircle />

            {{ repoInfo?.closedIssues.length }}
          </span>
          <span>
            <SvgRotate />

            {{ repoInfo?.openIssues.length }}
          </span>
        </div>

        <div class="project-team px-1 flex relative">
          <template v-if="repoInfo">
            <div class="team flex relative">
              <template v-if="repoInfo.team.length > 3">
                <span v-for="member in repoInfo.team.slice(0, 1)">
                  <NuxtImg :src="member.avatar_url" />
                </span>

                <span class="number font-bold pr-3"
                  >+{{ repoInfo.team.length - 3 }}</span
                >
              </template>
              <template v-else>
                <span v-for="member in repoInfo.team">
                  <NuxtImg :src="member.avatar_url" />
                </span>
              </template>
            </div>
          </template>
        </div>
      </div>

      <NuxtLink
        target="_blank"
        rel="noreferrer"
        :href="repo.html_url"
        class="flex project-cta items-center gap-1 ml-auto"
      >
        View on github
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </NuxtLink>
    </div>
  </template>
</template>

<style scoped>
.card {
  width: 100%;
}

.card * {
  transition: var(--transition);
}

.last-updated {
  font-size: var(--p3);
}

.info-graphics span {
  display: flex;
  gap: 0.35rem;
  align-items: center;
  font-weight: bold;
  background: #e9ecf0;
  border: 1px solid #b1c6d8;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-s);
  font-family: 'Sora', sans-serif;
  line-height: 0;
  font-size: var(--p2);
  height: 2.2rem;
  padding-left: 0.65rem;
  padding-right: 1rem;
}

.info-graphics span svg {
  height: 1.15rem;
  width: 1.15rem;
}

.project-title {
  font-size: var(--h4);
}

.project-cta {
  font-size: var(--p2);
  padding: 0;
  height: 2.3rem;
  align-items: center;
  padding-left: 0.75rem;
  padding-right: 0.7rem;
  line-height: 0;
  font-weight: 500;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: var(--transition);
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #ededed;
  border-radius: var(--radius-s);
}

.project-cta:hover {
  filter: var(--cta-hover);
}

.project-cta svg {
  height: 0.85rem;
  width: 0.85rem;
  position: relative;
  top: 1px;
}

.project-team {
  background-color: #f3f3f3;
  height: 2.35rem;
  display: grid;
  align-items: center;
  border-radius: 2rem;
  font-family: 'Sora', sans-serif;
  border: 1px solid var(--border);
}

.team span {
  height: 1.8rem;
  width: 1.8rem;
  border-radius: 50%;
  background-color: var(--white);
  display: flex;
  position: relative;
  outline: 2px solid #f3f3f3;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.team span img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.team span:nth-child(2) {
  left: -0.35rem;
}

.team span:nth-child(3) {
  left: -0.55rem;
}

.team span:nth-child(4) {
  left: -0.75rem;
}

.progress-bar .progress-background {
  height: 0.45rem;
  background-color: rgba(208, 222, 233, 0.6);
  border-radius: 2rem;
}

.percentage {
  font-family: 'Sora', sans-serif;
  font-size: var(--p3);
  line-height: normal;
}
</style>
