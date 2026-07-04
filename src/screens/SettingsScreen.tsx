import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { CANDIDATE_CODE, SYNC_STATUS_LABELS } from '../constants';
import { useZadachiStore } from '../hooks/useZadachiStore';
import { notificationService } from '../services/notifications/notificationService';
import type { ThemeColors } from '../theme';

type Props = { colors: ThemeColors; dark?: boolean };

export function SettingsScreen({ colors }: Props) {
  const tema = useZadachiStore(s => s.tema);
  const ustanovitTemu = useZadachiStore(s => s.setTema);
  const demoRezhim = useZadachiStore(s => s.demoRezhim);
  const ustanovitDemo = useZadachiStore(s => s.setDemoRezhim);
  const syncSt = useZadachiStore(s => s.syncSt);
  const sinhroniz = useZadachiStore(s => s.syncSeichas);
  const oshibka = useZadachiStore(s => s.oshibka);
  const zadachi = useZadachiStore(s => s.zadachi);

  const temnyi = tema === 'dark';
  const skolkoPending = zadachi.filter(z => z.syncStatus === 'pending').length;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg, padding: 14 }}>
      <View style={[styles.blok, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={{ color: colors.sub, fontSize: 12 }}>Код кандидата</Text>
        <Text style={{ color: colors.primary, fontSize: 22, fontWeight: 'bold', marginTop: 4 }}>
          {CANDIDATE_CODE}
        </Text>
      </View>

      <View style={[styles.blok, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.row}>
          <Text style={{ color: colors.text, fontWeight: '600' }}>Тёмная тема</Text>
          <Switch value={temnyi} onValueChange={v => ustanovitTemu(v ? 'dark' : 'light')} />
        </View>
      </View>

      <View style={[styles.blok, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: '600' }}>Демо-уведомления</Text>
            <Text style={{ color: colors.sub, fontSize: 11, marginTop: 2 }}>
              Уведомление через ~45 сек вместо 30 мин до дедлайна
            </Text>
          </View>
          <Switch value={demoRezhim} onValueChange={ustanovitDemo} />
        </View>
      </View>

      {demoRezhim && (
        <TouchableOpacity
          style={{
            backgroundColor: colors.accent,
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
            alignItems: 'center',
          }}
          onPress={() => notificationService.scheduleDemoNotification('Тестовая задача')}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Тестовое уведомление через 5 сек</Text>
        </TouchableOpacity>
      )}

      <View style={[styles.blok, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={{ color: colors.text, fontWeight: '600' }}>Синхронизация</Text>
        <Text style={{ color: colors.sub, marginTop: 6 }}>
          Статус: {SYNC_STATUS_LABELS[syncSt] ?? syncSt}
        </Text>
        <Text style={{ color: colors.sub, fontSize: 12 }}>
          Задач: {zadachi.length}, ожидает: {skolkoPending}
        </Text>
        {oshibka && (
          <Text style={{ color: colors.danger, marginTop: 6, fontSize: 12 }}>{oshibka}</Text>
        )}

        <TouchableOpacity
          style={[styles.syncKn, { backgroundColor: colors.primary }]}
          onPress={() => sinhroniz(true)}
          disabled={syncSt === 'syncing'}
        >
          {syncSt === 'syncing' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Синхронизировать сейчас</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.blok, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={{ color: colors.text, fontWeight: '600' }}>О приложении</Text>
        <Text style={{ color: colors.sub, fontSize: 12, marginTop: 6, lineHeight: 18 }}>
          Полевые задачи — приложение для сотрудников на объектах. Данные хранятся локально в
          AsyncStorage, синхронизация с json-server при наличии сети.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  blok: { padding: 14, borderRadius: 8, borderWidth: 1, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  syncKn: { marginTop: 12, padding: 12, borderRadius: 8, alignItems: 'center' },
});
