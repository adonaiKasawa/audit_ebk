import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export const SkeletonLoaderSuggestion = () => {
  return (
    <SkeletonPlaceholder borderRadius={8}>
      <>
        {[...Array(3)].map((_, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              marginBottom: 20,
              paddingHorizontal: 10,
              marginTop: 10,
            }}>
            <View style={{width: 40, height: 40, borderRadius: 20}} />
            <View style={{marginLeft: 10, flex: 1}}>
              <View style={{width: '50%', height: 12, marginBottom: 6}} />
              <View style={{width: '30%', height: 10, marginBottom: 6}} />
              <View style={{width: '80%', height: 10, marginTop: 10}} />
            </View>
          </View>
        ))}
      </>
    </SkeletonPlaceholder>
  );
};
