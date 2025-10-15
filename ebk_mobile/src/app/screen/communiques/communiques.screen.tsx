import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import colors from '../../../components/style/colors';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {jwtDecode} from 'jwt-decode';
import {selectAuth} from '../../store/auth/auth.slice';
import Feather from 'react-native-vector-icons/Feather';
import {
  Communiques,
  CommuniquesPaginated,
  PayloadUserInterface,
} from '../../config/interface';
import {findCommuniqueByChurchIdApi} from '../../api/communique/com.req';
import moment from 'moment';

export default function CommuniquesScreen({navigation}: any) {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const userDecode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = useState<PayloadUserInterface | undefined>(
    userDecode,
  );

  const [communiques, setCommuniques] = useState<CommuniquesPaginated>();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const handleGetCommunique = useCallback(async () => {
    if (user && user.eglise) {
      const find = await findCommuniqueByChurchIdApi(user?.eglise.id_eglise);
      if (find?.status === 200) {
        setCommuniques(find.data);
      }
    } else {
      Alert.alert(
        'Connexion requise',
        "Connectez-vous en tant que membre d'une église pour voir les communiqués.",
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
          {
            text: 'ANNULER',
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
      );
    }
  }, []);

  useEffect(() => {
    handleGetCommunique();
  }, [handleGetCommunique]);

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: backgroundStyle.backgroundColor,
      }}>
      {communiques ? (
        communiques?.items.length > 0 ? (
          <FlatList
            data={communiques?.items}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item}) => <CommuniquesItem item={item} />}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={handleGetCommunique}
              />
            }
          />
        ) : (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: colors.gris}}>
              Ici vous allez recevoire tout les communiqués de votre Église
            </Text>
          </View>
        )
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: colors.gris}}>
            Ici vous allez recevoire tout les communiqués de votre Église
          </Text>
        </View>
      )}
    </View>
  );
}

const CommuniquesItem = ({item}: {item: Communiques}) => {
  const [showMore, setShowMore] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View
      style={{
        marginVertical: 10,
        paddingLeft: 10,
        borderLeftColor: colors.gris,
        borderLeftWidth: 2,
      }}>
      <TouchableOpacity
        onPress={() => {
          setShowMore(!showMore);
        }}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={showMore ? undefined : 5}
          style={{color: isDarkMode ? colors.white : colors.primary}}>
          {item.communique}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 10,
        }}>
        {/* <View style={{ flexDirection: "row", gap: 5 }}>
        <Feather name={"eye"} size={20} color={colors.gris} />
        <Text style={{ color: colors.gris }}>93k</Text>
      </View> */}
        <View style={{flexDirection: 'row', gap: 5}}>
          <Feather name={'clock'} size={20} color={colors.gris} />
          <Text style={{color: colors.gris}}>
            {moment(item.createdAt).fromNow()}
          </Text>
        </View>
      </View>
    </View>
  );
};
