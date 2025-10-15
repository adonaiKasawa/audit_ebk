import {AuthHttpRequest, HttpRequest} from '..';
import {Platform} from 'react-native';

export interface credentials {
  telephone: string;
  password: string;
}

export interface createUserDto {
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  adresse?: string;
  datenaissance?: string;
  sexe?: string;
  ville?: string;
  pays?: string;
  password: string;
  fk_eglise?: number;
}

export interface codeDto {
  tel: string;
  code: string;
}

export const AuthLoginApi = async (credentials: credentials) =>
  await AuthHttpRequest('auth/signin/user', 'POST', credentials);
export const CreateAccountApi = async (dto: createUserDto) =>
  await AuthHttpRequest(`auth/local/signup`, 'POST', dto);
export const ConfirmeAccountApi = async (code: codeDto) =>
  await AuthHttpRequest(`auth/validateCompte`, 'POST', code);
export const SendTokenApi = async (token: string) =>
  await HttpRequest('notification/sendToken', 'POST', {
    token,
    plateform: Platform.OS,
  });
export const ReloadSession = async (dto: any) =>
  await AuthHttpRequest('auth/local/signin', 'POST', dto);
export const UpdateUserApi = async (dto: any, id: number) =>
  await HttpRequest(`auth/local/user/${id}`, 'PATCH', dto);
export const UpdatePasswordApi = async (dto: any, id: number) =>
  await HttpRequest(`auth/updatePassword/${id}`, 'PATCH', dto);
export const GetSmsMsgCode = async (tel: string, email: string) =>
  AuthHttpRequest(`auth/sendSmsByTel?telephone=${tel}&email=${email}`, 'GET');
export const checkValideCode = async (code: codeDto) =>
  await HttpRequest(`auth/checkValideCode`, 'POST', code);
export const sendSuggestionApi = async (suggestion: string) =>
  await HttpRequest('suggestion/', 'POST', {suggestion});
export const AuthDeleteApi = async () =>
  await HttpRequest('auth/delete/user/', 'DELETE');

export const findSuggestionsByUseApi = async () =>
  await HttpRequest(`suggestion/`, 'GET');

export const sendUserPhotoProfilApi = async (data: any, id: number) =>
  await HttpRequest(
    `auth/user/update/picture/profil/${id}`,
    'PATCH',
    data,
    'multipart/form-data',
  );

export const LeaveTheChurchApi = async () =>
  await HttpRequest(`auth/leaveTheChurch`, 'PATCH');
