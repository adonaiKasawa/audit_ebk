import {HttpRequest} from '..';

export const findAbonnementByEgliseIdPaginated = async (id_eglise: number) =>
  await HttpRequest(
    `abonnement/findByEgliseId/paginated/${id_eglise}?page=1&limit=100'`,
    'GET',
  );
