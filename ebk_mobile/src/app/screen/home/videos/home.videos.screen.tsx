import * as React from 'react';
import {View, FlatList, useColorScheme} from 'react-native';
import colors from '../../../../components/style/colors';
import CardVideosUI from '../../../../components/card/videos/card.videos';
import {RefreshControl} from 'react-native';
import {TypeContentEnum} from '../../../config/enum';
import {ItemVideos} from '../../../config/interface';
import SkeletonVideoCard from '../../../../components/skeleon/skeleton.leader.video';

function HomeVideosScreen({
  navigation,
  route,
  videos,
  handelGetFiles,
}: {
  navigation: any;
  route: any;
  videos: ItemVideos[];
  handelGetFiles?: (typeContent: TypeContentEnum) => Promise<void>;
}) {
  const [refreshing, setrefreshing] = React.useState<boolean>(false);
  const isDarkMode = useColorScheme() === 'dark';

  const [loadingSkeleton, setLoadingSkeleton] = React.useState<boolean>(true);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const onRefresh = async () => {
    if (handelGetFiles) {
      await handelGetFiles(TypeContentEnum.videos);
    }
  };

  React.useEffect(() => {
    if (videos?.length > 0) {
      setLoadingSkeleton(false);
    }
  }, [videos]);

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      {loadingSkeleton ? (
        <FlatList
          data={Array.from({length: 5})}
          keyExtractor={(_, i) => i.toString()}
          renderItem={() => <SkeletonVideoCard />}
        />
      ) : (
        <FlatList
          key={'videos_1_col'} // 🔑 ou 'videos_3_col' si 3 colonnes
          data={videos}
          keyExtractor={(item, i) => i.toString()}
          showsVerticalScrollIndicator={false}
          numColumns={loadingSkeleton ? 1 : 1} // tu peux mettre 3 si tes Cards sont en grille
          initialNumToRender={3} // ne charge que 3 vidéos au début
          windowSize={5} // nombre de vues à conserver autour de la zone visible
          maxToRenderPerBatch={3} // max par lot de rendu
          removeClippedSubviews={true} // supprime les vidéos hors de l’écran
          renderItem={({item}) => (
            <CardVideosUI navigation={navigation} route={route} videos={item} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

export default HomeVideosScreen;
