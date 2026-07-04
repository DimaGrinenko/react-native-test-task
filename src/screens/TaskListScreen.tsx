import { StyleSheet, Text, View } from 'react-native';

/** Список задач: сортировка, пустое состояние, переход в детали */
export function TaskListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Задачи</Text>
      <Text style={styles.hint}>TODO: список, сортировка, фильтры</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  hint: { marginTop: 8, color: '#666' },
});
