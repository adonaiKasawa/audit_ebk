import React, {useCallback, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, ViewProps} from 'react-native';

import Reanimated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  withRepeat,
} from 'react-native-reanimated';
import type {Camera, PhotoFile, VideoFile} from 'react-native-vision-camera';
import {CAPTURE_BUTTON_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH} from './../Constants';

const PAN_GESTURE_HANDLER_FAIL_X = [-SCREEN_WIDTH, SCREEN_WIDTH];
const PAN_GESTURE_HANDLER_ACTIVE_Y = [-2, 2];

const START_RECORDING_DELAY = 200;
const BORDER_WIDTH = CAPTURE_BUTTON_SIZE * 0.1;

interface Props extends ViewProps {
  camera: React.RefObject<Camera>;
  onMediaCaptured: (
    media: PhotoFile | VideoFile,
    type: 'photo' | 'video',
  ) => void;

  minZoom: number;
  maxZoom: number;
  cameraZoom: Reanimated.SharedValue<number>;

  flash: 'off' | 'on';

  enabled: boolean;

  setIsPressingButton: (isPressingButton: boolean) => void;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  timer: number;
}

const _CaptureButton: React.FC<Props> = ({
  camera,
  onMediaCaptured,
  minZoom,
  maxZoom,
  cameraZoom,
  flash,
  enabled,
  setIsPressingButton,
  style,
  setTimer,
  timer,
  ...props
}): React.ReactElement => {
  const pressDownDate = useRef<Date | undefined>(undefined);
  const isRecording = useRef(false);
  const recordingProgress = useSharedValue(0);
  const isPressingButton = useSharedValue(false);

  const [onLoadVideo, setOnloadVideo] = useState<'no' | 'active' | 'finish'>(
    'no',
  );
  const onLoadVideoRef = useRef(onLoadVideo);
  onLoadVideoRef.current = onLoadVideo;
  const timerRef = useRef(timer);
  timerRef.current = timer;

  //#region Camera Capture
  // const takePhoto = useCallback(async () => {
  //   try {
  //     if (camera.current == null) throw new Error('Camera ref is null!')

  //     const photo = await camera.current.takePhoto();
  //     //  { qualityPrioritization: 'quality',
  //     //     flash: flash,
  //     //     enableShutterSound: false,}

  //     onMediaCaptured(photo, 'photo');
  //   } catch (e) {
  //     error('Failed to take photo!', e)
  //   }
  // }, [camera, flash, onMediaCaptured])

  const onStoppedRecording = useCallback(() => {
    isRecording.current = false;
    cancelAnimation(recordingProgress);
  }, [recordingProgress]);

  const stopRecording = useCallback(async () => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');
      await camera.current.stopRecording();
    } catch (e) {
      // error('failed to stop recording!', e)
    }
  }, [camera]);

  const startRecording = useCallback(() => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!');

      camera.current.startRecording({
        flash: flash,
        onRecordingError: error => {
          // error('Recording failed!', error)
          onStoppedRecording();
        },
        onRecordingFinished: video => {
          onMediaCaptured(video, 'video');
          onStoppedRecording();
        },
      });
      // TODO: wait until startRecording returns to actually find out if the recording has successfully started
      isRecording.current = true;
    } catch (e) {
      // error('failed to start recording!', e, 'camera')
    }
  }, [camera, flash, onMediaCaptured, onStoppedRecording]);

  function startTimer() {
    const intervalID = setInterval(async () => {
      if (onLoadVideoRef.current === 'active') {
        setTimer(timer++);
        if (timerRef.current === 119) {
          stopTimer();
        }
      } else {
        clearInterval(intervalID);
      }
    }, 1000);
  }

  async function stopTimer() {
    await stopRecording();
    setTimer(0);
    isPressingButton.value = false;
    setIsPressingButton(false);
    setOnloadVideo('no');
  }

  const handleRegisterVideo = async () => {
    if (onLoadVideo === 'no') {
      startRecording();
      startTimer();
      isPressingButton.value = true;
      setIsPressingButton(true);
      setOnloadVideo('active');
    } else if (onLoadVideo === 'active') {
      stopTimer();
    }
  };

  const shadowStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: withSpring(isPressingButton.value ? 1 : 0, {
            mass: 1,
            damping: 35,
            stiffness: 300,
          }),
        },
      ],
    }),
    [isPressingButton],
  );

  const buttonStyle = useAnimatedStyle(() => {
    let scale: number;
    if (enabled) {
      if (isPressingButton.value) {
        scale = withRepeat(
          withSpring(1, {
            stiffness: 100,
            damping: 1000,
          }),
          -1,
          true,
        );
      } else {
        scale = withSpring(0.9, {
          stiffness: 500,
          damping: 300,
        });
      }
    } else {
      scale = withSpring(0.6, {
        stiffness: 500,
        damping: 300,
      });
    }

    return {
      opacity: withTiming(enabled ? 1 : 0.3, {
        duration: 100,
        easing: Easing.linear,
      }),
      transform: [
        {
          scale: scale,
        },
      ],
    };
  }, [enabled, isPressingButton]);

  return (
    <Reanimated.View style={[buttonStyle, style]}>
      <TouchableOpacity
        onPress={() => {
          handleRegisterVideo();
        }}>
        <Reanimated.View style={styles.flex}>
          <Reanimated.View style={[styles.shadow, shadowStyle]} />
          <View style={styles.button}></View>
        </Reanimated.View>
      </TouchableOpacity>
    </Reanimated.View>
  );
};

export const CaptureButton = React.memo(_CaptureButton);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  shadow: {
    position: 'absolute',
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    backgroundColor: '#e34077',
  },
  button: {
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    borderColor: 'white',
  },
});
