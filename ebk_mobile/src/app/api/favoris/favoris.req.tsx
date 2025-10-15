import {TypeContentEnum} from '../../config/enum';
import {HttpRequest} from '..';

export const createFavorisApi = async (
  typeContent: TypeContentEnum,
  contentId: number,
) => await HttpRequest(`favoris/${contentId}?files=${typeContent}`, 'POST');
export const findFavorisByContetTypeAndUserApi = async (
  typeContent: TypeContentEnum,
  userId: number,
) =>
  await HttpRequest(
    `favoris/findByContentTypeAndUser/${userId}/${typeContent}`,
    'GET',
  );
export const findFavorisByUserApi = async () =>
  await HttpRequest(`favoris/findByUser`, 'GET');
export const deleteFavorisApi = async (contentId: number) =>
  await HttpRequest(`favoris/${contentId}`, 'DELETE');
