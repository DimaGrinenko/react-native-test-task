import NetInfo from '@react-native-community/netinfo';
import type { Task, SyncStatus } from '../../types/task';
import { taskApi } from '../api/taskApi';
import { taskStorage } from '../storage/taskStorage';

function pickNewer(local: Task, remote: Task): Task {
  const l = new Date(local.updatedAt).getTime();
  const r = new Date(remote.updatedAt).getTime();
  return l >= r ? local : remote;
}

export const syncService = {
  async isOnline(): Promise<boolean> {
    const s = await NetInfo.fetch();
    return s.isConnected === true && s.isInternetReachable !== false;
  },

  async syncNow(): Promise<{ ok: boolean; zadachi: Task[]; offline?: boolean }> {
    const online = await this.isOnline();
    if (!online) {
      const local = await taskStorage.getAll();
      const pending = local.map((z) =>
        z.syncStatus === 'synced' ? z : { ...z, syncStatus: 'pending' as SyncStatus }
      );
      return { ok: false, zadachi: pending, offline: true };
    }

    let local = await taskStorage.getAll();
    local = local.map((z) => ({ ...z, syncStatus: 'syncing' as SyncStatus }));
    await taskStorage.saveAll(local);

    try {
      let remote: Task[] = [];
      try {
        remote = await taskApi.getAll();
      } catch {
        remote = [];
      }

      const merged = new Map<string, Task>();
      for (const r of remote) merged.set(r.id, r);
      for (const l of local) {
        const ex = merged.get(l.id);
        if (!ex) merged.set(l.id, { ...l, syncStatus: 'synced' });
        else merged.set(l.id, { ...pickNewer(l, ex), syncStatus: 'synced' });
      }

      const result: Task[] = [];
      for (const z of merged.values()) {
        const onServer = remote.find((r) => r.id === z.id);
        if (!onServer) {
          await taskApi.create(z);
        } else {
          const newer = pickNewer(z, onServer);
          if (newer.updatedAt !== onServer.updatedAt) await taskApi.update(newer);
        }
        result.push({ ...z, syncStatus: 'synced' });
      }

      const udalennye = await taskStorage.getDeletedIds();
      for (const delId of udalennye) {
        try {
          await taskApi.remove(delId);
        } catch {}
      }
      await taskStorage.clearDeletedIds();

      await taskStorage.saveAll(result);
      return { ok: true, zadachi: result };
    } catch {
      const fail = (await taskStorage.getAll()).map((z) => ({
        ...z,
        syncStatus: 'failed' as SyncStatus,
      }));
      await taskStorage.saveAll(fail);
      return { ok: false, zadachi: fail };
    }
  },
};
