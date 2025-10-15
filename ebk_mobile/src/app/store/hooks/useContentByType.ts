import {useMemo} from 'react';
import {TypeContentEnum} from '../../config/enum';
import {useAppSelector} from '../hooks';
import {getContentByType} from '../../helpers/getContentByType';

export function useContentByType(
  typeContent: TypeContentEnum,
  contentId?: number | string,
) {
  const videos = useAppSelector(state => state.homevideos.videos);
  const images = useAppSelector(state => state.homeimages.images);
  const livres = useAppSelector(state => state.homebooks.livres);
  const audios = useAppSelector(state => state.homeaudios.audios);

  const contentData = useMemo(() => {
    if (!typeContent || !contentId) return undefined;

    return getContentByType(typeContent, contentId, {
      videos,
      images,
      livres,
      audios,
    });
  }, [typeContent, contentId, videos, images, livres, audios]);

  return contentData;
}
