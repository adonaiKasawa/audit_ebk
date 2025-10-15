import * as React from 'react';
import {useRef, useState, useCallback, useMemo} from 'react';
import {
  Alert,
  Dimensions,
  GestureResponderEvent,
  LayoutChangeEvent,
  Linking,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import {
  CameraProps,
  CameraRuntimeError,
  PhotoFile,
  Templates,
  useCameraDevice,
  useCameraFormat,
  useFrameProcessor,
  VideoFile,
} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {CameraPermissionStatus} from 'react-native-vision-camera';

import {
  CONTENT_SPACING,
  CONTROL_BUTTON_SIZE,
  MAX_ZOOM_FACTOR,
  SAFE_AREA_PADDING,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from './Constants';
import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import {useEffect} from 'react';
import {useIsForeground} from './hooks/useIsForeground';
import {StatusBarBlurBackground} from './views/StatusBarBlurBackground';
import {CaptureButton} from './views/CaptureButton';
import {PressableOpacity} from 'react-native-pressable-opacity';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useIsFocused} from '@react-navigation/core';
import {examplePlugin} from './frame-processors/ExamplePlugin';
import {exampleKotlinSwiftPlugin} from './frame-processors/ExampleKotlinSwiftPlugin';
import {usePreferredCameraDevice} from './hooks/usePreferredCameraDevice';
import colors from '../style/colors';
import {formatSecondeTime} from '../../app/config/func';
import Feather from 'react-native-vector-icons/Feather';
import {launchImageLibrary} from 'react-native-image-picker';
// import {isValidFile, showEditor} from 'react-native-video-trim';
import {requestPermissionsIOSandADROID} from '../../app/helpers/permisionCamera';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const SCALE_FULL_ZOOM = 3;

type Props = NativeStackScreenProps<any, 'CameraPage'>;

export function CameraPage({navigation}: any): React.ReactElement {
  const camera = useRef<Camera>(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const hasMicrophonePermission = useMemo(
    () => Camera.getMicrophonePermissionStatus() === 'granted',
    [],
  );
  const zoom = useSharedValue(1);
  const isPressingButton = useSharedValue(false);

  const previousWidth = Dimensions.get('screen').width;
  const previousHeight = Dimensions.get('screen').height;
  const [isHorizontal, setIsHorizontal] = useState<boolean>(
    previousWidth > previousHeight,
  );
  // check if camera page is active
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;

  const [hasPermission, setHasPermission] = useState(false);

  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );
  const [enableHdr, setEnableHdr] = useState(false);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [enableNightMode, setEnableNightMode] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  // camera device settings
  const [preferredDevice] = usePreferredCameraDevice();
  // let device = useCameraDevice(cameraPosition)

  const [permissionsKey, setPermissionsKey] = useState<number>(0); // Ajouté

  let device = useCameraDevice(cameraPosition);

  if (preferredDevice != null && preferredDevice.position === cameraPosition) {
    // override default device with the one selected by the user in settings
    device = preferredDevice;
  }

  const [targetFps, setTargetFps] = useState(30);

  const screenAspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  const format = useCameraFormat(device, Templates.Snapchat);
  // const format = useCameraFormat(device, [
  //   { fps: targetFps },
  //   { videoAspectRatio: screenAspectRatio },
  //   { videoResolution: 'max' },
  //   { photoAspectRatio: screenAspectRatio },
  //   { photoResolution: 'max' },
  // ])

  const fps = Math.min(format?.maxFps ?? 1, targetFps);

  const supportsFlash = device?.hasFlash ?? false;
  const supportsHdr = format?.supportsPhotoHdr;
  const supports60Fps = useMemo(
    () => device?.formats.some(f => f.maxFps >= 60),
    [device?.formats],
  );
  const canToggleNightMode = device?.supportsLowLightBoost ?? false;

  //#region Animated Zoom
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  const cameraAnimatedProps = useAnimatedProps<CameraProps>(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);

  //#region Callbacks
  const setIsPressingButton = useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton;
    },
    [isPressingButton],
  );

  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);

  const onInitialized = useCallback(() => {
    setIsCameraInitialized(true);
  }, []);

  const onMediaCaptured = useCallback(
    (media: PhotoFile | VideoFile, type: 'photo' | 'video') => {
      navigation.navigate('MediaPage', {
        path: media.path,
        type: type,
      });
    },
    [navigation],
  );

  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  }, []);

  const onFlashPressed = useCallback(() => {
    setFlash(f => (f === 'off' ? 'on' : 'off'));
  }, []);
  //#endregion

  //#region Tap Gesture
  const onFocusTap = useCallback(
    ({nativeEvent: event}: GestureResponderEvent) => {
      if (!device?.supportsFocus) return;
      camera.current?.focus({
        x: event.locationX,
        y: event.locationY,
      });
    },
    [device?.supportsFocus],
  );

  const onDoubleTap = useCallback(() => {
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);
  //#endregion

  //#region Effects
  useEffect(() => {
    // Reset zoom to it's default everytime the `device` changes.
    zoom.value = device?.neutralZoom ?? 1;
  }, [zoom, device]);
  //#endregion

  //#region Pinch to Zoom Gesture
  // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
  // function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
  const onPinchGesture = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    {startZoom?: number}
  >({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(
        event.scale,
        [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
        [-1, 0, 1],
        Extrapolate.CLAMP,
      );
      zoom.value = interpolate(
        scale,
        [-1, 0, 1],
        [minZoom, startZoom, maxZoom],
        Extrapolate.CLAMP,
      );
    },
  });
  //#endregion

  useEffect(() => {
    const f =
      format != null
        ? `(${format.photoWidth}x${format.photoHeight} photo / ${format.videoWidth}x${format.videoHeight}@${format.maxFps} video @ ${fps}fps)`
        : undefined;
  }, [device?.name, format, fps]);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    examplePlugin(frame);
    exampleKotlinSwiftPlugin(frame);
  }, []);

  // Check permissions
  useEffect(() => {
    //  const requestPermissionsIOSandADROID = async (): Promise<boolean> => {
    //   if (Platform.OS === 'android') {
    //     try {
    //       const cameraGranted = await PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.CAMERA,
    //         {
    //           title: 'Permission pour utiliser la caméra',
    //           message: 'Cette application a besoin d\'accéder à votre caméra.',
    //           buttonNeutral: 'Demander plus tard',
    //           buttonNegative: 'Annuler',
    //           buttonPositive: 'OK',
    //         }
    //       );

    //       const micGranted = await PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    //         {
    //           title: 'Permission pour enregistrer du son',
    //           message: 'Cette application a besoin d\'accéder au micro.',
    //           buttonNeutral: 'Demander plus tard',
    //           buttonNegative: 'Annuler',
    //           buttonPositive: 'OK',
    //         }
    //       );

    //       return (
    //         cameraGranted === PermissionsAndroid.RESULTS.GRANTED &&
    //         micGranted === PermissionsAndroid.RESULTS.GRANTED
    //       );
    //     } catch (error) {
    //       console.warn('Erreur permission Android :', error);
    //       return false;
    //     }
    //   } else {
    //     // iOS : utiliser les fonctions de VisionCamera
    //     const cameraPermission = await Camera.getCameraPermissionStatus();
    //     const micPermission = await Camera.getMicrophonePermissionStatus();

    //     let grantedCamera = cameraPermission;
    //     if (cameraPermission.toString() !== 'authorized') {
    //       grantedCamera = await Camera.requestCameraPermission();
    //     }

    //     let grantedMic = micPermission;
    //     if (micPermission.toString() !== 'authorized') {
    //       grantedMic = await Camera.requestMicrophonePermission();
    //     }

    //     const isGranted = grantedCamera.toString() === 'authorized' && grantedMic.toString() === 'authorized';

    //     if (!isGranted) {
    //       Alert.alert(
    //         'Permission refusée',
    //         'Veuillez autoriser l’accès à la caméra et au micro dans les réglages de l’iPhone.',
    //         [
    //           { text: 'Annuler', style: 'cancel' },
    //           {
    //             text: 'Ouvrir les réglages',
    //             onPress: () => Linking.openURL('app-settings:')
    //           },
    //         ]
    //       );
    //     }

    //     return isGranted;
    //   }
    // };
    // requestPermissionsIOSandADROID()

    const checkPermissions = async () => {
      let cameraGranted = false;
      let micGranted = false;

      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ]);

          cameraGranted =
            granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED;
          micGranted =
            granted['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED;

          if (!cameraGranted || !micGranted) {
            Alert.alert(
              'Permission refusée',
              'Veuillez autoriser la caméra et le micro dans les paramètres Android.',
              [
                {text: 'Annuler', style: 'cancel'},
                {
                  text: 'Ouvrir réglages',
                  onPress: () => Linking.openSettings(),
                },
              ],
            );
          }
        } catch (err) {
          console.warn('Erreur PermissionsAndroid :', err);
        }
      } else {
        const cameraStatus = await Camera.getCameraPermissionStatus();
        const micStatus = await Camera.getMicrophonePermissionStatus();

        if (
          cameraStatus.toString() !== 'authorized' ||
          micStatus.toString() !== 'authorized'
        ) {
          if (cameraStatus === 'denied' || micStatus === 'denied') {
            Alert.alert(
              'Permission refusée',
              'Veuillez autoriser l’accès à la caméra et au micro dans les réglages de l’iPhone',
              [
                {
                  text: 'Ouvrir réglages',
                  onPress: () => Linking.openSettings(),
                },
                {text: 'Annuler', style: 'cancel'},
              ],
            );
          } else {
            const newCamera = await Camera.requestCameraPermission();
            const newMic = await Camera.requestMicrophonePermission();

            cameraGranted = newCamera.toString() === 'authorized';
            micGranted = newMic.toString() === 'authorized';
          }
        } else {
          cameraGranted = true;
          micGranted = true;
        }
      }

      // setHasPermission(cameraGranted && micGranted);
      const permissionGranted = cameraGranted && micGranted;
      setHasPermission(permissionGranted);

      if (permissionGranted) {
        // Force le recalcul du hook useCameraDevice
        setPermissionsKey(prev => prev + 1);
      }
    };

    checkPermissions();
  }, []);

  //#region Picker trim videos
  const handlePickerFile = async () => {
    // handleAllCameraPermision()
    const result = await launchImageLibrary({
      selectionLimit: 1,
      mediaType: 'video',
      assetRepresentationMode: 'current',
    });
    if (result.assets) {
      isValidFile(result.assets![0]?.uri || '').then(res => {});

      showEditor(result.assets![0]?.uri || '', {
        maxDuration: 120,
        cancelDialogTitle: 'Avertissement !',
        saveDialogCancelText: 'Fermer',
        cancelDialogMessage: 'Etes-vous sûr de vouloir annuler ?',
        cancelDialogCancelText: "Continuer l'enregistrement",
        cancelDialogConfirmText: 'Annuler',
        saveButtonText: 'Sauvegarder',
        cancelButtonText: 'Annuler',
        saveDialogConfirmText: 'Sauvegarder',
        saveDialogMessage: 'Etes-vous sûr de vouloir sauvegarder ?',
        fullScreenModalIOS: true,
        saveToPhoto: true,
      });
    }
  };

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.VideoTrim);
    const subscription = eventEmitter.addListener('VideoTrim', event => {
      switch (event.name) {
        case 'onShow': {
          break;
        }
        case 'onHide': {
          break;
        }
        case 'onStartTrimming': {
          break;
        }
        case 'onFinishTrimming': {
          navigation.navigate('MediaPage', {
            path:
              Platform.OS === 'ios'
                ? event.outputPath
                : Platform.OS === 'android'
                ? `file://${event.outputPath}`
                : '',
            type: 'video',
          });
          break;
        }
        case 'onCancelTrimming': {
          break;
        }
        case 'onError': {
          break;
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
  //#region Picker trim videos
  const onLayout = ({nativeEvent: {layout}}: LayoutChangeEvent) => {
    if (layout.width > layout.height) {
      setIsHorizontal(true);
    } else {
      setIsHorizontal(false);
    }
  };

  // if (!device) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
  //       <Text style={{ color: 'white' }}>Aucune caméra détectée</Text>
  //     </View>
  //   )
  // }

  return (
    <View style={styles.container} onLayout={onLayout}>
      {hasPermission && device != null && (
        <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
          <Reanimated.View
            onTouchEnd={onFocusTap}
            style={StyleSheet.absoluteFill}>
            <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
              <ReanimatedCamera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isActive}
                ref={camera}
                onInitialized={onInitialized}
                onError={onError}
                onStarted={() => 'Camera started!'}
                onStopped={() => 'Camera stopped!'}
                format={format}
                fps={fps}
                photoHdr={format?.supportsPhotoHdr && enableHdr}
                videoHdr={format?.supportsVideoHdr && enableHdr}
                lowLightBoost={device.supportsLowLightBoost && enableNightMode}
                enableZoomGesture={false}
                animatedProps={cameraAnimatedProps}
                exposure={0}
                // enableFpsGraph={true}
                // orientation={isHorizontal ? "portrait-upside-down" : "portrait"}
                // photo={true}
                video={true}
                audio={hasMicrophonePermission}
                // frameProcessor={frameProcessor}
              />
            </TapGestureHandler>
          </Reanimated.View>
        </PinchGestureHandler>
      )}

      {/* Button Upload video or camera */}
      <View
        style={{
          position: 'absolute',
          bottom: SAFE_AREA_PADDING.paddingBottom,
          right: SAFE_AREA_PADDING.paddingRight,
        }}>
        <TouchableOpacity
          onPress={() => {
            handlePickerFile();
          }}
          style={styles.button}>
          <Feather name="image" size={30} color={colors.white} />
        </TouchableOpacity>
      </View>

      <CaptureButton
        style={styles.captureButton}
        camera={camera}
        onMediaCaptured={onMediaCaptured}
        cameraZoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        flash={supportsFlash ? flash : 'off'}
        enabled={isCameraInitialized && isActive}
        setIsPressingButton={setIsPressingButton}
        timer={timer}
        setTimer={setTimer}
      />

      {/* <StatusBarBlurBackground /> */}

      <View style={styles.rightButtonRow}>
        <PressableOpacity
          style={styles.button}
          onPress={onFlipCameraPressed}
          disabledOpacity={0.4}>
          <IonIcon name="camera-reverse" color="white" size={24} />
        </PressableOpacity>
        {supportsFlash && (
          <PressableOpacity
            style={styles.button}
            onPress={onFlashPressed}
            disabledOpacity={0.4}>
            <IonIcon
              name={flash === 'on' ? 'flash' : 'flash-off'}
              color="white"
              size={24}
            />
          </PressableOpacity>
        )}
        {/* {supports60Fps && (
          <PressableOpacity style={styles.button} onPress={() => setTargetFps((t) => (t === 30 ? 60 : 30))}>
            <Text style={styles.text}>{`${targetFps}\nFPS`}</Text>
          </PressableOpacity>
        )} */}
        {/* {supportsHdr && (
          <PressableOpacity style={styles.button} onPress={() => setEnableHdr((h) => !h)}>
            <MaterialIcon name={enableHdr ? 'hdr' : 'hdr-off'} color="white" size={24} />
          </PressableOpacity>
        )} */}
        {canToggleNightMode && (
          <PressableOpacity
            style={styles.button}
            onPress={() => setEnableNightMode(!enableNightMode)}
            disabledOpacity={0.4}>
            <IonIcon
              name={enableNightMode ? 'moon' : 'moon-outline'}
              color="white"
              size={24}
            />
          </PressableOpacity>
        )}
        {/* <PressableOpacity style={styles.button} onPress={() => navigation.navigate('Devices')}>
          <IonIcon name="settings-outline" color="white" size={24} />
        </PressableOpacity> */}
        {/* <PressableOpacity style={styles.button} onPress={() => navigation.navigate('CodeScannerPage')}>
          <IonIcon name="qr-code-outline" color="white" size={24} />
        </PressableOpacity> */}
      </View>
      <View
        style={{
          position: 'absolute',
          backgroundColor: colors.blackrgba6,
          padding: 5,
          borderRadius: 10,
          left: Dimensions.get('screen').width / 2,
          top: 15,
        }}>
        <Text style={{color: colors.white}}>{formatSecondeTime(timer)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: SAFE_AREA_PADDING.paddingBottom,
  },
  button: {
    marginBottom: CONTENT_SPACING,
    width: CONTROL_BUTTON_SIZE,
    height: CONTROL_BUTTON_SIZE,
    borderRadius: CONTROL_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    right: SAFE_AREA_PADDING.paddingRight,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  text: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
