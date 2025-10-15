import {HttpRequest} from '..';

export const findMembreApi = async (id: number) =>
  await HttpRequest(`eglise/findMembreByEgliseId/${id}`, 'GET');

export const createMembresApi = async (dto: any) =>
  await HttpRequest(`auth/local/signup`, 'POST', dto);

export const updateMembreApi = async (dto: any, id: number) =>
  await HttpRequest(`auth/local/user/${id}`, 'PATCH', dto);
