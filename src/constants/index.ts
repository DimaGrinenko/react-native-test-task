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

export const MESTA_PRESET = [
  { nazvanie: 'Офис', adres: 'ул. Ленина 10, Москва', lat: 55.7558, lng: 37.6173 },
  { nazvanie: 'Склад', adres: 'пр. Мира 25, Москва', lat: 55.79, lng: 37.63 },
  { nazvanie: 'Объект А', adres: 'ул. Садовая 5, Москва', lat: 55.74, lng: 37.6 },
  { nazvanie: 'Больница', adres: 'ул. Профсоюзная 12', lat: 55.67, lng: 37.55 },
];

export const ACTION_LABELS: Record<string, string> = {
  created: 'Создание',
  updated: 'Изменение',
  status_changed: 'Статус',
  attachment_added: 'Вложение',
  attachment_removed: 'Удаление вложения',
  deleted: 'Удаление',
  synced: 'Синхронизация',
  sync_failed: 'Ошибка синхронизации',
};

export const SYNC_STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает',
  syncing: 'Синхронизация…',
  synced: 'Синхронизировано',
  failed: 'Ошибка',
};

export { darkTheme as darkColors, lightTheme as lightColors, ACTION_ICONS } from '../theme';
export type { ThemeColors } from '../theme';
