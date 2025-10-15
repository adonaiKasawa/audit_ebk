import React, {useRef, useEffect, useState, useCallback, useMemo} from 'react';
import {View, FlatList, ViewToken, Image, useColorScheme} from 'react-native';
import {StackNavigationScreenProps} from '../../../components/props/props.navigation';
import colors from '../../../components/style/colors';
import {findTestimonialsPaginatedApi} from '../../api/testimonials/testimonials.req';
import {TestimonialStatusEnum, TypeContentEnum} from '../../config/enum';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import CommentUI from '../../../components/comment/comment.ui';
import LoadingGif from '../../../components/loading/loadingGif';
import PlayerTestimonialsScreen from '../player/player.testmonial.screen';
import path from '../../../components/image/path';
import * as RNFS from '@dr.pogodin/react-native-fs';
import debounce from 'lodash.debounce';
import {file_url} from '../../api';

interface Testimonial {
  id: number;
  link: string;
  cachedUri?: string;
  [key: string]: any; // si tu as d'autres propriétés
}

function TestimonialDetailScreen({
  navigation,
  route,
}: StackNavigationScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };
  const snapPoints = useMemo(() => ['50%', '80%'], []);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const {initialVideoId} = route.params; // vidéo cliquée depuis HomeImage

  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isCommented, setIsCommented] = useState<number>(0);

  const videoRefs = useRef<{[key: number]: any}>({});
  const [cachedVideos, setCachedVideos] = useState<{[key: number]: string}>({});

  const handlePresentModalPress = () => bottomSheetRef.current?.present();

  /** 📦 Préchargement et mise en cache d’une vidéo */
  const preloadVideo = useCallback(async (videoUrl: string, id: number) => {
    if (!videoUrl) return '';
    try {
      const fullUrl = videoUrl.startsWith('http')
        ? videoUrl
        : `${file_url}${videoUrl}`;
      const filename = fullUrl.split('/').pop();
      if (!filename) return fullUrl;

      const localPath = `${RNFS.CachesDirectoryPath}/${filename}`;
      const exists = await RNFS.exists(localPath);

      if (!exists) {
        await RNFS.downloadFile({fromUrl: fullUrl, toFile: localPath}).promise;
        console.log(`✅ Vidéo préchargée : ${filename}`);
      }
      setCachedVideos(prev => ({...prev, [id]: localPath}));
      return localPath;
    } catch (err) {
      console.warn('Erreur de préchargement :', err);
      return videoUrl; // fallback vers l’URL distante
    }
  }, []);

  /** 🔀 Mélange aléatoire pour effet TikTok */
  const shuffleVideoArray = (array: any[]) =>
    array
      .map(v => ({value: v, sort: Math.random()}))
      .sort((a, b) => a.sort - b.sort)
      .map(({value}) => value);

  const handleFindTestimonials = useCallback(async () => {
    if (currentPage < totalPages || totalPages === 0) {
      const find = await findTestimonialsPaginatedApi(currentPage + 1);
      if (find?.status === 200) {
        const approved = find.data.items.filter(
          (item: any) => item.status === TestimonialStatusEnum.APPROVED,
        );

        // Précharger chaque vidéo et récupérer son URI locale
        const updatedTestimonials = await Promise.all(
          approved.map(async item => {
            const cachedUri =
              cachedVideos[item.id] || (await preloadVideo(item.link, item.id));
            return {...item, cachedUri};
          }),
        );

        let orderedTestimonials: any[] = [];

        if (initialVideoId) {
          // Vérifie si la vidéo cliquée est dans le lot
          const clickedIndex = updatedTestimonials.findIndex(
            t => t.id === initialVideoId,
          );

          if (clickedIndex >= 0) {
            const clickedVideo = updatedTestimonials[clickedIndex];
            // On met la vidéo cliquée en premier
            orderedTestimonials = [
              clickedVideo,
              ...updatedTestimonials.slice(0, clickedIndex),
              ...updatedTestimonials.slice(clickedIndex + 1),
            ];
          } else {
            // Si la vidéo n’est pas trouvée dans ce lot → shuffle normal
            orderedTestimonials = shuffleVideoArray(updatedTestimonials);
          }
        } else {
          // Pas d’ID initial → shuffle normal
          orderedTestimonials = shuffleVideoArray(updatedTestimonials);
        }

        setTestimonials(prev => [...prev, ...orderedTestimonials]);

        if (currentPage === 0 && orderedTestimonials.length > 0) {
          setActivePostId(orderedTestimonials[0]?.id);
        }

        setCurrentPage(find.data.meta.currentPage);
        setTotalPages(find.data.meta.totalPages);
      }
    }
  }, [currentPage, totalPages, cachedVideos, preloadVideo, initialVideoId]);

  /** 🎯 Détection de l’item actif */
  const handleViewableItemsChanged = useCallback(
    debounce(({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems.length > 0) {
        const firstVisibleId = viewableItems[0].item.id;
        setActivePostId(prev =>
          prev !== firstVisibleId ? (setIsCommented(0), firstVisibleId) : prev,
        );
      }
    }, 200),
    [],
  );

  /** ▶️ Lecture / pause selon visibilité */
  useEffect(() => {
    Object.keys(videoRefs.current).forEach(key => {
      const numKey = Number(key);
      if (numKey === activePostId) videoRefs.current[numKey]?.play?.();
      else videoRefs.current[numKey]?.pause?.();
    });

    if (activePostId !== null) {
      const index = testimonials.findIndex(t => t.id === activePostId);
      testimonials
        .slice(index, index + 3)
        .forEach(item => preloadVideo(item.link, item.id));
    }
  }, [activePostId, testimonials, preloadVideo]);

  useEffect(() => {
    handleFindTestimonials();
  }, []);

  /** 🎥 Rendu optimisé avec React.memo */
  const renderItem = useCallback(
    ({item}: {item: Testimonial}) => (
      <PlayerTestimonialsScreen
        navigation={navigation}
        route={route}
        video={item}
        activePostId={activePostId}
        videoRef={(ref: any) => {
          if (ref) videoRefs.current[item.id] = ref;
        }}
        handlePresentModalPress={handlePresentModalPress}
        isCommented={isCommented}
      />
    ),
    [activePostId, isCommented],
  );

  return (
    <BottomSheetModalProvider>
      <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
        {testimonials.length > 0 ? (
          <FlatList
            data={testimonials}
            keyExtractor={item => String(item.id)}
            renderItem={renderItem}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            viewabilityConfig={{itemVisiblePercentThreshold: 50}}
            onViewableItemsChanged={handleViewableItemsChanged}
            onEndReached={handleFindTestimonials}
            onEndReachedThreshold={3}
            style={{flex: 1}}
            initialNumToRender={3}
            maxToRenderPerBatch={2}
            windowSize={5}
            removeClippedSubviews
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={path.LOGOEBK} style={{width: 200, height: 200}} />
            <LoadingGif width={50} height={50} />
          </View>
        )}
      </View>

      <BottomSheetModal ref={bottomSheetRef} snapPoints={snapPoints}>
        <BottomSheetView
          style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
          {activePostId !== null && (
            <CommentUI
              idFile={activePostId}
              typeFile={TypeContentEnum.testimonials}
              afterComment={setIsCommented}
            />
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

export default TestimonialDetailScreen;
