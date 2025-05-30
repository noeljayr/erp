<script setup lang="ts">
import type { GithubIssue } from '~/types/taskTypes';
import Task from './Task.vue';
import AddTask from '../modals/add-task/AddTask.vue';

const GITHUB_ACCESS_TOKEN = useRuntimeConfig().public.GITHUB_ACCESS_TOKEN;
const ORG_NAME = useRuntimeConfig().public.ORG_NAME;
const { data: taskData, status } = useFetch(
  `https://api.github.com/orgs/${ORG_NAME}/issues?filter=all&per_page=5000&labels=not started`,
  {
    lazy: true,
    server: false,
    headers: {
      authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
    },
    transform: (taskData: GithubIssue[]) => {
      return taskData.map((task) => ({
        title: task.title,
        labels: task.labels,
        body: task.body,
        state: task.state,
        assignees: task.assignees,
        repository: task.repository,
        user: task.user,
      }));
    },
  }
);
</script>

<template>
  <div class="grid grid-rows-[auto_1fr] overflow-hidden h-full gap-4">
    <span class="flex items-center relative gap-2 font-semibold title">
      <SvgCircle />
      Not started <span class="count">{{ taskData?.length }}</span>
    </span>

    <div
      style="grid-auto-rows: min-content"
      class="grid grid-cols-1 hide-scrollbar relative rounded-[var(--radius)] gap-2 h-full overflow-y-auto"
    >
      <template v-if="status === 'pending'">
        <TasksLoadingState />
      </template>
      <template v-else-if="status === 'error'">
        <TasksErrorState />
      </template>
      <template v-else-if="status === 'success' && taskData">
        <template v-if="taskData.length > 0">
          <template v-for="task in taskData">
            <Task :task="task" />
          </template>
        </template>
        <template v-if="taskData.length <= 0">
          <TasksEmptyState
            :description="'No tasks ready to be worked on yet'"
          />
        </template>
      </template>
    </div>
  </div>

  
</template>

<style scoped></style>
