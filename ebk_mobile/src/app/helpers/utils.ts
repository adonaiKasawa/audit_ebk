import {Dimensions} from 'react-native';
import {MAX_WIDTH} from './useDimensions';
import {pad} from '../config/func';

export const {width: viewportWidth, height: viewportHeight} =
  Dimensions.get('window');

export const smallSize = viewportWidth < 340;

export const wp = (percentage: number, maxWidth?: boolean | number) => {
  let value;
  if (maxWidth === true) {
    value =
      (percentage * (viewportWidth > MAX_WIDTH ? MAX_WIDTH : viewportWidth)) /
      100;
  } else if (typeof maxWidth === 'number') {
    value =
      (percentage * (viewportWidth > maxWidth ? maxWidth : viewportWidth)) /
      100;
  } else {
    value = (percentage * viewportWidth) / 100;
  }

  return Math.round(value);
};

export const wpUI = (percentage: number, maxWidth?: boolean | number) => {
  'worklet';

  let value;
  if (maxWidth === true) {
    value =
      (percentage * (viewportWidth > MAX_WIDTH ? MAX_WIDTH : viewportWidth)) /
      100;
  } else if (typeof maxWidth === 'number') {
    value =
      (percentage * (viewportWidth > maxWidth ? maxWidth : viewportWidth)) /
      100;
  } else {
    value = (percentage * viewportWidth) / 100;
  }

  return Math.round(value);
};

export const hp = (percentage: number, maxHeight?: number) => {
  let value = (percentage * viewportHeight) / 100;
  if (maxHeight) {
    value = value > maxHeight ? maxHeight : value;
  }
  value = (percentage * viewportHeight) / 100;
  return Math.round(value);
};

export const cleanParams = () => ({
  type: undefined,
  title: undefined,
  code: undefined,
  strongType: undefined,
  phonetique: undefined,
  definition: undefined,
  translatedBy: undefined,
  content: undefined,
  version: undefined,
  verses: undefined,
});

export const removeBreakLines = (str: string = '') => str.replace(/\n/g, '');

export const maxWidth = (width: number, maxW = MAX_WIDTH) =>
  width > maxW ? maxW : width;

export const minutesAndSeconds = (position: number) => {
  const minutes = Math.floor(position / 60);
  const seconds = Math.floor(position % 60);
  return [pad(minutes), pad(seconds)];
};
// utils/commentDispatcher.ts
import {AppDispatch} from '../store'; // adapte si besoin
import {TypeContentEnum} from '../config/enum';
import {addCommentToVideo} from '../store/datahome/home.video.slice';
import {addCommentToImage} from '../store/datahome/home.image.slice';
import {addCommentToAudio} from '../store/datahome/home.audio.slice';
import {addCommentToBook} from '../store/datahome/home.book.slice';

export const dispatchCommentByType = (
  dispatch: AppDispatch,
  type: TypeContentEnum,
  idFile: number,
  comment: any,
) => {
  switch (type) {
    case TypeContentEnum.videos:
      dispatch(addCommentToVideo({videoId: idFile, comment}));
      break;
    case TypeContentEnum.images:
      dispatch(addCommentToImage({imageId: idFile, comment}));
      break;
    case TypeContentEnum.livres:
      dispatch(addCommentToBook({bookId: idFile, comment}));
      break;
    case TypeContentEnum.audios:
      dispatch(addCommentToAudio({audioId: idFile, comment}));
      break;
    default:
      console.warn('Type de contenu inconnu pour le commentaire', type);
  }
};
