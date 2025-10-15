import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AdminEventListScreen from './admin.event.list.screen';
import AdminEventDetailScreen from './admin.event.detail.screen';
import EventScannerQrCode from './event.scanner.screen';

const Stack = createNativeStackNavigator();

function AdminEventStackNavigation({navigation, route}: any) {
  return (
    <>
      <Stack.Navigator initialRouteName="EventListScreen">
        <Stack.Screen
          name="EventListScreen"
          component={AdminEventListScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="EventDetailScreen"
          component={AdminEventDetailScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="EventScannerQrCode"
          component={EventScannerQrCode}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </>
  );
}

export default AdminEventStackNavigation;
