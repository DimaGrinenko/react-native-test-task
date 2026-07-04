import type { TaskLocation } from '../types/task';

export interface TaskFormValues {
  title: string;
  description: string;
  dueAt: string;
  location: TaskLocation;
}

export type ValidationErrors = Partial<Record<keyof TaskFormValues | 'dueAt', string>>;

export function validateTaskForm(values: TaskFormValues): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!values.title.trim()) errors.title = 'Укажите название';
  if (!values.description.trim()) errors.description = 'Укажите описание';
  if (!values.dueAt) errors.dueAt = 'Укажите срок';
  if (!values.location.address.trim()) errors.location = 'Укажите адрес';
  return errors;
}
