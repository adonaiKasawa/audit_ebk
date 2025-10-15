import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  useColorScheme,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';
import colors from '../../../components/style/colors';
import Feather from 'react-native-vector-icons/Feather';
import {findPanoramaApi} from '../../api/panorama/panorama.req';
import {typePanoramaEnum} from '../../config/enum';

const {width} = Dimensions.get('window');

interface PanoramaVideo {
  id: number;
  title: string;
  url: string;
  description?: string;
  iframe?: string;
}

const BiblePanoramaNewScreen = ({navigation}: {navigation: any}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [videos, setVideos] = useState<PanoramaVideo[]>([]);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const backgroundColor = isDarkMode ? colors.primary : colors.white;
  const textColor = isDarkMode ? colors.white : colors.black;
  const subTextColor = isDarkMode ? colors.whitergba6 : colors.gris;
  const inputBackground = isDarkMode ? colors.secondary : colors.light;

  const handleGetPanorama = useCallback(async () => {
    setLoading(true);
    try {
      const response = await findPanoramaApi(typePanoramaEnum?.New_Testament);
      const data = response?.data ?? [];

      const formatted = data.map((item: PanoramaVideo) => {
        let youtubeId = '';
        if (item.url.includes('youtu.be/')) {
          youtubeId = item.url.split('youtu.be/')[1].split('?')[0];
        } else if (item.url.includes('youtube.com/watch?v=')) {
          youtubeId = item.url.split('v=')[1].split('&')[0];
        }

        return {
          ...item,
          iframe: `<iframe width="100%" height="100%" 
                    src="https://www.youtube.com/embed/${youtubeId}?autoplay=1" 
                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; 
                    encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen style="background:black;"></iframe>`,
        };
      });

      setVideos(formatted);
    } catch (error) {
      console.error('Erreur API panorama : ', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleGetPanorama();
  }, [handleGetPanorama]);

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  const renderVideo = ({item}: {item: PanoramaVideo}) => {
    const isActive = item.id === activeVideoId;
    const youtubeId = item.url.includes('youtu.be/')
      ? item.url.split('youtu.be/')[1].split('?')[0]
      : item.url.includes('youtube.com/watch?v=')
      ? item.url.split('v=')[1].split('&')[0]
      : '';

    const videoIframe = `<iframe width="100%" height="100%" 
      src="https://www.youtube.com/embed/${youtubeId}?${
      isActive ? 'autoplay=1' : ''
    }" frameborder="0" allow="accelerometer; autoplay; clipboard-write; 
      encrypted-media; gyroscope; picture-in-picture" allowfullscreen 
      style="background:black;"></iframe>`;

    return (
      <TouchableOpacity
        style={styles.videoBlock}
        activeOpacity={0.8}
        onPress={() => setActiveVideoId(isActive ? null : item.id)}>
        <View style={styles.videoAndText}>
          <View style={styles.videoContainer}>
            <WebView
              javaScriptEnabled
              domStorageEnabled
              source={{html: videoIframe}}
              style={styles.video}
              originWhitelist={['*']}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.title, {color: textColor}]} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={[styles.subText, {color: subTextColor}]}>
              Chaîne Biblique
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor}]}>
      {/* Header */}
      <View style={[styles.headerRow, {backgroundColor}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Feather name="arrow-left" size={26} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: textColor}]}>
          Nouveau Testament
        </Text>
        <TouchableOpacity
          onPress={() => setShowSearch(prev => !prev)}
          style={styles.searchIconButton}>
          <Feather name="search" size={24} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* Barre de recherche */}
      {showSearch && (
        <View style={[styles.searchContainer, {backgroundColor}]}>
          <TextInput
            placeholder="Rechercher une vidéo..."
            placeholderTextColor={subTextColor}
            value={searchText}
            onChangeText={setSearchText}
            style={[
              styles.searchInput,
              {color: textColor, backgroundColor: inputBackground},
            ]}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              style={{marginLeft: 8}}>
              <Feather name="x" size={20} color={subTextColor} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Loader */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{color: textColor, marginTop: 10}}>
            Chargement des vidéos...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredVideos}
          keyExtractor={item => item.id.toString()}
          renderItem={renderVideo}
          contentContainerStyle={{paddingBottom: 24}}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default BiblePanoramaNewScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  backButton: {marginRight: 12},
  headerTitle: {fontSize: 18, fontWeight: 'bold', flexShrink: 1},
  searchIconButton: {marginLeft: 'auto'},
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchInput: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  videoBlock: {marginBottom: 16, paddingHorizontal: 12},
  videoAndText: {flexDirection: 'row', alignItems: 'center'},
  videoContainer: {
    width: width * 0.45,
    height: (width * 0.45 * 9) / 16,
    backgroundColor: '#000',
    overflow: 'hidden',
    borderRadius: 8,
  },
  video: {width: '100%', height: '100%'},
  textContainer: {flex: 1, paddingLeft: 12},
  title: {fontSize: 16, fontWeight: '600', marginBottom: 4},
  subText: {fontSize: 13},
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
