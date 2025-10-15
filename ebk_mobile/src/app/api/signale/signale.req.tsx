import {HttpRequest} from '..';

export const createSignaleApi = async (typeContent: string, id: number) =>
  HttpRequest(`signale/${typeContent}/${id}`, 'POST');

export const signaleContentApi = async (contentType: string, id: number) =>
  HttpRequest(`signale/${contentType}/${id}`, 'POST', {});

export const findSignaleContentsByUserApi = async (contentType: string) =>
  await HttpRequest(
    `signale/user-signalement?contentType=${contentType}`,
    'GET',
  );
