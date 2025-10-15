import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View, useColorScheme, Dimensions} from 'react-native';
import colors from '../style/colors';

const {width} = Dimensions.get('window');

export default function SkeletonVideoCard() {
  const isDarkMode = useColorScheme() === 'dark';
  const bg = isDarkMode ? colors.primary : colors.lighter;

  return (
    <View style={{paddingBottom: 10, backgroundColor: bg}}>
      <SkeletonPlaceholder
        backgroundColor={isDarkMode ? '#2a2a2a' : '#e1e9ee'}
        highlightColor={isDarkMode ? '#3a3a3a' : '#f2f8fc'}>
        {/* ⚠️ Tous les enfants dans un seul wrapper */}
        <View>
          {/* Miniature de la vidéo */}
          <SkeletonPlaceholder.Item
            width={width}
            height={188}
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
          />

          {/* Description (style blurview) */}
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            paddingHorizontal={10}
            paddingVertical={10}
            width={width}
            borderBottomLeftRadius={10}
            borderBottomRightRadius={10}>
            {/* Avatar */}
            <SkeletonPlaceholder.Item
              width={50}
              height={50}
              borderRadius={25}
            />

            <SkeletonPlaceholder.Item marginLeft={15} flex={1}>
              {/* Titre */}
              <SkeletonPlaceholder.Item
                width="100%"
                height={14}
                borderRadius={4}
              />
              {/* Détails */}
              <SkeletonPlaceholder.Item
                marginTop={6}
                width="60%"
                height={10}
                borderRadius={4}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </View>
      </SkeletonPlaceholder>
    </View>
  );
}
