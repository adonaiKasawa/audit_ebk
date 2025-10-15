// Interface pour les informations de l'église
export interface Eglise {
  id_eglise: number;
  nom_eglise: string;
  photo_eglise: string;
  username_eglise: string;
}

// Interface pour les informations de l'utilisateur
export interface User {
  id: number;
  nom: string;
  prenom: string;
  username: string;
  profil: string | null;
  eglise: Eglise;
}

// Interface pour une réponse individuelle
export interface ResponseSondage {
  createdAt: string; // Utiliser `Date` si vous préférez des objets Date au lieu de strings
  updatedAt: string;
  deletedAt: string | null;
  id: number;
  response: string;
  user: User;
}

// Interface pour une question avec les réponses associées
export interface QuestionWithResponses {
  id: number;
  question: string;
  type: string;
  responses: ResponseSondage[];
}
// Interface pour le regroupement de questions avec réponses
export interface GroupedResponses {
  question: QuestionWithResponses;
}
