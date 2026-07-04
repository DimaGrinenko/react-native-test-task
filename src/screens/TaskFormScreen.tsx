import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MESTA_PRESET, TASK_STATUSES } from '../constants';
import { addAttachmentMeta, useZadachiStore } from '../hooks/useZadachiStore';
import type { ThemeColors } from '../theme';
import type { Task, TaskAttachment, TaskStatus } from '../types/task';
import { validateTaskForm } from '../utils/validation';

type Props = {
  colors: ThemeColors;
  dark?: boolean;
  taskId: string | null;
  onBack: () => void;
  onSaved: (id: string) => void;
};

export function TaskFormScreen({ colors, taskId, onBack, onSaved }: Props) {
  const zadachi = useZadachiStore(s => s.zadachi);
  const sozdat = useZadachiStore(s => s.sozdatZadachu);
  const obnovit = useZadachiStore(s => s.obnovitZadachu);
  const demoRezhim = useZadachiStore(s => s.demoRezhim);

  const [nazvanie,setNazvanie] = useState('');
  const [opisanie,setOpisanie] = useState('');
  const [srok,setSrok] = useState(new Date(Date.now() + 86400000));
  const [pokazDatu,setPokazDatu] = useState(false);
  const [adres,setAdres] = useState('');
  const [shirota,setShirota] = useState('');
  const [dolgota,setDolgota] = useState('');
  const [status,setStatus] = useState<TaskStatus>('new');
  const [vlozheniya,setVlozheniya] = useState<TaskAttachment[]>([]);
  const [oshibki,setOshibki] = useState<Record<string,string>>({});
  const [gruzit,setGruzit] = useState(false);

  useEffect(() => {
    if (!taskId) return;
    const z = zadachi.find(x => x.id === taskId);
    if (!z) return;
    setNazvanie(z.title);
    setOpisanie(z.description);
    setSrok(new Date(z.dueAt));
    setAdres(z.location.address);
    setShirota(z.location.latitude?.toString() ?? '');
    setDolgota(z.location.longitude?.toString() ?? '');
    setStatus(z.status);
    setVlozheniya(z.attachments);
  }, [taskId]);

  const vybratMesto = (i: number) => {
    const m = MESTA_PRESET[i];
    setAdres(m.adres);
    setShirota(String(m.lat));
    setDolgota(String(m.lng));
  };

  const dobavitFoto = async () => {
    const otvet = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (otvet.canceled || !otvet.assets[0]) return;
    const file = otvet.assets[0];
    setVlozheniya(prev => [...prev, addAttachmentMeta(file.uri, file.fileName ?? 'foto.jpg', file.mimeType ?? 'image/jpeg')]);
  };

  const dobavitPdf = async () => {
    const otvet = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (otvet.canceled || !otvet.assets?.[0]) return;
    const file = otvet.assets[0];
    setVlozheniya(prev => [...prev, addAttachmentMeta(file.uri, file.name, 'application/pdf')]);
  };

  const sohranit = async () => {
    const dannye = {
      title: nazvanie,
      description: opisanie,
      dueAt: srok.toISOString(),
      location: {
        address: adres,
        latitude: shirota ? parseFloat(shirota) : undefined,
        longitude: dolgota ? parseFloat(dolgota) : undefined,
      },
    };
    const err = validateTaskForm(dannye);
    if (Object.keys(err).length > 0) {
      setOshibki(err as Record<string,string>);
      return;
    }
    setOshibki({});

    const minDoSroka = (srok.getTime() - Date.now()) / 60000;
    if (minDoSroka < 30 && !demoRezhim) {
      Alert.alert('Внимание', 'До срока меньше 30 мин — уведомление придёт через ~10 сек');
    }

    setGruzit(true);
    try {
      if (taskId) {
        const staraya = zadachi.find(z => z.id === taskId)!;
        const obnovlennaya: Task = {
          ...staraya,
          title: nazvanie.trim(),
          description: opisanie.trim(),
          dueAt: srok.toISOString(),
          location: dannye.location,
          attachments: vlozheniya,
          status,
        };
        await obnovit(obnovlennaya);
        onSaved(taskId);
      } else {
        const novaya = await sozdat({
          title: nazvanie.trim(),
          description: opisanie.trim(),
          dueAt: srok.toISOString(),
          location: dannye.location,
          attachments: vlozheniya,
          status,
        });
        onSaved(novaya.id);
      }
    } finally {
      setGruzit(false);
    }
  };

  return (
    <ScrollView style={{flex:1, backgroundColor: colors.bg, padding: 14}} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={onBack}>
        <Text style={{color: colors.primary, marginBottom: 10}}>{'<'} Назад</Text>
      </TouchableOpacity>

      <Text style={{fontSize: 20, fontWeight:'bold', color: colors.text, marginBottom: 14}}>
        {taskId ? 'Редактирование' : 'Новая задача'}
      </Text>

      <Text style={styles.lbl}>Название *</Text>
      <TextInput style={[styles.inp, {backgroundColor: colors.card, color: colors.text, borderColor: colors.border}]}
        value={nazvanie} onChangeText={setNazvanie} placeholder="Название задачи" placeholderTextColor={colors.sub} />
      {oshibki.title && <Text style={styles.err}>{oshibki.title}</Text>}

      <Text style={styles.lbl}>Описание *</Text>
      <TextInput style={[styles.inp, styles.area, {backgroundColor: colors.card, color: colors.text, borderColor: colors.border}]}
        value={opisanie} onChangeText={setOpisanie} multiline placeholder="Описание" placeholderTextColor={colors.sub} />
      {oshibki.description && <Text style={styles.err}>{oshibki.description}</Text>}

      <Text style={styles.lbl}>Срок *</Text>
      <TouchableOpacity style={[styles.inp, {backgroundColor: colors.card, borderColor: colors.border}]}
        onPress={() => setPokazDatu(true)}>
        <Text style={{color: colors.text}}>{srok.toLocaleString('ru-RU')}</Text>
      </TouchableOpacity>
      {pokazDatu && (
        <DateTimePicker value={srok} mode="datetime" onChange={(_, d) => {
          setPokazDatu(Platform.OS === 'ios');
          if (d) setSrok(d);
        }} />
      )}
      {oshibki.dueAt && <Text style={styles.err}>{oshibki.dueAt}</Text>}

      <Text style={styles.lbl}>Место *</Text>
      <View style={{flexDirection:'row', flexWrap:'wrap', gap:6, marginBottom:8}}>
        {MESTA_PRESET.map((m, i) => (
          <TouchableOpacity key={m.nazvanie} onPress={() => vybratMesto(i)}
            style={{padding: 6, borderRadius: 6, borderWidth: 1, borderColor: colors.border}}>
            <Text style={{fontSize: 11, color: colors.text}}>{m.nazvanie}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput style={[styles.inp, {backgroundColor: colors.card, color: colors.text, borderColor: colors.border}]}
        value={adres} onChangeText={setAdres} placeholder="Адрес" placeholderTextColor={colors.sub} />
      {oshibki.location && <Text style={styles.err}>{oshibki.location}</Text>}

      <View style={{flexDirection:'row', gap:8, marginTop:6}}>
        <TextInput style={[styles.inp, {flex:1, backgroundColor: colors.card, color: colors.text, borderColor: colors.border}]}
          value={shirota} onChangeText={setShirota} placeholder="Широта" keyboardType="numeric" placeholderTextColor={colors.sub} />
        <TextInput style={[styles.inp, {flex:1, backgroundColor: colors.card, color: colors.text, borderColor: colors.border}]}
          value={dolgota} onChangeText={setDolgota} placeholder="Долгота" keyboardType="numeric" placeholderTextColor={colors.sub} />
      </View>

      <Text style={[styles.lbl, {marginTop:12}]}>Статус</Text>
      <View style={{flexDirection:'row', flexWrap:'wrap', gap:6}}>
        {TASK_STATUSES.map(s => (
          <TouchableOpacity key={s.value} onPress={() => setStatus(s.value)}
            style={{padding: 8, borderRadius: 6, backgroundColor: status===s.value ? colors.primary : colors.card, borderWidth:1, borderColor: colors.border}}>
            <Text style={{fontSize: 11, color: status===s.value ? '#fff' : colors.text}}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.lbl, {marginTop:12}]}>Вложения</Text>
      <View style={{flexDirection:'row', gap:8}}>
        <TouchableOpacity onPress={dobavitFoto} style={[styles.knVlozh, {backgroundColor: colors.primary}]}>
          <Text style={{color:'#fff'}}>Фото</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={dobavitPdf} style={[styles.knVlozh, {backgroundColor: colors.primary}]}>
          <Text style={{color:'#fff'}}>PDF</Text>
        </TouchableOpacity>
      </View>
      {vlozheniya.map(fail => (
        <View key={fail.id} style={{flexDirection:'row', alignItems:'center', marginTop:8, gap:8}}>
          {fail.mimeType.startsWith('image') ? (
            <Image source={{uri: fail.uri}} style={{width:40, height:40, borderRadius:4}} />
          ) : (
            <Text style={{color: colors.text}}>PDF: {fail.name}</Text>
          )}
          <TouchableOpacity onPress={() => setVlozheniya(p => p.filter(x => x.id !== fail.id))}>
            <Text style={{color: colors.danger}}>Убрать</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.save, {backgroundColor: colors.primary, opacity: gruzit ? 0.6 : 1}]}
        onPress={sohranit}
        disabled={gruzit}
      >
        <Text style={{color:'#fff', fontWeight:'bold', fontSize:16}}>{gruzit ? 'Сохраняем…' : 'Сохранить'}</Text>
      </TouchableOpacity>
      <View style={{height:30}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  lbl: { fontSize: 13, marginBottom: 4, marginTop: 8, color: '#666' },
  inp: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 14 },
  area: { minHeight: 70, textAlignVertical: 'top' },
  err: { color: 'red', fontSize: 11, marginTop: 2 },
  knVlozh: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  save: { marginTop: 20, padding: 14, borderRadius: 8, alignItems: 'center' },
});
