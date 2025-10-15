import React from 'react';
import {FlatList, useColorScheme, View} from 'react-native';
import colors from '../../../components/style/colors';
import {ReadingPlansCard3} from './components/card/reading.plans.card';

const ReadingPlansBycategoryScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const category = route.params.category;
  const plans = route.params.plans;
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
    color: isDarkMode ? colors.lighter : colors.primary,
  };

  return (
    <View style={{backgroundColor: backgroundStyle.backgroundColor, flex: 1}}>
      <FlatList
        data={plans}
        keyExtractor={item => item.id.toString()}
        style={{padding: 10}}
        renderItem={({item}) => {
          return <ReadingPlansCard3 navigation={navigation} item={item} />;
        }}
      />
    </View>
  );
};

export default ReadingPlansBycategoryScreen;
