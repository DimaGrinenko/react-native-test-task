import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { create } from 'zustand';
import { STORAGE_KEYS, TASK_STATUSES } from '../constants';
import { notificationService } from '../services/notifications/notificationService';
import { historyStorage } from '../services/storage/historyStorage';
import { taskStorage } from '../services/storage/taskStorage';
import { syncService } from '../services/sync/syncService';
import type { HistoryActionType, HistoryEntry } from '../types/history';
import type { SyncStatus, Task, TaskAttachment, TaskStatus } from '../types/task';

export type SortTip = 'createdAt' | 'dueAt' | 'status';
export type Tema = 'light' | 'dark';

function sdelayId() {
  return Date.now().toString() + '_' + Math.random().toString(36).slice(2,6);
}

function sortirovat(spisok: Task[], tip: SortTip) {
  const kopiya = [...spisok];
  if (tip === 'createdAt') kopiya.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
  else if (tip === 'dueAt') kopiya.sort((a,b) => a.dueAt.localeCompare(b.dueAt));
  else {
    kopiya.sort((a,b) => {
      const ia = TASK_STATUSES.findIndex(s => s.value === a.status);
      const ib = TASK_STATUSES.findIndex(s => s.value === b.status);
      return ia - ib;
    });
  }
  return kopiya;
}

interface Store {
  zadachi: Task[];
  istoriya: HistoryEntry[];
  sortTip: SortTip;
  poisk: string;
  statusFilter: TaskStatus | 'all';
  tema: Tema;
  demoRezhim: boolean;
  zagruzka: boolean;
  syncSt: SyncStatus;
  oshibka: string | null;
  toast: { msg: string; type: 'success' | 'error' } | null;
  init: () => Promise<void>;
  setSortTip: (tip: SortTip) => void;
  setPoisk: (q: string) => void;
  setStatusFilter: (f: TaskStatus | 'all') => void;
  setTema: (t: Tema) => Promise<void>;
  setDemoRezhim: (v: boolean) => Promise<void>;
  clearToast: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  dobavitIstoriyu: (taskId: string, taskTitle: string, action: HistoryActionType, opisanie: string) => Promise<void>;
  sozdatZadachu: (data: Omit<Task, 'id'|'createdAt'|'updatedAt'|'syncStatus'|'status'> & {status?: TaskStatus}) => Promise<Task>;
  obnovitZadachu: (task: Task) => Promise<void>;
  udalitZadachu: (id: string) => Promise<void>;
  pomenatStatus: (id: string, status: TaskStatus) => Promise<void>;
  syncSeichas: (manual?: boolean) => Promise<void>;
  getFilteredSorted: () => Task[];
}

export const useZadachiStore = create<Store>((set, get) => ({
  zadachi: [],
  istoriya: [],
  sortTip: 'createdAt',
  poisk: '',
  statusFilter: 'all',
  tema: 'light',
  demoRezhim: false,
  zagruzka: true,
  syncSt: 'synced',
  oshibka: null,
  toast: null,

  init: async () => {
    set({ zagruzka: true });
    const zadachi = await taskStorage.getAll();
    const istoriya = await historyStorage.getAll();
    const temaRaw = await AsyncStorage.getItem(STORAGE_KEYS.theme);
    const demoRaw = await AsyncStorage.getItem(STORAGE_KEYS.demoMode);
    set({
      zadachi,
      istoriya,
      tema: temaRaw === 'dark' ? 'dark' : 'light',
      demoRezhim: demoRaw === '1',
      zagruzka: false,
    });
    await notificationService.requestPermissions();
    get().syncSeichas(false);
    podpisatsyaNaSet();
  },

  setSortTip: tip => set({ sortTip: tip }),
  setPoisk: q => set({ poisk: q }),
  setStatusFilter: f => set({ statusFilter: f }),
  clearToast: () => set({ toast: null }),
  showToast: (msg, type='success') => set({ toast: { msg, type } }),

  setTema: async t => {
    await AsyncStorage.setItem(STORAGE_KEYS.theme, t);
    set({ tema: t });
  },

  setDemoRezhim: async v => {
    await AsyncStorage.setItem(STORAGE_KEYS.demoMode, v ? '1' : '0');
    set({ demoRezhim: v });
  },

  dobavitIstoriyu: async (taskId, taskTitle, action, opisanie) => {
    const zapis: HistoryEntry = {
      id: sdelayId(),
      taskId, taskTitle, action,
      description: opisanie,
      timestamp: new Date().toISOString(),
    };
    await historyStorage.add(zapis);
    set({ istoriya: [zapis, ...get().istoriya].slice(0, 500) });
  },

  sozdatZadachu: async data => {
    const seychas = new Date().toISOString();
    const task: Task = {
      ...data,
      id: sdelayId(),
      status: data.status ?? 'new',
      syncStatus: 'pending',
      createdAt: seychas,
      updatedAt: seychas,
    };
    await taskStorage.save(task);
    set({ zadachi: [...get().zadachi, task], syncSt: 'pending' });
    await get().dobavitIstoriyu(task.id, task.title, 'created', 'Создана: ' + task.title);
    await notificationService.scheduleReminder(task.id, task.title, new Date(task.dueAt), get().demoRezhim);
    get().showToast('Задача создана');
    get().syncSeichas(false);
    return task;
  },

  obnovitZadachu: async task => {
    const upd = { ...task, updatedAt: new Date().toISOString(), syncStatus: 'pending' as SyncStatus };
    await taskStorage.save(upd);
    set({ zadachi: get().zadachi.map(z => z.id === upd.id ? upd : z), syncSt: 'pending' });
    await get().dobavitIstoriyu(upd.id, upd.title, 'updated', 'Изменена: ' + upd.title);
    await notificationService.scheduleReminder(upd.id, upd.title, new Date(upd.dueAt), get().demoRezhim);
    get().showToast('Сохранено');
    get().syncSeichas(false);
  },

  udalitZadachu: async id => {
    const z = get().zadachi.find(x => x.id === id);
    await taskStorage.remove(id);
    await notificationService.cancelForTask(id);
    set({ zadachi: get().zadachi.filter(x => x.id !== id), syncSt: 'pending' });
    if (z) await get().dobavitIstoriyu(id, z.title, 'deleted', 'Удалена: ' + z.title);
    get().showToast('Удалено');
    get().syncSeichas(false);
  },

  pomenatStatus: async (id, status) => {
    const z = get().zadachi.find(x => x.id === id);
    if (!z) return;
    const upd = { ...z, status, updatedAt: new Date().toISOString(), syncStatus: 'pending' as SyncStatus };
    await taskStorage.save(upd);
    set({ zadachi: get().zadachi.map(x => x.id === id ? upd : x), syncSt: 'pending' });
    const lbl = TASK_STATUSES.find(s => s.value === status)?.label ?? status;
    await get().dobavitIstoriyu(id, z.title, 'status_changed', 'Статус → ' + lbl);
    get().showToast('Статус: ' + lbl);
    get().syncSeichas(false);
  },

  syncSeichas: async (manual = true) => {
    set({ syncSt: 'syncing', oshibka: null });
    const res = await syncService.syncNow();
    if (res.ok) {
      set({ zadachi: res.zadachi, syncSt: 'synced', oshibka: null });
      if (manual) {
        await get().dobavitIstoriyu('sync', 'Система', 'synced', 'Синхронизация выполнена');
        get().showToast('Синхронизация завершена');
      }
    } else {
      const offline = res.offline === true;
      set({
        zadachi: res.zadachi,
        syncSt: offline ? 'pending' : 'failed',
        oshibka: offline ? 'Нет сети' : 'Ошибка синхронизации',
      });
      if (manual) get().showToast(offline ? 'Нет сети' : 'Ошибка синхронизации', 'error');
    }
  },

  getFilteredSorted: () => {
    const { zadachi, poisk, statusFilter, sortTip } = get();
    let spisok = zadachi;
    if (statusFilter !== 'all') spisok = spisok.filter(z => z.status === statusFilter);
    if (poisk.trim()) {
      const q = poisk.toLowerCase();
      spisok = spisok.filter(z =>
        z.title.toLowerCase().includes(q) ||
        z.description.toLowerCase().includes(q) ||
        z.location.address.toLowerCase().includes(q)
      );
    }
    return sortirovat(spisok, sortTip);
  },
}));

let podpiska: (() => void) | null = null;
function podpisatsyaNaSet() {
  if (podpiska) return;
  podpiska = NetInfo.addEventListener(st => {
    if (st.isConnected) useZadachiStore.getState().syncSeichas(false);
  });
}

export function addAttachmentMeta(uri: string, name: string, mimeType: string): TaskAttachment {
  return { id: sdelayId(), uri, name, mimeType };
}
