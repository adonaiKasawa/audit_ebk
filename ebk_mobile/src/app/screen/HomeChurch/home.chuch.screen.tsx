import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  View,
  useColorScheme,
  Alert,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {selectAuth} from '../../store/auth/auth.slice';
import {jwtDecode} from 'jwt-decode';
import colors from '../../../components/style/colors';
import {ImageBackground} from 'react-native';
import {file_url} from '../../api';
import {
  Eglise,
  ItemAnnonces,
  ItemPicture,
  ItemVideos,
  PayloadUserInterface,
  StatistiqueEglise,
} from '../../config/interface';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import {Image} from 'react-native';
import {PrivilegesEnum, TypeContentEnum} from '../../config/enum';
import {
  findFileByChurchIdApi,
  findStatistiqueByChurchApi,
} from '../../api/church/church';
import {findAnnonceByEgliseIdPaginated} from '../../api/annonce/annonce.req';
import LoadingGif from '../../../components/loading/loadingGif';
import {MenuDivider} from 'react-native-material-menu';
import CardAudiosUI from '../../../components/card/audios/card.audios';
import CardBooksUI from '../../../components/card/books/card.book';
import CardImagesUI from '../../../components/card/images/card.image';
import CardVideosUI from '../../../components/card/videos/card.videos';
import {TestimonialsItem} from '../testimonials/testimonials.handeler.screen';
import {useFocusEffect} from '@react-navigation/native';
const WIDTH = Dimensions.get('screen').width;

function HomeChurchScreen({navigation, route}: {navigation: any; route: any}) {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };
  const userDecode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = React.useState<PayloadUserInterface | undefined>(
    userDecode,
  );
  const [eglise, setEglise] = useState<Eglise | undefined>(
    user ? user?.eglise : undefined,
  );
  const [statistique, setStatistique] = useState<StatistiqueEglise>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [contentChurchs, setContentChurchs] = useState<{
    videos: ItemVideos[];
    audios: ItemVideos[];
    books: ItemVideos[];
    picture: ItemPicture[];
    annonces: ItemAnnonces[];
    testimonials: any[];
  }>();
  const [coverImageError, setCoverImageError] = useState(false);
  const [step, setStep] = useState<string>('Accueil');

  const typeContent = [
    'Accueil',
    'Vidéos',
    'Audios',
    'Images',
    'Livres',
    'Témoignages',
  ];

  const onCoverImageError = () => {
    setCoverImageError(true);
  };

  const handelFindStatique = useCallback(async () => {
    if (user) {
      const find = await findStatistiqueByChurchApi(user?.eglise?.id_eglise);
      if (find?.status === 200) {
        setStatistique(find.data);
      }
    }
  }, [user]);

  const handelFindContent = useCallback(async () => {
    try {
      if (eglise) {
        setLoading(true);
        const videos = await findFileByChurchIdApi(
          eglise?.id_eglise,
          TypeContentEnum.videos,
        );
        const audios = await findFileByChurchIdApi(
          eglise?.id_eglise,
          TypeContentEnum.audios,
        );
        const books = await findFileByChurchIdApi(
          eglise?.id_eglise,
          TypeContentEnum.livres,
        );
        const pictures = await findFileByChurchIdApi(
          eglise?.id_eglise,
          TypeContentEnum.images,
        );
        const annonces = await findAnnonceByEgliseIdPaginated(
          eglise?.id_eglise,
        );
        const testimonials = await findFileByChurchIdApi(
          eglise?.id_eglise,
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
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  }, [eglise]);

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
          style={{
            paddingBottom: 150,
          }}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
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
      <View style={{paddingBottom: 300}}>
        <FlatList
          data={contentChurchs?.picture}
          keyExtractor={(_, index) => index.toString()}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
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

  useEffect(() => {
    if (auth.isAuthenticated) {
      if (user) {
        if (user.hasOwnProperty('eglise')) {
          if (user.eglise !== null) {
            handelFindStatique();
            handelFindContent();
          }
        }
      }
    }
  }, [handelFindStatique, handelFindContent]);

  useFocusEffect(
    useCallback(() => {
      const e: PayloadUserInterface | undefined = auth.access_token
        ? jwtDecode(auth.access_token)
        : undefined;
      if (user && e) {
        if (user.iat !== e.iat) {
          setUser(e);
          setEglise(e.eglise);
          handelFindStatique();
          handelFindContent();
        }
      } else {
        if (auth.isAuthenticated) {
          const e: PayloadUserInterface | undefined = auth.access_token
            ? jwtDecode(auth.access_token)
            : undefined;
          setUser(e);
          if (e && e.hasOwnProperty('eglise')) {
            if (e.eglise) {
              setEglise(e.eglise);
              handelFindStatique();
              handelFindContent();
            } else {
              Alert.alert(
                'Église requise',
                'Rejoignez une église en tant que membre.',
                [
                  {
                    text: 'Rejoindre',
                    onPress: () => {
                      navigation.navigate('ChurchList');
                    },
                    style: 'cancel',
                  },
                  {
                    text: 'ANNULER',
                    onPress: () => {
                      navigation.navigate('Home');
                    },
                  },
                ],
              );
            }
          } else {
            Alert.alert(
              'Église requise',
              'Rejoignez une église en tant que membre.',
              [
                {
                  text: 'Rejoindre',
                  onPress: () => {
                    navigation.navigate('ChurchList');
                  },
                  style: 'cancel',
                },
                {
                  text: 'ANNULER',
                  onPress: () => {
                    navigation.navigate('Home');
                  },
                },
              ],
            );
          }
        } else {
          setUser(undefined);
          setEglise(undefined);
          Alert.alert(
            'Église requise',
            'Rejoignez une église en tant que membre.',
            [
              {
                text: 'Rejoindre',
                onPress: () => {
                  navigation.navigate('ChurchList');
                },
                style: 'cancel',
              },
              {
                text: 'ANNULER',
                onPress: () => {
                  navigation.navigate('Home');
                },
              },
            ],
          );
        }
      }
    }, [user, auth, handelFindStatique, handelFindContent]),
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            handelFindStatique();
            handelFindContent();
          }}
          refreshing={false}
        />
      }
      style={{
        flex: 1,
        backgroundColor: backgroundStyle.backgroundColor,
        paddingBottom: 500,
      }}>
      <ImageBackground
        source={
          !coverImageError
            ? {uri: `${file_url}${eglise?.couverture_eglise}`}
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
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ProfileScreen');
                }}
                style={{
                  padding: 10,
                  backgroundColor: colors.blackrgba,
                  borderRadius: 25,
                }}>
                <Feather name="user" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center'}}>
              <Image
                source={{uri: `${file_url}${eglise?.photo_eglise}`}}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 5,
                  borderColor: colors.white,
                }}
              />
            </View>
            <View
              style={{
                backgroundColor: colors.blackrgba7,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
                borderRadius: 10,
                paddingVertical: 10,
              }}>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{color: colors.white, fontSize: 17, fontWeight: '700'}}>
                {eglise?.nom_eglise}
              </Text>
              <View style={{flexDirection: 'row', gap: 20}}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{color: colors.white, fontSize: 17}}>
                    {statistique ? statistique.members : 0}
                  </Text>
                  <Text style={{color: colors.white, fontSize: 17}}>
                    Membres
                  </Text>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{color: colors.white, fontSize: 17}}>
                    {statistique
                      ? statistique.annonces +
                        statistique.audios +
                        statistique.videos +
                        statistique.images.photo
                      : 0}
                  </Text>
                  <Text style={{color: colors.white, fontSize: 17}}>
                    Contenus
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
      <View>
        <FlatList
          data={typeContent}
          keyExtractor={(_, index) => index.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => setStep(item)}
              style={{
                margin: 10,
                paddingHorizontal: 15,
                paddingVertical: 5,
                borderRadius: 20,
                backgroundColor: isDarkMode
                  ? step === item
                    ? undefined
                    : colors.secondary
                  : step === item
                  ? undefined
                  : colors.blackrgba1,
                borderWidth: step === item ? 0.5 : undefined,
                borderColor: isDarkMode ? colors.red7 : colors.light2,
              }}>
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
    </ScrollView>
  );
}

export default HomeChurchScreen;
