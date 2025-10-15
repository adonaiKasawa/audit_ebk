import React from 'react';
import {Image, Text, useColorScheme, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ActionContent from '../../actions_content/actions.content.ui';

import colors from '../../../components/style/colors';
import moment from 'moment';

function InfoVideoPlayer({
  video,
  file_url,
  handlePresentModalPress,
  navigation,
}: any) {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  return (
    <LinearGradient
      colors={[colors.gris, isDarkMode ? colors.primary : colors.white]}
      start={{x: 0.5, y: 0.1}}
      end={{x: 0.5, y: 0.9}}
      style={{
        width: '100%',
        // height: 100,
        padding: 10,
      }}>
      <Text style={{color: colors.lighter, fontWeight: 'bold', fontSize: 20}}>
        {video.titre}
      </Text>
      <Text style={{color: colors.secondary, fontSize: 15}}>
        {/* 4.4k vues .  */}
        {moment(video.createdAt).fromNow()}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginTop: 20,
        }}>
        <Image
          source={{uri: `${file_url}${video.eglise.photo_eglise}`}}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
          }}
        />
        <View style={{alignItems: 'center'}}>
          <Text
            ellipsizeMode="tail"
            style={{
              color: isDarkMode ? colors.light : colors.primary,
              fontSize: 15,
              fontWeight: '500',
            }}>
            {video.eglise.nom_eglise}
          </Text>
          {/* <Text style={{ color: colors.gris, fontSize: 12, }}>
            54.6 k membres
          </Text> */}
        </View>
      </View>
      <View style={{height: 50}}>
        <ActionContent
          handlePresentModalPress={handlePresentModalPress}
          navigation={navigation}
          content={video}
          typeContent={TypeContentEnum.videos}
        />
      </View>
    </LinearGradient>
  );
}

export default InfoVideoPlayer;
