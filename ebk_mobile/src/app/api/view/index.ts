import {HttpRequest} from '..';
import {TypeContentEnum} from '../../config/enum';

export const addViewConentApi = async (
  id_file: number,
  fileType: TypeContentEnum,
) => await HttpRequest(`views/${id_file}?files=${fileType}`, 'POST');
