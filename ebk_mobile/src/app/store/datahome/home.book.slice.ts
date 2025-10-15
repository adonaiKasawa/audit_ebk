// src/redux/slices/homeBookSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Commentaires, Eglise, Favoris, Likes} from '../../config/interface';

export interface BookFile {
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
}

interface FilesState {
  livres: BookFile[];
}

const initialState: FilesState = {
  livres: [],
};

const homeBookSlice = createSlice({
  name: 'homebooks',
  initialState,
  reducers: {
    setLivres: (state, action: PayloadAction<BookFile[]>) => {
      state.livres = action.payload;
    },
    appendBooks: (state, action: PayloadAction<BookFile[]>) => {
      state.livres.push(...action.payload);
    },
    clearBooks: state => {
      state.livres = [];
    },
    addCommentToBook: (
      state,
      action: PayloadAction<{bookId: number; comment: Commentaires}>,
    ) => {
      const {bookId, comment} = action.payload;
      const book = state.livres.find(b => b.id === bookId);
      if (book) {
        if (book.commentaire) {
          book.commentaire.push(comment);
        } else {
          book.commentaire = [comment];
        }
      }
    },

    toggleLikeToBook: (
      state,
      action: PayloadAction<{bookId: number; user: any}>,
    ) => {
      const {bookId, user} = action.payload;
      const livre = state.livres.find(v => v.id === bookId);

      if (livre) {
        const existingIndex = livre.likes.findIndex(
          (livre: any) => livre.users?.id === user?.users?.id,
        );

        if (existingIndex !== -1) {
          // 🔻 Supprimer le like
          livre.likes.splice(existingIndex, 1);
        } else {
          // 🔺 Ajouter le like
          livre.likes.push(user);
        }
      }
    },
  },
});

export const {
  setLivres,
  appendBooks,
  clearBooks,
  addCommentToBook,
  toggleLikeToBook,
} = homeBookSlice.actions;
export default homeBookSlice.reducer;
