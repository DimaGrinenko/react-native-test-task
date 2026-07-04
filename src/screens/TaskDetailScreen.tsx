import { StyleSheet, Text, View } from 'react-native';

/** Детали задачи: статус, вложения, локация, история по задаче */
export function TaskDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Детали задачи</Text>
      <Text style={styles.hint}>TODO: полная информация, смена статуса, удаление</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  hint: { marginTop: 8, color: '#666' },
});
