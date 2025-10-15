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
import {UpdateUserApi} from '../../../api/auth';
import {PayloadUserInterface} from '../../../config/interface';
import {selectAuth, loginUser} from '../../../store/auth/auth.slice';
import {useAppSelector, useAppDispatch} from '../../../store/hooks';

export default function AccountForgotPasswordUpdatedScreen({
  navigation,
}: {
  navigation: any;
}) {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const decode = auth.access_token ? jwtDecode(auth.access_token) : undefined;
  const [user, setUser] = React.useState<PayloadUserInterface>(decode);

  const [password, setPassword] = useState<string>('');
  const [confpassword, setConfPassword] = useState<string>('');
  const [seeConfpassword, setSeeConfPassword] = useState<boolean>(true);
  const [seepassword, setSeePassword] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const handelConfirmUpdate = async () => {
    if (password !== '' && password.length >= 8) {
      if (password === confpassword) {
        setLoading(true);
        const update = await UpdateUserApi(
          {
            password,
          },
          user.sub,
        );
        setLoading(false);
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
          navigation.navigate('Bottom');
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
      } else {
        Alert.alert(
          'Erreur',
          'Le mot de passe et sa confirmation doivent être identiques pour des raisons de sécurité et de validation.',
        );
      }
    } else {
      Alert.alert(
        'Erreur',
        'Le mot de passe doit contenir au moins 8 caractères et inclure une combinaison de lettres, de chiffres et de caractères spéciaux pour renforcer sa sécurité.',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}
      keyboardVerticalOffset={20}>
      <ScrollView
        style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
        <View style={{padding: 10}}>
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
          <View style={{padding: 20}}>
            <Text
              style={{
                color: isDarkMode ? colors.white : colors.black,
                fontSize: 20,
                fontWeight: 'bold',
                marginVertical: 10,
              }}>
              Modifier votre mot de passe.
            </Text>
            <Text
              style={{
                color: isDarkMode ? colors.white : colors.primary,
                fontSize: 17,
                fontWeight: '300',
                textAlign: 'justify',
              }}>
              Pour garantir la sécurité de votre compte, veuillez procéder à la
              modification de votre mot de passe. Choisissez un mot de passe
              fort et assurez-vous de ne le partager avec personne. Nous
              recommandons l'utilisation d'une combinaison de lettres, de
              chiffres et de caractères spéciaux. Merci pour votre attention à
              la sécurité de votre compte.
            </Text>
          </View>
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
              style={styles(isDarkMode).textInput}
              placeholder="Mot de passe"
              placeholderTextColor={colors.gris}
              secureTextEntry={seepassword}
              value={password}
              onChangeText={e => setPassword(e)}
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
              style={{
                flex: 1,
                height: 50,
                color: isDarkMode ? colors.white : colors.primary,
              }}
              placeholder="Confirmer le mot de passer"
              placeholderTextColor={colors.gris}
              secureTextEntry={seeConfpassword}
              value={confpassword}
              onChangeText={e => setConfPassword(e)}
            />
            <Feather
              onPress={() => {
                setSeeConfPassword(!seeConfpassword);
              }}
              name={seeConfpassword ? 'lock' : 'unlock'}
              size={20}
              color={isDarkMode ? colors.white : colors.primary}
              style={{padding: 10}}
            />
          </View>
          <TouchableOpacity
            onPress={handelConfirmUpdate}
            style={{
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
              marginHorizontal: 20,
            }}>
            <Text
              style={{
                color: isDarkMode ? colors.white : colors.primary,
                fontWeight: '500',
              }}>
              Enregister
            </Text>
          </TouchableOpacity>
          {loading && <Loading />}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
      shadowOffset: {width: 0, height: 5},
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 5,
      alignContent: 'center',
    },
    textPrivacy: {
      fontWeight: 'bold',
      color: isDarkMode ? colors.black : colors.white,
    },
  });
