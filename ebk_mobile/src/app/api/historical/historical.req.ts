import {HttpRequest} from '..';

export const historicalViewAudioApi = async (
  id_file: number,
  type_file: string,
) => await HttpRequest(`historique/${id_file}?files=${type_file}`, 'POST');

export const findHistoryByUserApi = async () =>
  await HttpRequest('historique/user', 'GET');
