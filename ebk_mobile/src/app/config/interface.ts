import {PrivilegesEnum, SondageQuestionTypeEnum, TypeContentEnum} from './enum';

// start ....... interface generic ...... start
export interface PayloadUserInterface {
  sub: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  profil?: string;
  couverture?: string;
  username: null;
  privilege_user: string;
  eglise: Eglise;
  ville: string;
  pays: string;
  adresse: string;
  iat: number;
  exp: number;
}
export interface Links {
  first: string;
  previous: string;
  next: string;
  last: string;
}
export interface Meta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
export interface Token {
  access_token: string;
  refresh_token: string;
}
// end ....... interface generic ....... end

// start ..... interface for get or find data ....... start
export interface Users {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  sexe: null | string;
  datenaissance: Date | null;
  adresse: null | string;
  ville: null | string;
  pays: null | string;
  username: null;
  salt: string;
  password: string;
  hashedRt: string;
  privilege: PrivilegesEnum;
  status: string;
  confirm: boolean;
  eglise: Eglise;
}
export interface Eglise {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id_eglise: number;
  nom_eglise: string;
  username_eglise: string;
  photo_eglise: string;
  couverture_eglise: string;
  sigle_eglise: string;
  adresse_eglise: string;
  ville_eglise: string;
  pays_eglise: string;
  nombrefidel_eglise: string;
  status_eglise: string;
  payement_eglise: boolean;
  programme?: Programme[];
}

export interface Commentaires {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  commentaire: string;
  users: Users;
}
export interface Favoris {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  users?: Users;
}

export interface Likes {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  users?: Users;
}
export interface Programme {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  titre: string;
  sousProgramme: SousProgramme[];
}
export interface SousProgramme {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  debut: Date;
  fin: Date;
  libelle: string;
}
export interface Communiques {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  id: number;
  communique: string;
}
export interface subjectForum {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  id: number;
  title: string;
  description: string;
}

export interface NotificationContent {
  createdAt: Date;
  id_content: number;
  type_content: TypeContentEnum;
  img_content: string;
  img_eglise: string;
  body: string;
  title: string;
  notificationId: number;
  status: boolean;
}
// end ........ interface for get or find data  ...... end

// interface for get or find data paginated

export interface ItemForum {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  title: string;
  description: string;
  picture: null | string;
  eglise: Eglise;
  favoris: Favoris[];
  subjectForum: subjectForum[];
  shared: any[];
}

export interface ItemPicture {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  id: number;
  descrition: string;
  photos: string[];
  sharecode: null | string;
  eglise: Eglise;
  favoris: Favoris[];
  commentaire: Commentaires[];
  share: any[];
  likes: Likes[];
  signale: any[];
}

export interface View {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  usersId: number;
  videosId: number;
}

export interface Stream {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  usersId: number;
  audiosId: number;
}

export interface ItemVideos {
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
export interface ItemAbonnement {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id_abonnement: number;
  reference_abonnement: string;
  montant_abonnement: string;
  method_abonnement: string;
}

export interface ItemAnnonces {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  contente: string;
  sharecode: string;
  event: ManagementEvent;
}

export interface ItemBibleStudy {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  titre: string;
  objectif: string;
  description: string;
  payement: string;
  sharecode: string;
  favoris: Favoris[];
  commentaire: Commentaires[];
  share: any[];
  likes: Likes[];
  contentsBibleStudy: ItemContentBibleStudy[];
  eglise: Eglise;
}

export interface ItemContentBibleStudy {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  titre: string;
  image: string;
  content: string;
  sharecode: string;
  favoris: Favoris[];
  commentaire: Commentaires[];
  share: any[];
  likes: Likes[];
}

export interface ManagementEvent {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  name: string;
  description: string;
  dateEvent: Date;
  isBlocked: boolean;
  adressMap: string;
  totalPerson: number;
  isFree: boolean;
  price: number;
  isCancel: Date | null;
  eglise: Eglise;
  annonces: string[];
  totalSubscriptions: number;
  isSubscribe: boolean;
  subscribe:
    | {
        createdAt: Date;
        id: number;
        uuid: string;
        isCancel: boolean;
        isChecked: boolean;
        paymentMothod: string;
        paymentReference: string;
      }
    | {
        createdAt: Date;
        id: number;
        uuid: string;
        isCancel: boolean;
        isChecked: boolean;
        paymentMothod: string;
        paymentReference: string;
      }[]
    | null;
  imsubscribe: {
    createdAt: Date;
    id: number;
    uuid: string;
    isCancel: boolean;
    isChecked: boolean;
    paymentMothod: string;
    paymentReference: string;
  } | null;
}

export interface EglisePaginated {
  items: Eglise[];
  meta: Meta;
  links: Links;
}

export interface BibleStudyPaginated {
  items: ItemBibleStudy[];
  meta: Meta;
  links: Links;
}

export interface AnnoncePaginated {
  items: ItemAnnonces[];
  meta: Meta;
  links: Links;
}

export interface VideoPaginated {
  items: ItemVideos[];
  meta: Meta;
  links: Links;
}

export interface AbonnementPaginated {
  items: ItemAbonnement[];
  meta: Meta;
  links: Links;
}

export interface ForumPaginated {
  items: ItemForum[];
  meta: Meta;
  links: Links;
}

export interface PicturePaginated {
  items: ItemPicture[];
  meta: Meta;
  links: Links;
}

export interface CommentairesPaginated {
  items: Commentaires[];
  meta: Meta;
  links: Links;
}

export interface CommuniquesPaginated {
  items: Communiques[];
  meta: Meta;
  links: Links;
}

export interface StatistiqueEglise {
  audios: number;
  videos: number;
  livres: number;
  lives: number;
  members: number;
  pragrammes: number;
  annonces: number;
  images: {
    publication: number;
    photo: number;
  };
  communiques: number;
  likes: number;
  comments: number;
  favoris: number;
}

export interface SearchIterface {
  images: ItemPicture[];
  audios: ItemVideos[];
  videos: ItemVideos[];
  live: ItemVideos[];
  livre: ItemVideos[];
  eglise: Eglise[];
  bibleStudy: ItemBibleStudy[];
  forum: ItemForum[];
}

export interface Appointment {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: number;
  requestDate: string;
  motif: string;
  postpone: boolean;
  postponeDate: string | null;
  confirm: string;
  user: Users;
}
export interface OccurenceSondage {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  occurrence: string;
}

export interface UserSuggestion {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string | null;
  adresse: string | null;
  datenaissance: string | null;
  sexe: string | null;
  ville: string | null;
  pays: string | null;
  profil: string | null;
  couverture: string | null;
  username: string | null;
  confirm: boolean;
  status: string;
  privilege: string;
  hashedRt: string;
  salt: string;
  password: string;
  eglise: any; // à remplacer par une interface précise si disponible
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Suggestion {
  id: number;
  suggestion: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  responses: any; // ou `string | null` si précisé
  userResponse: any; // ou `string | null`
  userResponseId: number | null;
  userSuggestionId: number;
  userSuggestion: Users;
}

export interface QuestionnairesSondage {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  question: string;
  type: SondageQuestionTypeEnum;
  occurrences: OccurenceSondage[];
  responses: [];
}

export interface ItemSondageQst {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  title: string;
  objectif: string;
  public: boolean;
  eglise: Eglise;
  totalQuestion: number;
  totalAnswered: number;
}
export interface ItemSondageQstDetail extends ItemSondageQst {
  questions: QuestionnairesSondage[];
}
export interface SondageQstPaginated {
  items: ItemSondageQst[];
  meta: Meta;
  links: Links;
}
// interface for get or find data paginated
export interface ItemBiblePlanLecture {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: number;
  title: string;
  description: string;
  categorie: string;
  picture: string;
  number_days: number;
  share: any[];
  eglise: Eglise;
}

export interface BiblePlanLecturePaginated {
  items: ItemBiblePlanLecture[];
  meta: Meta;
  links: Links;
}

export interface BiblePlanByUserStarted {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  user: Users;
  plans: ItemBiblePlanLecture;
}
export interface CreateAbonnementDto {
  montant_abonnement: string | null;
  method_abonnement: string | null;
  reference_abonnement: string | null;
}

export type FileInfo = {
  name: string; // Nom du fichier
  type: 'file'; // Type de l'élément (fichier)
  size: number; // Taille du fichier en octets
};

export type FolderInfo = {
  name: string; // Nom du dossier
  type: 'directory'; // Type de l'élément (dossier)
  contents: (FileInfo | FolderInfo)[]; // Contenu du dossier : fichiers ou sous-dossiers
};

export type DirectoryTree = (FileInfo | FolderInfo)[];

export type BlockedContent = {
  id: number; // ID unique du blocage
  contentId: number; // ID du contenu bloqué (ex : image, vidéo)
  contentType: TypeContentEnum; // Type du contenu : "images", "videos", etc.
  reason?: string; // Optionnel : raison du blocage
  userId?: number; // Optionnel : ID de l'utilisateur ayant signalé
  createdAt?: string; // Optionnel : date du blocage
  updatedAt?: string; // Optionnel : date de mise à jour
};
