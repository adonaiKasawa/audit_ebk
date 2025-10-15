import React, {useEffect, useState} from 'react';

import OnBoardingSlides from './OnBoardingSlides';
import {useColorScheme, View} from 'react-native';
import colors from '../../../../components/style/colors';
import VersionSelector from '../version.selector.screen';
import {useAppDispatch} from '../../../store/hooks';
import {setBibleFirstOpen} from '../../../store/bible/bible.slice';

const BibleOnBoarding = () => {
  const [step, setStep] = React.useState(0);
  // const { isFirstTime, setFirstTime } = useCheckMandatoryVersions()
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useAppDispatch();
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  useEffect(() => {
    setTimeout(() => {
      setStep(1);
      dispatch(setBibleFirstOpen());
    }, 1000);
  });

  return (
    <View
      style={{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: backgroundStyle.backgroundColor,
      }}>
      {step === 0 && <OnBoardingSlides setStep={setStep} />}
      {step === 1 && <VersionSelector setStep={setStep} />}
      {/* {step === 2 && <DownloadResources setFirstTime={setFirstTime} />} */}
    </View>
  );
};

export default BibleOnBoarding;
