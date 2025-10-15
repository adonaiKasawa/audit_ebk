import {Dispatch} from 'redux';
import {TypeContentEnum} from '../config/enum';
import {toggleLikeToVideo} from '../store/datahome/home.video.slice';
import {toggleLikeToImage} from '../store/datahome/home.image.slice';
import {toggleLikeToAudio} from '../store/datahome/home.audio.slice';
import {toggleLikeToBook} from '../store/datahome/home.book.slice';

interface ToggleLikeParams {
  typeContent: TypeContentEnum;
  contentId: number;
  user: any;
  dispatch: Dispatch;
}

export function toggleLikeByType({
  typeContent,
  contentId,
  user,
  dispatch,
}: ToggleLikeParams) {
  switch (typeContent) {
    case TypeContentEnum.videos:
      dispatch(toggleLikeToVideo({videoId: contentId, user}));
      break;
    case TypeContentEnum.images:
      dispatch(toggleLikeToImage({imageId: contentId, user}));
      break;
    case TypeContentEnum.audios:
      dispatch(toggleLikeToAudio({audioId: contentId, user}));
      break;
    case TypeContentEnum.livres:
      dispatch(toggleLikeToBook({bookId: contentId, user}));
      break;
    default:
      console.warn(`Type de contenu non géré: ${typeContent}`);
  }
}
