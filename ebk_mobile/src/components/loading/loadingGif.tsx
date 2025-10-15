import React from 'react';
import {DimensionValue, Image, Text, View} from 'react-native';
import colors from '../style/colors';

type LoadingGifProps = {
  width: DimensionValue | undefined;
  height: DimensionValue | undefined;
  progress?: string;
};

const LoadingGif = ({width, height, progress}: LoadingGifProps) => {
  const x = parseInt(String(width)) / 2;
  const y = parseInt(String(height)) / 2;

  return (
    <View style={{width, height}}>
      <Image
        source={require('../../../assets/img/loading.gif')}
        style={{
          width: width,
          height: height,
        }}
      />
      {progress && (
        <Text
          style={{
            position: 'absolute',
            textAlign: 'center',
            top: y / 2,
            bottom: y / 2,
            right: x / 2,
            left: x / 2,
            color: colors.red,
          }}>
          {progress}
        </Text>
      )}
    </View>
  );
};

export default LoadingGif;
