import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState} from '..';

export interface IAudiosPlayer {}

export interface StateAudiosPlayer {
  lastAudiosId: number;
  lastAudiosLink: string;
  lastAdiosPostionProgesse: number;
  lastAudiosDuration: number;
  audiosInPlayer: boolean;
  audiosPlay: boolean;
  lastPhoto: string;
  lastTitre: string;
  lasteAuteur: string;
}

const initialState: StateAudiosPlayer = {
  lastAudiosId: 0,
  lastAudiosLink: '',
  lastAdiosPostionProgesse: 0,
  lastAudiosDuration: 0,
  audiosInPlayer: false,
  audiosPlay: false,
  lastPhoto: '',
  lastTitre: '',
  lasteAuteur: '',
};

export const audiosPlayerSlice = createSlice({
  name: 'audiosPlayer',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addAudiosPlayer: (state, action: PayloadAction<StateAudiosPlayer>) => {
      state.lastAudiosId = action.payload.lastAudiosId;
      state.lastAudiosLink = action.payload.lastAudiosLink;
      state.lastAdiosPostionProgesse = action.payload.lastAdiosPostionProgesse;
      state.lastAudiosDuration = action.payload.lastAudiosDuration;
      state.audiosInPlayer = action.payload.audiosInPlayer;
      state.audiosPlay = action.payload.audiosPlay;
      (state.lastPhoto = action.payload.lastPhoto),
        (state.lastTitre = action.payload.lastTitre),
        (state.lasteAuteur = action.payload.lasteAuteur);
    },
  },
});

export const {addAudiosPlayer} = audiosPlayerSlice.actions;

export const selectAudiosPlayer = (state: AppState) => state.audiosplayer;

export default audiosPlayerSlice.reducer;

export const persistConfigAudiosPlayer = {
  key: 'audios_player_ecclesia_book_mobile',
  version: 1,
  storage: AsyncStorage,
};
