import { Image } from 'expo-image';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SYNC_STATUS_LABELS, TASK_STATUSES } from '../constants';
import { useZadachiStore } from '../hooks/useZadachiStore';
import type { ThemeColors } from '../theme';
import type { TaskStatus } from '../types/task';

type Props = {
  colors: ThemeColors;
  dark?: boolean;
  taskId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
};

export function TaskDetailScreen({ colors, taskId, onBack, onEdit }: Props) {
  const tekushayaZadacha = useZadachiStore(s => s.zadachi.find(z => z.id === taskId));
  const smenitStatus = useZadachiStore(s => s.pomenatStatus);
  const udalit = useZadachiStore(s => s.udalitZadachu);
  const zapisiIstorii = useZadachiStore(s => s.istoriya.filter(h => h.taskId === taskId));

  if (!tekushayaZadacha) {
    return (
      <View style={{flex:1, padding:16, backgroundColor: colors.bg}}>
        <Text style={{color: colors.text}}>Задача не найдена</Text>
        <TouchableOpacity onPress={onBack}><Text style={{color: colors.primary}}>Назад</Text></TouchableOpacity>
      </View>
    );
  }

  const nazvanieStatusa = TASK_STATUSES.find(s => s.value === tekushayaZadacha.status)?.label;

  const nazhatUdalit = () => {
    Alert.alert('Удалить?', tekushayaZadacha.title, [
      { text: 'Нет', style: 'cancel' },
      { text: 'Да', style: 'destructive', onPress: async () => { await udalit(tekushayaZadacha.id); onBack(); } },
    ]);
  };

  return (
    <ScrollView style={{flex:1, backgroundColor: colors.bg, padding: 14}}>
      <TouchableOpacity onPress={onBack}>
        <Text style={{color: colors.primary, marginBottom: 12}}>{'<'} Назад</Text>
      </TouchableOpacity>

      <Text style={{fontSize: 22, fontWeight:'bold', color: colors.text}}>{tekushayaZadacha.title}</Text>
      <Text style={{color: colors.primary, marginTop: 4, fontWeight:'600'}}>{nazvanieStatusa}</Text>
      <Text style={{color: colors.sub, fontSize: 11, marginTop: 2}}>
        Синхронизация: {SYNC_STATUS_LABELS[tekushayaZadacha.syncStatus] ?? tekushayaZadacha.syncStatus}
      </Text>

      <View style={[styles.blok, {backgroundColor: colors.card, borderColor: colors.border}]}>
        <Text style={styles.blokZag}>Описание</Text>
        <Text style={{color: colors.text}}>{tekushayaZadacha.description}</Text>
      </View>

      <View style={[styles.blok, {backgroundColor: colors.card, borderColor: colors.border}]}>
        <Text style={styles.blokZag}>Срок</Text>
        <Text style={{color: colors.text}}>{new Date(tekushayaZadacha.dueAt).toLocaleString('ru-RU')}</Text>
      </View>

      <View style={[styles.blok, {backgroundColor: colors.card, borderColor: colors.border}]}>
        <Text style={styles.blokZag}>Адрес</Text>
        <Text style={{color: colors.text}}>{tekushayaZadacha.location.address}</Text>
        {tekushayaZadacha.location.latitude != null && (
          <Text style={{color: colors.sub, fontSize: 11, marginTop: 4}}>
            {tekushayaZadacha.location.latitude}, {tekushayaZadacha.location.longitude}
          </Text>
        )}
      </View>

      {tekushayaZadacha.attachments.length > 0 && (
        <View style={[styles.blok, {backgroundColor: colors.card, borderColor: colors.border}]}>
          <Text style={styles.blokZag}>Вложения ({tekushayaZadacha.attachments.length})</Text>
          {tekushayaZadacha.attachments.map(fail => (
            <View key={fail.id} style={{marginTop:8}}>
              {fail.mimeType.startsWith('image') ? (
                <Image source={{uri: fail.uri}} style={{width:'100%', height:160, borderRadius:6}} contentFit="cover" />
              ) : (
                <Text style={{color: colors.text}}>📄 {fail.name}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      <Text style={{color: colors.text, fontWeight:'bold', marginTop: 16, marginBottom: 8}}>Изменить статус</Text>
      <View style={{flexDirection:'row', flexWrap:'wrap', gap:6}}>
        {(['in_progress','completed','cancelled'] as TaskStatus[]).map(noviyStatus => {
          const bukva = TASK_STATUSES.find(s => s.value === noviyStatus)?.label;
          return (
            <TouchableOpacity key={noviyStatus}
              style={{padding: 10, borderRadius: 6, borderWidth:1, borderColor: colors.border,
                backgroundColor: tekushayaZadacha.status===noviyStatus ? colors.primary : colors.card}}
              onPress={() => smenitStatus(tekushayaZadacha.id, noviyStatus)}>
              <Text style={{color: tekushayaZadacha.status===noviyStatus ? '#fff' : colors.text, fontSize: 12}}>{bukva}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {zapisiIstorii.length > 0 && (
        <View style={{marginTop:16}}>
          <Text style={{color: colors.text, fontWeight:'bold', marginBottom:6}}>История</Text>
          {zapisiIstorii.slice(0,6).map(zapis => (
            <Text key={zapis.id} style={{color: colors.sub, fontSize: 11, marginBottom: 3}}>
              {new Date(zapis.timestamp).toLocaleString('ru-RU')} - {zapis.description}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity style={[styles.kn, {backgroundColor: colors.primary, marginTop:20}]}
        onPress={() => onEdit(tekushayaZadacha.id)}>
        <Text style={styles.knTxt}>Редактировать</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.kn, {backgroundColor: colors.danger, marginTop:8}]}
        onPress={nazhatUdalit}>
        <Text style={styles.knTxt}>Удалить</Text>
      </TouchableOpacity>
      <View style={{height:20}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  blok: { marginTop: 10, padding: 12, borderRadius: 8, borderWidth: 1 },
  blokZag: { fontSize: 11, color: '#888', marginBottom: 4, fontWeight: '600' },
  kn: { padding: 12, borderRadius: 8, alignItems: 'center' },
  knTxt: { color: '#fff', fontWeight: 'bold' },
});
