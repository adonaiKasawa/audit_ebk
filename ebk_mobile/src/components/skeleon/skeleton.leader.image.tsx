import React from 'react';
import {View, useColorScheme, Dimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import colors from '../style/colors';

const {width} = Dimensions.get('screen');

export default function SkeletonImageCard() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={{paddingBottom: 15}}>
      <SkeletonPlaceholder
        backgroundColor={isDarkMode ? '#2a2a2a' : '#e1e9ee'}
        highlightColor={isDarkMode ? '#3a3a3a' : '#f2f8fc'}>
        <View
          style={{
            borderRadius: 20,
            borderWidth: 0.5,
            borderColor: colors.gris,
            paddingVertical: 5,
            width: width,
          }}>
          {/* 👤 Description de l'église */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              gap: 20,
            }}>
            <SkeletonPlaceholder.Item
              width={30}
              height={30}
              borderRadius={10}
            />
            <View>
              <SkeletonPlaceholder.Item
                width={120}
                height={12}
                borderRadius={4}
              />
              <SkeletonPlaceholder.Item
                width={80}
                height={10}
                borderRadius={4}
                marginTop={6}
              />
            </View>
          </View>

          {/* 🖼️ Miniature de l’image (carousel) */}
          <SkeletonPlaceholder.Item
            height={300}
            width={width - 20}
            borderRadius={20}
            marginLeft={10}
          />

          {/* 📝 Description textuelle */}
          <SkeletonPlaceholder.Item
            marginTop={10}
            marginLeft={10}
            width={width - 40}
            height={12}
            borderRadius={4}
          />
          <SkeletonPlaceholder.Item
            marginTop={6}
            marginLeft={10}
            width={width - 60}
            height={10}
            borderRadius={4}
          />
          <SkeletonPlaceholder.Item
            marginTop={6}
            marginLeft={10}
            width={width - 80}
            height={10}
            borderRadius={4}
          />

          {/* ❤️ 🔖 💬 🔁 Actions */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 15,
              marginBottom: 10,
            }}>
            {[...Array(4)].map((_, index) => (
              <SkeletonPlaceholder.Item
                key={index}
                width={25}
                height={25}
                borderRadius={6}
              />
            ))}
          </View>
        </View>
      </SkeletonPlaceholder>
    </View>
  );
}
