import {jwtDecode} from 'jwt-decode';
import React, {useRef, useState} from 'react';
import {
  Alert,
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
import Feather from 'react-native-vector-icons/Feather';
import {UpdateUserApi} from '../../../api/auth';
import Loading from '../../../../components/loading';
import PhoneInput from 'react-native-phone-input';

export default function AccountPhoneScreen({navigation}: {navigation: any}) {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const decode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = React.useState<PayloadUserInterface | undefined>(
    decode,
  );

  const [telephone, setPhoneNumber] = useState<string>('');
  const phone = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const handelConfirmUpdate = async () => {
    if (user) {
      if (telephone !== '' && telephone.length > 4) {
        if (telephone !== user.telephone) {
          setLoading(true);
          const update = await UpdateUserApi(
            {
              telephone,
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
              update?.data?.access_token &&
                jwtDecode(update?.data?.access_token),
            );
            Alert.alert('Modification', "La modification s'est bien passée.");
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
            'Le numéro que vous saisissez doit être différent de celui précédemment entré.',
          );
        }
      } else {
        Alert.alert(
          'Erreur',
          "Le numéro que vous avez entré n'est pas valide. Veuillez réessayer avec un numéro correct.",
        );
      }
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
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
            Veuillez entrer un numéro de téléphone.
          </Text>
          <Text
            style={{
              color: isDarkMode ? colors.white : colors.primary,
              fontSize: 17,
              fontWeight: '300',
            }}>
            Ce numéro de téléphone est associé à votre compte et n'est pas
            visible pour les autres utilisateurs.
          </Text>
        </View>
        <PhoneInput
          initialCountry={'cd'}
          ref={phone}
          initialValue={telephone}
          onChangePhoneNumber={e => {
            setPhoneNumber(e);
          }}
          textStyle={{
            color: isDarkMode ? colors.white : colors.black,
          }}
          cancelText={'Annuler'}
          confirmText={'Confirmer'}
          pickerBackgroundColor={isDarkMode ? colors.primary : colors.white}
          pickerItemStyle={{
            backgroundColor: isDarkMode ? colors.primary : colors.white,
          }}
          pickerButtonColor={colors.primary}
          cancelTextStyle={{
            padding: 10,
            backgroundColor: isDarkMode ? colors.secondary : colors.light,
            color: isDarkMode ? colors.white : colors.black,
          }}
          confirmTextStyle={{
            padding: 10,
            backgroundColor: isDarkMode ? colors.secondary : colors.light,
            borderRadius: 10,
            color: isDarkMode ? colors.white : colors.black,
          }}
          flagStyle={{
            width: 30,
            height: 20,
            padding: 10,
          }}
          buttonTextStyle={{
            color: colors.gris,
            backgroundColor: 'red',
            padding: 10,
          }}
          style={styles(isDarkMode).textInput}
        />
        <TouchableOpacity
          onPress={handelConfirmUpdate}
          style={styles(isDarkMode).submitBtn}>
          <Text style={styles(isDarkMode).textBtn}>Enregister</Text>
        </TouchableOpacity>
      </View>
      {loading && <Loading />}
    </View>
  );
}

const styles = (isDarkMode: boolean = true) =>
  StyleSheet.create({
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
      marginHorizontal: 20,
    },
    textBtn: {
      fontWeight: 'bold',
      color: isDarkMode ? colors.white : colors.primary,
    },
  });
