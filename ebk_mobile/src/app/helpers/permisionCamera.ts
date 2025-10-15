import {Camera} from 'react-native-vision-camera';
import {PermissionsAndroid, Platform, Linking, Alert} from 'react-native';

export const requestPermissionsIOSandADROID = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const cameraGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permission pour utiliser la caméra',
          message: "Cette application a besoin d'accéder à votre caméra.",
          buttonNeutral: 'Demander plus tard',
          buttonNegative: 'Annuler',
          buttonPositive: 'OK',
        },
      );

      const micGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Permission pour enregistrer du son',
          message: "Cette application a besoin d'accéder au micro.",
          buttonNeutral: 'Demander plus tard',
          buttonNegative: 'Annuler',
          buttonPositive: 'OK',
        },
      );

      return (
        cameraGranted === PermissionsAndroid.RESULTS.GRANTED &&
        micGranted === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (error) {
      console.warn('Erreur permission Android :', error);
      return false;
    }
  } else {
    // iOS : utiliser les fonctions de VisionCamera
    const cameraPermission = await Camera.getCameraPermissionStatus();
    const micPermission = await Camera.getMicrophonePermissionStatus();

    let grantedCamera = cameraPermission;
    if (cameraPermission.toString() !== 'authorized') {
      grantedCamera = await Camera.requestCameraPermission();
    }

    let grantedMic = micPermission;
    if (micPermission.toString() !== 'authorized') {
      grantedMic = await Camera.requestMicrophonePermission();
    }

    const isGranted =
      grantedCamera.toString() === 'authorized' &&
      grantedMic.toString() === 'authorized';

    if (!isGranted) {
      Alert.alert(
        'Permission refusée',
        'Veuillez autoriser l’accès à la caméra et au micro dans les réglages de l’iPhone.',
        [
          {text: 'Annuler', style: 'cancel'},
          {
            text: 'Ouvrir les réglages',
            onPress: () => Linking.openURL('app-settings:'),
          },
        ],
      );
    }

    return isGranted;
  }
};

// // Request permissions on mount
// async function requestPermissions() {
//   const cameraPermission: CameraPermissionStatus = await Camera.getCameraPermissionStatus()
//   const microphonePermission: CameraPermissionStatus = await Camera.getMicrophonePermissionStatus()

//   let grantedCamera = cameraPermission
//   if (cameraPermission.toString() !== 'authorized') {
//     grantedCamera = await Camera.requestCameraPermission()
//   }

//   let grantedMicrophone = microphonePermission
//   if (microphonePermission.toString() !== 'authorized') {
//     grantedMicrophone = await Camera.requestMicrophonePermission()
//   }

//   if (grantedCamera.toString() === 'authorized' && grantedMicrophone.toString() === 'authorized') {
//     setHasPermission(true)
//   } else {
//     setHasPermission(false)
//     console.warn('Permission caméra ou micro refusée')
//   }
// }
