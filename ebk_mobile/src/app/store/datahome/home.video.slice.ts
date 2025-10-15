// src/redux/slices/homeVideoSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  Commentaires,
  Eglise,
  Favoris,
  Likes,
  Users,
  View,
} from '../../config/interface';

export interface VideoFile {
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
  views?: View[];
}

interface FilesState {
  videos: VideoFile[];
}

const initialState: FilesState = {
  videos: [],
};

const homeVideoSlice = createSlice({
  name: 'homevideos',
  initialState,
  reducers: {
    setVideos: (state, action: PayloadAction<VideoFile[]>) => {
      state.videos = action.payload;
    },
    appendVideos: (state, action: PayloadAction<VideoFile[]>) => {
      state.videos.push(...action.payload);
    },
    clearVideos: state => {
      state.videos = [];
    },

    // ✅ Ajouter un reducer pour mettre à jour les commentaires d’une vidéo spécifique
    addCommentToVideo: (
      state,
      action: PayloadAction<{videoId: number; comment: Commentaires}>,
    ) => {
      const {videoId, comment} = action.payload;
      const video = state.videos.find(v => v.id === videoId);
      if (video) {
        if (video.commentaire) {
          video.commentaire.push(comment);
        } else {
          video.commentaire = [comment];
        }
      }
    },

    toggleLikeToVideo: (
      state,
      action: PayloadAction<{videoId: number; user: any}>,
    ) => {
      const {videoId, user} = action.payload;
      const video = state.videos.find(v => v.id === videoId);

      if (video) {
        const existingIndex = video.likes.findIndex(
          like => like.users?.id === user?.users?.id,
        );

        if (existingIndex !== -1) {
          // 🔻 Supprimer le like
          video.likes.splice(existingIndex, 1);
        } else {
          // 🔺 Ajouter le like
          const newId = Number(
            `${Date.now()}${Math.floor(Math.random() * 1000)}`,
          );
          video.likes.push(user);
        }
      }
    },

    addViewToVideoWatch: (
      state,
      action: PayloadAction<{videoId: number; view: View}>,
    ) => {
      const {videoId, view} = action.payload;
      const video = state.videos.find(v => v.id === videoId);
      if (video) {
        const alreadyViewed = video.views?.some(
          v => v.usersId === view.usersId,
        );
        if (!alreadyViewed) {
          if (video.views) {
            video.views.push(view);
          } else {
            video.views = [view];
          }
        }
      }
    },
  },
});

export const {
  setVideos,
  appendVideos,
  clearVideos,
  addCommentToVideo,
  toggleLikeToVideo,
  addViewToVideoWatch,
} = homeVideoSlice.actions;
export default homeVideoSlice.reducer;
