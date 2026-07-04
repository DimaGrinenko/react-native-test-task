export type TaskStatus = 'new' | 'in_progress' | 'completed' | 'cancelled';

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface TaskLocation {
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface TaskAttachment {
  id: string;
  uri: string;
  name: string;
  mimeType: string;
  size?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueAt: string;
  location: TaskLocation;
  attachments: TaskAttachment[];
  status: TaskStatus;
  syncStatus: SyncStatus;
  createdAt: string;
  updatedAt: string;
}
