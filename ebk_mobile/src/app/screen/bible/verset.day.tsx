import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../../../components/style/colors';
import {dailyVerses} from './dayoversets/dayverset';

interface Verse {
  reference: string;
  text: string;
}

const VersetDayScreen = ({navigation}: any) => {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerseOfTheDay = () => {
      try {
        const today = new Date();
        const dayOfYear = Math.floor(
          (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
            (1000 * 60 * 60 * 24),
        );
        const index = dayOfYear % dailyVerses.length;
        setVerse(dailyVerses[index]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchVerseOfTheDay();
  }, []);

  return (
    <View style={styles.container}>
      {/* ✅ Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={26} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verset du jour</Text>
        <TouchableOpacity>
          <Feather name="share" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* ✅ Fond avec Image */}
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1050&q=80',
        }}
        style={styles.background}
        imageStyle={{opacity: 0.3}} // effet doux
      >
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : verse ? (
            <View style={styles.card}>
              <Text style={styles.reference}>{verse.reference}</Text>
              <Text style={styles.text}>{verse.text}</Text>
            </View>
          ) : (
            <Text style={styles.error}>Impossible de charger le verset.</Text>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default VersetDayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lighter,
  },
  header: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.9)', // effet transparent
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
  },
  reference: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  text: {
    fontSize: 17,
    color: '#222',
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});
