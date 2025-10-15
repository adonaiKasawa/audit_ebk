import {jwtDecode} from 'jwt-decode';
import React, {useState} from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import colors from '../../../../components/style/colors';
import {PayloadUserInterface} from '../../../config/interface';
import {loginUser, selectAuth} from '../../../store/auth/auth.slice';
import {useAppSelector, useAppDispatch} from '../../../store/hooks';
import Feather from 'react-native-vector-icons/Feather';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {paysDuMonde} from '../../../config/props';
import {AuthLoginApi, UpdateUserApi} from '../../../api/auth';
import Loading from '../../../../components/loading';

export default function AccountScreen({navigation}: {navigation: any}) {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const decode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = React.useState<PayloadUserInterface | undefined>(
    decode,
  );
  const [inEdit, setInEdit] = React.useState<boolean>(false);

  const [nom, setNom] = useState<string>();
  const [prenom, setPrenom] = useState<string>();
  const [adresse, setAdresse] = useState<string>();
  const [ville, setVille] = useState<string>();
  const [pays, setPays] = useState<string>();

  const [password, setPassword] = useState<string>('');
  const [seepassword, setSeePassword] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPws, setLoadingPws] = useState<boolean>(false);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const snapPoints = React.useMemo(() => ['50%', '100%'], []);
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  const bottomSheetPasswordRef = React.useRef<BottomSheetModal>(null);
  // callbacks
  const handlePresentModalPress = React.useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handlePresentModalPasswordPress = React.useCallback(() => {
    bottomSheetPasswordRef.current?.present();
  }, []);

  const handleSheetChanges = React.useCallback((index: number) => {}, []);

  const handelResetUpdate = () => {
    Alert.alert(
      'Annuler',
      'Toutes les modifications que vous avez apportées seront effacées.',
      [
        {
          text: 'Confirmer',
          onPress: () => {
            setNom(undefined);
            setPrenom(undefined);
            setAdresse(undefined);
            setVille(undefined);
            setPays(undefined);
            setInEdit(false);
          },
          style: 'cancel',
        },
        {text: 'ANNULER', onPress: () => {}},
      ],
    );
  };

  const handelConfirmUpdate = async () => {
    setLoading(true);
    if (user) {
      const update = await UpdateUserApi(
        {
          nom,
          prenom,
          ville,
          adresse,
          pays,
        },
        user.sub,
      );
      setLoading(false);
      setInEdit(false);
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
      } else {
        if (update?.status === 409) {
          Alert.alert('Erreur', update.data.message);
        } else if (update?.status === 400) {
          update.data.message.forEach((element: string) => {
            Alert.alert('Erreur', element);
          });
        } else {
          Alert.alert('Modification', "La modification s'est bien passée.");
        }
      }
    }
  };

  const handelCheckPassword = async () => {
    if (user) {
      if (password !== '' && password?.length >= 8) {
        setLoadingPws(true);
        const authLoginApi = await AuthLoginApi({
          telephone: user.telephone,
          password,
        });
        setLoadingPws(false);
        if (
          authLoginApi?.hasOwnProperty('access_token') &&
          authLoginApi?.hasOwnProperty('refresh_token')
        ) {
          dispatch(
            loginUser({
              isAuthenticated: true,
              access_token: authLoginApi?.access_token,
              refresh_token: authLoginApi?.refresh_token,
            }),
          );
          bottomSheetPasswordRef.current?.close();
          setPassword('');
          setSeePassword(true);
          navigation.navigate('forgotPasswordUpdated');
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

  return (
    <BottomSheetModalProvider>
      {user && (
        <>
          <View
            style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Information personnelles */}
              <View style={{margin: 10, gap: 5}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: isDarkMode ? colors.white : colors.primary,
                      fontSize: 17,
                      fontWeight: '500',
                    }}>
                    Information personnelles
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setInEdit(!inEdit);
                    }}
                    style={{padding: 10}}>
                    <Feather
                      name="edit-3"
                      size={25}
                      color={isDarkMode ? colors.white : colors.primary}
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  {/* Nom */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      backgroundColor: isDarkMode
                        ? colors.secondary
                        : colors.light,
                      padding: 15,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center',
                      }}>
                      <Feather
                        name="user"
                        color={isDarkMode ? colors.white : colors.primary}
                        size={20}
                      />
                      <Text
                        style={{
                          color: isDarkMode ? colors.white : colors.primary,
                        }}>
                        Nom
                      </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      {!inEdit ? (
                        <Text
                          style={{
                            color: isDarkMode ? colors.white : colors.primary,
                          }}>
                          {user.nom}
                        </Text>
                      ) : (
                        <TextInput
                          style={{
                            width: '90%',
                            backgroundColor: backgroundStyle.backgroundColor,
                            padding: 10,
                            borderRadius: 8,
                          }}
                          placeholder="Modifier votre nom"
                          placeholderTextColor={colors.gris}
                          value={nom}
                          onChangeText={setNom}
                        />
                      )}
                    </View>
                  </View>
                  {/* Prenom */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: isDarkMode
                        ? colors.secondary
                        : colors.light,
                      padding: 15,
                      marginTop: 2,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center',
                      }}>
                      <Feather
                        name="user"
                        color={isDarkMode ? colors.white : colors.primary}
                        size={20}
                      />
                      <Text
                        style={{
                          color: isDarkMode ? colors.white : colors.primary,
                        }}>
                        Prénom
                      </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      {!inEdit ? (
                        <Text
                          style={{
                            color: isDarkMode ? colors.white : colors.primary,
                          }}>
                          {user.prenom}
                        </Text>
                      ) : (
                        <TextInput
                          style={{
                            width: '90%',
                            backgroundColor: backgroundStyle.backgroundColor,
                            padding: 10,
                            borderRadius: 8,
                          }}
                          placeholder="Modifier votre prénom"
                          placeholderTextColor={colors.gris}
                          value={prenom}
                          onChangeText={setPrenom}
                        />
                      )}
                    </View>
                  </View>
                  {/* Adresse */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: isDarkMode
                        ? colors.secondary
                        : colors.light,
                      padding: 15,
                      marginTop: 2,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center',
                      }}>
                      <Feather
                        name="map-pin"
                        color={isDarkMode ? colors.white : colors.primary}
                        size={20}
                      />
                      <Text
                        style={{
                          color: isDarkMode ? colors.white : colors.primary,
                        }}>
                        Adresse
                      </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      {!inEdit ? (
                        <Text
                          style={{
                            color: isDarkMode ? colors.white : colors.primary,
                          }}>
                          {user.adresse}
                        </Text>
                      ) : (
                        <TextInput
                          style={{
                            width: '90%',
                            backgroundColor: backgroundStyle.backgroundColor,
                            padding: 10,
                            borderRadius: 8,
                          }}
                          placeholder="Modifier votre adresse"
                          placeholderTextColor={colors.gris}
                          value={adresse}
                          onChangeText={setAdresse}
                        />
                      )}
                    </View>
                  </View>
                  {/* Ville */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: isDarkMode
                        ? colors.secondary
                        : colors.light,
                      padding: 15,
                      marginTop: 2,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center',
                      }}>
                      <Feather
                        name="map-pin"
                        color={isDarkMode ? colors.white : colors.primary}
                        size={20}
                      />
                      <Text
                        style={{
                          color: isDarkMode ? colors.white : colors.primary,
                        }}>
                        Ville
                      </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      {!inEdit ? (
                        <Text
                          style={{
                            color: isDarkMode ? colors.white : colors.primary,
                          }}>
                          {user.ville}
                        </Text>
                      ) : (
                        <TextInput
                          style={{
                            width: '90%',
                            backgroundColor: backgroundStyle.backgroundColor,
                            padding: 10,
                            borderRadius: 8,
                          }}
                          placeholder="Modifier votre ville"
                          placeholderTextColor={colors.gris}
                          value={ville}
                          onChangeText={setVille}
                        />
                      )}
                    </View>
                  </View>
                  {/* Pays */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: isDarkMode
                        ? colors.secondary
                        : colors.light,
                      padding: 15,
                      marginTop: 2,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center',
                      }}>
                      <Feather
                        name="map-pin"
                        color={isDarkMode ? colors.white : colors.primary}
                        size={20}
                      />
                      <Text
                        style={{
                          color: isDarkMode ? colors.white : colors.primary,
                        }}>
                        Pays
                      </Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      {!inEdit ? (
                        <Text
                          style={{
                            color: isDarkMode ? colors.white : colors.primary,
                          }}>
                          {user.pays}
                        </Text>
                      ) : (
                        <TouchableOpacity
                          onPress={handlePresentModalPress}
                          style={{
                            width: '90%',
                            backgroundColor: backgroundStyle.backgroundColor,
                            padding: 10,
                            borderRadius: 8,
                          }}>
                          <Text
                            style={{
                              color: pays
                                ? isDarkMode
                                  ? colors.white
                                  : colors.primary
                                : colors.gris,
                            }}>
                            {pays ? pays : 'Modifier le pays'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {inEdit && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        margin: 10,
                      }}>
                      <TouchableOpacity
                        onPress={handelResetUpdate}
                        style={{
                          padding: 10,
                          borderRadius: 12,
                          backgroundColor: colors.secondary,
                        }}>
                        <Text
                          style={{
                            color: colors.white,
                            fontSize: 15,
                            fontWeight: '500',
                          }}>
                          Annuler
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handelConfirmUpdate}
                        style={{
                          padding: 10,
                          borderRadius: 12,
                          backgroundColor: isDarkMode
                            ? colors.white
                            : colors.light,
                        }}>
                        <Text
                          style={{
                            color: colors.black,
                            fontSize: 15,
                            fontWeight: '500',
                          }}>
                          Modifier
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
              {/* Information de Connexion */}
              <View style={{margin: 10, gap: 5}}>
                <Text
                  style={{
                    color: isDarkMode ? colors.white : colors.primary,
                    fontSize: 17,
                    fontWeight: '500',
                  }}>
                  Information de Connexion
                </Text>
                <View>
                  {/* telephone */}
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('AccountPhone');
                    }}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      backgroundColor: isDarkMode
                        ? colors.secondary
                        : colors.light,
                      padding: 15,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center',
                      }}>
                      <Feather
                        name="smartphone"
                        color={isDarkMode ? colors.white : colors.primary}
                        size={20}
                      />
                      <Text
                        style={{
                          color: isDarkMode ? colors.white : colors.primary,
                        }}>
                        Téléphone
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: isDarkMode ? colors.white : colors.primary,
                        }}>
                        {user.telephone}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* Email */}
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('AccountEmail');
                    }}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: isDarkMode
                        ? colors.secondary
                        : colors.light,
                      padding: 15,
                      marginTop: 2,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center',
                      }}>
                      <Feather
                        name="mail"
                        color={isDarkMode ? colors.white : colors.primary}
                        size={20}
                      />
                      <Text
                        style={{
                          color: isDarkMode ? colors.white : colors.primary,
                        }}>
                        Email
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: isDarkMode ? colors.white : colors.primary,
                        }}>
                        {user.email}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* Mot de passe */}
                  <TouchableOpacity
                    onPress={handlePresentModalPasswordPress}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: isDarkMode
                        ? colors.secondary
                        : colors.light,
                      padding: 15,
                      marginTop: 2,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center',
                      }}>
                      <Feather
                        name="lock"
                        color={isDarkMode ? colors.white : colors.primary}
                        size={20}
                      />
                      <Text
                        style={{
                          color: isDarkMode ? colors.white : colors.primary,
                        }}>
                        Mot de passe
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: isDarkMode ? colors.white : colors.primary,
                        }}>
                        ***********
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Suppression compte */}
              <View style={{margin: 10, gap: 5}}>
                <Text
                  style={{
                    color: isDarkMode ? colors.white : colors.primary,
                    fontSize: 17,
                    fontWeight: '500',
                  }}>
                  Suppression de compte
                </Text>
                <View>
                  {/* telephone */}
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('DeletedAccount');
                    }}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderRadius: 10,
                      backgroundColor: isDarkMode
                        ? colors.secondary
                        : colors.light,
                      padding: 15,
                    }}>
                    <View>
                      <Text
                        style={{color: 'red', fontSize: 17, fontWeight: '500'}}>
                        Supprimer le compte definitivement
                      </Text>
                      <Text style={{color: colors.gris, fontSize: 12}}>
                        Ton compte et ton contenu seront définitivement
                        supprimés. Tu peux annuler la demande de suppression en
                        réactivant ton compte dans un délai de 30 jours.
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
            <BottomSheetModal
              ref={bottomSheetRef}
              onChange={handleSheetChanges}
              snapPoints={snapPoints}
              index={0}>
              <BottomSheetFlatList
                data={paysDuMonde}
                keyExtractor={i => i.code}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setPays(item.nom);
                        bottomSheetRef.current?.close();
                      }}
                      style={{
                        padding: 10,
                        backgroundColor: isDarkMode
                          ? colors.secondary
                          : colors.light,
                        marginVertical: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          color: isDarkMode ? colors.white : colors.primary,
                          fontSize: 15,
                          fontWeight: '500',
                        }}>
                        {item.nom}
                      </Text>
                      <Text
                        style={{
                          color: isDarkMode ? colors.white : colors.primary,
                          fontSize: 25,
                          fontWeight: '500',
                        }}>
                        {item.flag}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                contentContainerStyle={{
                  backgroundColor: backgroundStyle.backgroundColor,
                }}
              />
            </BottomSheetModal>
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
                      onPress={handelCheckPassword}
                      style={styles(isDarkMode).submitBtn}>
                      <Text
                        style={{
                          color: isDarkMode ? colors.white : colors.primary,
                          fontWeight: '500',
                          fontSize: 17,
                        }}>
                        Vérification
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {loadingPws && <Loading />}
              </BottomSheetView>
            </BottomSheetModal>
          </View>
          {loading && <Loading />}
        </>
      )}
    </BottomSheetModalProvider>
  );
}

const styles = (isDarkMode: boolean = true) =>
  StyleSheet.create({
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
    textInput: {
      backgroundColor: isDarkMode ? colors.secondary : colors.white,
      height: 50,
      borderRadius: 14,
      paddingHorizontal: 10,
      marginVertical: 10,
      color: isDarkMode ? colors.white : colors.primary,
    },
    submitBtn: {
      backgroundColor: isDarkMode ? colors.secondary : colors.light,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 15,
      borderRadius: 25,
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
      alignContent: 'center',
    },
    textPrivacy: {
      fontWeight: 'bold',
      color: isDarkMode ? colors.black : colors.white,
    },
  });
