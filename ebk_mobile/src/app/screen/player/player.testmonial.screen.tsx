import React, {useCallback, useEffect, useRef, useState} from 'react';

import {
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  TextInput,
  Dimensions,
  LayoutChangeEvent,
  StyleSheet,
  Pressable,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  Share,
  ActivityIndicator,
} from 'react-native';
import {StackNavigationScreenProps} from '../../../components/props/props.navigation';
import colors from '../../../components/style/colors';
import PopoverMenu from '../../navigation/popover/popover.menu';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {file_url, front_url} from '../../api';
import Video, {OnBufferData, OnLoadData, VideoRef} from 'react-native-video';
import {isPaire} from '../../config/func';
import {useWindowDimensions} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import LoadingGif from '../../../components/loading/loadingGif';
import {useAppSelector} from '../../store/hooks';
import {selectAuth} from '../../store/auth/auth.slice';
import {jwtDecode} from 'jwt-decode';
import {PayloadUserInterface} from '../../config/interface';
import {createLikeFileApi, deleteLikeFileApi} from '../../api/like/like.req';
import {TypeContentEnum} from '../../config/enum';
import {
  createFavorisApi,
  deleteFavorisApi,
} from '../../api/favoris/favoris.req';
import SeekBarVideosPlayerUI from '../../../components/player/videos/seekbar.videos.player';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Width = Dimensions.get('screen').width;
const heights = Dimensions.get('screen').height;

function PlayerTestimonialsScreen({
  navigation,
  route,
  video,
  activePostId,
  handlePresentModalPress,
  isCommented,
}: any) {
  const insets = useSafeAreaInsets();
  const isDarkMode = useColorScheme() === 'dark';
  const screenIsFocused = useIsFocused();
  const auth = useAppSelector(selectAuth);
  const decode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = React.useState<PayloadUserInterface | undefined>(
    decode,
  );

  const previousWidth = Dimensions.get('screen').width;
  const previousHeight = Dimensions.get('screen').height;
  const [isHorizontal, setIsHorizontal] = useState<boolean>(
    previousWidth > previousHeight,
  );
  const videoRef = useRef<VideoRef | null>(null);
  const [paused, setpaused] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [isBuffering, setIsBuffering] = useState(false);

  const {height} = useWindowDimensions();
  const adjustedHeight =
    Platform.OS === 'ios' ? height - (insets.bottom + insets.top) : height;

  const [likes, setLikes] = useState<number>(video.likes.length);
  const [liked, setLiked] = useState<boolean>(false);
  const [loadinglike, setLoadingLike] = useState<boolean>(false);

  const [favoris, setFavoris] = useState<number>(video.favoris.length);
  const [favorised, setFavorised] = useState<boolean>(false);
  const [loadingFavoris, setLoadingFavoris] = useState<boolean>(false);

  const [shares, setShares] = useState<number>(video.share.length);
  const [shared, setShared] = useState<boolean>(false);
  const [loadingShare, setLoadingShare] = useState<boolean>(false);

  const [comment, setComment] = useState<number>(video.commentaire.length);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const likeIcon = () => {
    if (liked) {
      return loadinglike ? (
        <LoadingGif width={30} height={30} />
      ) : (
        <AntDesign name="heart" size={25} color={'red'} />
      );
    } else {
      return loadinglike ? (
        <LoadingGif width={30} height={30} />
      ) : (
        <AntDesign name="hearto" size={25} color={colors.white} />
      );
    }
  };

  const ShareIcon = () => {
    if (shared) {
      return loadingShare ? (
        <LoadingGif width={30} height={30} />
      ) : (
        <Feather name="share" size={25} color={'#f5c542'} />
      );
    } else {
      return loadingShare ? (
        <LoadingGif width={30} height={30} />
      ) : (
        <Feather name="share" size={25} color={colors.white} />
      );
    }
  };

  const FavoriIcon = () => {
    if (favorised) {
      return loadingFavoris ? (
        <LoadingGif width={30} height={30} />
      ) : (
        <AntDesign name="star" size={25} color={'#fcba05'} />
      );
    } else {
      return loadingFavoris ? (
        <LoadingGif width={30} height={30} />
      ) : (
        <AntDesign name="staro" size={25} color={colors.white} />
      );
    }
  };

  const checkIfUserLikedContent = React.useCallback(() => {
    if (user) {
      if (video.likes.find((item: any) => item.users?.id === user.sub))
        setLiked(true);
      if (video.favoris.find((item: any) => item.users?.id === user.sub))
        setFavorised(true);
      if (video.share.find((item: any) => item.users?.id === user.sub))
        setShared(true);
    }
  }, []);

  const handleToggleLikesContent = async () => {
    if (auth.isAuthenticated) {
      setLoadingLike(true);
      if (liked) {
        await deleteLikeFileApi(video.id);
        setLikes(likes - 1);
        setLiked(false);
      } else {
        await createLikeFileApi(video.id, TypeContentEnum.testimonials);
        setLikes(likes + 1);
        setLiked(true);
      }
      setLoadingLike(false);
    } else {
      Alert.alert(
        'Connexion requise',
        'Votre interaction est précieuse. Connectez-vous pour aimer le contenu.',
        [
          {
            text: 'SE CONNECTER',
            onPress: () => {
              navigation.navigate('Account', {
                screen: 'signIn',
              });
            },
            style: 'cancel',
          },
          {text: 'ANNULER', onPress: () => {}},
        ],
      );
    }
  };

  const handleToggleFavorisContent = async () => {
    if (auth.isAuthenticated) {
      setLoadingFavoris(true);
      if (favorised) {
        await deleteFavorisApi(video.id);
        setFavoris(favoris - 1);
        setFavorised(false);
      } else {
        await createFavorisApi(TypeContentEnum.testimonials, video.id);
        setFavoris(favoris + 1);
        setFavorised(true);
      }
      setLoadingFavoris(false);
    } else {
      Alert.alert(
        'Connexion requise',
        'Votre interaction est précieuse. Connectez-vous SVP.',
        [
          {
            text: 'SE CONNECTER',
            onPress: () => {
              navigation.navigate('Account', {
                screen: 'signIn',
              });
            },
            style: 'cancel',
          },
          {text: 'ANNULER', onPress: () => {}},
        ],
      );
    }
  };

  const handleToggleSharedContent = async () => {
    if (auth.isAuthenticated) {
      try {
        const result = await Share.share({
          message: `${front_url}share?s_share_code=${video.sharecode}&u_user=${
            user?.username ? user?.username : 'any_user'
          }&t_type_file=${TypeContentEnum.testimonials}`,
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error: any) {
        Alert.alert(error.message);
      }
    } else {
      Alert.alert(
        'Connexion requise',
        'Votre interaction est précieuse. Connectez-vous SVP.',
        [
          {
            text: 'SE CONNECTER',
            onPress: () => {
              navigation.navigate('Account', {
                screen: 'signIn',
              });
            },
            style: 'cancel',
          },
          {text: 'ANNULER', onPress: () => {}},
        ],
      );
    }
  };

  React.useEffect(() => {
    checkIfUserLikedContent();
  }, [checkIfUserLikedContent]);

  const onLayout = ({nativeEvent: {layout}}: LayoutChangeEvent) => {
    if (layout.width > layout.height) {
      setIsHorizontal(true);
    } else {
      setIsHorizontal(false);
    }
  };

  const handleLoad = (meta: OnLoadData) => {
    setDuration(meta.duration);
  };

  const onBuffer = (e: OnBufferData) => {};

  const onError = () => {};

  const onPaused = () => {
    setpaused(!paused);
    if (!videoRef.current) {
      return;
    }

    if (paused) {
      videoRef.current.resume();
    } else {
      videoRef.current.pause();
    }
  };

  const handleGetCurrentPosition = async (data: {currentTime: number}) => {
    setCurrentPosition(data.currentTime);
  };

  const onSlidingStart = (value: number) => {
    // setIsSliding(true);
  };
  const onSlidingComplete = (value: number) => {
    if (!!videoRef.current) {
      // setIsSliding(false);
      setCurrentPosition(value);
      videoRef.current.seek(value);
    }
  };

  const handlePlaying = () => {
    if (!videoRef.current) {
      return;
    }

    if (activePostId !== video.id) {
      videoRef.current.pause();
      setpaused(true);
      videoRef.current.seek(0);
      setCurrentPosition(0);
    }

    if (activePostId === video.id) {
      if (screenIsFocused) {
        videoRef.current.resume();
        setpaused(false);
        if (isCommented !== 0) {
          setComment(prev => prev + 1);
        }
      } else {
        videoRef.current.pause();
        setpaused(true);
      }
    }
  };

  React.useEffect(() => {
    handlePlaying();

    return () => {};
  }, [activePostId, videoRef.current, isCommented]);

  useFocusEffect(
    useCallback(() => {
      // Lorsque l'écran est focalisé
      handlePlaying();

      return () => {
        // Lorsque l'écran est défocalisé
        if (!!videoRef.current) {
          // setpaused(true);
          videoRef.current.pause();
        }
      };
    }, []),
  );

  return (
    <View
      style={{
        height: adjustedHeight,
        backgroundColor: colors.black,
        marginTop: 0,
      }}>
      {isBuffering && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: colors.red,
            zIndex: 15,
          }}>
          <ActivityIndicator size="large" color="#ffffff" />
          {/* <Text style={{ color: colors.white, fontSize: 25 }}>Buffering...</Text> */}
        </View>
      )}
      <Video
        // source={{uri: `${video.cachedUri}`}}
        source={{
          uri: video?.cachedUri?.startsWith('http') // si URL distante
            ? video?.cachedUri
            : Platform.OS === 'android'
            ? video?.cachedUri
            : `file://${video?.cachedUri}`,
        }}
        style={[StyleSheet.absoluteFill]}
        volume={1}
        resizeMode="cover"
        controls={false}
        repeat={true}
        ref={videoRef}
        onBuffer={({isBuffering}) => {
          setIsBuffering(isBuffering);
        }}
        onError={e => console.log('Video error:', e)}
        onLoadStart={e => {}}
        onLoad={handleLoad}
        onProgress={handleGetCurrentPosition}
        playInBackground={false}
        playWhenInactive={false}
      />

      <Pressable
        style={[
          StyleSheet.absoluteFill,
          {justifyContent: 'center', alignItems: 'center'},
        ]}
        onPress={() => {
          onPaused();
        }}>
        <View
          style={{
            padding: 10,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            display: paused ? 'flex' : 'none',
          }}>
          <FontAwesome5 name="play" size={40} color={colors.white} />
        </View>
      </Pressable>
      <View
        style={[
          StyleSheet.absoluteFill,
          {height: 50, justifyContent: 'center', paddingHorizontal: 10},
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <PopoverMenu navigation={navigation} />
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('TestimonialsUpload');
                navigation.navigate('TestimonialsPublish', {
                  screen: 'TestimonialsPublish',
                });
              }}
              style={{
                height: 40,
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.blackrgba,
                borderRadius: 25,
              }}>
              <Feather name="camera" size={24} color={colors.lighter} />
            </TouchableOpacity>

            {user && auth.isAuthenticated && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ProfileScreen');
                }}
                style={{
                  height: 40,
                  width: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.blackrgba,
                  borderRadius: 25,
                }}>
                {user.profil ? (
                  <Image
                    source={{uri: `${file_url}${user?.profil}`}}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 25,
                    }}
                  />
                ) : (
                  <Feather name="user" size={24} color={colors.lighter} />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <View style={{position: 'absolute', right: 10, bottom: 150, width: 60}}>
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 30,
          }}>
          <TouchableOpacity
            onPress={handleToggleLikesContent}
            style={styles.button}>
            {likeIcon()}
            <Text style={{color: colors.white, elevation: 3}}>{likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePresentModalPress}
            style={styles.button}>
            <Feather name="message-square" size={30} color={colors.white} />
            <Text style={{color: colors.white, elevation: 3}}>{comment}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToggleFavorisContent}
            style={styles.button}>
            {FavoriIcon()}
            <Text style={{color: colors.white, elevation: 3}}>{favoris}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToggleSharedContent}
            style={styles.button}>
            {ShareIcon()}
            <Text style={{color: colors.white, elevation: 3}}>{shares}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          left: 10,
          bottom: 120,
          width: Width - 75,
        }}>
        <View
          style={{flex: 1, flexDirection: 'row', gap: 5, alignItems: 'center'}}>
          <Image
            source={{uri: `${file_url}${video?.users?.profil}`}}
            style={{
              width: 30,
              height: 30,
              borderRadius: 25,
            }}
          />
          <View style={{flex: 3}}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{color: colors.white}}>
              {video?.users?.nom} {video?.users?.prenom}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{color: colors.white, fontWeight: 'bold'}}>
              {video.users
                ? '@' + video?.users?.username ||
                  video?.users?.nom + video?.users?.prenom
                : ''}
            </Text>
            {/* <Text numberOfLines={1} ellipsizeMode="tail" style={{ color: colors.white, fontSize: 12 }}>
              134 M membres
            </Text> */}
          </View>
          {/* <View style={{ flex: 1 }}>
            <TouchableOpacity style={{ backgroundColor: colors.white, padding: 5, borderRadius: 15, }}>
              <Text style={{ color: colors.black, textAlign: 'center' }}>Suivres</Text>
            </TouchableOpacity>
          </View> */}
        </View>
        <View style={{flex: 1, marginTop: 5}}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{color: colors.white, fontSize: 11}}>
            {video.description}
          </Text>
          {/* <View style={{ flexDirection: "row", gap: 20, alignItems: 'center' }}>
            <>
              <Image
                source={require("../../../../assets/img/img1.jpeg")}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10
                }}
              />
              <Image
                source={require("../../../../assets/img/img3.jpeg")}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  position: 'absolute',
                  left: 10
                }}
              />
              <Image
                source={require("../../../../assets/img/img2.jpeg")}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  position: 'absolute',
                  left: 15
                }}
              />
            </>
            <Text style={{ color: colors.white, fontSize: 10 }}>
              Ont aimer récemment
            </Text>
          </View> */}
        </View>
      </View>
      <View style={{position: 'absolute', left: 10, right: 10, bottom: 90}}>
        <SeekBarVideosPlayerUI
          currentPosition={currentPosition}
          counter={true}
          trackLength={duration}
          onSeek={onSlidingComplete}
          onSlidingStart={onSlidingStart}
        />
      </View>
    </View>
  );
}
export default PlayerTestimonialsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.red,
    padding: 0,
  },
  button: {
    padding: 10,
    borderRadius: 30,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    backgroundColor: 'black',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
