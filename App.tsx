import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CANDIDATE_CODE } from './src/constants';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { MapScreen } from './src/screens/MapScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { TaskListScreen } from './src/screens/TaskListScreen';

type Tab = 'tasks' | 'map' | 'history' | 'settings';

export default function App() {
  const [tab, setTab] = useState<Tab>('tasks');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Field Tasks</Text>
        <Text style={styles.headerCode}>{CANDIDATE_CODE}</Text>
      </View>

      <View style={styles.content}>
        {tab === 'tasks' && <TaskListScreen />}
        {tab === 'map' && <MapScreen />}
        {tab === 'history' && <HistoryScreen />}
        {tab === 'settings' && <SettingsScreen />}
      </View>

      <View style={styles.tabs}>
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
            style={[styles.tab, tab === id && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === id && styles.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1e3a8a',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerCode: { color: '#bfdbfe', marginTop: 4, fontSize: 13 },
  content: { flex: 1 },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderTopWidth: 3, borderTopColor: '#2563eb' },
  tabText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  tabTextActive: { color: '#1d4ed8' },
});
