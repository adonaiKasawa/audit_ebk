import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {file_url} from '../../app/api';
import {Suggestion} from '../../app/config/interface';
import FastImage from 'react-native-fast-image';

interface SuggestionItemProps {
  colorScheme: 'light' | 'dark' | null;
  suggestions: Suggestion[]; // à typer mieux si tu veux
}

function SuggestionItem({colorScheme, suggestions}: SuggestionItemProps) {
  const scale = useSharedValue(1);
  const styles = getStyles(colorScheme);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // 🎯 Aucune suggestion
  if (!suggestions || suggestions?.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={require('../../../assets/img/illus.jpg')} // change le fichier si besoin
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <Text style={styles.emptyText}>Aucune suggestion pour le moment.</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {suggestions?.map((suggestion: any, index) => (
        <TouchableOpacity
          key={suggestion.id || index}
          style={styles.content}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.95}>
          <View style={styles.header}>
            {suggestion?.userSuggestion?.profil ? (
              <FastImage
                source={{
                  uri: `${file_url}${suggestion?.userSuggestion?.profil}`,
                  priority: FastImage.priority.normal,
                  cache: FastImage.cacheControl.immutable, // ou web selon ton serveur
                }} // Image de profil depuis l'API
                style={styles.avatar}
                // resizeMode="cover"
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <Image
                source={require('../../../assets/img/ecclessia.png')} // Image par défaut
                style={styles.avatar}
                resizeMode="cover"
              />
            )}

            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {suggestion.userSuggestion?.prenom}{' '}
                {suggestion.userSuggestion?.nom}
              </Text>

              <Text style={styles.date}>
                {formatDate(new Date(suggestion.createdAt))}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              {/* <StarRating
              rating={suggestion.rating}
              size={16}
              interactive={false}
              color="#FFD700"
            /> */}
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.suggestionText}>{suggestion.suggestion}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}

export default SuggestionItem;

function getStyles(colorScheme: 'light' | 'dark' | null) {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      marginBottom: 1,
    },
    content: {
      backgroundColor: isDark ? '#18191A' : '#F0F2F5',
      borderRadius: 8,
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? '#E4E6EB' : '#1C1E21',
      marginBottom: 2,
    },
    date: {
      fontSize: 12,
      color: isDark ? '#8A8D91' : '#65676B',
    },
    ratingContainer: {
      marginLeft: 12,
    },
    textContainer: {
      paddingLeft: 52,
    },
    suggestionText: {
      fontSize: 14,
      lineHeight: 20,
      color: isDark ? '#E4E6EB' : '#1C1E21',
    },

    // 👉 Styles pour état vide
    emptyContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 50,
    },
    emptyImage: {
      width: 200,
      height: 200,
      marginBottom: 10,
      borderRadius: 20,
    },
    emptyText: {
      fontSize: 15,
      color: isDark ? '#aaa' : '#666',
    },
  });
}
