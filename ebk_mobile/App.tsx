/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {Platform, SafeAreaView, Text, useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import colors from './src/components/style/colors';
import StatusBarComponent from './src/components/statusbar/status.bar.cmpnt';
import StackNavigationApp from './src/app/navigation/stack/stack.navigation';
import {appPersist, store} from './src/app/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import moment from 'moment';
import 'moment/locale/fr';
import {setupPlayer} from './PlaybackService';
// import TrackPlayer from 'react-native-track-player';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import {NotifierWrapper} from 'react-native-notifier';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import BibleThemeInitializer from './src/app/store/bible/bible.theme.initializer';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
// import { Capability } from 'react-native-track-player';
import TrackPlayer, {Capability} from 'react-native-track-player';

messaging.NotificationAndroidVisibility.VISIBILITY_PUBLIC;

moment.locale('fr');

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const handelIosTrackingTransparencyPermission = () => {
    if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY).then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              "La fonctionnalité de suivi n'est pas disponible sur cet appareil.",
            );
            break;
          case RESULTS.DENIED:
            request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY).then(() => {});
            break;
          case RESULTS.GRANTED:
            console.log('La permission de suivi a été accordée.');
            break;
          case RESULTS.BLOCKED:
            console.log(
              "La permission de suivi est bloquée par l'utilisateur.",
            );
            break;
        }
      });
    }
  };

  // useEffect(() => {
  //   setupPlayer().then(async e => {
  //     if (e) {
  //       await TrackPlayer.add({ url: '' });
  //       await TrackPlayer.play();
  //       await TrackPlayer.add({
  //         id: 'track1',
  //         url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  //         title: 'Test',
  //         artist: 'Artist',
  //       });
  //     }
  //   });

  //   handelIosTrackingTransparencyPermission();
  // }, []);

  useEffect(() => {
    const bootstrap = async () => {
      // 1) Prépare le player UNE seule fois
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add({url: ''});

      // 3) Lance la lecture
      await TrackPlayer.play();
    };

    bootstrap();
    handelIosTrackingTransparencyPermission();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={appPersist}>
          <BibleThemeInitializer>
            <NotifierWrapper>
              <NavigationContainer>
                <SafeAreaProvider>
                  <SafeAreaView
                    style={{
                      flex: 1,
                      backgroundColor: backgroundStyle.backgroundColor,
                    }}>
                    <StatusBarComponent />
                    <StackNavigationApp />
                  </SafeAreaView>
                </SafeAreaProvider>
              </NavigationContainer>
            </NotifierWrapper>
          </BibleThemeInitializer>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
