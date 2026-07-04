import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const idsMap = new Map<string, string>();

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    const { status: exist } = await Notifications.getPermissionsAsync();
    if (exist === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return false;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('deadline', {
        name: 'Дедлайны задач',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4F46E5',
      });
    }
    return true;
  },

  async scheduleReminder(
    taskId: string,
    taskTitle: string,
    dueAt: Date,
    demoRezhim?: boolean
  ): Promise<string | null> {
    await this.cancelForTask(taskId);
    const ok = await this.requestPermissions();
    if (!ok) return null;

    let triggerSec: number;
    let body: string;

    if (demoRezhim) {
      triggerSec = 45;
      body = `[Демо] Через 45 сек — дедлайн «${taskTitle}»`;
    } else {
      const diffMs = dueAt.getTime() - Date.now() - 30 * 60 * 1000;
      if (diffMs <= 0) {
        triggerSec = 10;
        body = `Срок «${taskTitle}» скоро! (менее 30 мин)`;
      } else {
        triggerSec = Math.floor(diffMs / 1000);
        body = `Через 30 минут дедлайн: «${taskTitle}»`;
      }
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Напоминание о задаче',
        body,
        data: { taskId },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(triggerSec, 1),
        channelId: Platform.OS === 'android' ? 'deadline' : undefined,
      },
    });
    idsMap.set(taskId, id);
    return id;
  },

  async cancelForTask(taskId: string): Promise<void> {
    const old = idsMap.get(taskId);
    if (old) {
      await Notifications.cancelScheduledNotificationAsync(old);
      idsMap.delete(taskId);
    }
  },

  async scheduleDemoNotification(taskTitle: string): Promise<void> {
    const ok = await this.requestPermissions();
    if (!ok) return;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 Демо-уведомление',
        body: `Тестовое уведомление для «${taskTitle}»`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
        channelId: Platform.OS === 'android' ? 'deadline' : undefined,
      },
    });
  },
};
