import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { TASK_STATUSES } from '../constants';
import { useZadachiStore } from '../hooks/useZadachiStore';
import type { ThemeColors } from '../theme';
import { TaskDetailScreen } from './TaskDetailScreen';

type Props = { colors: ThemeColors; dark?: boolean };

export function MapScreen({ colors, dark }: Props) {
  const vseZadachi = useZadachiStore(s => s.zadachi);
  const zadachiNaKarte = vseZadachi.filter(z => z.location.latitude != null && z.location.longitude != null);
  const [otkrytiyId,setOtkrytiyId] = useState<string|null>(null);

  if (zadachiNaKarte.length === 0) {
    return (
      <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor: colors.bg, padding:20}}>
        <Text style={{fontSize:30}}>🗺</Text>
        <Text style={{color: colors.text, fontWeight:'bold', marginTop:10}}>Нет задач на карте</Text>
        <Text style={{color: colors.sub, textAlign:'center', marginTop:6, fontSize:13}}>
          Укажите координаты или выберите пресет при создании
        </Text>
      </View>
    );
  }

  const pervayaTochka = zadachiNaKarte[0];

  return (
    <View style={{flex:1}}>
      <MapView
        style={{flex:1}}
        initialRegion={{
          latitude: pervayaTochka.location.latitude!,
          longitude: pervayaTochka.location.longitude!,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        }}
      >
        {zadachiNaKarte.map(zadacha => (
          <Marker
            key={zadacha.id}
            coordinate={{ latitude: zadacha.location.latitude!, longitude: zadacha.location.longitude! }}
            title={zadacha.title}
            description={zadacha.location.address}
            onPress={() => setOtkrytiyId(zadacha.id)}
          />
        ))}
      </MapView>

      <View style={[styles.panel, {backgroundColor: colors.card}]}>
        <Text style={{color: colors.text, fontWeight:'bold', marginBottom:6, fontSize:12}}>
          Задачи ({zadachiNaKarte.length})
        </Text>
        <ScrollView horizontal>
          {zadachiNaKarte.map(zadacha => {
            const bukvaStatusa = TASK_STATUSES.find(s => s.value === zadacha.status)?.label;
            return (
              <TouchableOpacity key={zadacha.id} style={[styles.item, {borderColor: colors.border}]}
                onPress={() => setOtkrytiyId(zadacha.id)}>
                <Text style={{color: colors.text, fontSize:12, fontWeight:'600'}} numberOfLines={1}>{zadacha.title}</Text>
                <Text style={{color: colors.sub, fontSize:10}}>{bukvaStatusa}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

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
  panel: {
    position:'absolute', bottom: 10, left: 10, right: 10,
    borderRadius: 8, padding: 10, maxHeight: 100,
  },
  item: { width: 120, padding: 8, borderWidth: 1, borderRadius: 6, marginRight: 6 },
});
