import { StyleSheet, Text, View } from 'react-native';

/** Карта с маркерами задач (react-native-maps) */
export function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Карта</Text>
      <Text style={styles.hint}>TODO: маркеры, открытие задачи из маркера</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  hint: { marginTop: 8, color: '#666' },
});
