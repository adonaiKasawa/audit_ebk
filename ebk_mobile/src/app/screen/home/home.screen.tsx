import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from 'react-native';
import colors from '../../../components/style/colors';
import HomeImagesScreen from './images/home.images.screen';
import HomeVideosScreen from './videos/home.videos.screen';
import HomeAudiosScreen from './audios/home.audios.screen';
import HomeBooksScreen from './books/home.books.screen';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {findFilesPaginatedApi} from '../../api/library/library';
import {file_url, HttpRequest} from '../../api';
import {TestimonialStatusEnum, TypeContentEnum} from '../../config/enum';
import {updateFiles} from '../../store/files/files.slice';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import CommentUI from '../../../components/comment/comment.ui';
import {ListenNotification} from '../../natification/config';
import HomeAnnoncesScreen from './annonces/home.annonce.screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {setVideos} from '../../store/datahome/home.video.slice';
import {appendImages} from '../../store/datahome/home.image.slice';
import {setLivres} from '../../store/datahome/home.book.slice';
import {setAudios} from '../../store/datahome/home.audio.slice';
import {BlockedContent, ItemVideos} from '../../config/interface';
import {findTestimonialsPaginatedApi} from '../../api/testimonials/testimonials.req';
import {setTestimonials} from '../../store/datahome/home.testimonials.slice';
import * as RNFS from '@dr.pogodin/react-native-fs';
import MenuOptionsUI from '../../../components/menuoptions/MenuOptionsUI';
import {findBlockContentByUserApi} from '../../api/blocks/bloack.content.api';

function HomeScreen({navigation, route}: any) {
  const dispatch = useAppDispatch();

  const [typeContent, setTypeContent] = React.useState<string>('ImagesHome');
  const [loading, setLoading] = React.useState<boolean>(false);

  const [isBottomSheetOpen, setIsBottomSheetOpen] = React.useState(false);
  const [cachedVideos, setCachedVideos] = React.useState<{
    [key: number]: string;
  }>({});

  const [typeContentForBottomSheet, setTypeContentForBottomSheet] =
    React.useState<TypeContentEnum>(TypeContentEnum.images);
  const [contentIdForBottomSheet, setContentIdForBottomSheet] =
    React.useState<number>(0);

  const [blockedContent, setBlockedContent] = React.useState<BlockedContent[]>(
    [],
  );
  const [links, setLinks] = React.useState({
    first: '',
    previous: '',
    next: '',
    last: '',
  });

  const videos = useAppSelector(state => state.homevideos.videos);
  const images = useAppSelector(state => state.homeimages.images);
  const livres = useAppSelector(state => state.homebooks.livres);
  const audios = useAppSelector(state => state.homeaudios.audios);
  const testimonials = useAppSelector(
    state => state.hometestimonial.testimonials,
  );

  const [currentMode, setCurrentMode] = React.useState<'menu' | 'comments'>(
    'menu',
  );

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const typeContentHome = [
    {text: 'Images', route: 'ImagesHome'},
    {text: 'Vidéos', route: 'VideosHome'},
    {text: 'Audios', route: 'AudiosHome'},
    {text: 'Livres', route: 'BooksHome'},
  ];

  const snapPoints = React.useMemo(() => ['50%', '100%'], []);
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);

  const handlePresentModalPress = React.useCallback(
    (
      mode: 'menu' | 'comments',
      typeContent: TypeContentEnum,
      idFile: number,
    ) => {
      setCurrentMode(mode);
      setTypeContentForBottomSheet(typeContent);
      setContentIdForBottomSheet(idFile);
      bottomSheetRef.current?.present();
    },
    [],
  );

  const handleGetBlockedContents = React.useCallback(async () => {
    try {
      const response = await findBlockContentByUserApi();
      if (Array.isArray(response?.data)) {
        setBlockedContent(response.data);
      } else {
        setBlockedContent([]); // toujours un tableau pour éviter .some() undefined
        console.warn('blockedContent non valide :', response?.data);
      }
    } catch (err) {
      setBlockedContent([]); // fallback
      console.warn('Erreur récupération blockedContent :', err);
    }
  }, []);

  React.useEffect(() => {
    handleGetBlockedContents();
  }, [handleGetBlockedContents]);

  const handelGetFiles = React.useCallback(
    async (typeContent: TypeContentEnum, links: string = '') => {
      setLoading(true);
      const getFiles =
        links === ''
          ? await findFilesPaginatedApi(0, typeContent)
          : await HttpRequest(links, 'GET');
      setLoading(false);
      if (getFiles?.hasOwnProperty('data')) {
        if (getFiles?.data?.items?.length > 0) {
          switch (typeContent) {
            case TypeContentEnum.images:
              dispatch(appendImages(getFiles.data.items));
              break;
            case TypeContentEnum.videos:
              const randomVideo: any[] = shuffleVideoArray(
                getFiles.data.items as any[],
              );
              dispatch(setVideos(randomVideo));
              break;
            case TypeContentEnum.livres:
              dispatch(setLivres(getFiles.data.items));
              break;
            case TypeContentEnum.audios:
              dispatch(setAudios(getFiles.data.items)); // global state
              break;
          }
          setLinks(getFiles.data.links);
        } else {
          dispatch(updateFiles({file: [], type: typeContent}));
        }
      }
    },
    [],
  );

  const preloadVideo = React.useCallback(
    async (videoUrl: string, id: number) => {
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
          await RNFS.downloadFile({fromUrl: fullUrl, toFile: localPath})
            .promise;
          console.log(`✅ Vidéo préchargée : ${filename}`);
        }
        setCachedVideos(prev => ({...prev, [id]: localPath}));
        return localPath;
      } catch (err) {
        console.warn('Erreur de préchargement :', err);
        return videoUrl;
      }
    },
    [],
  );

  const handelGetTestimonials = React.useCallback(async () => {
    try {
      const find = await findTestimonialsPaginatedApi(1); // récupération simple
      if (find?.status === 200) {
        const approved = find.data.items.filter(
          (item: any) => item.status === TestimonialStatusEnum.APPROVED,
        );

        // Précharger les vidéos et ajouter cachedUri
        const updatedTestimonials = await Promise.all(
          approved.map(async (item: any) => {
            const cachedUri =
              cachedVideos[item.id] || (await preloadVideo(item.link, item.id));
            return {...item, cachedUri};
          }),
        );

        // Mélange aléatoire
        const shuffledTestimonials = updatedTestimonials
          .map(v => ({value: v, sort: Math.random()}))
          .sort((a, b) => a.sort - b.sort)
          .map(({value}) => value);

        dispatch(setTestimonials(shuffledTestimonials));
      }
    } catch (err) {
      console.warn('Erreur lors du chargement des témoignages :', err);
    }
  }, [cachedVideos, preloadVideo, dispatch]);

  // function shuffleArray(array: ItemPicture[]): ItemPicture[] {
  //   return array
  //     .map((value: ItemPicture) => ({value, sort: Math.random()}))
  //     .sort((a, b) => a.sort - b.sort)
  //     .map(({value}) => value);
  // }

  function shuffleVideoArray(array: ItemVideos[]): ItemVideos[] {
    return array
      .map((value: ItemVideos) => ({value, sort: Math.random()}))
      .sort((a, b) => a.sort - b.sort)
      .map(({value}) => value);
  }

  // Exemple d'utilisation :

  React.useEffect(() => {
    let isMount = true;
    if (isMount) {
      handelGetFiles(TypeContentEnum.images);
      handelGetFiles(TypeContentEnum.videos);
      handelGetFiles(TypeContentEnum.audios);
      handelGetFiles(TypeContentEnum.livres);
      handelGetTestimonials();
    }
    return () => {
      isMount = false;
    };
  }, []);

  React.useEffect(() => {
    ListenNotification(navigation);
  });

  const goToContentType = (route: string) => setTypeContent(route);
  const filteredImages = React.useMemo(() => {
    const blocked = blockedContent ?? []; // si undefined, on met un tableau vide
    if (blocked.length === 0) return images;

    return images?.filter(img => {
      const isBlocked = blocked.some(
        b => b?.contentType === 'images' && b?.contentId === img?.id,
      );
      return !isBlocked;
    });
  }, [images, blockedContent]);

  const combinedItems = React.useMemo(() => {
    const imgs = filteredImages?.map(img => ({...img, type: 'image'})) ?? [];
    const tests =
      testimonials?.map(test => ({...test, type: 'testimonial'})) ?? [];

    // ✅ On attend que les deux existent avant de mélanger
    if (imgs.length === 0 || tests.length === 0) {
      return [];
    }

    const interval = Math.floor(imgs.length / tests.length) || 1; // ratio images/tests
    const result: any[] = [];

    let testIndex = 0;

    imgs.forEach((img, i) => {
      result.push(img);

      // 🔹 Placement des testimonials avec interval + hasard
      if ((i + 1) % interval === 0 && testIndex < tests.length) {
        // 50% de chances de placer le testimonial à cet endroit
        if (Math.random() > 0.5) {
          result.push(tests[testIndex]);
          testIndex++;
        }
      }
    });

    // 🔹 Si jamais il reste des testimonials non insérés → les mettre à la fin
    while (testIndex < tests.length) {
      result.push(tests[testIndex]);
      testIndex++;
    }

    return result;
  }, [testimonials, filteredImages]);

  const RenderContenteForType = () => {
    switch (typeContent) {
      case 'ImagesHome':
        return (
          <HomeImagesScreen
            handlePresentModalPress={handlePresentModalPress}
            handelGetFiles={handelGetFiles}
            navigation={navigation}
            route={route}
            images={combinedItems}
            links={links}
          />
        );
      case 'VideosHome':
        return (
          <HomeVideosScreen
            handelGetFiles={handelGetFiles}
            navigation={navigation}
            route={route}
            videos={videos}
          />
        );
      case 'AudiosHome':
        return (
          <HomeAudiosScreen
            handelGetFiles={handelGetFiles}
            navigation={navigation}
            route={route}
            audios={audios}
          />
        );
      case 'BooksHome':
        return (
          <HomeBooksScreen
            handelGetFiles={handelGetFiles}
            navigation={navigation}
            route={route}
            livres={livres}
          />
        );
    }
  };

  return (
    <BottomSheetModalProvider>
      <ScrollView
        style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
        <HomeAnnoncesScreen navigation={navigation} />
        <View style={{paddingHorizontal: 10, marginVertical: 10}}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {typeContentHome.map((item, i) => (
              <TouchableOpacity
                key={item.route}
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 16,
                  borderRadius: 10,
                  backgroundColor:
                    typeContent === item.route
                      ? isDarkMode
                        ? colors.white
                        : colors.primary
                      : isDarkMode
                      ? colors.secondary
                      : colors.light,
                  marginHorizontal: i === 0 ? 0 : 8,
                  marginRight: 8,
                }}
                onPress={() => goToContentType(item.route)}>
                <Text
                  style={{
                    color:
                      typeContent === item.route
                        ? isDarkMode
                          ? colors.primary
                          : colors.light
                        : isDarkMode
                        ? colors.light
                        : colors.secondary,
                    fontSize: 16,
                    fontWeight: '500',
                  }}>
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {RenderContenteForType()}
        <BottomSheetModal
          onDismiss={() => setIsBottomSheetOpen(false)}
          onChange={index => setIsBottomSheetOpen(index !== -1)} // -1 = fermée
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={1}
          style={{paddingBottom: 200}}>
          {/* <BottomSheetView
            style={{
              flex: 1,
              backgroundColor: backgroundStyle.backgroundColor,
              paddingBottom: 100,
            }}>
            <CommentUI
              idFile={contentIdForBottomSheet}
              typeFile={typeContentForBottomSheet}
            />
          </BottomSheetView> */}
          <BottomSheetView style={{flex: 1}}>
            {currentMode === 'menu' ? (
              <MenuOptionsUI
                idFile={contentIdForBottomSheet}
                typeFile={typeContentForBottomSheet} // ← Ajouté
                onClose={() => bottomSheetRef.current?.dismiss()}
              />
            ) : (
              <CommentUI
                idFile={contentIdForBottomSheet}
                typeFile={typeContentForBottomSheet}
              />
            )}
          </BottomSheetView>
        </BottomSheetModal>
        {/* <View style={{ height: 200 }} /> */}
        <View style={{height: 110}} />
      </ScrollView>
      {!isBottomSheetOpen && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 10,
            zIndex: 10,
            bottom: 110,
            backgroundColor: isDarkMode ? colors.white : colors.black,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('QuestionSuggestionScreen')}>
          <MaterialCommunityIcons
            color={isDarkMode ? colors.black : colors.white}
            size={50}
            name="progress-question"
          />
        </TouchableOpacity>
      )}
    </BottomSheetModalProvider>
  );
}

export default HomeScreen;
