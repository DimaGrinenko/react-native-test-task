export type HistoryActionType =
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'attachment_added'
  | 'attachment_removed'
  | 'deleted'
  | 'synced'
  | 'sync_failed';

export interface HistoryEntry {
  id: string;
  taskId: string;
  taskTitle: string;
  action: HistoryActionType;
  description: string;
  timestamp: string;
}
