import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  useColorScheme,
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import TrackPlayer, {State, Event} from 'react-native-track-player';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {jwtDecode} from 'jwt-decode';
import Slider from '@react-native-community/slider';

import {file_url} from '../../../app/api';
import {
  selectAudiosPlayer,
  addAudiosPlayer,
} from '../../../app/store/audiosplayer/audiosplayer.slice';
import {selectAuth} from '../../../app/store/auth/auth.slice';
import {useAppSelector, useAppDispatch} from '../../../app/store/hooks';
import LoadingGif from '../../loading/loadingGif';
import colors from '../../style/colors';
import {ItemVideos} from '../../../app/config/interface';
import {setupPlayer} from '../../../../PlaybackService';
import {pad} from '../../../app/config/func';
import {minutesAndSeconds} from '../../../app/helpers/utils';
import SeekBarAudioPlayer from './seekbar.audios.player';
import {setActiveAudioId} from '../../../app/store/audiosplayer/audio.id.slice';
import {addStreamConentApi} from '../../../app/api/stream';
import {TypeContentEnum} from '../../../app/config/enum';
import {
  addStreamToAudioListen,
  AudioFile,
} from '../../../app/store/datahome/home.audio.slice';
import {historicalViewAudioApi} from '../../../app/api/historical/historical.req';

const ControllerAudiosPlayerUI = ({audios}: {audios: AudioFile}) => {
  const audiosPlayerRedux = useAppSelector(selectAudiosPlayer);
  const auth = useAppSelector(selectAuth);
  const user = auth.access_token ? jwtDecode(auth.access_token) : null;

  const dispatch = useAppDispatch();
  const isDarkMode = useColorScheme() === 'dark';

  const [file, setFiles] = useState<any>(audios);
  const [loadingLike, SetLoadingLike] = useState<boolean>(false);
  const [pauseOrPlay, setPauseOrPlay] = useState<boolean>(
    audiosPlayerRedux?.audiosPlay,
  );
  const pauseOrPlayRef = useRef(pauseOrPlay);
  pauseOrPlayRef.current = pauseOrPlay;

  const [trackLength, setTrackLength] = useState<number>(0);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const currentPositionRef = useRef(currentPosition);
  currentPositionRef.current = currentPosition;

  const hasBeenAddedToHistory = useRef(false);

  const [hasStreamed, setHasStreamed] = useState(false);

  const [getStatePlayer, setGetStatePlayer] = useState<string>('');

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePauseOrPlayAudios = useCallback(() => {
    if (pauseOrPlayRef.current) {
      setPauseOrPlay(false);
      TrackPlayer.pause();
      dispatch(setActiveAudioId(null));
    } else {
      setPauseOrPlay(true);
      TrackPlayer.play();
      handleGetInfoByAudios();
      dispatch(setActiveAudioId(audios?.id));
    }

    dispatch(
      addAudiosPlayer({
        lastAudiosId: file?.id,
        lastAdiosPostionProgesse: 0,
        lastAudiosLink: `${file_url}${file?.lien}`,
        lastAudiosDuration: audiosPlayerRedux.lastAudiosDuration,
        audiosInPlayer: false,
        audiosPlay: !pauseOrPlayRef.current,
        lasteAuteur: file?.auteur,
        lastPhoto: file?.photo,
        lastTitre: file?.titre,
      }),
    );
  }, [dispatch, file, audios?.id, audiosPlayerRedux.lastAudiosDuration]);

  const handleSeekBar = (value: number) => {
    const time = Math.round(value);
    setCurrentPosition(time);
  };

  const handleOnCompleteSeek = async (value: number) => {
    await TrackPlayer.seekTo(value);
    setCurrentPosition(value);
  };

  // console.log('audio stream : ', audios)

  const handleOnStartSlider = (value: number) => {
    // Optionnel
  };

  const handleTrackerShowAudios = async () => {
    const isSetup = await setupPlayer();
    const track = {
      id: `${file?.id}`,
      url: `${file_url}${file?.lien}`,
      title: file.titre,
      artist: file.auteur,
      album: 'audio',
      artwork: `${file_url}${file?.photo}`,
    };

    if (isSetup) {
      try {
        if (
          audiosPlayerRedux.lastAudiosId === file?.id &&
          audiosPlayerRedux.audiosPlay
        ) {
          setCurrentPosition(
            Math.round(audiosPlayerRedux.lastAdiosPostionProgesse),
          );
          let duration = (await TrackPlayer.getProgress()).duration;
          setTrackLength(duration);
          setPauseOrPlay(true);
        } else {
          await TrackPlayer.reset();
          await TrackPlayer.add(track);
          setCurrentPosition(0);
          let duration = (await TrackPlayer.getProgress()).duration;
          while (duration === 0) {
            duration = (await TrackPlayer.getProgress()).duration;
          }
          if (duration > 0) {
            setTrackLength(duration);
            await TrackPlayer.play();
            setPauseOrPlay(true);
            handleGetInfoByAudios();
          }
        }
      } catch (e) {
        await TrackPlayer.reset();
      }
    }
  };

  const ComponentWillUnMount = async () => {
    let position = (await TrackPlayer.getProgress()).position;
    let duration = (await TrackPlayer.getProgress()).duration;
    dispatch(
      addAudiosPlayer({
        lastAudiosId: file?.id,
        lastAdiosPostionProgesse: position,
        lastAudiosLink: `${file_url}${file?.lien}`,
        lastAudiosDuration: duration,
        audiosInPlayer: true,
        audiosPlay: true,
        lasteAuteur: file?.auteur,
        lastPhoto: file?.photo,
        lastTitre: file?.titre,
      }),
    );
  };

  useEffect(() => {
    let isMount = true;
    if (isMount) {
      handleTrackerShowAudios();
      handleGetInfoByAudios();
    }

    const remotePauseListener = TrackPlayer.addEventListener(
      Event.RemotePause,
      () => {
        handlePauseOrPlayAudios();
      },
    );

    const remotePlayListener = TrackPlayer.addEventListener(
      Event.RemotePlay,
      () => {
        handlePauseOrPlayAudios();
      },
    );

    return () => {
      isMount = false;
      ComponentWillUnMount();
      remotePauseListener.remove();
      remotePlayListener.remove();
    };
  }, [handlePauseOrPlayAudios]);

  useEffect(() => {
    setFiles(audios);
  }, [audios]);

  // add stream
  const addStreamToAudio = async () => {
    if (!user?.sub) return;

    const alreadyStreamed = file?.streams?.some(
      (stream: any) => stream.usersId === user.sub,
    );

    if (alreadyStreamed || hasStreamed) return;

    try {
      const addStream = await addStreamConentApi(
        audios.id,
        TypeContentEnum.audios,
      );

      if (addStream?.data?.message === 'Vous avez déjà vu ce contenu.') {
        console.log('Stream déjà comptabilisé');
      } else {
        console.log('🎧 Nouveau stream enregistré !');
        setHasStreamed(true);

        dispatch(
          addStreamToAudioListen({
            audioId: file.id,
            stream: {
              id: Date.now(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              deletedAt: null,
              usersId: Number(user.sub),
              audiosId: file.id,
            },
          }),
        );
      }
    } catch (error) {
      console.log("Erreur lors de l'ajout du stream :", error);
    }
  };

  // fonction count time read audio
  const handleGetInfoByAudios = async () => {
    const getProgress = await TrackPlayer.getProgress();
    const getState = (await TrackPlayer.getPlaybackState()).state;
    setGetStatePlayer(getState.toString());

    const progressRatio = currentPositionRef.current / getProgress.duration;

    // ✅ Ajout historique après 3 sec
    if (currentPositionRef.current >= 3 && !hasBeenAddedToHistory.current) {
      addToHistory();
    }

    // ✅ Déclenche à 50%
    if (progressRatio >= 0.5 && !hasStreamed) {
      addStreamToAudio(); // 👈 appelle ici
    }

    setTimeout(() => {
      if (
        pauseOrPlayRef.current &&
        currentPositionRef.current < getProgress.duration
      ) {
        if (getState === State.Playing) {
          setCurrentPosition(currentPositionRef.current + 1);
        }
        if (getState !== State.Stopped) {
          handleGetInfoByAudios(); // récursion
        }
      }
    }, 1000);
  };

  // Function add to history
  const addToHistory = async () => {
    if (!user?.sub || hasBeenAddedToHistory.current) return;

    try {
      const res = await historicalViewAudioApi(
        audios.id,
        TypeContentEnum.audios,
      );

      if (res?.data) {
        console.log('📌 Historique ajouté');
      }

      hasBeenAddedToHistory.current = true; // pour éviter les doublons
    } catch (error) {
      console.log('❌ Erreur ajout historique :', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.dark}}>
      <View style={{alignItems: 'center'}}>
        <Image
          source={{uri: `${file_url}${file?.photo}`}}
          style={{width: 220, height: 220, borderRadius: 16}}
          resizeMode="cover"
        />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
          }}>
          {file?.titre}
        </Text>
        <Text
          style={{color: colors.secondary, fontSize: 14, textAlign: 'center'}}>
          {file?.auteur}
        </Text>
      </View>

      <View style={{marginVertical: 10}}>
        <SeekBarAudioPlayer
          trackLength={trackLength}
          currentPosition={currentPositionRef.current}
          onSeek={handleSeekBar}
          onSlidingStart={handleOnStartSlider}
          onSlidingComplete={handleOnCompleteSeek}
          counter={true}
        />
      </View>

      <View style={{alignItems: 'center', marginTop: 40}}>
        <TouchableOpacity
          onPress={handlePauseOrPlayAudios}
          style={{
            width: 40,
            height: 40,
            borderRadius: 32,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}>
          {getStatePlayer === State.Buffering.toString() ||
          getStatePlayer === State.Loading.toString() ||
          getStatePlayer === 'idle' ? (
            <LoadingGif width={30} height={30} />
          ) : (
            <AntDesign
              color="#fff"
              size={20}
              name={!pauseOrPlay ? 'caretright' : 'pause'}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  text: {
    color: colors.gris,
    fontSize: 12,
  },
});

export default ControllerAudiosPlayerUI;
