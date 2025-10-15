import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Image,
  useColorScheme,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {StackNavigationScreenProps} from '../../../components/props/props.navigation';
import colors from '../../../components/style/colors';
import CardForumUI from '../../../components/card/forum/card.forum';
import {findForumAllPaginatedApi} from '../../api/church/church';
import {
  ForumPaginated,
  ItemForum,
  PayloadUserInterface,
} from '../../config/interface';
import {TouchableOpacity} from 'react-native';
import {jwtDecode} from 'jwt-decode';
import {selectAuth} from '../../store/auth/auth.slice';
import {useAppSelector, useAppDispatch} from '../../store/hooks';
import {useFocusEffect} from '@react-navigation/native';

function ForumScreen({navigation}: StackNavigationScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  const [forums, setForums] = useState<ForumPaginated>();
  const [forumsChurch, setForumsChurch] = useState<ItemForum[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setrefreshing] = useState<boolean>(false);
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const userDecode = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user, setUser] = useState<any>(userDecode);
  const [step, setStep] = useState<'all' | 'church'>(
    user ? (user?.eglise ? 'church' : 'all') : 'all',
  );

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const handleGetForum = useCallback(async () => {
    setLoading(true);
    const find = await findForumAllPaginatedApi();
    setLoading(false);
    if (find?.status === 200) {
      setForums(find.data);
      if (user && user.hasOwnProperty('eglise')) {
        const forum = find.data.items.filter(
          (item: ItemForum) => item.eglise.id_eglise === user.eglise.id_eglise,
        );
        setForumsChurch(forum);
        setStep('church');
      }
    }
  }, [findForumAllPaginatedApi]);

  useEffect(() => {
    handleGetForum();
  }, [handleGetForum]);

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
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
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
      <Text style={{fontSize: 15, margin: 10, color: colors.gris}}>
        Les forums évangéliques peuvent être un excellent moyen de partager des
        connaissances, d'échanger des idées et de se soutenir mutuellement dans
        la foi.
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {step === 'all' ? (
          <FlatList
            data={forums?.items}
            keyExtractor={item => item.id.toString()}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            showsVerticalScrollIndicator={false}
            style={{
              paddingHorizontal: 10,
            }}
            renderItem={({item, index}) => (
              <CardForumUI forum={item} key={index} navigation={navigation} />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleGetForum}
              />
            }
          />
        ) : forumsChurch ? (
          <FlatList
            data={forumsChurch}
            keyExtractor={item => item.id.toString()}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            showsVerticalScrollIndicator={false}
            style={{
              paddingHorizontal: 10,
            }}
            renderItem={({item, index}) => (
              <CardForumUI forum={item} key={index} navigation={navigation} />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleGetForum}
              />
            }
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: isDarkMode ? colors.white : colors.black}}>
              L'église ne dispose actuellement d'aucun forum.
            </Text>
          </View>
        )}
        <View style={{height: 150}} />
      </ScrollView>
    </View>
  );
}

export default ForumScreen;
