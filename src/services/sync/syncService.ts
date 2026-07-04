import type { SyncStatus } from '../../types/task';

/** Офлайн-очередь и синхронизация с json-server (last-write-wins) */
export const syncService = {
  async getStatus(): Promise<SyncStatus> {
    return 'synced';
  },
  async syncNow(): Promise<void> {
    // TODO: push local changes, pull remote, resolve conflicts
  },
};
