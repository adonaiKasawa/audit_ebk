import * as React from 'react';
import {
  View,
  FlatList,
  ScrollView,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import {StackNavigationScreenProps} from '../../../../components/props/props.navigation';
import colors from '../../../../components/style/colors';
import CardBooksUI from '../../../../components/card/books/card.book';
import {TypeContentEnum} from '../../../config/enum';

function HomeBooksScreen({navigation, route, livres, handelGetFiles}: any) {
  const isDarkMode = useColorScheme() === 'dark';

  const [refreshing, setrefreshing] = React.useState<boolean>(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const onRefresh = async () => {
    if (handelGetFiles) {
      await handelGetFiles(TypeContentEnum.livres);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundStyle.backgroundColor,
        paddingTop: 10,
      }}>
      <FlatList
        data={livres}
        keyExtractor={(item, i) => i.toString()}
        ItemSeparatorComponent={() => <View style={{height: 10}}></View>}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        style={{
          marginBottom: 100,
        }}
        renderItem={({item}) => (
          <CardBooksUI navigation={navigation} livres={item} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

export default HomeBooksScreen;
