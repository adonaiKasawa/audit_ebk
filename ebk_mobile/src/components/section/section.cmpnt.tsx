import {Text, View, useColorScheme} from 'react-native';
import {SectionProps} from '../props/props.cmpnt';
import {styles} from '../style/style.main';
import colors from '../style/colors';

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? colors.white : colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? colors.light : colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}
