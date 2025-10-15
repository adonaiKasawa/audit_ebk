import * as React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  useColorScheme,
  Dimensions,
  Platform,
} from 'react-native';
import {StackNavigationScreenProps} from '../../../components/props/props.navigation';
import colors from '../../../components/style/colors';
import {CardForumSubjectUI} from '../../../components/card/forum/card.forum';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {file_url} from '../../api';

const width = Dimensions.get('screen').width;

function ForumSubjectScreen({navigation, route}: StackNavigationScreenProps) {
  const {forum} = route.params;
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      <View
        style={{
          gap: 10,
          paddingHorizontal: 10,
          backgroundColor: backgroundStyle.backgroundColor,
          borderRadius: 16,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
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
          <View style={{flex: 1, justifyContent: 'center', gap: 5}}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                color: isDarkMode ? colors.light : colors.primary,
              }}>
              {forum.title}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{flexDirection: 'row', gap: 5}}>
                <Octicons name="light-bulb" size={20} color={colors.gris} />
                <Text style={{color: colors.gris}}>
                  {forum.subjectForum.length}
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
        </View>
        <View style={{paddingVertical: 10}}>
          <Text
            style={{
              fontSize: 13,
              color: isDarkMode ? colors.light : colors.primary,
            }}>
            {forum.description}
          </Text>
        </View>
      </View>

      {forum.subjectForum.length > 0 ? (
        <FlatList
          data={forum.subjectForum}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
          style={{
            paddingHorizontal: 10,
          }}
          renderItem={({item, index}) => (
            <CardForumSubjectUI
              sujets={item}
              index={index + 1}
              navigation={navigation}
              key={index}
            />
          )}
          // onRefresh={() => {}}
          // refreshing={true}
        />
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              color: colors.gris,
              textAlign: 'center',
              paddingHorizontal: 10,
            }}>
            Le forum n'a pas encore de sujets, mais nous travaillons pour
            permettre à nos fidèles membres de proposer des sujets en se basant
            sur le titre et la description du forum.
          </Text>
        </View>
      )}
    </View>
  );
}
export default ForumSubjectScreen;
