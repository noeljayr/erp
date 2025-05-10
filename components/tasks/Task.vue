<script setup lang="ts">
import type { GithubIssue } from '~/types/taskTypes';
import { AnimatePresence, motion } from 'motion-v';
import { motionTranstion } from '#imports';
import { getPriority } from '#imports';

defineProps<{
  task: GithubIssue;
}>();
</script>

<template>
  <AnimatePresence>
    <motion.div
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="{ motionTranstion }"
      class="component task h-fit flex truncate flex-col p-4 gap-2.5"
    >
      <div class="flex w-full justify-between items-center">
        <span class="truncate font-semibold cursor-pointer">{{
          task.title
        }}</span>
        <div class="flex gap-3 items-center">
          <span
            :class="[
              'priority font-bold flex gap-1.5 items-center',
              getPriority(task.labels).toLowerCase(),
            ]"
            >{{ getPriority(task.labels) }} <span></span
          ></span>
        </div>
      </div>

      <span
        class="description truncate cursor-pointer font-medium opacity-70"
        >{{ task.body }}</span
      >

      <div class="flex gap-6 items-center">
        <span class="assigned-to flex gap-2 items-center">
          <span
            class="image flex h-[1.5rem] w-[1.5rem] rounded-[50%] overflow-hidden justify-center items-center"
          >
            <template v-if="task.assignees.length > 0">
              <NuxtImg :src="task.assignees[0].avatar_url" />
            </template>

            <template v-else>
              <NuxtImg :src="task.assignees[0].avatar_url" />
            </template>
          </span>
          <template v-if="task.assignees.length > 0">
            <span class="font-semibold opacity-50"
              >{{ task.assignees[0].login }}
            </span>
          </template>
          <template v-else>
            <span class="font-semibold opacity-70">{{ task.user.login }} </span>
          </template>
        </span>

        <span class="repo flex items-center gap-2">
          <SvgGitRepo />

          <span class="font-semibold opacity-70"
            >{{ task.repository.name }}
          </span>
        </span>
      </div>
    </motion.div>
  </AnimatePresence>
</template>

<style scoped>
.status * {
  font-size: var(--p3);
}
.priority {
  font-size: var(--p3);
  padding: 0.3rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  border: 1px solid var(--border-2);
  border-radius: 2rem;
  font-family: 'Sora', sans-serif;
  line-height: normal;
}

.description {
  font-size: var(--p2);
}

.priority span {
  height: 0.35rem;
  width: 0.35rem;
  background-color: var(--border);
  border-radius: 50%;
  display: flex;
}

.high {
  background: rgba(255, 38, 0, 0.1);
  border: 1px solid rgba(255, 38, 0, 0.15);
  color: #ff2600;
}
.high span {
  background-color: #ff2600;
}

.medium {
  background: rgba(255, 161, 6, 0.15);
  border: 1px solid rgba(255, 161, 6, 0.15);
  color: #ffa106;
}

.medium span {
  background-color: #ffa106;
}

.low {
  background: rgba(1, 177, 138, 0.2);
  border: 1px solid rgba(1, 177, 138, 0.2);
  color: #01b18a;
}
.low span {
  background-color: #01b18a;
}

.more-icon svg {
  height: 1.5rem;
  width: 1.5rem;
}

.repo svg {
  height: 1.5rem;
  width: 1.5rem;
}
</style>
