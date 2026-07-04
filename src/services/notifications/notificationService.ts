export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    return true;
  },

  async scheduleReminder(
    _taskId: string,
    _taskTitle: string,
    _dueAt: Date,
    _demoRezhim?: boolean
  ): Promise<string | null> {
    return null;
  },

  async cancelForTask(_taskId: string): Promise<void> {},
};
