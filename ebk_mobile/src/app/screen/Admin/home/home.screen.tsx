import * as React from 'react';
import {View, Text, ScrollView, useColorScheme} from 'react-native';
import {jwtDecode} from 'jwt-decode';
import colors from '../../../../components/style/colors';
import {selectAuth} from '../../../store/auth/auth.slice';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import HomeChurchScreen from '../../HomeChurch/home.chuch.screen';

function AdminHomeScreen({navigation, route}: any) {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const userDecode = auth.access_token
    ? jwtDecode(auth.access_token)
    : undefined;

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  React.useEffect(() => {
    let isMount = true;
    if (isMount) {
    }
    return () => {
      isMount = false;
    };
  }, []);

  return <HomeChurchScreen navigation={navigation} route={route} />;
}

export default AdminHomeScreen;
