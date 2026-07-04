import { StyleSheet, Text, View } from 'react-native';
import { TASK_STATUSES } from '../constants';
import { STATUS_COLORS, STATUS_COLORS_DARK, type ThemeColors } from '../theme';
import type { TaskStatus } from '../types/task';

type Props = {
  status: TaskStatus;
  colors: ThemeColors;
  dark?: boolean;
  compact?: boolean;
};

export function StatusBadge({ status, colors, dark, compact }: Props) {
  const palette = dark ? STATUS_COLORS_DARK : STATUS_COLORS;
  const st = palette[status];
  const label = TASK_STATUSES.find((s) => s.value === status)?.label ?? status;

  return (
    <View style={[styles.wrap, { backgroundColor: st.bg }, compact && styles.compact]}>
      <View style={[styles.dot, { backgroundColor: st.dot }]} />
      <Text style={[styles.text, { color: st.text }, compact && styles.textCompact]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  compact: { paddingHorizontal: 8, paddingVertical: 3 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  text: { fontSize: 12, fontWeight: '700' },
  textCompact: { fontSize: 11 },
});
