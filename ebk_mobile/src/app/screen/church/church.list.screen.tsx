import {FlatList, RefreshControl, View, useColorScheme} from 'react-native';
import colors from '../../../components/style/colors';
import {useCallback, useEffect, useState} from 'react';
import {EglisePaginated} from '../../config/interface';
import CardChurchUI from '../../../components/card/church/card.church';
import {findChurchsPaginatedApi} from '../../api/church/church';
import LoadingGif from '../../../components/loading/loadingGif';

export default function ChurchListScreen({navigation}: {navigation: any}) {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const initData = {
    items: [],
    meta: {
      itemCount: 0,
      itemsPerPage: 0,
      totalItems: 0,
      totalPages: 0,
      currentPage: 0,
    },
    links: {
      previous: '',
      next: '',
      last: '',
      first: '',
    },
  };
  const [churchs, setChurchs] = useState<EglisePaginated>(initData);

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const fetchChurchData = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await findChurchsPaginatedApi(pageNumber);
      if (response?.status === 200) {
        setPage(response.data.meta.currentPage);
        setChurchs(prevChurchs => ({
          meta: response.data.meta,
          links: response.data.links,
          items: [...prevChurchs.items, ...response.data.items],
        }));
      }
    } catch (error) {
      console.error('Error fetching church data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChurchData(page + 1);
  }, []);

  const handleRefresh = () => {
    setChurchs(initData);
    setPage(0);
    fetchChurchData(1);
  };

  const handleEndReached = () => {
    if (churchs.meta.totalPages > page) {
      fetchChurchData(page + 1);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      <FlatList
        data={churchs?.items}
        keyExtractor={(_, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={{height: 10}} />}
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: 10,
        }}
        renderItem={({item, index}) => (
          <CardChurchUI church={item} key={index} navigation={navigation} />
        )}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleRefresh} />
        }
        onEndReachedThreshold={0.25}
        onEndReached={info => {
          handleEndReached();
        }}
      />
      {loading && (
        <View
          style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
          <LoadingGif width={30} height={30} />
        </View>
      )}
    </View>
  );
}
