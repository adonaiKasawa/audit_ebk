import {HttpRequest} from '..';

export const createBibleStudyApi = async (credentials: any) =>
  await HttpRequest(`bible-study`, 'POST', credentials);
export const createContentBibleStudyApi = async (
  credentials: any,
  id: number,
) => await HttpRequest(`bible-study/content/file/${id}`, 'POST', credentials);
export const findBibleStudyById = async (id: number) =>
  await HttpRequest(`bible-study/${id}`, 'GET');
export const findBibleStudyByEgliseIdPaginated = async (id_eglise: number) =>
  await HttpRequest(
    `bible-study/find/paginated/${id_eglise}?page=1&limit=100`,
    'GET',
  );
export const findBibleStudyPaginatedApi = async () =>
  await HttpRequest(`bible-study/find/all/paginated?page=1&limit=100`, 'GET');
export const deleteBibleStudyApi = async (id_formation: number) =>
  await HttpRequest(`bible-study/${id_formation}`, 'DELETE');
