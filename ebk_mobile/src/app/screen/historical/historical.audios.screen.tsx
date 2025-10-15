import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  useColorScheme,
  TextInput,
} from 'react-native';
import {findHistoryByUserApi} from '../../api/historical/historical.req';
import {AudioFile} from '../../store/datahome/home.audio.slice';
import CardAudiosUI from '../../../components/card/audios/card.audios';
import colors from '../../../components/style/colors';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {setActiveAudioId} from '../../store/audiosplayer/audio.id.slice';
import {useNavigation} from '@react-navigation/native';
import {RefreshControl} from 'react-native-gesture-handler';
import {NativeStackNavigationProp} from 'react-native-screens/lib/typescript/native-stack/types';
import Ionicons from 'react-native-vector-icons/Ionicons'; // tout en haut
import {TouchableOpacity} from '@gorhom/bottom-sheet';

export type RootStackParamList = {
  AudiosPlayer: {audios: any};
};

type NavigationProp = NativeStackNavigationProp<any, 'AudiosPlayer'>;

export default function HistoricalAudiosScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [history, setHistory] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  const [refreshing, setrefreshing] = useState<boolean>(false);
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false); // ✅

  const dispatch = useAppDispatch();

  const activeAudioId = useAppSelector(
    state => state.audioPlayer.activeAudioId,
  );

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const onRefresh = async () => {
    await handleGetHistoryAudios();
  };

  const handleAudioPress = (audio: any) => {
    dispatch(setActiveAudioId(audio?.id));
    navigation.navigate('AudiosPlayer', {audios: audio});
  };

  const handleGetHistoryAudios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await findHistoryByUserApi();
      if (response?.data) {
        const formatted = response.data
          .filter((item: any) => item.audio)
          .map((item: any) => ({
            ...item.audio,
            commentaire: item.audio.commentaire ?? [],
            likes: item.audio.likes ?? [],
            favoris: item.audio.favoris ?? [],
            views: item.audio.views ?? [],
            share: item.audio.share ?? [],
            eglise: item.audio.eglise ?? null,
          }));

        const uniqueAudiosMap = new Map();
        formatted.forEach((audio: any) => {
          uniqueAudiosMap.set(audio.id, audio);
        });

        const uniqueAudios = Array.from(uniqueAudiosMap.values());
        setHistory(uniqueAudios);
      }
    } catch (error) {
      console.error('Erreur historique :', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleGetHistoryAudios();
  }, [handleGetHistoryAudios]);

  // ✅ Filtrer les audios par titre
  const filteredAudios = useMemo(() => {
    return history.filter(audio =>
      audio?.titre?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText, history]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* ✅ BOUTON DE RETOUR */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0008" />
        </TouchableOpacity>

        {!showSearch ? (
          <>
            <Text style={styles.header}>🎧 Historique d’écoute</Text>
            <Ionicons
              name="search-outline"
              size={24}
              color="#0008"
              onPress={() => setShowSearch(true)}
            />
          </>
        ) : (
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un audio..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#888"
              autoFocus
            />
            <Ionicons
              name="close-circle"
              size={22}
              color="#888"
              onPress={() => {
                setShowSearch(false);
                setSearchText('');
              }}
            />
          </View>
        )}
      </View>

      {/* ✅ Texte : Nombre d’éléments */}
      {!showSearch && (
        <Text style={styles.subHeader}>
          {filteredAudios.length} élément{filteredAudios.length > 1 ? 's' : ''}
        </Text>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          // color="#0000ff"
          style={{marginTop: 20}}
        />
      ) : (
        <>
          {history?.length > 0 ? (
            <View
              style={{
                flex: 1,
                backgroundColor: backgroundStyle.backgroundColor,
                paddingTop: 5,
              }}>
              <FlatList
                data={filteredAudios}
                keyExtractor={(item, i) => i.toString()}
                ItemSeparatorComponent={() => (
                  <View style={{height: 10}}></View>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 3}} // ✅ ESPACEMENT GAUCHE/DROITE-
                renderItem={({item}) => (
                  <CardAudiosUI
                    audios={item}
                    navigation={navigation}
                    isPlaying={activeAudioId === item?.id}
                    onPress={() => handleAudioPress(item)}
                  />
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                ListFooterComponent={() =>
                  filteredAudios.length > 0 ? (
                    <View style={styles.footer}>
                      <Text style={styles.footerText}>
                        — Fin de l'historique —
                      </Text>
                    </View>
                  ) : null
                }
              />
            </View>
          ) : (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.footerText}>
                L'historique est vide pour le moment.
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  header: {
    fontWeight: 'bold',
    color: '#0008',
    marginBottom: 4,
    alignSelf: 'stretch',
    overflow: 'hidden',
    fontSize: 16,
    fontStyle: 'normal',
    flexWrap: 'wrap',
    marginLeft: 8,
  },
  subHeader: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    marginBottom: 10,
    marginLeft: 14,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#000',
  },
  footer: {
    marginTop: 20,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
  },
});
