import { StyleSheet, Text, View } from 'react-native';
import { CANDIDATE_CODE } from '../constants';

/** Настройки: тема, демо-уведомления, код кандидата, синхронизация */
export function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Настройки</Text>
      <Text style={styles.code}>Код кандидата: {CANDIDATE_CODE}</Text>
      <Text style={styles.hint}>TODO: переключатель темы, demo mode, статус sync</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  code: { marginTop: 12, fontSize: 16, fontWeight: '600' },
  hint: { marginTop: 8, color: '#666' },
});
