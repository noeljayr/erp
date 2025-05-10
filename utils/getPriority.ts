import type { label } from '~/types/taskTypes';

export const getPriority = (labels: label[]) => {
  let priority = '';
  labels.forEach((label) => {
    if (
      label.name === 'High' ||
      label.name === 'Medium' ||
      label.name === 'Low'
    ) {
      priority = label.name;
    }
  });

  return priority;
};
