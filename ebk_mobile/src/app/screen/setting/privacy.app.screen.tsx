import {View} from 'react-native';
import WebView from 'react-native-webview';

export default function PrivacyAppScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const link = route.params.link;
  return (
    <View style={{flex: 1}}>
      <WebView
        source={{uri: `https://ecclesiabook.org/legacy?v=${link}`}}
        style={{flex: 1}}
      />
    </View>
  );
}
