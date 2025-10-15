import React, {useCallback, useMemo, useState} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Text,
  TextInput,
} from 'react-native';
import Video, {OnLoadData} from 'react-native-video';
import {SAFE_AREA_PADDING} from './Constants';
import {useIsForeground} from './hooks/useIsForeground';
import {PressableOpacity} from 'react-native-pressable-opacity';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Alert} from 'react-native';
import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import {useIsFocused} from '@react-navigation/core';
import FastImage, {OnLoadEvent} from 'react-native-fast-image';
import {Video as VideoComppress} from 'react-native-compressor';
import colors from '../style/colors';
import {useAppSelector} from '../../app/store/hooks';
import {selectAuth} from '../../app/store/auth/auth.slice';
import {TestimonialStatusEnum} from '../../app/config/enum';
import {sendTestimonialsApi} from '../../app/api/testimonials/testimonials.req';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';

export const requestSavePermission = async (): Promise<boolean> => {
  // On Android 13 and above, scoped storage is used instead and no permission is needed
  if (Platform.OS !== 'android' || Platform.Version >= 33) return true;

  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  if (permission == null) return false;
  let hasPermission = await PermissionsAndroid.check(permission);
  if (!hasPermission) {
    const permissionRequestResult = await PermissionsAndroid.request(
      permission,
    );
    hasPermission = permissionRequestResult === 'granted';
  }
  return hasPermission;
};

const isVideoOnLoadEvent = (
  event: OnLoadData | OnLoadEvent,
): event is OnLoadData => 'duration' in event && 'naturalSize' in event;

export function MediaPage({navigation, route}: any): React.ReactElement {
  const {path, type} = route.params;
  const [hasMediaLoaded, setHasMediaLoaded] = useState(false);
  const isForeground = useIsForeground();
  const isScreenFocused = useIsFocused();
  const isVideoPaused = !isForeground || !isScreenFocused;
  const [savingState, setSavingState] = useState<'none' | 'saving' | 'saved'>(
    'none',
  );
  const [loading, setLoading] = useState(false);
  const auth = useAppSelector(selectAuth);
  const [compressprogress, setCompressProgress] = React.useState<number>(0);
  const [lastSavedUri, setLastSavedUri] = useState<PhotoIdentifier | null>(
    null,
  );
  const [description, setDescription] = useState('');

  const onMediaLoad = useCallback((event: OnLoadData | OnLoadEvent) => {
    if (isVideoOnLoadEvent(event)) {
    } else {
    }
  }, []);

  const onMediaLoadEnd = useCallback(() => {
    setHasMediaLoaded(true);
  }, []);

  const onMediaLoadError = useCallback(() => {}, []);

  const handleCompresseVideo = async () => {
    const result = await VideoComppress.compress(
      `${path}`,
      {
        compressionMethod: 'auto', // tu peux aussi tester 'manual'
        minimumFileSizeForCompress: 1, // en MB
        // quality: 'medium', // valeurs possibles : 'low', 'medium', 'high'
        // bitrate: 2000000, // Optionnel si tu veux un contrôle très fin
        // maxSize: 1280, // largeur max. si tu veux réduire la résolution
        // maxSize: 1080,        // largeur maximale de la vidéo (1080px = Full HD)
        bitrate: 1500000,
      },
      progress => {
        setCompressProgress(progress);
      },
    );
    return result;
  };

  const onSavePressed = useCallback(async () => {
    try {
      setSavingState('saving');

      const hasPermission = await requestSavePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission refusée!',
          `Vision Camera n'a pas l'autorisation d'enregistrer.`,
        );
        return;
      }

      const videosCompressed = await handleCompresseVideo();

      const saveFile: any = await CameraRoll.saveAsset(videosCompressed, {
        type: type,
        album: 'EcclesiaBooK',
      });

      setSavingState('saved');
      setLastSavedUri(saveFile); // 🆕 stocke le chemin pour publier ensuite
    } catch (e) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      setSavingState('none');
      Alert.alert('Échec de la sauvegarde!', message);
    }
  }, [path, type]);

  const source = useMemo(() => ({uri: `file://${path}`}), [path]);

  const screenStyle = useMemo(
    () => ({opacity: hasMediaLoaded ? 1 : 0}),
    [hasMediaLoaded],
  );

  const publishVideo = async (videoUri: PhotoIdentifier) => {
    if (!auth.isAuthenticated) {
      Alert.alert(
        'Connexion requise',
        'Connectez-vous pour publier votre contenu.',
        [
          {
            text: 'SE CONNECTER',
            onPress: () => navigation.navigate('Account', {screen: 'signIn'}),
            style: 'cancel',
          },
          {text: 'ANNULER', onPress: () => {}},
        ],
      );
      return;
    }

    setLoading(true);
    setCompressProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: videoUri.node.image.uri,
        type: videoUri.node.type,
        name: videoUri.node.image.filename || 'video.mp4',
      });
      formData.append('status', TestimonialStatusEnum.APPROVED);
      formData.append('description', description);

      const send = await sendTestimonialsApi(formData);

      setLoading(false);

      if (send?.status === 201) {
        navigation.navigate('TestimonialsHandler');
      } else {
        const message =
          typeof send?.data.message === 'object'
            ? send?.data.message.join(';\n')
            : send?.data.message;

        Alert.alert('Erreur', message || 'Une erreur s’est produite.');
      }
    } catch (error) {
      setLoading(false);
      console.log("Erreur d'envoi vidéo :", error);
      Alert.alert('Erreur', "La vidéo n'a pas pu être envoyée.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, screenStyle]}>
        {type === 'photo' && (
          <FastImage
            source={source}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            onLoadEnd={onMediaLoadEnd}
            onLoad={onMediaLoad}
          />
        )}

        {type === 'video' && (
          <Video
            source={source}
            style={StyleSheet.absoluteFill}
            paused={isVideoPaused}
            resizeMode="cover"
            posterResizeMode="cover"
            allowsExternalPlayback={false}
            automaticallyWaitsToMinimizeStalling={false}
            disableFocus={true}
            repeat={true}
            useTextureView={false}
            controls={false}
            playWhenInactive={true}
            ignoreSilentSwitch="ignore"
            onReadyForDisplay={onMediaLoadEnd}
            onLoad={onMediaLoad}
            onError={onMediaLoadError}
          />
        )}

        <PressableOpacity
          style={styles.closeButton}
          onPress={navigation.goBack}>
          <IonIcon name="close" size={35} color="white" style={styles.icon} />
        </PressableOpacity>

        {savingState === 'none' && (
          <>
            <TextInput
              placeholder="Écris une description..."
              placeholderTextColor="#555" // ✅ ici la solution
              value={description}
              onChangeText={setDescription}
              style={{
                position: 'absolute',
                bottom: 140,
                left: 20,
                right: 20,
                backgroundColor: '#fff',
                padding: 10,
                borderRadius: 10,
                elevation: 3,
                color: '#000',
              }}
              multiline
            />

            <PressableOpacity
              style={[
                styles.actionButton,
                {position: 'absolute', bottom: 90, left: 20},
              ]}
              onPress={onSavePressed}>
              <IonIcon name="download-outline" size={20} color={colors.white} />
              <Text style={styles.actionText}>Continuer</Text>
            </PressableOpacity>
          </>
        )}

        {savingState === 'saving' && (
          <View
            style={[
              styles.actionButton,
              {position: 'absolute', bottom: 90, left: 20},
            ]}>
            {compressprogress > 0 && (
              <Text style={[styles.actionText, {marginRight: 8}]}>
                {Math.round(compressprogress * 100)}%
              </Text>
            )}
            <ActivityIndicator color={colors.white} />
          </View>
        )}

        {savingState === 'saved' && lastSavedUri && (
          <View
            style={[
              styles.publishButton,
              {position: 'absolute', bottom: 30, left: 20},
            ]}>
            {loading ? (
              <>
                <ActivityIndicator color={colors.white} />
                <Text style={[styles.publishText, {marginLeft: 10}]}>
                  Publication…
                </Text>
              </>
            ) : (
              <PressableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => publishVideo(lastSavedUri)}>
                <IonIcon
                  name="cloud-upload-outline"
                  size={20}
                  color={colors.white}
                />
                <Text style={styles.publishText}>Publier</Text>
              </PressableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: SAFE_AREA_PADDING.paddingTop,
    left: SAFE_AREA_PADDING.paddingLeft,
    width: 40,
    height: 40,
  },
  saveButton: {
    position: 'absolute',
    bottom: SAFE_AREA_PADDING.paddingBottom,
    left: SAFE_AREA_PADDING.paddingLeft,
    width: 140,
    height: 40,
    backgroundColor: 'red',
  },
  icon: {
    textShadowColor: 'black',
    textShadowOffset: {
      height: 0,
      width: 0,
    },
    textShadowRadius: 1,
  },

  // style
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  actionText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#00D26A',
    backgroundColor: '#00D26A',
  },
  publishText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
});
