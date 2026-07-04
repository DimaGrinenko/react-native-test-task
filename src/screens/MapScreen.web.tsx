import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TASK_STATUSES } from '../constants';
import { useZadachiStore } from '../hooks/useZadachiStore';
import type { ThemeColors } from '../theme';
import { TaskDetailScreen } from './TaskDetailScreen';

type Props = { colors: ThemeColors; dark?: boolean };

export function MapScreen({ colors, dark }: Props) {
  const vseZadachi = useZadachiStore(s => s.zadachi);
  const zadachiNaKarte = vseZadachi.filter(z => z.location.latitude != null && z.location.longitude != null);
  const [otkrytiyId, setOtkrytiyId] = useState<string | null>(null);

  if (zadachiNaKarte.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg, padding: 20 }}>
        <Text style={{ fontSize: 30 }}>🗺</Text>
        <Text style={{ color: colors.text, fontWeight: 'bold', marginTop: 10 }}>Нет задач на карте</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 14 }}>
      <Text style={{ color: colors.sub, fontSize: 12, marginBottom: 10 }}>
        Карта доступна только на телефоне, здесь список точек:
      </Text>
      <ScrollView>
        {zadachiNaKarte.map(zadacha => {
          const bukvaStatusa = TASK_STATUSES.find(s => s.value === zadacha.status)?.label;
          return (
            <TouchableOpacity
              key={zadacha.id}
              style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setOtkrytiyId(zadacha.id)}
            >
              <Text style={{ color: colors.text, fontWeight: '600' }}>{zadacha.title}</Text>
              <Text style={{ color: colors.sub, fontSize: 12 }}>{zadacha.location.address}</Text>
              <Text style={{ color: colors.sub, fontSize: 11 }}>
                {zadacha.location.latitude}, {zadacha.location.longitude} · {bukvaStatusa}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Modal visible={!!otkrytiyId} animationType="slide">
        {otkrytiyId && (
          <TaskDetailScreen
            colors={colors}
            dark={dark}
            taskId={otkrytiyId}
            onBack={() => setOtkrytiyId(null)}
            onEdit={() => setOtkrytiyId(null)}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 8 },
});
