import {HttpRequest} from '..';

export const blockContentApi = async (contentType: string, id: number) =>
  HttpRequest(`blocked/${id}?contentType=${contentType}`, 'POST');

export const findBlockContentByUserApi = async () =>
  await HttpRequest('blocked/test', 'GET');
