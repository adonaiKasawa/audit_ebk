import {NavigationProp, RouteProp} from '@react-navigation/native';

export type RootStackNavigationParamList = {
  Home: any;
  Forums: any;
  BibleStudys: any;
  Testimonials: any;
};

export type StackNavigationScreenProps = {
  navigation: NavigationProp<RootStackNavigationParamList>;
  route: any;
};

// Paramètres de navigation pour l'écran 'Bottom'
export type BottomTabNavigationParams = {
  Bottom: undefined;
  VideosPlayer: undefined;
  AudiosPlayer: undefined;
  BooksPlayer: undefined;
  ImagesViewer: undefined;
  ForumSubject: undefined;
  ForumParticipation: undefined;
  ChurchList: undefined;
  ChurchDetail: undefined;
  Programmes: undefined;
  Communiques: undefined;
  PostPonne: undefined;
  PostPonneCreate: undefined;
  TestimonialsUpload: undefined;
  TestimonialsHandler: undefined;
  Notification: undefined;
  Settings: undefined;
};

// Paramètres de navigation pour l'écran 'Account'
type AccountStackNavigationParams = {
  signUp: undefined;
  signIn: undefined;
  forgotPassword: undefined;
  forgotPasswordUpdated: undefined;
  ConfirmPhoneNumber: undefined;
  ConfirmEmail: undefined;
  UpdateAccount: undefined;
  // Ajoutez d'autres écrans et leurs paramètres ici...
};

// Paramètres de navigation pour l'écran 'Home'
type HomeStackNavigationParams = {
  Home: undefined;
  // Ajoutez d'autres écrans et leurs paramètres ici...
};

// Définissez le type global pour tous les paramètres de navigation
type RootStackParamList = BottomTabNavigationParams &
  AccountStackNavigationParams &
  HomeStackNavigationParams;

// // Type du navigateur global pour les onglets du bas
// type BottomTabNavigationProp<T extends keyof BottomTabNavigationParams> = BottomTabNavigationProp<
//   BottomTabNavigationParams,
//   T
// >;

// // Type du navigateur global pour la navigation par onglets supérieurs avec le style matériel
// type MaterialTopTabNavigationProp<T extends keyof BottomTabNavigationParams> = MaterialTopTabNavigationProp<
//   BottomTabNavigationParams,
//   T
// >;

// // Type du navigateur global pour la navigation par onglets inférieurs avec le style matériel
// type MaterialBottomTabNavigationProp<T extends keyof BottomTabNavigationParams> = MaterialBottomTabNavigationProp<
//   BottomTabNavigationParams,
//   T
// >;

// // Type des propriétés de navigation pour chaque écran
// type NavigationProps<T extends keyof RootStackParamList> = {
//   navigation: BottomTabNavigationProp<T> | AccountStackNavigationParams | HomeStackNavigationParams;
//   route: RouteProp<RootStackParamList, T>;
// };

// export {
//   BottomTabNavigationParams,
//   AccountStackNavigationParams,
//   HomeStackNavigationParams,
//   RootStackParamList,
//   BottomTabNavigationProp,
//   MaterialTopTabNavigationProp,
//   MaterialBottomTabNavigationProp,
//   NavigationProps,
// };
