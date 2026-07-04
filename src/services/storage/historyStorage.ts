import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants';
import type { HistoryEntry } from '../../types/history';

export const historyStorage = {
  async getAll(): Promise<HistoryEntry[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.history);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  async add(zapis: HistoryEntry): Promise<void> {
    const vse = await this.getAll();
    vse.unshift(zapis);
    await AsyncStorage.setItem(STORAGE_KEYS.history, JSON.stringify(vse.slice(0, 500)));
  },

  async saveAll(zapisi: HistoryEntry[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.history, JSON.stringify(zapisi));
  },
};
