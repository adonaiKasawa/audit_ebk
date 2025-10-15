import {HttpRequest} from '..';
import {TypeContentEnum} from '../../config/enum';
// import {HttpRequest} from '..';

export const findChurchPaginatedApi = async (page: number) =>
  await HttpRequest(`eglise?page=${page}&limit=10`, 'GET');

export const findChurchsPaginatedApi = async (page: number) =>
  await HttpRequest(`eglise/all-paginated?page=${page}&limit=100`, 'GET');

// {{offline}}/eglise/all-paginated?page=1&limit=3

export const findChurchByUsernameApi = async (username: string) =>
  await HttpRequest(`eglise/username/${username}`, 'GET');
export const findFileByChurchIdApi = async (
  id_eglise: number,
  file: TypeContentEnum,
) =>
  await HttpRequest(
    `${file}/findByEgliseId/pagination/${id_eglise}?page=1&limit=100000`,
    'GET',
  );
export const findStatistiqueByChurchApi = async (id: number) =>
  await HttpRequest(`eglise/findStatistiqueByEglise/${id}`, 'GET');

export const findCommentBySubjectForumApi = async (id: number) =>
  await HttpRequest(
    `comment/findByContentId/paginated/${id}/sujetForum?page=1&limit=100000000`,
    'GET',
  );
export const createSubjectForFourmApi = async (
  dto: {title: string; description: string | undefined},
  id: number,
) => await HttpRequest(`forum/subject/${id}`, 'POST', dto);
export const updateSubjectForFourmApi = async (
  dto: {title: string; description: string | undefined},
  id: number,
) => await HttpRequest(`forum/subject/${id}`, 'PATCH', dto);
export const deleteSubjectFourmApi = async (id: number) =>
  await HttpRequest(`forum/subject/${id}`, 'DELETE');

export const findForumAllPaginatedApi = async () =>
  await HttpRequest('forum/paginated?page=1&limit=100000', 'GET');
export const findForumByIdApi = async (id: string) =>
  await HttpRequest(`forum/findById/${id}`, 'GET');
export const findForumByChurchId = async (id_eglise: number) =>
  await HttpRequest(`forum/ByEgliseId/paginated/${id_eglise}`, 'GET');
export const createForumChurchApi = async (forumDto: any) =>
  await HttpRequest(`forum`, 'POST', forumDto);
export const updatetFourmApi = async (
  dto: {title: string; description: string | undefined},
  id: number,
) => await HttpRequest(`forum/${id}`, 'PATCH', dto);
export const deleteFourmApi = async (id: number) =>
  await HttpRequest(`forum/${id}`, 'DELETE');
