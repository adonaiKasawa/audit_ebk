import React from 'react';
import {
  Platform,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../../../components/style/colors';
import {BlurView} from '@react-native-community/blur';
import {ItemBiblePlanLecture} from '../../../../config/interface';

export const ReadingPlansToStartUpBtn = ({
  plan,
  navigation,
}: {
  plan: ItemBiblePlanLecture;
  navigation: any;
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const handleGotoDetailPlan = () => {
    navigation.navigate('ReadingPlanDetailScreen', {plan});
  };

  return (
    <>
      {Platform.OS === 'ios' ? (
        <BlurView
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            left: 10,
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 25,
            // backgroundColor: isDarkMode ? colors.whitergba3 : colors.blackrgba5,
          }}
          blurType={'light'}
          blurAmount={10}
          blurRadius={20}>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              color: colors.white,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            Démarer
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.white,
              height: 50,
              width: 50,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'flex-end',
            }}
            onPress={handleGotoDetailPlan}>
            <Feather name="chevron-right" size={30} color={colors.black} />
          </TouchableOpacity>
        </BlurView>
      ) : (
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            left: 10,
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 50,
            backgroundColor: isDarkMode ? colors.whitergba3 : colors.blackrgba5,
          }}>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              color: colors.white,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            Démarer
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.white,
              height: 50,
              width: 50,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'flex-end',
            }}
            onPress={handleGotoDetailPlan}>
            <Feather name="chevron-right" size={30} color={colors.black} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export const ReadingPlansToStartUpBtn2 = ({
  planId,
  navigation,
}: {
  planId: number;
  navigation: any;
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const handleGotoDetailPlan = () => {
    navigation.navigate('ReadingPlanDetailScreen', {planId});
  };

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  //   color: isDarkMode ? colors.lighter : colors.primary,
  // };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: colors.white,
        height: 30,
        width: 30,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
      }}
      onPress={handleGotoDetailPlan}>
      <Feather name="arrow-right" size={20} color={colors.black} />
    </TouchableOpacity>
  );
};
