import { StyleSheet, Text, View } from 'react-native';

/** Создание / редактирование задачи с валидацией */
export function TaskFormScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Новая задача</Text>
      <Text style={styles.hint}>TODO: форма, вложения, локация, дедлайн</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  hint: { marginTop: 8, color: '#666' },
});
