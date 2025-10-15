import React, {useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import colors from '../../../components/style/colors';
import {file_url} from '../../api';
import Gallery from 'react-native-awesome-gallery';

const {width, height} = Dimensions.get('screen');

export default function ImagesGalleryPlayerScreen({navigation, route}: any) {
  const images: string[] = route.params?.images;
  const full_image_paths = images.map(img => `${file_url}${img}`);

  const isDarkMode = useColorScheme() === 'dark';
  const [showMaxLines, setShowMaxLines] = useState<boolean>(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  return (
    <Gallery
      data={full_image_paths}
      onIndexChange={newIndex => {}}
      onSwipeToClose={() => {
        navigation.goBack();
      }}
    />
  );
}
