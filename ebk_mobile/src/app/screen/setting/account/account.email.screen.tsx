import {jwtDecode} from 'jwt-decode';
import React, {useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
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
import {file_url} from '../../../api';
import Feather from 'react-native-vector-icons/Feather';
import {capitalize} from '../../../config/func';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {paysDuMonde} from '../../../config/props';
import {UpdateUserApi} from '../../../api/auth';
import Loading from '../../../../components/loading';

export default function AccountEmailScreen({navigation}: {navigation: any}) {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const decode = auth.access_token ? jwtDecode(auth.access_token) : undefined;
  const [user, setUser] = React.useState<PayloadUserInterface>(decode);

  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const handelConfirmUpdate = async () => {
    if (email !== '' && email.length > 4) {
      if (email !== user.email) {
        setLoading(true);
        const update = await UpdateUserApi(
          {
            email,
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
          "L'adresse e-mail que vous saisissez doit être différent de celui précédemment entré.",
        );
      }
    } else {
      Alert.alert(
        'Erreur',
        "L'adresse e-mail que vous avez entré n'est pas valide. Veuillez réessayer avec une adresse e-mail correct.",
      );
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
            Modifier l'adresse e-mail.
          </Text>
          <Text
            style={{
              color: isDarkMode ? colors.white : colors.primary,
              fontSize: 17,
              fontWeight: '300',
            }}>
            Cette adresse e-mail est associé à votre compte et n'est pas visible
            pour les autres utilisateurs.
          </Text>
        </View>
        <TextInput
          style={{
            backgroundColor: isDarkMode ? colors.secondary : colors.white,
            height: 50,
            borderRadius: 14,
            paddingHorizontal: 10,
            marginVertical: 10,
            color: isDarkMode ? colors.white : colors.primary,
          }}
          placeholder="Adresse e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
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
      </View>
      {loading && <Loading />}
    </View>
  );
}
