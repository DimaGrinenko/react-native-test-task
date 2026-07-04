import type { TaskStatus } from '../types/task';

export const CANDIDATE_CODE = 'SA-RN-XXXX';

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'new', label: 'Новый' },
  { value: 'in_progress', label: 'В процессе' },
  { value: 'completed', label: 'Завершено' },
  { value: 'cancelled', label: 'Отменено' },
];

export const STORAGE_KEYS = {
  tasks: '@field_tasks/tasks',
  history: '@field_tasks/history',
  theme: '@field_tasks/theme',
  demoMode: '@field_tasks/demo_mode',
  udalennye: '@field_tasks/deleted_ids',
} as const;

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000';
