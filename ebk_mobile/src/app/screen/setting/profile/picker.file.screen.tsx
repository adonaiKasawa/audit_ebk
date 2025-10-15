import {jwtDecode} from 'jwt-decode';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import colors from '../../../../components/style/colors';
import {PayloadUserInterface} from '../../../config/interface';
import {loginUser, selectAuth} from '../../../store/auth/auth.slice';
import {useAppSelector, useAppDispatch} from '../../../store/hooks';
import Loading from '../../../../components/loading';
import {requestSavePermission} from '../../../../components/camera/MediaPage';
import {launchImageLibrary} from 'react-native-image-picker';
import useDimensions from '../../../helpers/useDimensions';
import ImageCropPicker, {
  Image as ResultCropperImage,
} from 'react-native-image-crop-picker';
import {sendUserPhotoProfilApi} from '../../../api/auth';

export default function PickerFileScreen({navigation}: {navigation: any}) {
  const width = useDimensions().screen.width;
  const height = useDimensions().screen.height;

  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const decode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = React.useState<PayloadUserInterface | undefined>(
    decode,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [photo, setPhoto] = React.useState<ResultCropperImage>();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
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

  const handlePickerFile = async () => {
    // handleAllCameraPermision()
    const result = await launchImageLibrary({
      selectionLimit: 1,
      mediaType: 'photo',
    });
    if (result.assets) {
      const openCropper = await ImageCropPicker.openCropper({
        path: result.assets[0].uri || '',
        width: 500,
        height: 500,
        mediaType: 'photo',
      });
      if (openCropper.path) {
        setPhoto(openCropper);
      }
    }
  };

  const handleSavePhotoProfil = async () => {
    const formData = new FormData();
    // formData.append('profil', photo?.filename);

    formData.append('photo', {
      uri: photo?.path,
      type: photo?.mime,
      name: 'profil_user.jpeg',
    });

    if (user && auth.isAuthenticated) {
      setLoading(true);
      const send = await sendUserPhotoProfilApi(formData, user?.sub);
      setLoading(false);

      if (send?.status === 200) {
        dispatch(
          loginUser({
            isAuthenticated: true,
            access_token: send?.data?.access_token,
            refresh_token: send?.data?.refresh_token,
          }),
        );
        setUser(
          send?.data?.access_token && jwtDecode(send?.data?.access_token),
        );
        // setTimeout(() => {
        navigation.navigate('ProfileScreen', {update: true});
        // }, 1000)
      } else {
        Alert.alert('ERREUR', send?.statusText);
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

  useEffect(() => {
    handlePickerFile();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      {user && (
        <>
          <View
            style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
            {photo?.cropRect && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={{uri: photo?.path}}
                  style={{
                    width: 200,
                    height: 200,
                    resizeMode: 'cover',
                    borderRadius: 100,
                  }}
                />
                {photo?.path && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: isDarkMode
                        ? colors.secondary
                        : colors.light,
                      paddingVertical: 15,
                      paddingHorizontal: 10,
                      margin: 10,
                      borderRadius: 12,
                    }}
                    onPress={() => {
                      handleSavePhotoProfil();
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: isDarkMode ? colors.white : colors.primary,
                        fontSize: 18,
                      }}>
                      Enregistrer la photo de profil
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            <TouchableOpacity
              style={{
                backgroundColor: isDarkMode ? colors.white : colors.primary,
                paddingVertical: 15,
                margin: 10,
                borderRadius: 12,
              }}
              onPress={() => {
                handlePickerFile();
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: backgroundStyle.backgroundColor,
                  fontSize: 18,
                  fontWeight: '500',
                }}>
                Changer l'image
              </Text>
            </TouchableOpacity>
          </View>
          {loading && <Loading />}
        </>
      )}
    </View>
  );
}

const styles = (isDarkMode: boolean = true) => StyleSheet.create({});
