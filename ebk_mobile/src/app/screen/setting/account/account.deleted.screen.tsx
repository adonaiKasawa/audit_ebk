import {jwtDecode} from 'jwt-decode';
import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Loading from '../../../../components/loading';
import colors from '../../../../components/style/colors';
import {
  AuthDeleteApi,
  AuthLoginApi,
  UpdateUserApi,
  sendSuggestionApi,
} from '../../../api/auth';
import {PayloadUserInterface} from '../../../config/interface';
import {selectAuth, loginUser} from '../../../store/auth/auth.slice';
import {useAppSelector, useAppDispatch} from '../../../store/hooks';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

export default function AccountDeletedScreen({navigation}: {navigation: any}) {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const decode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = React.useState<PayloadUserInterface | undefined>(
    decode,
  );

  const [password, setPassword] = useState<string>('');
  const [motivation, setMotifivation] = useState<string>('');
  const [seeConfpassword, setSeeConfPassword] = useState<boolean>(true);
  const [seepassword, setSeePassword] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const snapPoints = React.useMemo(() => ['50%', '100%'], []);
  const bottomSheetPasswordRef = React.useRef<BottomSheetModal>(null);

  const handlePresentModalPasswordPress = React.useCallback(() => {
    bottomSheetPasswordRef.current?.present();
  }, []);

  const handleSheetChanges = React.useCallback((index: number) => {}, []);

  const handelSendAvisEndSuggestion = async () => {
    if (motivation) {
      sendSuggestionApi(motivation);
    }
  };

  const handelCheckPassword = async () => {
    if (user) {
      if (password !== '' && password?.length >= 8) {
        setLoading(true);
        handelSendAvisEndSuggestion();
        const authLoginApi = await AuthLoginApi({
          telephone: user.telephone,
          password,
        });
        setLoading(false);
        if (
          authLoginApi?.hasOwnProperty('access_token') &&
          authLoginApi?.hasOwnProperty('refresh_token')
        ) {
          handelDeleteAccountUser();
        } else {
          if (typeof authLoginApi.message === 'object') {
            let message = '';
            authLoginApi.message.map(
              (item: string) => (message += `${item}; \n`),
            );
            Alert.alert('Authentification', message);
          } else if (typeof authLoginApi?.message === 'string') {
            if (authLoginApi?.message === 'confirme-compte') {
              navigation.navigate('ConfirmCompteAfterCreate', {
                tel: user.telephone,
              });
            } else {
              Alert.alert('Authentification', authLoginApi?.message);
            }
          } else {
            Alert.alert(
              'Authentification',
              "Une erreur s'est produite lors de votre connexion;\n Réessayez plus tard",
            );
          }
        }
      } else {
        Alert.alert('Erreur', "Le mot de passe saisi n'est pas correct.");
      }
    }
  };

  const handelDeleteAccountUser = async () => {
    setLoading(true);
    const AuthDelete = await AuthDeleteApi();
    setLoading(false);

    // if (AuthDelete?.status === 200) {
    dispatch(
      loginUser({
        isAuthenticated: false,
        access_token: undefined,
        refresh_token: undefined,
      }),
    );
    navigation.navigate('Bottom');
    // }
  };

  return (
    <BottomSheetModalProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={20}>
        <ScrollView
          style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
          <View style={{padding: 10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{padding: 10}}
                onPress={() => {
                  navigation.goBack();
                }}>
                <Feather
                  name="arrow-left"
                  size={30}
                  color={isDarkMode ? colors.white : colors.black}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  padding: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  handlePresentModalPasswordPress();
                }}>
                <Text style={{color: 'red', fontSize: 17}}>Supprimer</Text>
              </TouchableOpacity>
            </View>
            <View style={{padding: 20}}>
              <Text
                style={{
                  color: isDarkMode ? colors.white : colors.black,
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginVertical: 10,
                }}>
                Pourquoi souhaitez-vous quitter EcclessaiBooK ?
              </Text>
              <Text
                style={{
                  color: isDarkMode ? colors.white : colors.primary,
                  fontSize: 17,
                  fontWeight: '300',
                  textAlign: 'justify',
                }}>
                Nous regrettons que vous ayez décidé de quitter notre service.
              </Text>
              <Text
                style={{
                  color: isDarkMode ? colors.white : colors.primary,
                  fontSize: 17,
                  fontWeight: '300',
                  textAlign: 'justify',
                }}>
                Nous aimerions comprendre les raisons de la suppression de votre
                compte.
              </Text>
              <Text
                style={{
                  color: isDarkMode ? colors.white : colors.primary,
                  fontSize: 17,
                  fontWeight: '300',
                  textAlign: 'justify',
                }}>
                Vos commentaires seront précieux pour améliorer notre
                application et soutenir notre communauté.
              </Text>
              <Text
                style={{
                  color: isDarkMode ? colors.white : colors.primary,
                  fontSize: 17,
                  fontWeight: '300',
                  textAlign: 'justify',
                }}>
                Merci de prendre le temps de partager vos motivations avec nous.
              </Text>
            </View>
            <TextInput
              multiline
              numberOfLines={4}
              style={[styles(isDarkMode).textInput, {height: 200}]}
              placeholder="Votre Motivation "
              placeholderTextColor={colors.gris}
              secureTextEntry={seepassword}
              value={motivation}
              onChangeText={setMotifivation}
            />
            {/* <TouchableOpacity onPress={() => {}} style={{
          backgroundColor: '#FB0202',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 15,
          borderRadius: 25,
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 2,
          alignContent: 'center',
          marginHorizontal: 20
        }}>
          <Text style={{
            color: colors.white,
            fontSize: 17,
            fontWeight: '500'
          }}>Continuez</Text>
        </TouchableOpacity> */}
            {loading && <Loading />}
          </View>
          <BottomSheetModal
            ref={bottomSheetPasswordRef}
            onChange={handleSheetChanges}
            snapPoints={snapPoints}
            index={0}>
            <BottomSheetView
              style={{
                flex: 1,
                backgroundColor: backgroundStyle.backgroundColor,
              }}>
              <View
                style={{
                  flex: 1,
                  padding: 10,
                  gap: 40,
                }}>
                <View style={{gap: 20}}>
                  <Text style={styles(isDarkMode).titleTop}>
                    Validation de l'identité du titulaire du compte.
                  </Text>
                  <Text style={styles(isDarkMode).description}>
                    Pour des raisons de sécurité et afin de confirmer votre
                    identité en tant que titulaire du compte, veuillez saisir
                    votre mot de passe ci-dessous. Nous vous remercions pour
                    votre coopération.
                  </Text>
                </View>
                <View>
                  <View
                    style={[
                      styles(isDarkMode).textInput,
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      },
                    ]}>
                    <TextInput
                      style={[styles(isDarkMode).textInput, {width: '90%'}]}
                      placeholder="Mot de passe"
                      placeholderTextColor={colors.gris}
                      secureTextEntry={seepassword}
                      value={password}
                      onChangeText={setPassword}
                      // keyboardType="visible-password"
                    />
                    <Feather
                      onPress={() => {
                        setSeePassword(!seepassword);
                      }}
                      name={seepassword ? 'lock' : 'unlock'}
                      size={20}
                      color={isDarkMode ? colors.white : colors.primary}
                      style={{padding: 10}}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Attention',
                        'En poursuivant, tu confirmes avoir vérifié ta demande de données et exprimes le souhait de continuer avec la suppression de ton compte.',
                        [
                          {
                            text: 'Supprimer',
                            onPress: () => {
                              handelCheckPassword();
                            },
                            style: 'cancel',
                          },
                          {text: 'ANNULER', onPress: () => {}},
                        ],
                      );
                    }}
                    style={styles(isDarkMode).submitBtn}>
                    <Text
                      style={{
                        color: isDarkMode ? colors.white : colors.primary,
                        fontWeight: '500',
                        fontSize: 17,
                      }}>
                      CONFIRMER ET SUPPRIMER
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {loading && <Loading />}
            </BottomSheetView>
          </BottomSheetModal>
        </ScrollView>
      </KeyboardAvoidingView>
    </BottomSheetModalProvider>
  );
}

const styles = (isDarkMode: boolean = true) =>
  StyleSheet.create({
    topPart: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleTop: {
      color: isDarkMode ? colors.white : colors.primary,
      fontSize: Platform.OS === 'android' ? 25 : 30,
      fontWeight: 'bold',
    },
    description: {
      color: colors.gris,
      fontSize: 12,
      textAlign: 'center',
      paddingHorizontal: 10,
    },
    bottomPart: {
      flex: 3,
      backgroundColor: isDarkMode ? colors.white : colors.primary,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      paddingHorizontal: 10,
      paddingTop: 30,
      gap: 15,
    },
    textInput: {
      backgroundColor: isDarkMode ? colors.secondary : colors.white,
      height: 50,
      borderRadius: 14,
      paddingHorizontal: 10,
      marginVertical: 10,
      color: isDarkMode ? colors.white : colors.primary,
    },
    submitBtn: {
      backgroundColor: isDarkMode ? colors.primary : colors.light,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 15,
      borderRadius: 25,
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 5,
      alignContent: 'center',
    },
    textPrivacy: {
      fontWeight: 'bold',
      color: isDarkMode ? colors.black : colors.white,
    },
  });
