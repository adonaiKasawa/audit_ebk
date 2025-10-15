import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import colors from '../../../components/style/colors';
import {
  Eglise,
  ItemAnnonces,
  ItemPicture,
  ItemVideos,
  PayloadUserInterface,
  StatistiqueEglise,
} from '../../config/interface';
import {file_url} from '../../api';
import {findFileByChurchIdApi} from '../../api/church/church';
import {PrivilegesEnum, TypeContentEnum} from '../../config/enum';
import {MenuDivider} from 'react-native-material-menu';
import CardVideosUI from '../../../components/card/videos/card.videos';
import CardBooksUI from '../../../components/card/books/card.book';
import CardAudiosUI from '../../../components/card/audios/card.audios';
import CardImagesUI from '../../../components/card/images/card.image';
import {TestimonialsItem} from '../testimonials/testimonials.handeler.screen';
import {findAnnonceByEgliseIdPaginated} from '../../api/annonce/annonce.req';
import LoadingGif from '../../../components/loading/loadingGif';
import {Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {loginUser, selectAuth} from '../../store/auth/auth.slice';
import {jwtDecode} from 'jwt-decode';
import {
  createFavorisApi,
  deleteFavorisApi,
  findFavorisByContetTypeAndUserApi,
} from '../../api/favoris/favoris.req';
import {LeaveTheChurchApi, UpdateUserApi} from '../../api/auth';
import {updateMembers} from '../../store/statistiqueChurch/statistique.slice';
const WIDTH = Dimensions.get('screen').width;

const ChurchDetailScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const Eglise: Eglise = route.params.church;
  const Statistique: StatistiqueEglise = route.params.statistique;

  const decode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = useState<PayloadUserInterface | undefined>(decode);
  const [statistique, setStatistique] =
    useState<StatistiqueEglise>(Statistique);

  const [step, setStep] = useState<string>('Accueil');
  const [loading, setLoading] = useState<boolean>(false);
  const [contentChurchs, setContentChurchs] = useState<{
    videos: ItemVideos[];
    audios: ItemVideos[];
    books: ItemVideos[];
    picture: ItemPicture[];
    annonces: ItemAnnonces[];
    testimonials: any[];
  }>();

  const [coverImageError, setCoverImageError] = useState(false);
  const [isMember, setIsMember] = useState<boolean>(
    user ? user.eglise?.id_eglise === Eglise.id_eglise : false,
  );
  const [loadingAddMember, setLoadingAddMember] = useState<boolean>(false);

  const [favorised, setFavorised] = useState<boolean>(false);
  const [loadingFavoris, setLoadingFavoris] = useState<boolean>(false);

  const typeContent = [
    'Accueil',
    'Vidéos',
    'Audios',
    'Images',
    'Livres',
    'Témoignages',
  ];

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const handelFindContent = useCallback(async () => {
    try {
      setLoading(true);
      const videos = await findFileByChurchIdApi(
        Eglise.id_eglise,
        TypeContentEnum.videos,
      );
      const audios = await findFileByChurchIdApi(
        Eglise.id_eglise,
        TypeContentEnum.audios,
      );
      const books = await findFileByChurchIdApi(
        Eglise.id_eglise,
        TypeContentEnum.livres,
      );
      const pictures = await findFileByChurchIdApi(
        Eglise.id_eglise,
        TypeContentEnum.images,
      );
      const annonces = await findAnnonceByEgliseIdPaginated(Eglise.id_eglise);
      const testimonials = await findFileByChurchIdApi(
        Eglise.id_eglise,
        TypeContentEnum.testimonials,
      );
      setLoading(false);
      setContentChurchs({
        videos: videos?.data.items,
        audios: audios?.data.items,
        books: books?.data.items,
        picture: pictures?.data.items,
        annonces: annonces?.data.items,
        testimonials: testimonials?.data.items,
      });
    } catch (error) {
      //  console.error("Error fetching content:", error);
    }
  }, [findFileByChurchIdApi]);

  const handelFindFavorisByContentTypeAndUser = useCallback(async () => {
    try {
      if (user) {
        const result = await findFavorisByContetTypeAndUserApi(
          TypeContentEnum.eglises,
          user.sub,
        );
        const favorisList = result?.data || [];
        const isFav = favorisList.some(
          (item: any) => item?.eglise?.id_eglise === Eglise.id_eglise,
        );
        setFavorised(isFav);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  }, [findFavorisByContetTypeAndUserApi]);

  useEffect(() => {
    handelFindFavorisByContentTypeAndUser();
  }, [handelFindFavorisByContentTypeAndUser]);

  const DividerItem = (text: string) => {
    return (
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}>
        <MenuDivider color={colors.gris} />
        <Text style={{color: isDarkMode ? colors.white : colors.black}}>
          {text}
        </Text>
        <MenuDivider color={colors.gris} />
      </View>
    );
  };

  const renderWelcomeContent = () => {
    return (
      <ScrollView>
        {DividerItem('Vidéos')}
        <FlatList
          data={contentChurchs?.videos}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          pagingEnabled={true}
          renderItem={({item, index}) =>
            index < 5 ? (
              <CardVideosUI
                navigation={navigation}
                route={route}
                videos={item}
              />
            ) : null
          }
        />
        {DividerItem('Livres')}
        <FlatList
          data={contentChurchs?.books}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          pagingEnabled={true}
          style={{}}
          renderItem={({item, index}) =>
            index < 5 ? (
              <CardBooksUI
                navigation={navigation}
                route={route}
                livres={item}
              />
            ) : null
          }
        />
        {DividerItem('Audios')}
        <FlatList
          data={contentChurchs?.audios}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          pagingEnabled={true}
          style={{}}
          renderItem={({item, index}) =>
            index < 5 ? (
              <CardAudiosUI
                navigation={navigation}
                route={route}
                audios={item}
              />
            ) : null
          }
        />
        {DividerItem('Images')}
        <FlatList
          data={contentChurchs?.picture}
          keyExtractor={(_, index) => index.toString()}
          pagingEnabled={true}
          renderItem={({item, index}) =>
            index < 5 ? (
              <CardImagesUI navigation={navigation} images={item} />
            ) : null
          }
        />
      </ScrollView>
    );
  };

  const renderVideosContent = () => {
    return (
      <View style={{flex: 1, marginTop: 10}}>
        <FlatList
          data={contentChurchs?.videos}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <CardVideosUI navigation={navigation} route={route} videos={item} />
          )}
        />
      </View>
    );
  };

  const renderAudiosContent = () => {
    return (
      <View style={{flex: 1, marginTop: 10}}>
        <FlatList
          data={contentChurchs?.audios}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          pagingEnabled={true}
          style={{}}
          renderItem={({item, index}) => (
            <CardAudiosUI navigation={navigation} route={route} audios={item} />
          )}
        />
      </View>
    );
  };

  const renderLivresContent = () => {
    return (
      <View style={{flex: 1, marginTop: 10}}>
        <FlatList
          data={contentChurchs?.books}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          renderItem={({item, index}) => (
            <CardBooksUI navigation={navigation} route={route} livres={item} />
          )}
        />
      </View>
    );
  };

  const renderImagesContent = () => {
    return (
      <View>
        <FlatList
          data={contentChurchs?.picture}
          keyExtractor={(_, index) => index.toString()}
          pagingEnabled={true}
          renderItem={({item, index}) => (
            <CardImagesUI navigation={navigation} images={item} />
          )}
        />
      </View>
    );
  };

  const renderTestimonialsContent = () => {
    return (
      <View style={{flex: 1, marginTop: 2}}>
        <FlatList
          data={contentChurchs?.testimonials}
          keyExtractor={(_, index) => index.toString()}
          pagingEnabled={true}
          renderItem={({item, index}) => (
            <TestimonialsItem
              navigation={navigation}
              item={item}
              handleFindTestimonials={() => {}}
            />
          )}
        />
      </View>
    );
  };

  const renderAnnoncesContent = () => {
    return <View></View>;
  };

  const UserIcon = () => {
    if (isMember) {
      return loadingAddMember ? (
        <LoadingGif width={30} height={30} />
      ) : (
        <Feather
          name="user-x"
          color={'red'}
          size={24}
          style={{alignSelf: 'center'}}
        />
      );
    } else {
      return loadingAddMember ? (
        <LoadingGif width={30} height={30} />
      ) : (
        <Feather
          name="user-plus"
          color={colors.primary}
          size={24}
          style={{alignSelf: 'center'}}
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
        <AntDesign name="staro" size={25} color={colors.primary} />
      );
    }
  };

  const handleToggleAddMember = () => {
    Alert.alert(
      'EcclesiaBooK',
      `Vous êtes sur le point de ${
        user?.eglise?.id_eglise !== Eglise?.id_eglise
          ? 'visitez cette église'
          : 'sortir de cette église'
      }.`,
      [
        {
          text: 'Confirmer',
          onPress: () => {
            handleChangeEglise();
          },
          style: 'cancel',
        },
        {text: 'ANNULER', onPress: () => {}},
      ],
    );
  };

  // Ici
  const handleChangeEglise = async () => {
    if (user) {
      setLoadingAddMember(true);
      let update: any;
      if (Eglise?.id_eglise === user?.eglise?.id_eglise) {
        update = await LeaveTheChurchApi();
        setIsMember(false);
        if (update)
          setStatistique(prev => ({
            ...prev,
            members: Math.max(0, prev.members - 1),
          }));

        if (update) {
          dispatch(updateMembers({id: Eglise.id_eglise, increment: false}));
        }
      } else {
        update = await UpdateUserApi(
          {
            fk_eglise: Eglise?.id_eglise,
          },
          user?.sub,
        );
        setIsMember(true);
        if (update)
          setStatistique(prev => ({...prev, members: prev.members + 1}));

        if (update) {
          dispatch(updateMembers({id: Eglise.id_eglise, increment: true}));
        }
      }
      setLoadingAddMember(false);
      if (update?.status === 200) {
        dispatch(
          loginUser({
            isAuthenticated: true,
            access_token: update?.data?.access_token,
            refresh_token: update?.data?.refresh_token,
          }),
        );
        setUser(
          update?.data?.access_token && jwtDecode(update?.data?.access_token),
        );
        Alert.alert('Modification', "La modification s'est bien passée.");
        // navigation.navigate("Drawer", {
        //   screen: "Bottom",
        //   params: {
        //     screen: "Home"
        //   }
        // });
      } else {
        if (update?.status === 409) {
          Alert.alert('Erreur', update?.message);
        } else if (update?.status === 400) {
          update?.message.forEach((element: string) => {
            Alert.alert('Erreur', element);
          });
        } else {
          Alert.alert('Modification', "La modification s'est bien passée.");
        }
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

  const handleToggleFavorisContent = async () => {
    if (auth.isAuthenticated) {
      setLoadingFavoris(true);
      if (favorised) {
        // await deleteFavorisApi(Eglise.id_eglise);
        setFavorised(false);
        await createFavorisApi(TypeContentEnum.eglises, Eglise.id_eglise);
      } else {
        await createFavorisApi(TypeContentEnum.eglises, Eglise.id_eglise);
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

  const onCoverImageError = () => {
    setCoverImageError(true);
  };

  useEffect(() => {
    handelFindContent();
  }, [handelFindContent]);

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      <ImageBackground
        source={
          !coverImageError
            ? {uri: `${file_url}${Eglise.couverture_eglise}`}
            : require('../../../../assets/img/ecclessia.png')
        }
        style={{
          height: 270,
          width: WIDTH,
        }}
        borderBottomLeftRadius={40}
        borderBottomRightRadius={40}
        resizeMode={coverImageError ? 'contain' : 'cover'}
        onError={onCoverImageError}>
        <LinearGradient
          colors={[colors.blackrgba5, colors.whitergba3]}
          start={{x: 0.5, y: 0.1}}
          end={{x: 0.5, y: 0.9}}
          style={{
            width: '100%',
            padding: 10,
            height: '100%',
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
                style={{
                  backgroundColor: colors.blackrgba4,
                  borderRadius: 25,
                  height: 50,
                  width: 50,
                  alignContent: 'center',
                  justifyContent: 'center',
                }}>
                <Feather
                  name="arrow-left"
                  color={colors.white}
                  size={24}
                  style={{alignSelf: 'center'}}
                />
              </TouchableOpacity>
              <View style={{flex: 1}}>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={{
                    color: colors.white,
                    fontSize: 15,
                    fontWeight: '700',
                  }}>
                  {Eglise.nom_eglise}
                </Text>
              </View>
              <Image
                source={{uri: `${file_url}${Eglise.photo_eglise}`}}
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 25,
                }}
              />
            </View>
            <View style={{alignItems: 'center'}}>
              <Image
                source={{uri: `${file_url}${Eglise.photo_eglise}`}}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 5,
                  borderColor: colors.white,
                }}
              />
              <View style={{flexDirection: 'row', gap: 10, marginTop: 5}}>
                {user && user.privilege_user === PrivilegesEnum.FIDELE && (
                  <TouchableOpacity
                    onPress={handleToggleAddMember}
                    style={{
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      backgroundColor: colors.white,
                      borderRadius: 10,
                    }}>
                    {UserIcon()}
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={handleToggleFavorisContent}
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    backgroundColor: colors.white,
                    borderRadius: 10,
                  }}>
                  {FavoriIcon()}
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 20,
                padding: 10,
                borderRadius: 10,
                backgroundColor: colors.blackrgba5,
                marginHorizontal: 50,
              }}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: colors.white, fontSize: 17}}>
                  {statistique ? statistique.members : 0}
                </Text>
                <Text style={{color: colors.white, fontSize: 17}}>Membres</Text>
              </View>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: colors.white, fontSize: 17}}>
                  {statistique
                    ? statistique?.annonces +
                      statistique?.audios +
                      statistique?.videos +
                      statistique?.images.photo
                    : 0}
                </Text>
                <Text style={{color: colors.white, fontSize: 17}}>
                  Contenus
                </Text>
              </View>
              {/* <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text>{Statistique.members}</Text>
                <Text>Membres</Text>
              </View> */}
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
      <View>
        <FlatList
          data={typeContent}
          keyExtractor={(_, index) => index.toString()}
          horizontal={true}
          style={{
            borderBottomWidth: 0.5,
            borderBottomColor: colors.gris,
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => setStep(item)}
              style={{margin: 10, paddingHorizontal: 10}}>
              <Text
                style={{
                  color:
                    step === item
                      ? isDarkMode
                        ? colors.white
                        : colors.black
                      : colors.gris,
                  fontSize: 15,
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={{flex: 1}}>
        {loading ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <LoadingGif width={30} height={30} />
          </View>
        ) : (
          <View style={{flex: 1}}>
            {step === typeContent[0] && renderWelcomeContent()}
            {step === typeContent[1] && renderVideosContent()}
            {step === typeContent[2] && renderAudiosContent()}
            {step === typeContent[3] && renderImagesContent()}
            {step === typeContent[4] && renderLivresContent()}
            {step === typeContent[5] && renderAnnoncesContent()}
            {step === typeContent[6] && renderTestimonialsContent()}
          </View>
        )}
      </View>
    </View>
  );
};

export default ChurchDetailScreen;
