import React, {memo} from 'react';
import {TouchableOpacity, useColorScheme} from 'react-native';
import {wp} from '../../helpers/utils';
import colors from '../../../components/style/colors';
import {Text} from 'react-native';

type Props = {
  item: number;
  isSelected?: boolean;
  onChange: (item: number) => void;
  onLongChange?: (item: number) => void;
};

const SelectorItem = ({item, isSelected, onChange, onLongChange}: Props) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        width: wp(99) / 5,
      }}
      onPress={() => onChange(item)}
      onLongPress={() => onLongChange?.(item)}>
      <Text
        style={{
          color: isSelected ? colors.blue : colors.gris,
          fontWeight: isSelected ? 'bold' : 'normal',
          fontSize: 16,
        }}>
        {item}
      </Text>
    </TouchableOpacity>
  );
};

export default memo(SelectorItem);
