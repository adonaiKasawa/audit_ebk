import {HttpRequest} from '..';

export const findProgrammeByChurchIdApi = async (id: number) =>
  await HttpRequest(`programme/findByEglise/${id}`, 'GET');
export const createProgrammeApi = async (dto: {titre: string}) =>
  await HttpRequest(`programme`, 'POST', dto);
export const updateProgrammeeApi = async (dto: {titre: string}, id: number) =>
  await HttpRequest(`programme/${id}`, 'PATCH', dto);
export const deleteProgrammeApi = async (id: number) =>
  await HttpRequest(`programme/delete/${id}`, 'DELETE');

export const resendNotificationApi = async (id: number) =>
  await HttpRequest(`programme/resendNotification/${id}`, 'POST');
export const addSousProgrammeApi = async (
  dto: {debut: string; fin: string; libelle: string},
  id: number,
) => await HttpRequest(`programme/${id}`, 'POST', dto);
export const updateSousProgrammeApi = async (
  dto: {debut: string; fin: string; libelle: string},
  id: number,
) => await HttpRequest(`programme/update/sousprogramme/${id}`, 'PATCH', dto);
export const deleteSousProgrammeApi = async (id: number) =>
  await HttpRequest(`programme/sousprogramme/${id}`, 'DELETE');
