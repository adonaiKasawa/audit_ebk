import React from 'react';
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
import {ItemForum} from '../../../app/config/interface';
import {file_url} from '../../../app/api';
const width = Dimensions.get('screen').width;

export default function CardForumUI({
  forum,
  navigation,
}: {
  forum: ItemForum;
  navigation: any;
}) {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.secondary : colors.light,
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ForumParticipation', {forum});
      }}
      style={{
        width: width - 20,
        height: 120,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 10,
        backgroundColor: backgroundStyle.backgroundColor,
        borderRadius: 16,
      }}>
      <View style={{height: 80, width: 80}}>
        <Image
          source={{uri: `${file_url}${forum.eglise.photo_eglise}`}}
          style={{
            width: 80,
            height: 80,
            borderRadius: 50,
          }}
        />
        <Image
          source={{uri: `${file_url}${forum.eglise.photo_eglise}`}}
          style={{
            position: 'absolute',
            right: 10,
            bottom: -5,
            width: 30,
            height: 30,
            borderRadius: 15,
          }}
        />
      </View>
      <View style={{flex: 1, width: width - 100}}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={2}
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: isDarkMode ? colors.light : colors.primary,
            }}>
            {forum.title}
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontSize: 13,
              color: colors.gris,
            }}>
            {forum.description}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginBottom: 5,
          }}>
          <View style={{flexDirection: 'row', gap: 5}}>
            <Octicons name="light-bulb" size={20} color={colors.gris} />
            <Text style={{color: colors.gris}}>
              {forum?.subjectForum?.length}
            </Text>
          </View>
          <View style={{flexDirection: 'row', gap: 5}}>
            <MaterialCommunityIcons
              name="forum-outline"
              size={20}
              color={colors.gris}
            />
            <Text style={{color: colors.gris}}>0</Text>
          </View>
          <View style={{flexDirection: 'row', gap: 5}}>
            <Feather name="users" size={20} color={colors.gris} />
            <Text style={{color: colors.gris}}>0</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function CardForumSubjectUI({
  navigation,
  sujets,
  index,
  forum,
  Comments,
}: any) {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.secondary : colors.light,
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ForumParticipation', {sujets, index});
      }}
      style={{
        width: width - 20,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 10,
        backgroundColor: backgroundStyle.backgroundColor,
        borderRadius: 16,
      }}>
      <View style={{width: 50, alignItems: 'center', gap: 5}}>
        <Octicons name="light-bulb" size={20} color={colors.gris} />
      </View>
      <View style={{width: width - 100, gap: 15, justifyContent: 'center'}}>
        <Text style={{color: colors.gris, fontWeight: '500'}}>
          {Comments?.length}{' '}
          {Comments?.length > 1 ? 'contributions' : 'contribution'}{' '}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
