// src/redux/slices/homeAudioSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  Commentaires,
  Eglise,
  Favoris,
  Likes,
  Stream,
} from '../../config/interface';

export interface AudioFile {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  titre: string;
  lien: string;
  photo: string;
  webp: null;
  auteur: string;
  interne: boolean;
  sharecode: string;
  eglise: Eglise;
  favoris: Favoris[];
  likes: Likes[];
  commentaire: Commentaires[];
  share: Favoris[];
  views?: Stream[];
}

interface FilesState {
  audios: AudioFile[];
}

const initialState: FilesState = {
  audios: [],
};

const homeAudioSlice = createSlice({
  name: 'homeaudios',
  initialState,
  reducers: {
    setAudios: (state, action: PayloadAction<AudioFile[]>) => {
      state.audios = action.payload;
    },
    appendAudios: (state, action: PayloadAction<AudioFile[]>) => {
      state.audios.push(...action.payload);
    },
    clearAudios: state => {
      state.audios = [];
    },
    addCommentToAudio: (
      state,
      action: PayloadAction<{audioId: number; comment: Commentaires}>,
    ) => {
      const {audioId, comment} = action.payload;
      const audio = state.audios.find(a => a.id === audioId);
      if (audio) {
        if (audio.commentaire) {
          audio.commentaire.push(comment);
        } else {
          audio.commentaire = [comment];
        }
      }
    },

    toggleLikeToAudio: (
      state,
      action: PayloadAction<{audioId: number; user: any}>,
    ) => {
      const {audioId, user} = action.payload;
      const audio = state.audios.find(v => v.id === audioId);

      if (audio) {
        const existingIndex = audio.likes.findIndex(
          (audio: any) => audio.users?.id === user?.users?.id,
        );

        if (existingIndex !== -1) {
          // 🔻 Supprimer le like
          audio.likes.splice(existingIndex, 1);
        } else {
          // 🔺 Ajouter le like
          audio.likes.push(user);
        }
      }
    },

    addStreamToAudioListen: (
      state,
      action: PayloadAction<{audioId: number; stream: Stream}>,
    ) => {
      const {audioId, stream} = action.payload;
      const audio = state.audios.find(v => v.id === audioId);
      if (audio) {
        const alreadyViewed = audio.views?.some(
          v => v.usersId === stream.usersId,
        );
        if (!alreadyViewed) {
          if (audio.views) {
            audio.views.push(stream);
          } else {
            audio.views = [stream];
          }
        }
      }
    },
  },
});

export const {
  setAudios,
  appendAudios,
  clearAudios,
  addCommentToAudio,
  toggleLikeToAudio,
  addStreamToAudioListen,
} = homeAudioSlice.actions;
export default homeAudioSlice.reducer;
