import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ACTION_LABELS } from '../constants';
import { useZadachiStore } from '../hooks/useZadachiStore';
import type { ThemeColors } from '../theme';

type Props = { colors: ThemeColors; dark?: boolean };

export function HistoryScreen({ colors }: Props) {
  const vseZapisi = useZadachiStore(s => s.istoriya);

  if (vseZapisi.length === 0) {
    return (
      <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor: colors.bg}}>
        <Text style={{fontSize:30}}>📜</Text>
        <Text style={{color: colors.text, fontWeight:'bold', marginTop:8}}>История пуста</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{backgroundColor: colors.bg}}
      data={vseZapisi}
      keyExtractor={zapis => zapis.id}
      contentContainerStyle={{padding:12}}
      renderItem={({item: zapis}) => (
        <View style={[styles.kart, {backgroundColor: colors.card, borderColor: colors.border}]}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{color: colors.primary, fontWeight:'bold', fontSize:12}}>
              {ACTION_LABELS[zapis.action] ?? zapis.action}
            </Text>
            <Text style={{color: colors.sub, fontSize:10}}>
              {new Date(zapis.timestamp).toLocaleString('ru-RU')}
            </Text>
          </View>
          <Text style={{color: colors.text, fontWeight:'600', marginTop:4}} numberOfLines={1}>{zapis.taskTitle}</Text>
          <Text style={{color: colors.sub, fontSize:12, marginTop:2}}>{zapis.description}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  kart: { padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 8 },
});
