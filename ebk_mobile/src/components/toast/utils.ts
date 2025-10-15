import {animation} from '.';
import colors from '../style/colors';

export const getStyles = (type: string, isDarkMode: boolean) => {
  switch (type) {
    case 'success':
      return {
        backgroundColor: isDarkMode ? colors.primary : colors.lighter,
        titleColor: isDarkMode ? colors.lighter : colors.primary,
        descriptionColor: colors.gris,
        animationSource: animation.success,
      };
    case 'warning':
      return {
        backgroundColor: '#fef7ec',
        titleColor: '#f08135',
        descriptionColor: '#f08135',
        animationSource: animation.warning,
      };
    case 'error':
      return {
        backgroundColor: '#fae1db',
        titleColor: '#d9100a',
        descriptionColor: '#d9100a',
        animationSource: animation.error,
      };
    default:
      return {
        backgroundColor: 'white',
        titleColor: 'black',
        descriptionColor: 'gray',
        animationSource: animation.success,
      };
  }
};
