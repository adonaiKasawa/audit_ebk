import {StatusBar, useColorScheme} from 'react-native';
import colors from '../style/colors';

export default function StatusBarComponent() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };
  return (
    <StatusBar
      barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      backgroundColor={backgroundStyle.backgroundColor}
    />
  );
}
