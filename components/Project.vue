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
}>('repoInfo', async () => {
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
const calculatePercentage = (
  closed: number | undefined,
  open: number | undefined
) => {
  if (typeof closed == 'number' && typeof open === 'number') {
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
        <span class="font-bold project-title">{{ repo.name }}</span>

        <span class="last-updated font-medium opacity-75 ml-auto">
          {{ formatDate(repo.updated_at) }}
        </span>
      </div>

      <span class="grid grid-cols-[1fr_auto] items-center w-full gap-2">
        <span class="progress-bar flex items-center p-[0.1rem]">
          <span
            :style="{
              width:
                calculatePercentage(
                  repoInfo?.closedIssues.length,
                  repoInfo?.openIssues.length
                ) + '%',
            }"
            :class="[`bg-[var(--primary)] h-full rounded-[2rem]`]"
          ></span>
        </span>
        <span class="font-bold percentage"
          >{{
            calculatePercentage(
              repoInfo?.closedIssues.length,
              repoInfo?.openIssues.length
            )
          }}%</span
        >
      </span>

      <div class="flex justify-between w-full items-center">
        <div class="info-graphics grid grid-cols-[auto_auto] gap-2">
          <span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_357_525)">
                <path
                  d="M7.5 13.75C10.9375 13.75 13.75 10.9375 13.75 7.5C13.75 4.0625 10.9375 1.25 7.5 1.25C4.0625 1.25 1.25 4.0625 1.25 7.5C1.25 10.9375 4.0625 13.75 7.5 13.75Z"
                  stroke="#145993"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  opacity="0.34"
                  d="M4.84375 7.50125L6.6125 9.27L10.1563 5.7325"
                  stroke="#145993"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_357_525">
                  <rect width="15" height="15" fill="white" />
                </clipPath>
              </defs>
            </svg>

            {{ repoInfo?.closedIssues.length }}
          </span>
          <span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.62457 2.84375C6.85949 2.34647 8.24137 2.36012 9.46621 2.88171C10.6911 3.40329 11.6585 4.39008 12.1558 5.625C12.6531 6.85991 12.6394 8.24179 12.1179 9.46664C11.5963 10.6915 10.6095 11.659 9.37457 12.1562M9.37457 9.375V12.5H12.4996M3.51825 4.475V4.48125M2.53711 6.875V6.88125M2.89325 9.4375V9.44375M4.47467 11.4812V11.4875M6.87457 12.4625V12.4687"
                stroke="#145993"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            {{ repoInfo?.openIssues.length }}
          </span>
        </div>

        <div class="project-team px-2 flex relative">
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
        class="flex cta-3 items-center gap-1 ml-auto"
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
  background: rgba(20, 89, 147, 0.05);
  border: 1px solid rgba(20, 89, 147, 0.15);
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-s);
  font-family: 'Sora', sans-serif;
  line-height: 0;
  font-size: var(--p2);
  padding: 0.6rem;
  padding-left: 0.75rem;
  padding-right: 1.15rem;
}

.info-graphics span svg {
  height: 1.15rem;
  width: 1.15rem;
}

.project-title {
  font-size: var(--h4);
}

.cta-3 {
  font-size: var(--p2);
  padding: 0;
  height: 2.5rem;
  align-items: center;
  padding-left: 0.75rem;
  padding-right: 0.7rem;
  line-height: 0;
  font-weight: 500;
  width: 100%;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: var(--transition);
}

.cta-3:hover {
  filter: var(--cta-hover);
}

.cta-3 svg {
  height: 1rem;
  width: 1rem;
}

.project-team {
  background-color: #f3f3f3;
  height: 2.65rem;
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
  border: 2px solid var(--border);
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

.progress-bar {
  height: 0.65rem;
  background-color: #d0dee9;
  border-radius: 2rem;
}

.percentage {
  font-family: 'Sora', sans-serif;
}
</style>
