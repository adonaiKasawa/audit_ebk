import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Image,
  Dimensions,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import colors from '../../../components/style/colors';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Feather from 'react-native-vector-icons/Feather';
// import img4 from '../../assets/img/img4.png';
// import img4 from '../../../../assets/img/img4.png';

import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import {formatSecondeTime, formatBytes} from '../../config/func';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {selectAuth} from '../../store/auth/auth.slice';
import {
  deleteTestimonialsByUserApi,
  findTestimonialsByUserIdApi,
  sendTestimonialsApi,
} from '../../api/testimonials/testimonials.req';
import {PayloadUserInterface} from '../../config/interface';
import {jwtDecode} from 'jwt-decode';
import LoadingGif from '../../../components/loading/loadingGif';
import {file_url} from '../../api';
import {createThumbnail} from 'react-native-create-thumbnail';
import {TestimonialStatusEnum} from '../../config/enum';
import {requestSavePermission} from '../../../components/camera/MediaPage';
import {
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import {Video} from 'react-native-compressor';
import {
  selectFirstOpen,
  setFirstOpenTesmonials,
} from '../../store/firstOpen/first.open.slice';
import DataDisclosureModal from '../../../components/modal/data.discloture';
import FastImage from 'react-native-fast-image';

const width = Dimensions.get('screen').width;

function TestimonialsHandlerScreen({navigation}: any) {
  const isDarkMode = useColorScheme() === 'dark';
  const auth = useAppSelector(selectAuth);
  const firstOpen = useAppSelector(selectFirstOpen);
  const dispatch = useAppDispatch();

  const [inTesmonials, setInTesmonials] = React.useState<boolean>(
    firstOpen.inTesmonials,
  );
  const [user, setUser] = React.useState<PayloadUserInterface | undefined>(
    auth.access_token ? jwtDecode(auth.access_token) : undefined,
  );
  const [isActive, setIsActive] = React.useState<string>('Approuver');
  const [videos, setVideos] = React.useState<PhotoIdentifier[]>([]);
  const [testimonials, setTestimonials] = React.useState<{
    pending: any[];
    approved: any[];
    dismiss: any[];
  }>({
    pending: [],
    approved: [],
    dismiss: [],
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  const {hasPermission, requestPermission} = useCameraPermission();
  const microphonePermission = useMicrophonePermission();

  const handelSetFirstOpen = () => {
    dispatch(setFirstOpenTesmonials({open: false, inTesmonials: false}));
    setInTesmonials(false);
  };

  const handleCameraRollPermision = async () => {
    const hasPermission = await requestSavePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission refusée!',
        `Vision Camera n'a pas l'autorisation d'enregistrer le média dans votre pellicule.`,
      );
      return;
    }
  };

  const handleAllCameraPermision = async () => {
    if (!hasPermission) {
      requestPermission();
    }
    if (!microphonePermission.hasPermission) {
      microphonePermission.requestPermission();
    }
    handleCameraRollPermision();
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const handleFindVideosInMemoryOfUser = React.useCallback(async () => {
    const files = await CameraRoll.getPhotos({
      first: 20,
      assetType: 'Videos',
      include: ['albums', 'playableDuration', 'filename', 'fileSize'],
    });

    if (files) {
      setVideos(
        files.edges.filter(v => v.node.group_name.includes('EcclesiaBooK')),
      );
    }
  }, [CameraRoll]);

  const handleFindTestimonials = React.useCallback(async () => {
    if (user) {
      setLoading(true);
      const find = await findTestimonialsByUserIdApi(user.sub);
      setLoading(false);
      if (find?.status === 200) {
        let pending = find.data.filter(
          (item: any) => item.status === TestimonialStatusEnum.PENDING,
        );
        let approved = find.data.filter(
          (item: any) => item.status === TestimonialStatusEnum.APPROVED,
        );
        let dismiss = find.data.filter(
          (item: any) => item.status === TestimonialStatusEnum.DISMISS,
        );
        setTestimonials({
          pending,
          approved,
          dismiss,
        });
      }
    }
  }, []);

  React.useEffect(() => {
    handleFindVideosInMemoryOfUser();
    handleFindTestimonials();
  }, [handleFindVideosInMemoryOfUser, handleFindTestimonials]);

  React.useEffect(() => {
    handleAllCameraPermision();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      {!inTesmonials ? (
        <>
          {!hasPermission && (
            <View>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 10,
                  margin: 10,
                  borderRadius: 15,
                  backgroundColor: isDarkMode ? colors.light : colors.primary,
                }}
                onPress={() => {
                  handleAllCameraPermision();
                }}>
                <Text
                  style={{
                    color: backgroundStyle.backgroundColor,
                    fontWeight: 'bold',
                  }}>
                  Autorisation de la camera
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingVertical: 10,
              borderBottomWidth: 0.2,
              borderBottomColor: colors.gris,
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsActive('Approuver');
              }}>
              <Text
                style={{
                  color:
                    isActive === 'Approuver'
                      ? isDarkMode
                        ? colors.white
                        : colors.primary
                      : colors.gris,
                }}>
                Contenus publiés
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsActive('Enregistré');
              }}>
              <Text
                style={{
                  color:
                    isActive === 'Enregistré'
                      ? isDarkMode
                        ? colors.white
                        : colors.primary
                      : colors.gris,
                }}>
                Enregistré
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => { setIsActive("En attente") }}>
            <Text style={{ color: isActive === "En attente" ? isDarkMode ? colors.white : colors.primary : colors.gris }}>En attente</Text>
          </TouchableOpacity> */}

            {/* <TouchableOpacity onPress={() => { setIsActive("Rejeter") }}>
            <Text style={{ color: isActive === "Rejeter" ? isDarkMode ? colors.white : colors.primary : colors.gris }}>Rejeter</Text>
          </TouchableOpacity> */}
          </View>

          {isActive === 'Enregistré' && (
            <FlatList
              data={videos}
              keyExtractor={(_, index) => index.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                paddingHorizontal: 5,
                marginBottom: 10,
              }}
              renderItem={({item}) => (
                <TestimonialsSavedItem
                  handleFindTestimonials={handleFindTestimonials}
                  navigation={navigation}
                  item={item}
                />
              )}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={handleFindVideosInMemoryOfUser}
                />
              }
            />
          )}

          {isActive === 'En attente' && (
            <FlatList
              data={testimonials.pending}
              keyExtractor={(_, index) => index.toString()}
              numColumns={3}
              style={{
                gap: 5,
              }}
              renderItem={({item}) => (
                <TestimonialsItem
                  handleFindTestimonials={handleFindTestimonials}
                  navigation={navigation}
                  item={item}
                />
              )}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={handleFindTestimonials}
                />
              }
            />
          )}

          {isActive === 'Approuver' && (
            <FlatList
              data={testimonials.approved}
              // keyExtractor={(_, index) => index.toString()}
              keyExtractor={item => item?.id?.toString()} // Utilise item.id ici
              numColumns={3}
              style={{
                gap: 5,
                paddingHorizontal: 5,
              }}
              renderItem={({item}) => (
                <TestimonialsItem
                  handleFindTestimonials={handleFindTestimonials}
                  navigation={navigation}
                  item={item}
                />
              )}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={() => {
                    handleFindTestimonials();
                  }}
                />
              }
            />
          )}
          {isActive === 'Rejeter' && (
            <FlatList
              data={testimonials.approved}
              keyExtractor={(_, index) => index.toString()}
              numColumns={3} // 🟡 pour 3 cartes
              columnWrapperStyle={{
                justifyContent: 'space-between',
                paddingHorizontal: 5,
              }}
              renderItem={({item}) => (
                <TestimonialsItem
                  handleFindTestimonials={handleFindTestimonials}
                  navigation={navigation}
                  item={item}
                />
              )}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={handleFindTestimonials}
                />
              }
            />
          )}

          {/* <TouchableOpacity
            onPress={() => navigation.navigate('TestimonialsUpload')}
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              backgroundColor: colors.gris,
              padding: 10,
              borderRadius: 25,
            }}>
            <FontAwesome6 name="clapperboard" size={30} color={colors.white} />
          </TouchableOpacity> */}
        </>
      ) : (
        <View>
          <DataDisclosureModal
            firstOpen={inTesmonials}
            handelSetFirstOpen={handelSetFirstOpen}
          />
        </View>
      )}
    </View>
  );
}

export default TestimonialsHandlerScreen;

export const TestimonialsSavedItem = ({
  item,
  navigation,
  handleFindTestimonials,
}: {
  item: PhotoIdentifier;
  navigation: any;
  handleFindTestimonials: any;
}) => {
  const auth = useAppSelector(selectAuth);
  const [loading, setLoading] = React.useState<boolean>(false);
  const fileSize = item.node.image.fileSize ? item.node.image.fileSize : 0;
  const [compressprogress, setCompressProgress] = React.useState<number>(0);

  const handelSendVideos = async () => {
    const formData = new FormData();
    formData.append('file', {
      uri: item.node.image.uri,
      type: item.node.type,
      name: item.node.image.filename || 'video.mp4',
    });
    formData.append('status', TestimonialStatusEnum.APPROVED);

    if (auth.isAuthenticated) {
      setLoading(true);
      const send = await sendTestimonialsApi(formData);
      setLoading(false);

      if (send?.status === 201) {
        Alert.alert(
          'Publication',
          'La vidéo est maintenant accessible à tous !',
        );
        handleFindTestimonials();
      } else {
        if (typeof send?.data.message === 'object') {
          let message = '';
          send?.data.message.map((item: string) => (message += `${item}; \n`));
          Alert.alert('Erreur publication', message);
        } else if (typeof send?.data?.message === 'string') {
          Alert.alert('Erreur publication', send?.data?.message);
        }
      }
    } else {
      Alert.alert(
        'Connexion requise',
        'Votre témoignage est précieux. Connectez-vous pour le partager avec nous.',
        [
          {
            text: 'SE DÉCONNECTER',
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

  const handleCompresseVideo = async () => {
    const result = await Video.compress(
      `file://${item.node.image.filepath}`,
      {},
      progress => {
        // ('Compression Progress: ', progress);
        setCompressProgress(progress);
      },
    );
  };

  return (
    <TouchableOpacity style={{flex: 1 / 3, padding: 5}}>
      <FastImage
        style={{
          width: '100%',
          height: 160,
          borderRadius: 10,
        }}
        source={{
          uri: item.node.image.uri,
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />

      {loading ? (
        <View style={{position: 'absolute', left: 10, bottom: 10}}>
          <LoadingGif width={40} height={40} />
        </View>
      ) : (
        <TouchableOpacity
          onPress={handelSendVideos}
          style={{position: 'absolute', left: 10, bottom: 10}}>
          <Feather name="send" size={24} color={colors.white} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 10,
          bottom: 10,
          backgroundColor: colors.blackrgba8,
          borderRadius: 10,
          padding: 5,
        }}>
        <Text style={{color: colors.white}}>
          {formatSecondeTime(item.node.image.playableDuration)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 10,
          top: 10,
          backgroundColor: colors.blackrgba8,
          borderRadius: 10,
          padding: 5,
        }}>
        <Text style={{color: colors.white}}>{formatBytes(fileSize)}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export const TestimonialsItem = ({
  item,
  navigation,
  handleFindTestimonials,
}: {
  item: any;
  navigation: any;
  handleFindTestimonials: any;
}) => {
  const auth = useAppSelector(selectAuth);
  const decode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = React.useState<PayloadUserInterface | undefined>(
    decode,
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [miniature, setMiniature] = React.useState<string>();

  const handelDelteTestimonial = () => {
    Alert.alert(
      'Confirmation de suppression',
      'Êtes-vous sûr de vouloir supprimer ce témoignage ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            if (auth.isAuthenticated) {
              setLoading(true);
              const deleteTestimonial = await deleteTestimonialsByUserApi(
                item.id,
              );
              setLoading(false);
              if (deleteTestimonial?.status === 200) {
                handleFindTestimonials();
              }
            } else {
              Alert.alert(
                'Connexion requise',
                'Votre témoignage est précieux. Connectez-vous pour le partager avec nous.',
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
          },
        },
      ],
    );
  };

  const generateThumbnail = React.useCallback(async () => {
    try {
      createThumbnail({
        url: `${file_url}${item.link}`,
      })
        .then(res => {
          setMiniature(res.path);
        })
        .catch(error => {});
    } catch (error) {}
  }, []);

  React.useEffect(() => {
    generateThumbnail();
  }, [generateThumbnail]);

  return (
    <View key={item?.id} style={{flex: 1 / 3, padding: 5}}>
      {miniature ? (
        <FastImage
          key={item.id}
          style={{
            width: '100%',
            height: 160,
            borderRadius: 10,
          }}
          resizeMode={FastImage.resizeMode.cover}
          source={{
            uri: miniature,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
        />
      ) : (
        <View
          style={{
            width: '100%',
            height: 160,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.blackrgba5,
            borderRadius: 10,
          }}>
          <Image
            style={{width: 60, height: 60, borderRadius: 10}}
            resizeMode="cover"
            // source={require('../../../../assets/img/img4.png')}
            source={require('../../../../assets/img/img4.png')}
          />
        </View>
      )}

      {loading ? (
        <View style={{position: 'absolute', left: 5, top: 5}}>
          <LoadingGif width={30} height={30} />
        </View>
      ) : (
        user &&
        item?.users?.id === user.sub && (
          <TouchableOpacity
            onPress={handelDelteTestimonial}
            style={{position: 'absolute', left: 5, top: 5}}>
            <Feather name="trash-2" size={22} color={colors.white} />
          </TouchableOpacity>
        )
      )}
    </View>
  );
};
