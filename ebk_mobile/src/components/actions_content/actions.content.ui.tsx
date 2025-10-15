/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
import {
  Alert,
  Share,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../style/colors';
import {useEffect, useRef, useState} from 'react';
import {PayloadUserInterface} from '../../app/config/interface';
import {useAppDispatch, useAppSelector} from '../../app/store/hooks';
import {selectAuth} from '../../app/store/auth/auth.slice';
import {jwtDecode} from 'jwt-decode';
import {createLikeFileApi} from '../../app/api/like/like.req';
import {TypeContentEnum} from '../../app/config/enum';
import LoadingGif from '../loading/loadingGif';
import {
  createFavorisApi,
  deleteFavorisApi,
} from '../../app/api/favoris/favoris.req';
import {front_url} from '../../app/api';
import {useContentByType} from '../../app/store/hooks/useContentByType';
import {toggleLikeByType} from '../../app/helpers/toggleLikeByType';
import {Animated, Easing} from 'react-native';

export default function ActionContent({
  content,
  navigation,
  typeContent,
  handlePresentModalPress,
  commentCount,
}: {
  content: any;
  navigation: any;
  typeContent: TypeContentEnum;
  handlePresentModalPress?: (
    mode: 'menu' | 'comments',
    typeContent: TypeContentEnum,
    idFile: number,
  ) => void;
  commentCount: any;
}) {
  const auth = useAppSelector(selectAuth);
  const decode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;

  const contentData = useContentByType(typeContent, content?.id);

  const user = auth.access_token
    ? jwtDecode<PayloadUserInterface>(auth.access_token)
    : undefined;

  // const [user] = useState<PayloadUserInterface | undefined>(decode);

  const [favoris, setFavoris] = useState<number>(
    contentData ? contentData.favoris.length : 0,
  );
  const [favorised, setFavorised] = useState<boolean>(false);
  const [loadingFavoris, setLoadingFavoris] = useState<boolean>(false);
  const [shares] = useState<number>(contentData ? contentData.share.length : 0);
  const [shared, setShared] = useState<boolean>(false);
  const [loadingShare] = useState<boolean>(false);

  const [likedLocally, setLikedLocally] = useState<boolean | null>(null);

  const likeAnimation = useRef(new Animated.Value(1)).current;

  const isDarkMode = useColorScheme() === 'dark';

  const dispatch = useAppDispatch();

  const handleLikeAnimation = () => {
    likeAnimation.setValue(0.2);
    Animated.spring(likeAnimation, {
      toValue: 1,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const ShareIcon = () => {
    if (shared) {
      return loadingShare ? (
        <LoadingGif width={30} height={30} />
      ) : (
        <Feather name="corner-up-right" size={25} color={'#f5c542'} />
      );
    } else {
      return loadingShare ? (
        <LoadingGif width={30} height={30} />
      ) : (
        <Feather
          name="corner-up-right"
          size={25}
          color={isDarkMode ? colors.light : colors.primary}
        />
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
        <AntDesign
          name="staro"
          size={25}
          color={isDarkMode ? colors.light : colors.primary}
        />
      );
    }
  };

  const handleToggleLikesContent = async () => {
    if (auth.isAuthenticated) {
      try {
        const isLiked = contentData?.likes?.some(
          (like: any) => like?.users?.id === user?.sub,
        );

        setLikedLocally(!isLiked); // Inverser le like localement

        let userAction = {id: user?.sub};

        const userLiked = {
          id: undefined,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          deletedAt: Date.now(),
          users: userAction,
        };

        toggleLikeByType({
          typeContent,
          contentId: contentData!.id,
          user: userLiked,
          dispatch,
        });

        await createLikeFileApi(contentData!.id, typeContent);
      } catch (error) {
        console.error('Erreur lors du like:', error);
        Alert.alert('Erreur', 'Une erreur est survenue lors du like.');
      }
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
        await deleteFavorisApi(contentData!.id);
        setFavoris(favoris - 1);
        setFavorised(false);
      } else {
        await createFavorisApi(typeContent, contentData!.id);
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
          message: `${front_url}share?s_share_code=${
            contentData!.sharecode
          }&u_user=${
            user?.username ? user?.username : 'any_user'
          }&t_type_file=${typeContent}`,
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

  useEffect(() => {
    setLikedLocally(null);
  }, [contentData?.likes]);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() => {
          handleLikeAnimation();
          handleToggleLikesContent();
        }}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          padding: 10,
        }}>
        <Animated.View style={{transform: [{scale: likeAnimation}]}}>
          <AntDesign
            name={
              likedLocally !== null
                ? likedLocally
                  ? 'heart'
                  : 'hearto'
                : contentData?.likes?.some(
                    (like: any) => like?.users?.id === user?.sub,
                  )
                ? 'heart'
                : 'hearto'
            }
            size={25}
            color={
              likedLocally !== null
                ? likedLocally
                  ? 'red'
                  : isDarkMode
                  ? colors.light
                  : colors.primary
                : contentData?.likes?.some(
                    (like: any) => like?.users?.id === user?.sub,
                  )
                ? 'red'
                : isDarkMode
                ? colors.light
                : colors.primary
            }
          />
        </Animated.View>
        <Text
          style={{
            color: isDarkMode ? colors.light : colors.primary,
            fontSize: 15,
            fontWeight: '500',
          }}>
          {contentData?.likes?.length}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          // handlePresentModalPress &&
          //   handlePresentModalPress(typeContent, contentData!.id);
          handlePresentModalPress &&
            handlePresentModalPress('comments', typeContent, contentData!.id);
        }}
        style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
        <Feather
          name="message-square"
          size={25}
          color={isDarkMode ? colors.light : colors.primary}
        />
        <Text
          style={{
            color: isDarkMode ? colors.gris : colors.primary,
            fontSize: 15,
          }}>
          {commentCount ? commentCount : contentData!.commentaire.length}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleToggleFavorisContent}
        style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
        {FavoriIcon()}
        <Text
          style={{
            color: isDarkMode ? colors.gris : colors.primary,
            fontSize: 15,
          }}>
          {favoris}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleToggleSharedContent();
        }}
        style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
        {ShareIcon()}
        <Text
          style={{
            color: isDarkMode ? colors.gris : colors.primary,
            fontSize: 15,
          }}>
          {shares}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
