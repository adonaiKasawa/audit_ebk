import {HttpRequest} from '..';
import {typePanoramaEnum} from '../../config/enum';

export const findPanoramaApi = async (typePanorama: typePanoramaEnum) =>
  await HttpRequest(`panorama/all?type=${typePanorama}&page=1&limit=50`, 'GET');
