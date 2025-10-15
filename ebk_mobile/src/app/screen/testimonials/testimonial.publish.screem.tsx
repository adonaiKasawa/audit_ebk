import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Video from 'react-native-video';
import Feather from 'react-native-vector-icons/Feather';
import {Video as VideoCompressor} from 'react-native-compressor';
import {useAppSelector} from '../../store/hooks';
import {selectAuth} from '../../store/auth/auth.slice';
import {TestimonialStatusEnum} from '../../config/enum';
import {sendTestimonialsApi} from '../../api/testimonials/testimonials.req';

const TestimonialsPublishScreen = ({navigation}: any) => {
  const [originalVideoUri, setOriginalVideoUri] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null); // uri compressée
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [compressProgress, setCompressProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const auth = useAppSelector(selectAuth);

  // Choix de la vidéo
  const pickVideo = async () => {
    const result = await launchImageLibrary({
      mediaType: 'video',
      videoQuality: 'high',
    });
    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri || null;
      if (!uri) return;
      setOriginalVideoUri(uri);
      setVideoUri(null);
      setVideoDuration(null);
    }
  };

  // Compression de la vidéo
  const compressVideo = async () => {
    if (!originalVideoUri) return;
    setCompressing(true);
    setCompressProgress(0);

    try {
      const compressedUri = await VideoCompressor.compress(
        originalVideoUri,
        {compressionMethod: 'auto', bitrate: 1500000},
        progress => setCompressProgress(progress),
      );
      console.log('compressedUri :', compressedUri);
      setVideoUri(compressedUri);
    } catch (err) {
      console.error('Erreur compression vidéo:', err);
      Alert.alert(
        'Compression échouée',
        'La vidéo sera utilisée sans compression.',
      );
      setVideoUri(originalVideoUri);
    } finally {
      setCompressing(false);
    }
  };

  // Publication de la vidéo
  const publishVideo = async () => {
    if (!auth.isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Connectez-vous pour publier votre contenu.',
        [
          {
            text: 'SE CONNECTER',
            onPress: () => navigation.navigate('Account', {screen: 'signIn'}),
          },
          {text: 'ANNULER', style: 'cancel'},
        ],
      );
      return;
    }

    if (!videoUri) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: videoUri,
        type: 'video/mp4',
        name: 'video.mp4',
      } as any);
      formData.append('status', TestimonialStatusEnum.APPROVED);
      formData.append('description', description);

      const response = await sendTestimonialsApi(formData);
      if (response?.status === 201) {
        Alert.alert('✅ Succès', 'Vidéo publiée avec succès !');
        setOriginalVideoUri(null);
        setVideoUri(null);
        setDescription('');
        setVideoDuration(null);
        navigation.navigate('TestimonialsHandler');
      } else {
        const message =
          typeof response?.data.message === 'object'
            ? response?.data.message.join(';\n')
            : response?.data.message;
        Alert.alert('Erreur', message || 'Une erreur est survenue.');
      }
    } catch (err) {
      console.error("Erreur d'envoi vidéo :", err);
      Alert.alert('Erreur', "La vidéo n'a pas pu être envoyée.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            style={styles.goBackBtn}
            onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#007bff" />
            <Text style={styles.goBackText}>Retour</Text>
          </TouchableOpacity>

          {!originalVideoUri ? (
            <View style={styles.emptyState}>
              <Feather name="video" size={60} color="#aaa" />
              <Text style={styles.emptyText}>Choisis une vidéo</Text>
              <TouchableOpacity style={styles.pickBtn} onPress={pickVideo}>
                <Text style={styles.pickBtnText}>Parcourir</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Lecture de la vidéo originale */}
              <Video
                source={{uri: originalVideoUri}}
                style={styles.video}
                controls
                resizeMode="cover"
                onLoad={data => {
                  setVideoDuration(data.duration);
                  if (data.duration > 180) {
                    Alert.alert(
                      'Vidéo trop longue',
                      'Vous ne pouvez pas publier une vidéo de plus de trois minutes. Veuillez sélectionner une vidéo plus courte.',
                    );
                    setOriginalVideoUri(null);
                    setVideoUri(null);
                  }
                }}
              />

              {/* Champ description */}
              <TextInput
                style={styles.input}
                placeholder="Ajoute une description..."
                placeholderTextColor="#888"
                value={description}
                onChangeText={setDescription}
                multiline
              />

              {/* Bouton pour compresser */}
              {!videoUri &&
                originalVideoUri &&
                videoDuration &&
                videoDuration <= 180 && (
                  <TouchableOpacity
                    style={styles.publishBtn}
                    onPress={compressVideo}>
                    {compressing ? (
                      <>
                        <ActivityIndicator color="#fff" />
                        <Text style={[styles.publishText, {marginLeft: 10}]}>
                          {Math.round(compressProgress * 100)}%
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.publishText}>Continuer</Text>
                    )}
                  </TouchableOpacity>
                )}

              {/* Bouton pour publier */}
              {videoUri && (
                <TouchableOpacity
                  style={styles.publishBtn}
                  onPress={publishVideo}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.publishText}>Publier</Text>
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {flexGrow: 1, backgroundColor: '#fff', paddingBottom: 20},
  goBackBtn: {flexDirection: 'row', alignItems: 'center', padding: 10},
  goBackText: {color: '#007bff', fontSize: 16, marginLeft: 5},
  emptyState: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  emptyText: {marginTop: 10, fontSize: 16, color: '#666'},
  pickBtn: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 10,
    alignItems: 'center',
  },
  pickBtnText: {color: '#fff', fontSize: 16},
  video: {width: '100%', height: 600, backgroundColor: '#000'},
  input: {
    marginTop: 15,
    marginHorizontal: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    fontSize: 16,
    color: '#000',
  },
  publishBtn: {
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  publishText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},
});

export default TestimonialsPublishScreen;
