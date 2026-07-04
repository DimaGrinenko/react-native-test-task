import type { Task } from '../../types/task';

/** Локальное хранение задач (AsyncStorage / SQLite / MMKV) */
export const taskStorage = {
  async getAll(): Promise<Task[]> {
    // TODO
    return [];
  },
  async save(task: Task): Promise<void> {
    // TODO
  },
  async remove(id: string): Promise<void> {
    // TODO
  },
};
