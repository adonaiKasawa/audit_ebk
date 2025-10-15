// fontsSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppState} from '..';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FontState {
  downloadedFonts: string[]; // Liste des noms de polices téléchargées
}

const initialState: FontState = {
  downloadedFonts: [],
};

const fontsSlice = createSlice({
  name: 'fonts',
  initialState,
  reducers: {
    addFont(state, action: PayloadAction<string>) {
      state.downloadedFonts.push(action.payload);
    },
  },
});

export const {addFont} = fontsSlice.actions;
export default fontsSlice.reducer;

export const selectDownloadedFonts = (state: AppState) => state.fonts;

export const persistConfigFonts = {
  key: 'fonts_ecclesia_book_mobile',
  version: 1,
  storage: AsyncStorage,
};
