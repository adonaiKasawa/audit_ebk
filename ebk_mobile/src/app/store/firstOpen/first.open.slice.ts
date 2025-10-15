import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState} from '..';

interface State {
  open: boolean;
  inTesmonials: boolean;
}

const initialState: State = {
  open: true,
  inTesmonials: true,
};

export const firstOpenSlice = createSlice({
  name: 'firstOpen',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setFirstOpen: (state, action: PayloadAction<State>) => {
      state.open = false;
    },
    setFirstOpenTesmonials: (state, action: PayloadAction<State>) => {
      state.inTesmonials = false;
    },
  },
});

export const {setFirstOpen, setFirstOpenTesmonials} = firstOpenSlice.actions;

export const selectFirstOpen = (state: AppState) => state.firstOpen;

export default firstOpenSlice.reducer;

export const persistConfigFirstOpen = {
  key: 'first_open_ecclesia_book_mobile',
  version: 1,
  storage: AsyncStorage,
};
