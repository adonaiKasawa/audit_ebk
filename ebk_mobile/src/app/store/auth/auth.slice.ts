import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState} from '..';

export interface State {
  access_token: string | undefined;
  refresh_token: string | undefined;
  isAuthenticated: boolean;
}

export interface Action {}

const initialState: State = {
  access_token: undefined,
  refresh_token: undefined,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    loginUser: (state, action: PayloadAction<State>) => {
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    logoutUser: state => {
      state.access_token = undefined;
      state.refresh_token = undefined;
      state.isAuthenticated = false;
    },
  },
});

export const {loginUser, logoutUser} = authSlice.actions;

export const selectAuth = (state: AppState) => state.auth;

export default authSlice.reducer;

export const persistConfigAuth = {
  key: 'auth_ecclesia_book_mobile',
  version: 1,
  storage: AsyncStorage,
};
