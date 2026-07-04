import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SYNC_STATUS_LABELS, TASK_STATUSES } from '../constants';
import type { SortTip } from '../hooks/useZadachiStore';
import { useZadachiStore } from '../hooks/useZadachiStore';
import type { ThemeColors } from '../theme';
import type { Task, TaskStatus } from '../types/task';
import { TaskDetailScreen } from './TaskDetailScreen';
import { TaskFormScreen } from './TaskFormScreen';

type Props = { colors: ThemeColors; dark?: boolean };

export function TaskListScreen({ colors, dark }: Props) {
  const zadachi = useZadachiStore(s => s.zadachi);
  const sortTip = useZadachiStore(s => s.sortTip);
  const poisk = useZadachiStore(s => s.poisk);
  const filtrStatusa = useZadachiStore(s => s.statusFilter);
  const idetZagruzka = useZadachiStore(s => s.zagruzka);
  const pomenyatSort = useZadachiStore(s => s.setSortTip);
  const pomenyatPoisk = useZadachiStore(s => s.setPoisk);
  const pomenyatFiltr = useZadachiStore(s => s.setStatusFilter);

  const [tekuschiyEkran,setTekuschiyEkran] = useState<'spisok'|'forma'|'detali'>('spisok');
  const [vybranniyId,setVybranniyId] = useState<string|null>(null);
  const [idDlyaRedakta,setIdDlyaRedakta] = useState<string|null>(null);

  useEffect(() => {
    useZadachiStore.getState().init();
  },[]);

  if (tekuschiyEkran === 'forma') {
    return (
      <TaskFormScreen
        colors={colors}
        dark={dark}
        taskId={idDlyaRedakta}
        onBack={() => { setTekuschiyEkran('spisok'); setIdDlyaRedakta(null); }}
        onSaved={id => { setVybranniyId(id); setTekuschiyEkran('detali'); setIdDlyaRedakta(null); }}
      />
    );
  }

  if (tekuschiyEkran === 'detali' && vybranniyId) {
    return (
      <TaskDetailScreen
        colors={colors}
        dark={dark}
        taskId={vybranniyId}
        onBack={() => setTekuschiyEkran('spisok')}
        onEdit={id => { setIdDlyaRedakta(id); setTekuschiyEkran('forma'); }}
      />
    );
  }

  let spisokZadach: Task[] = [...zadachi];
  if (filtrStatusa !== 'all') spisokZadach = spisokZadach.filter(z => z.status === filtrStatusa);
  if (poisk.trim()) {
    const strokaPoiska = poisk.toLowerCase();
    spisokZadach = spisokZadach.filter(z =>
      z.title.toLowerCase().includes(strokaPoiska) ||
      z.description.toLowerCase().includes(strokaPoiska) ||
      z.location.address.toLowerCase().includes(strokaPoiska)
    );
  }
  if (sortTip === 'createdAt') spisokZadach.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
  else if (sortTip === 'dueAt') spisokZadach.sort((a,b) => a.dueAt.localeCompare(b.dueAt));
  else spisokZadach.sort((a,b) => a.status.localeCompare(b.status));

  const narisovatKartochku = ({item}: {item: Task}) => {
    const zapisStatusa = TASK_STATUSES.find(s => s.value === item.status);
    return (
      <TouchableOpacity
        style={[styles.kartochka, {backgroundColor: colors.card, borderColor: colors.border}]}
        onPress={() => { setVybranniyId(item.id); setTekuschiyEkran('detali'); }}
      >
        <Text style={[styles.nazvanieTxt, {color: colors.text}]} numberOfLines={1}>{item.title}</Text>
        <Text style={{color: colors.sub, fontSize: 12, marginTop: 4}}>
          {new Date(item.dueAt).toLocaleString('ru-RU')} · {zapisStatusa?.label}
        </Text>
        <Text style={{color: colors.sub, fontSize: 11, marginTop: 2}} numberOfLines={1}>
          📍 {item.location.address}
        </Text>
        {item.syncStatus !== 'synced' && (
          <Text style={{color: colors.primary, fontSize: 10, marginTop: 4}}>
            {SYNC_STATUS_LABELS[item.syncStatus] ?? item.syncStatus}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const variantyFiltra: (TaskStatus | 'all')[] = ['all','new','in_progress','completed','cancelled'];

  return (
    <View style={{flex:1, backgroundColor: colors.bg}}>
      <TextInput
        style={[styles.poisk, {backgroundColor: colors.card, color: colors.text, borderColor: colors.border}]}
        placeholder="Поиск..."
        placeholderTextColor={colors.sub}
        value={poisk}
        onChangeText={pomenyatPoisk}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{maxHeight:40, marginTop:8}}>
        <View style={{flexDirection:'row', paddingHorizontal:12, gap:6}}>
          {variantyFiltra.map(filtr => (
            <TouchableOpacity
              key={filtr}
              onPress={() => pomenyatFiltr(filtr)}
              style={[styles.chip, {backgroundColor: filtrStatusa===filtr ? colors.primary : colors.card, borderColor: colors.border}]}
            >
              <Text style={{color: filtrStatusa===filtr ? '#fff' : colors.text, fontSize: 11}}>
                {filtr === 'all' ? 'Все' : TASK_STATUSES.find(s=>s.value===filtr)?.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.sortRow}>
        {(['createdAt','dueAt','status'] as SortTip[]).map(tipSorta => (
          <TouchableOpacity
            key={tipSorta}
            onPress={() => pomenyatSort(tipSorta)}
            style={[styles.sortKn, sortTip===tipSorta && {backgroundColor: colors.primary}]}
          >
            <Text style={{color: sortTip===tipSorta ? '#fff' : colors.text, fontSize: 11}}>
              {tipSorta === 'createdAt' ? 'Дата' : tipSorta === 'dueAt' ? 'Срок' : 'Статус'}
            </Text>
          </TouchableOpacity>
        ))}
        <Text style={{marginLeft:'auto', color: colors.sub, fontSize: 11}}>{spisokZadach.length} задач</Text>
      </View>

      {idetZagruzka ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : spisokZadach.length === 0 ? (
        <View style={styles.center}>
          <Text style={{fontSize:40}}>📋</Text>
          <Text style={{color: colors.text, fontWeight:'bold', marginTop:10}}>Задач нет</Text>
          <TouchableOpacity
            style={[styles.knAdd, {backgroundColor: colors.primary}]}
            onPress={() => { setIdDlyaRedakta(null); setTekuschiyEkran('forma'); }}
          >
            <Text style={{color:'#fff'}}>+ Создать</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={spisokZadach}
          keyExtractor={el => el.id}
          renderItem={narisovatKartochku}
          contentContainerStyle={{padding:12, paddingBottom:70}}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, {backgroundColor: colors.primary}]}
        onPress={() => { setIdDlyaRedakta(null); setTekuschiyEkran('forma'); }}
      >
        <Text style={{color:'#fff', fontSize:28}}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  poisk: { margin: 12, marginBottom: 0, borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 14 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14, borderWidth: 1 },
  sortRow: { flexDirection:'row', padding: 12, gap: 6, alignItems:'center' },
  sortKn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, backgroundColor: '#ddd' },
  kartochka: { padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 8 },
  nazvanieTxt: { fontSize: 16, fontWeight: '700' },
  center: { flex:1, alignItems:'center', justifyContent:'center' },
  knAdd: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  fab: {
    position:'absolute', right: 16, bottom: 16,
    width: 52, height: 52, borderRadius: 26,
    alignItems:'center', justifyContent:'center',
  },
});
