import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SYNC_COLORS } from '../theme';
import type { SyncStatus } from '../types/task';

type Props = {
  status: SyncStatus;
  small?: boolean;
};

export function SyncBadge({ status, small }: Props) {
  const cfg = SYNC_COLORS[status];
  return (
    <View style={[styles.wrap, { backgroundColor: cfg.bg }, small && styles.small]}>
      {status === 'syncing' && <ActivityIndicator size="small" color={cfg.text} />}
      <Text style={[styles.text, { color: cfg.text }, small && styles.textSmall]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  small: { paddingHorizontal: 6, paddingVertical: 2 },
  text: { fontSize: 11, fontWeight: '700' },
  textSmall: { fontSize: 10 },
});
