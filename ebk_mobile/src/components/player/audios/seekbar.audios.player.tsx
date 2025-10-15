import {View, Text, StyleSheet} from 'react-native';
import colors from '../../style/colors';
import Slider from '@react-native-community/slider';
import {minutesAndSeconds} from '../../../app/helpers/utils';

type SeekBarProps = {
  trackLength: number;
  currentPosition: number;
  onSeek: (value: number) => void;
  onSlidingStart: (value: number) => void;
  onSlidingComplete: (value: number) => void;
  counter: boolean;
};

const SeekBarAudioPlayer = ({
  trackLength,
  currentPosition,
  onSeek,
  onSlidingStart,
  onSlidingComplete,
  counter = false,
}: SeekBarProps) => {
  const elapsed = minutesAndSeconds(currentPosition);
  const remaining = minutesAndSeconds(trackLength - currentPosition);

  return (
    <View style={styles.container}>
      <Slider
        style={{
          height: 40,
          width: '100%',
        }}
        maximumValue={trackLength}
        onSlidingStart={onSlidingStart}
        onSlidingComplete={onSlidingComplete}
        onValueChange={onSeek}
        value={currentPosition}
        minimumTrackTintColor={colors.gris}
        maximumTrackTintColor={'#FFF6'}
        thumbTintColor={colors.primary}
      />

      <View style={{height: 20, paddingHorizontal: 15, marginTop: 8}}>
        {counter && (
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.text, {color: '#FFF'}]}>
              {elapsed[0]}:{elapsed[1].padStart(2, '0')}
            </Text>
            <View style={{flex: 1}} />
            <Text style={[styles.text, {color: '#FFF'}]}>
              {remaining[0]}:{remaining[1].padStart(2, '0')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default SeekBarAudioPlayer;

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 12,
    textAlign: 'center',
  },
});
