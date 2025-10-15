import {TypeContentEnum} from '../config/enum';
import {ItemPicture, ItemVideos} from '../config/interface';

export function getContentByType(
  type: TypeContentEnum,
  contentId: number | string,
  data: {
    videos: ItemVideos[];
    images: ItemPicture[];
    livres: ItemVideos[];
    audios: ItemVideos[];
  },
) {
  const defaultContent = {
    id: 0,
    likes: [],
    favoris: [],
    share: [],
    sharecode: '',
  };

  switch (type) {
    case TypeContentEnum.videos:
      return data.videos.find((item: any) => item.id === contentId);
    case TypeContentEnum.images:
      return data.images.find((item: any) => item.id === contentId);
    case TypeContentEnum.livres:
      return data.livres.find((item: any) => item.id === contentId);
    case TypeContentEnum.audios:
      return data.audios.find((item: any) => item.id === contentId);
    default:
      return undefined;
  }
}
