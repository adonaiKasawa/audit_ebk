import * as React from 'react';
import {View, FlatList, useColorScheme, RefreshControl} from 'react-native';
import colors from '../../../../components/style/colors';
import CardAudiosUI from '../../../../components/card/audios/card.audios';
import {TypeContentEnum} from '../../../config/enum';
import {setActiveAudioId} from '../../../store/audiosplayer/audio.id.slice';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';

function HomeAudiosScreen({navigation, audios, handleGetFiles}: any) {
  const isDarkMode = useColorScheme() === 'dark';
  const [refreshing, setrefreshing] = React.useState<boolean>(false);

  const dispatch = useAppDispatch();

  const activeAudioId = useAppSelector(
    state => state.audioPlayer.activeAudioId,
  );

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const onRefresh = async () => {
    if (handleGetFiles) {
      await handleGetFiles(TypeContentEnum.audios);
    }
  };

  const handleAudioPress = (audio: any) => {
    dispatch(setActiveAudioId(audio?.id));
    navigation.navigate('AudiosPlayer', {audios: audio});
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundStyle.backgroundColor,
        paddingTop: 10,
      }}>
      <FlatList
        data={audios}
        keyExtractor={(item, i) => i.toString()}
        ItemSeparatorComponent={() => <View style={{height: 10}}></View>}
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: 5,
        }}
        renderItem={({item}) => (
          <CardAudiosUI
            audios={item}
            navigation={navigation}
            isPlaying={activeAudioId === item?.id} // 👈 passe si c'est actif
            onPress={() => handleAudioPress(item)} // 👈 passe handler
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

export default HomeAudiosScreen;
