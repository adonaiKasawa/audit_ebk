import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import colors from '../../../components/style/colors';

export default function BibleIntroScreen({
  onStartReading,
}: {
  onStartReading: () => void;
}) {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  const textColor = isDarkMode ? '#fff' : '#000';

  return (
    <View style={[styles.container, backgroundStyle]}>
      <Text style={[styles.title, {color: textColor}]}>LA</Text>
      <Text style={[styles.holy, {color: textColor}]}>SAINTE BIBLE</Text>
      <Text style={[styles.version, {color: textColor}]}>Strong Version</Text>

      <TouchableOpacity
        style={[
          styles.readButton,
          {backgroundColor: isDarkMode ? colors.lighter : colors.primary},
        ]}
        onPress={onStartReading}>
        <Text
          style={[
            styles.readButtonText,
            {color: isDarkMode ? '#000' : '#fff'},
          ]}>
          📖 Lire la Bible
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    letterSpacing: 3,
    fontWeight: '400',
    fontFamily: 'serif',
  },
  holy: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'serif',
    letterSpacing: 2,
  },
  version: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 10,
    marginBottom: 60,
    fontFamily: 'serif',
  },
  readButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 4,
  },
  readButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
