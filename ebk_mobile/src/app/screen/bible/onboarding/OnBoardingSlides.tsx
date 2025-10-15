import React from 'react';

import {Image, Text, useColorScheme, View} from 'react-native';
import colors from '../../../../components/style/colors';
import Loading from '../../../../components/loading';
import LoadingGif from '../../../../components/loading/loadingGif';

const OnBoardingSlides = ({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  return (
    <View
      style={{
        elevation: 10,
        borderRadius: 25,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 2,
        backgroundColor: isDarkMode ? colors.secondary : colors.light,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 30,
      }}>
      <Image
        source={require('../../../../../assets/img/ecclessia.png')}
        style={{
          resizeMode: 'cover',
          width: 200,
          height: 200,
          marginTop: 20,
        }}
      />
      <Text
        style={{
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 'bold',
          color: isDarkMode ? colors.white : colors.black,
          marginVertical: 10,
        }}>
        La Bible
      </Text>

      <View
        style={{
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <LoadingGif width={50} height={50} />
      </View>
    </View>
  );
};

export default OnBoardingSlides;
