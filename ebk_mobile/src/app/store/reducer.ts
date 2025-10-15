import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import audiosPlayerReducer, {
  persistConfigAudiosPlayer,
} from './audiosplayer/audiosplayer.slice';
import authReducer, {persistConfigAuth} from './auth/auth.slice';
import filesReducer, {persistConfigFiles} from './files/files.slice';
import notificationReducer, {
  persistConfigNotification,
} from './notification/notification.slice';
import themeReducer, {persistConfigTheme} from './theme/theme.slice';
import tokenReducer, {persistConfigToken} from './token/token.slice';
import firstOpenReducer, {
  persistConfigFirstOpen,
} from './firstOpen/first.open.slice';
import bibleStoreReducer, {persistConfigBibleStore} from './bible/bible.slice';
import fontsReducer, {persistConfigFonts} from './fonts/fonts.slice';
import homeVideosReducer from './datahome/home.video.slice';
import homeImagesReducer from './datahome/home.image.slice';
import homeBooksReducer from './datahome/home.book.slice';
import homeAudiosReducer from './datahome/home.audio.slice';
import homeTestimonialReducer from './datahome/home.testimonials.slice';
import homeTestimonialsListReducer from './datahome/home.testmonialslist.slice';
import statistiqueReducer from './statistiqueChurch/statistique.slice';
import audioPlayerReducer from './audiosplayer/audio.id.slice';
import signaledReducer from './datahome/home.signaled.slice';

export default combineReducers({
  auth: persistReducer(persistConfigAuth, authReducer),
  theme: persistReducer(persistConfigTheme, themeReducer),
  files: persistReducer(persistConfigFiles, filesReducer),
  token: persistReducer(persistConfigToken, tokenReducer),
  notification: persistReducer(persistConfigNotification, notificationReducer),
  firstOpen: persistReducer(persistConfigFirstOpen, firstOpenReducer),
  audiosplayer: persistReducer(persistConfigAudiosPlayer, audiosPlayerReducer),
  bibleStore: persistReducer(persistConfigBibleStore, bibleStoreReducer),
  fonts: persistReducer(persistConfigFonts, fontsReducer),
  homevideos: homeVideosReducer,
  homeimages: homeImagesReducer,
  homebooks: homeBooksReducer,
  homeaudios: homeAudiosReducer,
  hometestimonial: homeTestimonialReducer,
  hometestimonialslist: homeTestimonialsListReducer,
  statistique: statistiqueReducer,
  audioPlayer: audioPlayerReducer,
  signaled: signaledReducer,
});
