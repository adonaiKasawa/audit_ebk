import {HttpRequest} from '..';

export const createAnnonceApi = async (credentials: any, id_eglise: number) =>
  await HttpRequest(`annonce/${id_eglise}`, 'POST', credentials);

export const findAnnonceByEgliseIdPaginated = async (id_eglise: number) =>
  await HttpRequest(
    `annonce/findByEgliseId/paginated/${id_eglise}?page=1&limit=100'`,
    'GET',
  );
export const findAnnoncePaginated = async () =>
  await HttpRequest(`annonce/all-paginated?page=1&limit=1000'`, 'GET');

export const deleteAnnonceApi = async (id_annonce: number) =>
  await HttpRequest(`annonce/${id_annonce}`, 'DELETE');
