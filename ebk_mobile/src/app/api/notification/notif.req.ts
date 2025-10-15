import {TypeContentEnum} from '../../config/enum';
import {HttpRequest} from '..';

export const resendNotificationApi = async (
  id: number,
  typeContent: TypeContentEnum,
) => await HttpRequest(`notification/resend/${typeContent}/${id}`, 'GET');
export const getUserNotificationsApi = async () =>
  await HttpRequest(`notification/findByUser`, 'GET');

export const changeNotificationStatusApi = async (notificationId: number) =>
  await HttpRequest(`notification/status/${notificationId}`, 'PUT');
