import React, {useEffect} from 'react';
import {useColorScheme} from 'react-native';
import {useDispatch} from 'react-redux';
import {bibleStoreSlice, selectBibleStore, setBibleTheme} from './bible.slice';
import {Theme} from './bible.slice';
import {useAppSelector} from '../hooks';
interface BibleThemeInitializerProps {
  children: React.ReactNode;
}

const BibleThemeInitializer: React.FC<BibleThemeInitializerProps> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const bibleStore = useAppSelector(selectBibleStore);
  const dispatch = useDispatch();

  useEffect(() => {
    if (colorScheme) {
      // Map the app's color scheme to the corresponding Bible theme
      if (
        bibleStore.font.theme.background === '' &&
        bibleStore.font.theme.color === ''
      ) {
        const bibleTheme = colorScheme === 'light' ? Theme[0] : Theme[6]; // Customize this mapping
        dispatch(setBibleTheme(bibleTheme));
      }
    }
  }, [colorScheme, dispatch]);

  return <>{children}</>;
};

export default BibleThemeInitializer;
