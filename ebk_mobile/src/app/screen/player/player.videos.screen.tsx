import {
  Alert,
  Dimensions,
  Image,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
// import Video from 'react-native-video';

// import VideoPlayer from 'react-native-media-console';
import {HttpRequest, file_url} from '../../api';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import colors from '../../../components/style/colors';
import VideoPlayer from 'react-native-video-controls';
import LinearGradient from 'react-native-linear-gradient';
import ActionContent from '../../../components/actions_content/actions.content.ui';
import HomeVideosScreen from '../home/videos/home.videos.screen';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {selectAuth} from '../../store/auth/auth.slice';
import {jwtDecode} from 'jwt-decode';
import {TypeContentEnum} from '../../config/enum';
import {findFilesPaginatedApi} from '../../api/library/library';
import {updateFiles} from '../../store/files/files.slice';
import {ItemVideos} from '../../config/interface';
import moment from 'moment';
import WebView from 'react-native-webview';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import CommentUI from '../../../components/comment/comment.ui';
import {addViewConentApi} from '../../api/view';
import {addViewToVideoWatch} from '../../store/datahome/home.video.slice';

const width = Dimensions.get('screen').width;

export default function VideosPlayerScreen({navigation, route}: any) {
  const previousWidth = Dimensions.get('screen').width;
  const previousHeight = Dimensions.get('screen').height;
  const [isHorizontal, setIsHorizontal] = useState<boolean>(
    previousWidth > previousHeight,
  );
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const userDecode = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = useState<any>(userDecode);
  const [typeContent, setTypeContent] = useState<string>('ImagesHome');
  const [loading, setLoading] = useState<boolean>(false);
  const isDarkMode = useColorScheme() === 'dark';
  const [videos, setVideos] = useState<any>([]);
  // const video: ItemVideos = route.params?.video;
  const [links, setLinks] = useState<{
    first: string;
    previous: string;
    next: string;
    last: string;
  }>({
    first: '',
    previous: '',
    next: '',
    last: '',
  });
  const [url, setUrl] = useState<string>('');

  const videosFromStore = useAppSelector(state => state.homevideos.videos);
  const videoId = route.params?.video?.id;

  const video: ItemVideos = videosFromStore.find(v => v.id === videoId)!;

  const viewCount = video?.views?.length ?? 0;

  const [commentCount, setCommentCount] = useState<any>(
    video.commentaire?.length || 0,
  );

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const snapPoints = React.useMemo(() => ['100%', '100%'], []);

  const bottomSheetRef = React.useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = React.useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleSheetChanges = React.useCallback((index: number) => {}, []);

  const onLayout = ({nativeEvent: {layout}}: LayoutChangeEvent) => {
    if (layout.width > layout.height) {
      setIsHorizontal(true);
    } else {
      setIsHorizontal(false);
    }
  };

  const onBuffer = () => {};

  const onError = () => {};

  const handleAfterComment = (value: React.SetStateAction<number>) => {
    setCommentCount(value);
  };

  const handleGetFiles = useCallback(async (links: string = '') => {
    setLoading(true);
    const getFiles =
      links === ''
        ? await findFilesPaginatedApi(0, TypeContentEnum.videos)
        : await HttpRequest(links, 'GET');
    setLoading(false);
    if (getFiles?.hasOwnProperty('data')) {
      if (getFiles?.data?.items?.length > 0) {
        // if (getFiles?.data?.items?.length !== storeFiles.videos.length && !getFiles?.data?.items?.every((value: any, index: number) => value === storeFiles.videos[index])) {
        //   setFiles([...files, ...getFiles?.data?.items]);
        //   dispatch(updateFiles({
        //      file: getFiles?.data?.items,
        //      type: fileType
        //    }));
        // }else{
        setVideos([...videos, ...getFiles?.data?.items]);

        // }
        setLinks(getFiles?.data?.links);
      } else {
        dispatch(
          updateFiles({
            file: [],
            type: typeContent,
          }),
        );
      }
    }
  }, []);

  useEffect(() => {
    let isMount = true;
    if (isMount) {
    }
    return () => {
      isMount = false;
    };
  }, []);

  useEffect(() => {
    let isMount = true;

    if (isMount) {
      let iframe = video?.lien.split(' ');
      if (!video?.interne) {
        if (iframe[3] && iframe[3].search('src') > -1) {
          setUrl(iframe[3]);
        } else if (iframe[1] && iframe[1].search('src') > -1) {
          setUrl(iframe[1]);
        }
      }
      handleGetFiles();

      // ✅ 2. Ajouter une vue
      addViewToVideo();
    }
    return () => {
      isMount = false;
    };
  }, [handleGetFiles]);

  const addViewToVideo = async () => {
    if (!user?.sub) return;

    const hasAlreadyViewed = video?.views?.some(
      (view: any) => view.usersId === user.sub,
    );

    if (hasAlreadyViewed) {
      console.log('L’utilisateur a déjà vu cette vidéo, aucune vue ajoutée.');
      return;
    }

    try {
      const addView = await addViewConentApi(video.id, TypeContentEnum.videos);

      if (addView?.data?.message === 'Vous avez déjà vu ce contenu.') {
        console.log('Réponse serveur : vue déjà enregistrée');
      } else {
        dispatch(
          addViewToVideoWatch({
            videoId: video.id,
            view: {
              id: video.id, // l'id
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              deletedAt: null, // ✅ objet Date
              usersId: user.sub,
              videosId: video.id,
            },
          }),
        );
      }
    } catch (error) {
      console.log("Erreur lors de l'ajout de la vue :", error);
    }
  };

  return (
    <BottomSheetModalProvider>
      <View
        style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}
        onLayout={onLayout}>
        <View style={{flex: 1}}>
          {video.interne ? (
            <VideoPlayer
              controls={true}
              source={{uri: `${file_url}${video.lien}`}}
              onBuffer={onBuffer}
              onError={onError}
              onEnterFullscreen={() => {
                setIsHorizontal(true);
              }}
              style={styles.backgroundVideo}
              resizeMode={'stretch'}
              navigator={navigation}
            />
          ) : (
            <WebView
              source={{
                html: `<iframe width="100%" height="100%" ${url}  frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
              }}
              style={{
                backgroundColor: backgroundStyle.backgroundColor,
                flex: 1,
              }}
            />
          )}
        </View>

        <View
          style={{
            flex: isHorizontal ? 0 : 2,
            display: isHorizontal ? 'none' : undefined,
          }}>
          <LinearGradient
            colors={[colors.gris, isDarkMode ? colors.primary : colors.white]}
            start={{x: 0.5, y: 0.1}}
            end={{x: 0.5, y: 0.9}}
            style={{
              width: '100%',
              // height: 100,
              padding: 10,
            }}>
            <Text
              style={{color: colors.lighter, fontWeight: 'bold', fontSize: 20}}>
              {video.titre}
            </Text>
            <Text style={{color: colors.secondary, fontSize: 15}}>
              {/* 4.4k vues . */}
              {viewCount} {viewCount > 1 ? 'Vues. ' : 'Vue. '}
              {moment(video.createdAt).fromNow()}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                marginTop: 20,
              }}>
              <Image
                source={{uri: `${file_url}${video.eglise.photo_eglise}`}}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                }}
              />
              <View style={{alignItems: 'center'}}>
                <Text
                  ellipsizeMode="tail"
                  style={{
                    color: isDarkMode ? colors.light : colors.primary,
                    fontSize: 15,
                    fontWeight: '500',
                  }}>
                  {video.eglise.nom_eglise}
                </Text>
                {/* <Text style={{ color: colors.gris, fontSize: 12, }}>
            54.6 k membres
          </Text> */}
              </View>
            </View>
            <View style={{height: 50}}>
              <ActionContent
                handlePresentModalPress={handlePresentModalPress}
                navigation={navigation}
                content={video}
                typeContent={TypeContentEnum.videos}
                commentCount={commentCount}
              />
            </View>
          </LinearGradient>

          <View style={{flex: 1}}>
            <HomeVideosScreen
              navigation={navigation}
              route={route}
              videos={videos}
            />
          </View>
        </View>

        <BottomSheetModal
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          snapPoints={snapPoints}>
          <BottomSheetView
            style={{
              flex: 1,
              backgroundColor: backgroundStyle.backgroundColor,
            }}>
            <CommentUI
              idFile={video.id}
              typeFile={TypeContentEnum.videos}
              afterComment={handleAfterComment}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  backgroundVideo: {
    width: '100%',
    height: '100%',
  },
});
