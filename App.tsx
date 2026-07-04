import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CANDIDATE_CODE, SYNC_STATUS_LABELS } from './src/constants';
import { useZadachiStore } from './src/hooks/useZadachiStore';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { MapScreen } from './src/screens/MapScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { TaskListScreen } from './src/screens/TaskListScreen';
import { darkTheme, lightTheme } from './src/theme';

type Vkladka = 'tasks' | 'map' | 'history' | 'settings';

export default function App() {
  const [aktivnayaVkladka, setAktivnayaVkladka] = useState<Vkladka>('tasks');
  const tema = useZadachiStore(s => s.tema);
  const syncSt = useZadachiStore(s => s.syncSt);
  const toast = useZadachiStore(s => s.toast);
  const ubratToast = useZadachiStore(s => s.clearToast);

  const cveta = tema === 'dark' ? darkTheme : lightTheme;
  const temnyi = tema === 'dark';

  let soderzhimoe = null;
  if (aktivnayaVkladka === 'tasks') soderzhimoe = <TaskListScreen colors={cveta} dark={temnyi} />;
  else if (aktivnayaVkladka === 'map') soderzhimoe = <MapScreen colors={cveta} dark={temnyi} />;
  else if (aktivnayaVkladka === 'history') soderzhimoe = <HistoryScreen colors={cveta} dark={temnyi} />;
  else soderzhimoe = <SettingsScreen colors={cveta} dark={temnyi} />;

  const knopkiVkladok: {id: Vkladka, bukva: string}[] = [
    {id:'tasks', bukva:'Задачи'},
    {id:'map', bukva:'Карта'},
    {id:'history', bukva:'История'},
    {id:'settings', bukva:'Настройки'},
  ];

  return (
    <SafeAreaView style={{flex:1, backgroundColor: cveta.bg}}>
      <View style={[styles.shapka, {backgroundColor: cveta.headerFrom}]}>
        <Text style={styles.zagolovok}>Полевые задачи</Text>
        <Text style={styles.kod}>{CANDIDATE_CODE}</Text>
        <Text style={styles.syncTxt}>Синхронизация: {SYNC_STATUS_LABELS[syncSt] ?? syncSt}</Text>
      </View>

      <View style={{flex:1}}>{soderzhimoe}</View>

      <View style={[styles.tabBar, {backgroundColor: cveta.card, borderColor: cveta.border}]}>
        {knopkiVkladok.map(knopka => (
          <TouchableOpacity
            key={knopka.id}
            onPress={() => setAktivnayaVkladka(knopka.id)}
            style={[styles.tabKn, aktivnayaVkladka===knopka.id && {borderTopColor: cveta.primary, borderTopWidth: 3}]}
          >
            <Text style={{color: aktivnayaVkladka===knopka.id ? cveta.primary : cveta.sub, fontSize: 12, fontWeight: aktivnayaVkladka===knopka.id ? '700':'500'}}>
              {knopka.bukva}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {toast && (
        <View style={[styles.toast, {backgroundColor: toast.type==='error' ? cveta.danger : cveta.ok}]}>
          <Text style={{color:'#fff', fontWeight:'600'}}>{toast.msg}</Text>
          <TouchableOpacity onPress={ubratToast} style={{marginLeft:10}}>
            <Text style={{color:'#fff'}}>x</Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBar style={temnyi ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shapka: { padding: 14, paddingTop: 10 },
  zagolovok: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  kod: { color: '#ccc', fontSize: 12, marginTop: 3 },
  syncTxt: { color: '#aaa', fontSize: 11, marginTop: 2 },
  tabBar: { flexDirection:'row', borderTopWidth:1 },
  tabKn: { flex:1, paddingVertical: 12, alignItems:'center' },
  toast: {
    position:'absolute', top: 80, left: 16, right: 16,
    padding: 12, borderRadius: 8, flexDirection:'row', alignItems:'center',
  },
});
