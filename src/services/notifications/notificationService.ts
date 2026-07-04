/** Локальные push за 30 мин до дедлайна + demo mode 30–60 сек */
export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    return false;
  },
  async scheduleReminder(taskId: string, dueAt: Date, demoMode?: boolean): Promise<void> {
    // TODO: expo-notifications
  },
  async cancelForTask(taskId: string): Promise<void> {
    // TODO
  },
};
