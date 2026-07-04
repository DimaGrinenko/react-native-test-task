import { API_BASE_URL } from '../../constants';
import type { Task } from '../../types/task';

const base = API_BASE_URL;

export const taskApi = {
  async getAll(): Promise<Task[]> {
    const res = await fetch(`${base}/tasks`);
    if (!res.ok) throw new Error('fetch fail');
    return res.json();
  },

  async create(task: Task): Promise<Task> {
    const res = await fetch(`${base}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('create fail');
    return res.json();
  },

  async update(task: Task): Promise<Task> {
    const res = await fetch(`${base}/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('update fail');
    return res.json();
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${base}/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('delete fail');
  },
};
