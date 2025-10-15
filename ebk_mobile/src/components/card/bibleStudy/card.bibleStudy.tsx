import * as React from 'react';
import {
  View,
  Text,
  useColorScheme,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import colors from '../../../components/style/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ItemBibleStudy} from '../../../app/config/interface';
import {file_url} from '../../../app/api';

const width = Dimensions.get('screen').width;

function CardBibleStudyUI({
  navigation,
  bibleStudy,
}: {
  navigation: any;
  bibleStudy: ItemBibleStudy;
}) {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  React.useEffect(() => {}, []);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('BibleStudyContent', {bibleStudy});
      }}
      style={{
        flex: 1,
        paddingHorizontal: 10,
        gap: 10,
        marginVertical: 10,
      }}>
      <View style={{flex: 1}}>
        {bibleStudy.contentsBibleStudy.length > 0 && (
          <Image
            source={{
              uri: `${file_url}${bibleStudy.contentsBibleStudy[0].image}`,
            }}
            style={{
              width: -10,
              height: 214,
              borderRadius: 16,
            }}
          />
        )}
        {bibleStudy.contentsBibleStudy.length > 1 && (
          <Image
            source={{
              uri: `${file_url}${bibleStudy.contentsBibleStudy[1].image}`,
            }}
            style={{
              width: -10,
              height: 214,
              borderRadius: 16,
              position: 'absolute',
              top: 5,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
        )}
        {bibleStudy.contentsBibleStudy.length > 2 && (
          <Image
            source={{
              uri: `${file_url}${bibleStudy.contentsBibleStudy[2].image}`,
            }}
            style={{
              width: -10,
              height: 214,
              borderRadius: 16,
              position: 'absolute',
              top: 10,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
        )}

        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'space-around',
          }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colors.blackrgba5,
              width: 100,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
              padding: 5,
              alignSelf: 'center',
              marginTop: 50,
            }}>
            <MaterialIcons
              name="playlist-play"
              size={30}
              color={colors.white}
            />
            <Text
              style={{color: colors.white, fontSize: 15, fontWeight: '400'}}>
              {bibleStudy.contentsBibleStudy.length} vidéos
            </Text>
          </View>
          <View
            style={{
              padding: 5,
              flexDirection: 'row',
              gap: 10,
              backgroundColor: colors.blackrgba4,
              borderRadius: 16,
              marginHorizontal: 10,
            }}>
            <Image
              source={{uri: `${file_url}${bibleStudy.eglise.photo_eglise}`}}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
              }}
            />
            <View style={{justifyContent: 'center', gap: 2, flex: 1}}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{color: colors.white, fontSize: 12}}>
                {bibleStudy.titre}{' '}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{color: colors.white, fontSize: 10}}>
                {bibleStudy.eglise.nom_eglise}{' '}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: isDarkMode ? colors.secondary : colors.light,
          height: 35,
          marginTop: 10,
          borderRadius: 12,
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <View style={{flex: 1}}>
          <Image
            source={{
              uri: `${file_url}${bibleStudy.contentsBibleStudy[0].image}`,
            }}
            style={{
              width: 80,
              height: 34,
            }}
            resizeMode="cover"
          />
        </View>
        <View style={{flex: 2}}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{color: isDarkMode ? colors.white : colors.primary}}>
            {bibleStudy.contentsBibleStudy[0].titre}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text
            ellipsizeMode="tail"
            style={{color: isDarkMode ? colors.white : colors.primary}}>
            {bibleStudy.contentsBibleStudy.length} chapitres
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
export default CardBibleStudyUI;
