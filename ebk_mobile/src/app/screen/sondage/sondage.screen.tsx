import React, {useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import colors from '../../../components/style/colors';
import {jwtDecode} from 'jwt-decode';
import {selectAuth} from '../../store/auth/auth.slice';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {ItemSondageQst, PayloadUserInterface} from '../../config/interface';
import {TouchableOpacity} from 'react-native';
import {
  findSondageQstApi,
  findSondageQstByEglsieIdApi,
  findSondageQstUserAnsweredApi,
} from '../../api/sondageQst/sondageQst.req';
import CardSondageUI from '../../../components/card/sondage/card.sondage';
import Loading from '../../../components/loading';

export default function SondageScreen({navigation}: {navigation: any}) {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const userDecode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = useState<PayloadUserInterface | undefined>(
    userDecode,
  );
  const [step, setStep] = useState<'public' | 'church' | 'answer'>(
    user ? (user?.eglise ? 'church' : 'public') : 'public',
  );
  const [refreshing, setrefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [sondageQsts, setSondageQsts] = useState<ItemSondageQst[]>([]);
  const [sondageQstsFromEglise, setSondageQstsFromEglise] = useState<
    ItemSondageQst[]
  >([]);
  const [sondageQstsUserAnswered, setSondageQstsUserAnswered] = useState<
    ItemSondageQst[]
  >([]);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const handleFindSondageQst = async () => {
    setLoading(true);
    const sondage = await findSondageQstApi();
    setLoading(false);
    if (sondage?.status === 200) {
      setSondageQsts(sondage.data.items);
    }
  };

  const handleFindSondageQstUserAnswered = async () => {
    if (user) {
      setLoading(true);
      const sondage = await findSondageQstUserAnsweredApi(user.sub);
      setLoading(false);
      if (sondage?.status === 200) {
        setSondageQstsUserAnswered(sondage.data);
      }
    }
  };

  const handleFindSondageByEglseId = async () => {
    if (user) {
      setLoading(true);
      const sondage = await findSondageQstByEglsieIdApi(user.eglise.id_eglise);
      setLoading(false);
      if (sondage?.status === 200) {
        setSondageQstsFromEglise(sondage.data.items);
      }
    }
  };

  useEffect(() => {
    handleFindSondageQst();
    handleFindSondageByEglseId();
    handleFindSondageQstUserAnswered();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => setStep('public')}
          style={{
            margin: 10,
            paddingHorizontal: 15,
            paddingVertical: 5,
            borderRadius: 20,
            backgroundColor: isDarkMode
              ? step === 'public'
                ? undefined
                : colors.secondary
              : step === 'public'
              ? undefined
              : colors.blackrgba1,
            borderWidth: step === 'public' ? 0.5 : undefined,
            borderColor: isDarkMode ? colors.red7 : colors.light2,
          }}>
          <Text
            style={{
              color:
                step === 'public'
                  ? isDarkMode
                    ? colors.white
                    : colors.black
                  : colors.gris,
              fontSize: 15,
            }}>
            Tous
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setStep('church')}
          style={{
            margin: 10,
            paddingHorizontal: 15,
            paddingVertical: 5,
            borderRadius: 20,
            backgroundColor: isDarkMode
              ? step === 'church'
                ? undefined
                : colors.secondary
              : step === 'church'
              ? undefined
              : colors.blackrgba1,
            borderWidth: step === 'church' ? 0.5 : undefined,
            borderColor: isDarkMode ? colors.red7 : colors.light2,
          }}>
          <Text
            style={{
              color:
                step === 'church'
                  ? isDarkMode
                    ? colors.white
                    : colors.black
                  : colors.gris,
              fontSize: 15,
            }}>
            Mon Église
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setStep('answer')}
          style={{
            margin: 10,
            paddingHorizontal: 15,
            paddingVertical: 5,
            borderRadius: 20,
            backgroundColor: isDarkMode
              ? step === 'answer'
                ? undefined
                : colors.secondary
              : step === 'answer'
              ? undefined
              : colors.blackrgba1,
            borderWidth: step === 'answer' ? 0.5 : undefined,
            borderColor: isDarkMode ? colors.red7 : colors.light2,
          }}>
          <Text
            style={{
              color:
                step === 'answer'
                  ? isDarkMode
                    ? colors.white
                    : colors.black
                  : colors.gris,
              fontSize: 15,
            }}>
            Participer
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={
          step === 'public'
            ? sondageQsts
            : step === 'church'
            ? sondageQstsFromEglise
            : step === 'answer'
            ? sondageQstsUserAnswered
            : []
        }
        // key={step}
        keyExtractor={(item: any) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={{height: 10}} />}
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: 10,
        }}
        renderItem={({item, index}) => (
          <CardSondageUI sondage={item} key={index} navigation={navigation} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={
              step === 'public'
                ? handleFindSondageQst
                : step === 'church'
                ? handleFindSondageQstUserAnswered
                : step === 'answer'
                ? handleFindSondageByEglseId
                : undefined
            }
          />
        }
      />
      {loading && <Loading />}
    </View>
  );
}
