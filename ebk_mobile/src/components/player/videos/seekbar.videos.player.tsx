import {View, Text, StyleSheet} from 'react-native';
import {formatSecondeTime, pad} from '../../../app/config/func';
import colors from '../../style/colors';
import Slider from '@react-native-community/slider';
import path from '../../image/path';
import moment from 'moment';

type SeekBarProps = {
  trackLength: number;
  currentPosition: number;
  onSeek: (value: number) => void;
  onSlidingStart: (value: number) => void;
  counter: boolean;
};
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [
    h > 0 ? h : null,
    h > 0 ? String(m).padStart(2, '0') : m,
    String(s).padStart(2, '0'),
  ]
    .filter(time => time !== null)
    .join(':');
};

const minutesAndSeconds = (position: number) => [
  formatTime(position),
  formatTime(position),
];

const SeekBarVideosPlayerUI = ({
  trackLength,
  currentPosition,
  onSeek,
  onSlidingStart,
  counter,
}: SeekBarProps) => {
  const elapsed = currentPosition;
  const remaining = trackLength - currentPosition;
  return (
    <View
      style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10}}>
      <Text style={[styles.text, {color: colors.white}]}>
        {moment.utc(elapsed * 1000).format('mm:ss')}
      </Text>
      <Slider
        maximumValue={trackLength}
        onSlidingStart={onSlidingStart}
        onSlidingComplete={onSeek}
        value={currentPosition}
        minimumTrackTintColor={colors.white}
        // maximumTrackTintColor={colors.gris}
        // thumbImage={path.sliderTwiter}
        thumbTintColor={colors.white}
        style={{
          flex: 1,
        }}
      />
      <Text style={[styles.text, {color: colors.white}]}>
        {moment.utc(remaining * 1000).format('mm:ss')}
      </Text>
    </View>
  );
};

export default SeekBarVideosPlayerUI;

const styles = StyleSheet.create({
  slider: {
    marginTop: -12,
  },
  container: {
    // paddingTop: 5,
  },
  track: {
    height: 2,
    borderRadius: 1,
  },
  thumb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 12,
    textAlign: 'center',
  },
});
