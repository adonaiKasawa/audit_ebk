import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import colors from '../../style/colors';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {
  Eglise,
  ItemForum,
  StatistiqueEglise,
} from '../../../app/config/interface';
import {file_url} from '../../../app/api';
import {capitalize, uppercase} from '../../../app/config/func';
import {findStatistiqueByChurchApi} from '../../../app/api/church/church';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../../app/store';
const width = Dimensions.get('screen').width;
import {
  setStatistiqueData,
  updateMembers,
} from './../../../app/store/statistiqueChurch/statistique.slice'; // adapte le chemin
import {AppState} from '../../../app/store';

export default function CardChurchUI({
  church,
  navigation,
}: {
  church: Eglise;
  navigation: any;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.secondary : colors.light,
  };

  // Utilisation de useSelector pour accéder à l'état global
  const statistique = useSelector(
    (state: AppState) => state.statistique[church.id_eglise],
  );

  const handelFindStatique = useCallback(async () => {
    const find = await findStatistiqueByChurchApi(church.id_eglise);
    if (find?.status === 200) {
      const data = find.data;
      dispatch(setStatistiqueData({id: church.id_eglise, data: find.data})); // Mets à jour le state global Redux
    }
  }, [church.id_eglise, dispatch]);

  useEffect(() => {
    handelFindStatique();
  }, [handelFindStatique]);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ChurchDetail', {church, statistique});
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 10,
        backgroundColor: backgroundStyle.backgroundColor,
        borderRadius: 16,
      }}>
      <Image
        source={{uri: `${file_url}${church.photo_eglise}`}}
        style={{
          width: 60,
          height: 60,
          borderRadius: 50,
        }}
      />
      <View style={{flex: 1, width: width - 100, gap: 10}}>
        <View>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{
              fontSize: 13,
              fontWeight: '500',
              color: isDarkMode ? colors.light : colors.primary,
            }}>
            {uppercase(church.nom_eglise)}
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontSize: 13,
              color: colors.gris,
            }}>
            {capitalize(church.adresse_eglise.toLowerCase())} .{' '}
            {capitalize(church.ville_eglise.toLowerCase())} .{' '}
            {capitalize(church.pays_eglise.toLowerCase())}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
            <AntDesign name="file1" size={20} color={colors.gris} />
            <Text style={{color: colors.gris}}>
              {statistique
                ? statistique?.annonces +
                  statistique?.audios +
                  statistique.images.publication +
                  statistique.videos
                : 0}
            </Text>
          </View>
          <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
            <AntDesign name="staro" size={20} color={colors.gris} />
            <Text style={{color: colors.gris}}>{statistique?.favoris}</Text>
          </View>
          <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
            <Feather name="users" size={20} color={colors.gris} />
            <Text style={{color: colors.gris}}>{statistique?.members}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
