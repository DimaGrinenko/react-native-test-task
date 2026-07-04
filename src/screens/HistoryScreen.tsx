import { StyleSheet, Text, View } from 'react-native';

/** Журнал действий: создание, правки, статусы, синхронизация */
export function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>История</Text>
      <Text style={styles.hint}>TODO: лента событий с временными метками</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  hint: { marginTop: 8, color: '#666' },
});
