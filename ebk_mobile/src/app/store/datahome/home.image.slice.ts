// import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import {
//   Commentaires,
//   Eglise,
//   Favoris,
//   ItemPicture,
//   Likes,
// } from '../../config/interface';

// interface FilesState {
//   images: ItemPicture[];
// }

// const initialState: FilesState = {
//   images: [],
// };

// const homeImageSlice = createSlice({
//   name: 'homeimages',
//   initialState,
//   reducers: {
//     setImages: (state, action: PayloadAction<any[]>) => {
//       state.images = action.payload;
//     },
//     appendImages: (state, action: PayloadAction<any[]>) => {
//       state.images.push(...action.payload);
//     },
//     clearImages: state => {
//       state.images = [];
//     },
//     addCommentToImage: (
//       state,
//       action: PayloadAction<{imageId: number; comment: Commentaires}>,
//     ) => {
//       const {imageId, comment} = action.payload;
//       const image = state.images.find(img => img.id === imageId);
//       if (image) {
//         if (image.commentaire) {
//           image.commentaire.push(comment);
//         } else {
//           image.commentaire = [comment];
//         }
//       }
//     },

//     toggleLikeToImage: (
//       state,
//       action: PayloadAction<{imageId: number; user: any}>,
//     ) => {
//       const {imageId, user} = action.payload;
//       const image = state.images.find(v => v.id === imageId);

//       if (image) {
//         const existingIndex = image.likes.findIndex(
//           (image: any) => image.users?.id === user?.users?.id,
//         );

//         if (existingIndex !== -1) {
//           // 🔻 Supprimer le like
//           image.likes.splice(existingIndex, 1);
//         } else {
//           // 🔺 Ajouter le like
//           const newId = Number(
//             `${Date.now()}${Math.floor(Math.random() * 1000)}`,
//           );
//           image.likes.push(user);
//         }
//       }
//     },
//   },
// });

// // Sélecteur pour retrouver une image par id
// export const selectImageById = (state: any, id: number) => {
//   return state.homeimages.images.find((img: any) => img.id === id);
// };

// export const {
//   setImages,
//   appendImages,
//   clearImages,
//   addCommentToImage,
//   toggleLikeToImage,
// } = homeImageSlice.actions;
// export default homeImageSlice.reducer;

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Commentaires, ItemPicture} from '../../config/interface';

interface FilesState {
  images: ItemPicture[];
}

const initialState: FilesState = {
  images: [],
};

const homeImageSlice = createSlice({
  name: 'homeimages',
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<any[]>) => {
      state.images = action.payload;
    },
    appendImages: (state, action: PayloadAction<any[]>) => {
      state.images.push(...action.payload);
    },
    clearImages: state => {
      state.images = [];
    },

    addCommentToImage: (
      state,
      action: PayloadAction<{imageId: number; comment: Commentaires}>,
    ) => {
      const {imageId, comment} = action.payload;
      const image = state.images.find(img => img.id === imageId);
      if (image) {
        if (image.commentaire) {
          image.commentaire.push(comment);
        } else {
          image.commentaire = [comment];
        }
      }
    },

    toggleLikeToImage: (
      state,
      action: PayloadAction<{imageId: number; user: any}>,
    ) => {
      const {imageId, user} = action.payload;
      const image = state.images.find(v => v.id === imageId);

      if (image) {
        const existingIndex = image.likes.findIndex(
          (like: any) => like.users?.id === user?.users?.id,
        );

        if (existingIndex !== -1) {
          // 🔻 Supprimer le like
          image.likes.splice(existingIndex, 1);
        } else {
          // 🔺 Ajouter le like
          image.likes.push(user);
        }
      }
    },

    // ✅ Nouveau reducer pour ajouter un signalement
    addSignalToImage: (
      state,
      action: PayloadAction<{imageId: number; signal: any}>,
    ) => {
      const {imageId, signal} = action.payload;
      const image = state.images.find(img => img.id === imageId);
      if (image) {
        if (image.signale) {
          image.signale.push(signal);
        } else {
          image.signale = [signal];
        }
      }
    },
  },
});

// Sélecteur pour retrouver une image par id
export const selectImageById = (state: any, id: number) => {
  return state.homeimages.images.find((img: any) => img.id === id);
};

export const {
  setImages,
  appendImages,
  clearImages,
  addCommentToImage,
  toggleLikeToImage,
  addSignalToImage, // ✅ export du reducer
} = homeImageSlice.actions;
export default homeImageSlice.reducer;
