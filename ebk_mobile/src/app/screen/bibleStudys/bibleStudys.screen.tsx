import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {StackNavigationScreenProps} from '../../../components/props/props.navigation';
import colors from '../../../components/style/colors';
import CardBibleStudyUI from '../../../components/card/bibleStudy/card.bibleStudy';
import {findBibleStudyPaginatedApi} from '../../api/etudeBiblique/etudeBiblique.req';
import {
  BibleStudyPaginated,
  ItemBibleStudy,
  PayloadUserInterface,
} from '../../config/interface';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {jwtDecode} from 'jwt-decode';
import {selectAuth} from '../../store/auth/auth.slice';
import {useFocusEffect} from '@react-navigation/native';

function BibleStudysScreen({navigation}: StackNavigationScreenProps) {
  const [isActive, setIsActive] = useState<string>('Accueil');
  const [bibleStudys, setBibleStudys] = useState<BibleStudyPaginated>();
  const [bibleStudysChurch, setBibleStudyChurch] = useState<ItemBibleStudy[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const userDecode = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = useState<any>(userDecode);
  const [step, setStep] = useState<'all' | 'church'>(
    user ? (user?.eglise ? 'church' : 'all') : 'all',
  );

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const handleFindTestmoniall = React.useCallback(async () => {
    setLoading(true);
    const find = await findBibleStudyPaginatedApi();
    if (find?.status === 200) {
      setBibleStudys({
        items: find.data.items.filter(
          (item: ItemBibleStudy) => item.contentsBibleStudy.length > 0,
        ),
        links: find.data.links,
        meta: find.data.meta,
      });
      if (user && user.hasOwnProperty('eglise')) {
        const study = find.data.items.filter(
          (item: ItemBibleStudy) =>
            item.eglise.id_eglise === user.eglise.id_eglise,
        );
        setBibleStudyChurch(study);
        setStep('church');
      }
    }
  }, []);

  useEffect(() => {
    handleFindTestmoniall();
  }, [handleFindTestmoniall]);

  useFocusEffect(
    useCallback(() => {
      const e: PayloadUserInterface | undefined = auth.access_token
        ? jwtDecode(auth.access_token)
        : undefined;
      if (user && e) {
        if (user.iat !== e.iat) {
          setUser(e);
        }
      } else {
        if (auth.isAuthenticated) {
          const e: PayloadUserInterface | undefined = auth.access_token
            ? jwtDecode(auth.access_token)
            : undefined;
          setUser(e);
        } else {
          setUser(undefined);
        }
      }
    }, [user, auth]),
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundStyle.backgroundColor,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
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
          onPress={() => setStep('all')}
          style={{
            margin: 10,
            paddingHorizontal: 15,
            paddingVertical: 5,
            borderRadius: 20,
            backgroundColor: isDarkMode
              ? step === 'all'
                ? undefined
                : colors.secondary
              : step === 'all'
              ? undefined
              : colors.blackrgba1,
            borderWidth: step === 'all' ? 0.5 : undefined,
            borderColor: isDarkMode ? colors.red7 : colors.light2,
          }}>
          <Text
            style={{
              color:
                step === 'all'
                  ? isDarkMode
                    ? colors.white
                    : colors.black
                  : colors.gris,
              fontSize: 15,
            }}>
            Tous les forums
          </Text>
        </TouchableOpacity>
      </View>
      {/* <View style={{ flexDirection: 'row',  justifyContent: 'space-around', paddingVertical: 10,borderBottomWidth: 0.2, borderBottomColor: colors.gris}}>
        <TouchableOpacity onPress={() => {setIsActive("Accueil")}}>
          <Text style={{color: isActive === "Accueil" ? isDarkMode ? colors.white: colors.primary : colors.gris}}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {setIsActive("En cours")}}>
          <Text style={{color: isActive === "En cours" ? isDarkMode ? colors.white: colors.primary : colors.gris}}>En cours</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {setIsActive("Suivies")}}>
          <Text style={{color: isActive === "Suivies" ? isDarkMode ? colors.white: colors.primary : colors.gris}}>Suivies</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {setIsActive("Enregistrés")}}>
          <Text style={{color: isActive === "Enregistrés" ? isDarkMode ? colors.white: colors.primary : colors.gris}}>Enregistrés</Text>
        </TouchableOpacity>
      </View> */}
      {step === 'all'
        ? bibleStudys?.items.length === 0 && (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: isDarkMode ? colors.white : colors.black}}>
                L'église ne dispose actuellement d'aucune étude biblique.
              </Text>
            </View>
          )
        : bibleStudysChurch && (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: isDarkMode ? colors.white : colors.black}}>
                L'église ne dispose actuellement d'aucune étude biblique.
              </Text>
            </View>
          )}
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={step === 'all' ? bibleStudys?.items : bibleStudysChurch}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item, index}) => (
            <CardBibleStudyUI bibleStudy={item} navigation={navigation} />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={handleFindTestmoniall}
            />
          }
        />
        <View style={{height: 150}} />
      </ScrollView>
    </View>
  );
}
export default BibleStudysScreen;
