import {HttpRequest} from '..';

export const findSearchApi = async (s_query: string) =>
  await HttpRequest(`search/${s_query}`, 'GET');
