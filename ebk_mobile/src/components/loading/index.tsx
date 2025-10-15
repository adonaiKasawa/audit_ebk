import React from 'react';
import {Image, View} from 'react-native';

const Loading = () => {
  return (
    <View
      style={{
        position: 'absolute',
        backgroundColor: 'black',
        opacity: 0.5,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View>
        <Image
          source={require('../../../assets/img/loading.gif')}
          style={{
            width: 100,
            height: 100,
          }}
        />
      </View>
    </View>
  );
};

export default Loading;
