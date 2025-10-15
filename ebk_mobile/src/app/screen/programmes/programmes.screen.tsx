import {jwtDecode} from 'jwt-decode';
import {useState, useCallback, useEffect} from 'react';
import {
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import colors from '../../../components/style/colors';
import {findCommuniqueByChurchIdApi} from '../../api/communique/com.req';
import {
  PayloadUserInterface,
  CommuniquesPaginated,
  Communiques,
  Programme,
  SousProgramme,
} from '../../config/interface';
import {selectAuth} from '../../store/auth/auth.slice';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {findProgrammeByChurchIdApi} from '../../api/programme/prog.res';
import {capitalize} from '../../config/func';
import Feather from 'react-native-vector-icons/Feather';
import {FadeIn} from 'react-native-reanimated';
import moment from 'moment';

export default function ProgrammesScreen({navigation}: {navigation: any}) {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const userDecode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = useState<PayloadUserInterface | undefined>(
    userDecode,
  );
  const [programmes, setProgrammes] = useState<Programme[]>();
  const [daySelected, setDaySelected] = useState<string>('dimanche');
  const days = [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ];

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const handleGetCommunique = useCallback(async () => {
    if (user && user.eglise) {
      const find = await findProgrammeByChurchIdApi(user?.eglise.id_eglise);
      if (find?.status === 200) {
        setProgrammes(find.data);
      }
    } else {
      Alert.alert(
        'Connexion requise',
        " Connectez-vous etant que membre d'une église pour voir les programmes.",
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
    <View style={{flex: 1, ...backgroundStyle}}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleGetCommunique} />
        }>
        {days.map(day => {
          const findprogramme = programmes?.find(
            item => item.titre.toLowerCase() === day.toLowerCase(),
          );
          const souspregramme = findprogramme?.sousProgramme;
          if (souspregramme && souspregramme.length > 0) {
            return (
              <ProgrammeForDayItem
                key={day}
                souspregramme={souspregramme}
                item={day}
                setDaySelected={setDaySelected}
                selected={day.toLowerCase() === daySelected.toLowerCase()}
              />
            );
          }
        })}
      </ScrollView>
    </View>
  );
}

const ProgrammeForDayItem = ({
  item,
  selected,
  setDaySelected,
  souspregramme,
}: {
  souspregramme: SousProgramme[] | undefined;
  item: string;
  selected: boolean;
  setDaySelected: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  return (
    <View style={{margin: 10}}>
      <TouchableOpacity
        onPress={() => {
          setDaySelected(item);
        }}
        style={{
          padding: 10,
          justifyContent: 'space-between',
          flexDirection: 'row',
          backgroundColor: isDarkMode ? colors.secondary : colors.light,
          borderRadius: 16,
        }}>
        <Text
          style={{
            color: isDarkMode ? colors.white : colors.black,
            fontSize: 18,
            fontWeight: '500',
          }}>
          {capitalize(item)}
        </Text>
        <Feather
          name={selected ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={isDarkMode ? colors.white : colors.black}
        />
      </TouchableOpacity>
      <View
        style={{
          marginHorizontal: 10,
          backgroundColor: colors.blackrgba3,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          paddingHorizontal: 10,
          display: selected ? 'flex' : 'none',
          transform: '5s',
        }}>
        {souspregramme &&
          souspregramme.length > 0 &&
          souspregramme.map((item, index) => (
            <View
              key={index}
              style={{
                borderBottomWidth: 1,
                borderBottomColor:
                  index === souspregramme.length - 1
                    ? colors.blackrgba3
                    : colors.gris,
                padding: 10,
              }}>
              <Text
                style={{
                  color: isDarkMode ? colors.white : colors.black,
                  fontSize: 17,
                }}>
                {item.libelle}
              </Text>
              <Text
                style={{
                  color: isDarkMode ? colors.white : colors.black,
                  fontSize: 17,
                }}>
                Heure: {moment(item.debut).format('LT')} à{' '}
                {moment(item.fin).format('LT')}
              </Text>
            </View>
          ))}
      </View>
    </View>
  );
};
