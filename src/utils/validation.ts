import type { TaskLocation } from '../types/task';

export interface TaskFormValues {
  title: string;
  description: string;
  dueAt: string;
  location: TaskLocation;
}

export type ValidationErrors = Partial<Record<keyof TaskFormValues | 'dueAt', string>>;

export function validateTaskForm(values: TaskFormValues): ValidationErrors {
  const err: ValidationErrors = {};
  if (!values.title.trim()) err.title = 'Укажите название задачи';
  if (values.title.trim().length > 100) err.title = 'Название слишком длинное (макс. 100)';
  if (!values.description.trim()) err.description = 'Укажите описание';
  if (!values.dueAt) err.dueAt = 'Укажите срок выполнения';
  else if (isNaN(new Date(values.dueAt).getTime())) err.dueAt = 'Некорректная дата';
  if (!values.location.address.trim()) err.location = 'Укажите адрес';
  return err;
}
