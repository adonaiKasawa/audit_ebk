import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {AppState} from '..';

export interface State {
  mode: string;
  level: 'app' | 'os';
}

export interface Action {}

const initialState: State = {
  mode: 'dark',
  level: 'app',
};

export const themeSlice = createSlice({
  name: 'auth',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setTheme: (state, action: PayloadAction<State>) => {
      state.mode = action.payload.mode;
      state.level = action.payload.level;
    },
  },
});

export const {setTheme} = themeSlice.actions;

export const selectTheme = (state: AppState) => state.theme;

export default themeSlice.reducer;

export const persistConfigTheme = {
  key: 'theme_ecclesia_book_mobile',
  version: 1,
  storage: AsyncStorage,
};
