// redux/slices/audioPlayerSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AudioPlayerState {
  activeAudioId: number | null;
}

const initialState: AudioPlayerState = {
  activeAudioId: null,
};

const audioPlayerSlice = createSlice({
  name: 'audioPlayer',
  initialState,
  reducers: {
    setActiveAudioId(state, action: PayloadAction<number | null>) {
      state.activeAudioId = action.payload;
    },
  },
});

export const {setActiveAudioId} = audioPlayerSlice.actions;
export default audioPlayerSlice.reducer;
