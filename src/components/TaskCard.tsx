import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ThemeColors } from '../theme';
import { shadows } from '../theme';
import { formatDateTime, formatTimeLeft, isOverdue } from '../utils/format';
import type { Task } from '../types/task';
import { StatusBadge } from './StatusBadge';
import { SyncBadge } from './SyncBadge';

type Props = {
  task: Task;
  colors: ThemeColors;
  dark?: boolean;
  onPress: () => void;
};

export function TaskCard({ task, colors, dark, onPress }: Props) {
  const overdue = isOverdue(task.dueAt) && task.status !== 'completed' && task.status !== 'cancelled';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, shadows.card]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityLabel={`Задача ${task.title}`}
    >
      <View style={styles.top}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {task.title}
        </Text>
        <StatusBadge status={task.status} colors={colors} dark={dark} compact />
      </View>

      <Text style={[styles.desc, { color: colors.sub }]} numberOfLines={2}>
        {task.description}
      </Text>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>📅</Text>
          <Text style={[styles.metaText, { color: colors.text }]}>{formatDateTime(task.dueAt)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>📍</Text>
          <Text style={[styles.metaText, { color: colors.sub }]} numberOfLines={1}>
            {task.location.address}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text
          style={[
            styles.deadline,
            { color: overdue ? colors.danger : colors.primary },
          ]}
        >
          {overdue ? '⚠ Просрочено' : `⏱ ${formatTimeLeft(task.dueAt)}`}
        </Text>
        {task.syncStatus !== 'synced' && <SyncBadge status={task.syncStatus} small />}
        {task.attachments.length > 0 && (
          <Text style={[styles.attach, { color: colors.sub }]}>📎 {task.attachments.length}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  title: { flex: 1, fontSize: 17, fontWeight: '800' },
  desc: { fontSize: 13, lineHeight: 18, marginBottom: 12 },
  meta: { gap: 6, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaIcon: { fontSize: 13 },
  metaText: { flex: 1, fontSize: 13 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  deadline: { fontSize: 12, fontWeight: '700' },
  attach: { fontSize: 12, marginLeft: 'auto' },
});
