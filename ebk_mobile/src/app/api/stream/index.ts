import {HttpRequest} from '..';
import {TypeContentEnum} from '../../config/enum';

export const addStreamConentApi = async (
  id_file: number,
  fileType: TypeContentEnum,
) => await HttpRequest(`views/${id_file}?files=${fileType}`, 'POST');
