import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CANDIDATE_CODE, SYNC_STATUS_LABELS } from './src/constants';
import { useZadachiStore } from './src/hooks/useZadachiStore';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { MapScreen } from './src/screens/MapScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { TaskListScreen } from './src/screens/TaskListScreen';
import { darkTheme, lightTheme } from './src/theme';

type Tab = 'tasks' | 'map' | 'history' | 'settings';

export default function App() {
  const [tab, setTab] = useState<Tab>('tasks');
  const tema = useZadachiStore(s => s.tema);
  const syncSt = useZadachiStore(s => s.syncSt);
  const toast = useZadachiStore(s => s.toast);
  const clearToast = useZadachiStore(s => s.clearToast);
  const colors = tema === 'dark' ? darkTheme : lightTheme;
  const dark = tema === 'dark';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.headerFrom }]}>
        <Text style={styles.headerTitle}>Полевые задачи</Text>
        <Text style={styles.headerCode}>{CANDIDATE_CODE}</Text>
        <Text style={styles.syncTxt}>
          Синхронизация: {SYNC_STATUS_LABELS[syncSt] ?? syncSt}
        </Text>
      </View>

      <View style={styles.content}>
        {tab === 'tasks' && <TaskListScreen colors={colors} />}
        {tab === 'map' && <MapScreen colors={colors} dark={dark} />}
        {tab === 'history' && <HistoryScreen colors={colors} dark={dark} />}
        {tab === 'settings' && <SettingsScreen colors={colors} dark={dark} />}
      </View>

      <View style={[styles.tabs, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        {(
          [
            ['tasks', 'Задачи'],
            ['map', 'Карта'],
            ['history', 'История'],
            ['settings', 'Настройки'],
          ] as const
        ).map(([id, label]) => (
          <TouchableOpacity
            key={id}
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={() => setTab(id)}
            style={[styles.tab, tab === id && { borderTopColor: colors.primary, borderTopWidth: 3 }]}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: tab === id ? '700' : '600',
                color: tab === id ? colors.primary : colors.sub,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {toast && (
        <View
          style={[
            styles.toast,
            { backgroundColor: toast.type === 'error' ? colors.danger : colors.ok },
          ]}
        >
          <Text style={{ color: '#fff', fontWeight: '600', flex: 1 }}>{toast.msg}</Text>
          <TouchableOpacity onPress={clearToast}>
            <Text style={{ color: '#fff' }}>×</Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBar style={dark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerCode: { color: '#bfdbfe', marginTop: 4, fontSize: 13 },
  syncTxt: { color: '#cbd5e1', marginTop: 4, fontSize: 11 },
  content: { flex: 1 },
  tabs: { flexDirection: 'row', borderTopWidth: 1 },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  toast: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
