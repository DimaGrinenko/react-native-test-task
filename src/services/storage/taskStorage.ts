import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants';
import type { Task } from '../../types/task';

export const taskStorage = {
  async getAll(): Promise<Task[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.tasks);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  async saveAll(zadachi: Task[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(zadachi));
  },

  async save(task: Task): Promise<void> {
    const vse = await this.getAll();
    const idx = vse.findIndex((z) => z.id === task.id);
    if (idx >= 0) vse[idx] = task;
    else vse.push(task);
    await this.saveAll(vse);
  },

  async remove(id: string): Promise<void> {
    const vse = await this.getAll();
    await this.saveAll(vse.filter((z) => z.id !== id));
    const udalennye = await this.getDeletedIds();
    if (!udalennye.includes(id)) {
      udalennye.push(id);
      await AsyncStorage.setItem(STORAGE_KEYS.udalennye, JSON.stringify(udalennye));
    }
  },

  async getDeletedIds(): Promise<string[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.udalennye);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  async clearDeletedIds(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.udalennye);
  },
};
