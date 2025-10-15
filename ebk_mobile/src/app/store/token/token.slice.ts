import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState} from '..';

interface State {
  token: string;
}

const initialState: State = {
  token: '',
};

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setToken: (state, action: PayloadAction<State>) => {
      state.token = action.payload.token;
    },
    resetToken: state => {
      state.token = '';
    },
  },
});

export const {setToken, resetToken} = tokenSlice.actions;

export const selectToken = (state: AppState) => state.token;

export default tokenSlice.reducer;

export const persistConfigToken = {
  key: 'token_ecclesia_book_mobile',
  version: 1,
  storage: AsyncStorage,
};
