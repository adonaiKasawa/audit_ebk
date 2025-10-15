import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Type de statistique
interface Statistique {
  annonces: number;
  audios: number;
  comments: number;
  communiques: number;
  favoris: number;
  images: {
    photo: number;
    publication: number;
  };
  likes: number;
  lives: number;
  livres: number;
  members: number;
  pragrammes: number;
  videos: number;
}

// Type de l'état du slice
interface StatistiqueState {
  [key: number]: Statistique; // L'ID de l'église est un nombre
}

const initialState: StatistiqueState = {};

// Création du slice
const statistiqueSlice = createSlice({
  name: 'statistique',
  initialState,
  reducers: {
    // Pour stocker les statistiques d'une église donnée
    setStatistiqueData: (
      state,
      action: PayloadAction<{id: number; data: Statistique}>,
    ) => {
      const {id, data} = action.payload;
      state[id] = data; // Stocke la statistique pour l'église avec l'ID spécifique
    },

    // Pour mettre à jour les membres (incrémentation ou décrémentation)
    updateMembers: (
      state,
      action: PayloadAction<{id: number; increment: boolean}>,
    ) => {
      const {id, increment} = action.payload;
      if (state[id]) {
        state[id].members += increment ? 1 : -1;
      }
    },
  },
});

export const {setStatistiqueData, updateMembers} = statistiqueSlice.actions;

export default statistiqueSlice.reducer;
