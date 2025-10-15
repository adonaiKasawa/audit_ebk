/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';

import {
  Dimensions,
  Image,
  View,
  Text,
  useColorScheme,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  ReadingPlansToStartUpBtn,
  ReadingPlansToStartUpBtn2,
} from '../btn/reading.plans.btn';
import colors from '../../../../../components/style/colors';
import moment from 'moment';
import path from '../../../../../components/image/path';
import {jwtDecode} from 'jwt-decode';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LoadingGif from '../../../../../components/loading/loadingGif';
import {
  ItemBiblePlanLecture,
  PayloadUserInterface,
} from '../../../../config/interface';
import {selectAuth} from '../../../../store/auth/auth.slice';
import {useAppSelector} from '../../../../store/hooks';
import Feather from 'react-native-vector-icons/Feather';
import {file_url} from '../../../../api';

const ReadingPlansCard = ({
  currentPlans,
  leftPlans,
  rightPlans,
  navigation,
}: {
  currentPlans: ItemBiblePlanLecture;
  leftPlans: ItemBiblePlanLecture;
  rightPlans: ItemBiblePlanLecture;
  planItem: ItemBiblePlanLecture;
  navigation: any;
}) => {
  const WIDTH = Dimensions.get('screen').width;

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          height: 400,
          alignItems: 'center',
        }}>
        <View style={{width: 20}}>
          <Image
            source={{uri: `${file_url}${leftPlans.picture}`}}
            style={{
              width: WIDTH / 2,
              height: 300,
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
            }}
          />
        </View>
        <View style={{width: WIDTH - 40, height: 350}}>
          <Image
            source={{uri: `${file_url}${currentPlans.picture}`}}
            style={{
              width: WIDTH - 40,
              height: 350,
              borderRadius: 20,
            }}
          />
          <ReadingPlansToStartUpBtn
            plan={currentPlans}
            navigation={navigation}
          />
        </View>
        <View style={{width: 20}}>
          <Image
            source={{uri: `${file_url}${rightPlans.picture}`}}
            style={{
              width: 20,
              height: 300,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export const ReadingPlansCard2 = ({
  item,
  navigation,
}: {
  item: ItemBiblePlanLecture;
  navigation: any;
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const auth = useAppSelector(selectAuth);
  const decode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user] = useState<PayloadUserInterface | undefined>(decode);

  const [shares] = useState<number>(0);
  const [shared, setShared] = useState<boolean>(false);
  const [loadingShare] = useState<boolean>(false);

  const [favoris, setFavoris] = useState<number>(54);
  const [favorised, setFavorised] = useState<boolean>(false);
  const [loadingFavoris, setLoadingFavoris] = useState<boolean>(false);

  const FavoriIcon = () => {
    if (favorised) {
      return loadingFavoris ? (
        <LoadingGif width={25} height={25} />
      ) : (
        <AntDesign name="star" size={20} color={'#fcba05'} />
      );
    } else {
      return loadingFavoris ? (
        <LoadingGif width={25} height={25} />
      ) : (
        <AntDesign
          name="staro"
          size={20}
          color={isDarkMode ? colors.light : colors.primary}
        />
      );
    }
  };

  const ShareIcon = () => {
    if (shared) {
      return loadingShare ? (
        <LoadingGif width={25} height={25} />
      ) : (
        <Feather name="share" size={20} color={'#f5c542'} />
      );
    } else {
      return loadingShare ? (
        <LoadingGif width={30} height={30} />
      ) : (
        <Feather
          name="share"
          size={20}
          color={isDarkMode ? colors.light : colors.primary}
        />
      );
    }
  };

  const handleToggleFavorisContent = async () => {
    if (auth.isAuthenticated) {
      setLoadingFavoris(true);
      if (favorised) {
        // await deleteFavorisApi(content.id);
        setFavoris(favoris - 1);
        setFavorised(false);
      } else {
        // await createFavorisApi(typeContent, content.id);
        setFavoris(favoris + 1);
        setFavorised(true);
      }
      setLoadingFavoris(false);
    } else {
      Alert.alert(
        'Connexion requise',
        'Votre interaction est précieuse. Connectez-vous SVP.',
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
          {text: 'ANNULER', onPress: () => {}},
        ],
      );
    }
  };

  const handleGotoDetailPlan = () => {
    navigation.navigate('ReadingPlanDetailScreen', {plan: item});
  };

  return (
    <TouchableOpacity
      style={{
        width: 250,
        height: 314,
        backgroundColor: isDarkMode ? colors.secondary : colors.light,
        marginHorizontal: 5,
        borderRadius: 20,
        padding: 5,
      }}
      onPress={handleGotoDetailPlan}>
      <Image
        source={{uri: `${file_url}${item.picture}`}}
        style={{
          width: 240,
          height: 200,
          resizeMode: 'cover',
          borderRadius: 20,
        }}
      />
      <View style={{flex: 1, padding: 10, gap: 2}}>
        <Text
          style={{
            textAlign: 'left',
            fontWeight: '500',
            color: isDarkMode ? colors.white : colors.black,
            textTransform: 'uppercase',
            fontSize: 12,
          }}
          numberOfLines={2}>
          {item.title}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
          <Image
            source={{uri: `${file_url}${item.eglise.photo_eglise}`}}
            style={{
              width: 20,
              height: 20,
              borderRadius: 25,
            }}
          />
          <Text
            style={{
              fontSize: 10,
              color: isDarkMode ? colors.white : colors.gris,
              textTransform: 'uppercase',
            }}>
            {item.eglise.nom_eglise}
          </Text>
        </View>
        <View />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontSize: 10, color: colors.gris}}>
            {moment(item.createdAt).fromNow()}
          </Text>
          <View
            style={{
              backgroundColor: colors.white,
              width: 50,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'flex-end',
            }}>
            <Text
              style={{
                fontSize: 11,
                color: colors.black,
                fontWeight: '600',
              }}>
              j {item.number_days}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginTop: 5,
          }}>
          {/* <TouchableOpacity style={{flexDirection: 'row', alignItems: 'flex-end', gap: 2}}>
            <FavoriIcon /> 
            <Text style={{color: colors.gris, fontSize: 12}}>{item.share.length}</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'flex-end', gap: 2}}>
            <ShareIcon />
            <Text style={{color: colors.gris, fontSize: 12}}>
              {item.share.length}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const ReadingPlansCard3 = ({
  item,
  navigation,
}: {
  item: ItemBiblePlanLecture;
  navigation: any;
}) => {
  const WIDTH = Dimensions.get('screen').width;
  const isDarkMode = useColorScheme() === 'dark';
  const auth = useAppSelector(selectAuth);
  const decode: PayloadUserInterface | undefined = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;
  const [user] = useState<PayloadUserInterface | undefined>(decode);

  const [shares] = useState<number>(0);
  const [shared, setShared] = useState<boolean>(false);
  const [loadingShare] = useState<boolean>(false);

  const [favoris, setFavoris] = useState<number>(54);
  const [favorised, setFavorised] = useState<boolean>(false);
  const [loadingFavoris, setLoadingFavoris] = useState<boolean>(false);

  const FavoriIcon = () => {
    if (favorised) {
      return loadingFavoris ? (
        <LoadingGif width={25} height={25} />
      ) : (
        <AntDesign name="star" size={20} color={'#fcba05'} />
      );
    } else {
      return loadingFavoris ? (
        <LoadingGif width={25} height={25} />
      ) : (
        <AntDesign
          name="staro"
          size={20}
          color={isDarkMode ? colors.light : colors.primary}
        />
      );
    }
  };

  const ShareIcon = () => {
    if (shared) {
      return loadingShare ? (
        <LoadingGif width={25} height={25} />
      ) : (
        <Feather name="share" size={20} color={'#f5c542'} />
      );
    } else {
      return loadingShare ? (
        <LoadingGif width={30} height={30} />
      ) : (
        <Feather
          name="share"
          size={20}
          color={isDarkMode ? colors.light : colors.primary}
        />
      );
    }
  };

  const handleToggleFavorisContent = async () => {
    if (auth.isAuthenticated) {
      setLoadingFavoris(true);
      if (favorised) {
        // await deleteFavorisApi(content.id);
        setFavoris(favoris - 1);
        setFavorised(false);
      } else {
        // await createFavorisApi(typeContent, content.id);
        setFavoris(favoris + 1);
        setFavorised(true);
      }
      setLoadingFavoris(false);
    } else {
      Alert.alert(
        'Connexion requise',
        'Votre interaction est précieuse. Connectez-vous SVP.',
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
          {text: 'ANNULER', onPress: () => {}},
        ],
      );
    }
  };

  const handleGotoDetailPlan = () => {
    navigation.navigate('ReadingPlanDetailScreen', {plan: item});
  };

  return (
    <TouchableOpacity
      style={{
        width: WIDTH - 20,
        height: 120,
        // backgroundColor: isDarkMode ? colors.secondary : colors.light,
        borderRadius: 20,
        padding: 5,
        borderColor: colors.gris,
        borderWidth: 0.3,
        marginBottom: 10,
      }}
      onPress={handleGotoDetailPlan}>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={{uri: `${file_url}${item.picture}`}}
          style={{
            width: 105,
            height: 105,
            resizeMode: 'cover',
            borderRadius: 10,
          }}
        />
        <View style={{flex: 1, padding: 10, gap: 2}}>
          <Text
            style={{
              fontSize: 11,
              color: colors.gris,
            }}>
            Jour{item.number_days > 1 && 's'} {item.number_days}
          </Text>
          <Text
            style={{
              textAlign: 'left',
              fontWeight: '500',
              color: isDarkMode ? colors.white : colors.black,
              textTransform: 'uppercase',
              fontSize: 12,
            }}
            numberOfLines={2}>
            {item.title}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <Image
              source={{uri: `${file_url}${item.eglise.photo_eglise}`}}
              style={{
                width: 20,
                height: 20,
                borderRadius: 25,
              }}
            />
            <Text
              style={{
                fontSize: 10,
                color: isDarkMode ? colors.white : colors.gris,
                textTransform: 'uppercase',
              }}>
              {item.eglise.nom_eglise}
            </Text>
          </View>
          <View />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 10, color: colors.gris}}>
              {moment(item.createdAt).fromNow()}
            </Text>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'flex-end', gap: 2}}>
              <ShareIcon />
              <Text style={{color: colors.gris, fontSize: 12}}>
                {item.share.length}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default ReadingPlansCard;
