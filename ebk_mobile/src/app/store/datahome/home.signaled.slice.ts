// home.signaled.slice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface SignaledState {
  [key: string]: any[]; // clé = typeContent, valeur = tableau des contenus signalés
}

const initialState: SignaledState = {};

const signaledSlice = createSlice({
  name: 'signaled',
  initialState,
  reducers: {
    updateSignaledContent: (
      state,
      action: PayloadAction<{
        contentType: string;
        contentId: number;
        data: any;
      }>,
    ) => {
      const {contentType, contentId, data} = action.payload;
      if (!state[contentType]) state[contentType] = [];
      const index = state[contentType].findIndex(
        (c: any) => c.id === contentId,
      );
      if (index >= 0) {
        state[contentType][index] = data;
      } else {
        state[contentType].push(data);
      }
    },
  },
});

export const {updateSignaledContent} = signaledSlice.actions;
export default signaledSlice.reducer;
