import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState} from '..';
// import { IFile } from '../../config/interface';
// import { fileTypeEnum } from '../../config/enum';

export interface StateFiles {
  videos: IFile[];
  audios: IFile[];
  livres: IFile[];
}

const initialState: StateFiles = {
  videos: [],
  audios: [],
  livres: [],
};

export const filesSlice = createSlice({
  name: 'files',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addFiles: (state, action: PayloadAction<IFile>) => {
      switch (action.type) {
        case 'videos':
          state.videos.push(action.payload);
          break;
        case 'audios':
          state.audios.push(action.payload);
          break;
        case 'livres':
          state.livres.push(action.payload);
          break;
        default:
          break;
      }
    },
    updateFiles: (
      state,
      action: PayloadAction<{file: IFile[]; type: fileTypeEnum}>,
    ) => {
      switch (action.payload.type) {
        case 'videos':
          state.videos = action.payload.file;
          break;
        case 'audios':
          state.audios = action.payload.file;
          break;
        case 'livres':
          state.livres = action.payload.file;
          break;
        default:
          break;
      }
    },
  },
});

export const {addFiles, updateFiles} = filesSlice.actions;

export const selectFiles = (state: AppState) => state.files;

export default filesSlice.reducer;

export const persistConfigFiles = {
  key: 'files_ecclesia_book_mobile',
  version: 1,
  storage: AsyncStorage,
};
