import React from 'react';
import {Button, Text, View} from 'react-native';
import {StackNavigationScreenProps} from '../../../components/props/props.navigation';

function ProfilScreen({navigation, route}: StackNavigationScreenProps) {
  const itemId: number = route.params?.itemId;
  const otherParam: string = route.params?.otherParam;

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>
        Profile Screen {itemId} {otherParam}
      </Text>
      <Button
        title="Go to profile... again"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

export default ProfilScreen;
