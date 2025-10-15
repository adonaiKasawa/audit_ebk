'use server';

export interface InputTagInterface {
  title: 'string';
  description: 'string';
  version: 'string';
  book: 'string';
  chapter: 'string';
  verse: 'string';
  colorTag: 'string';
}

interface InputHistory {
  version: string;
  book: string;
  chapter: string;
  verse: string;
}

import {HttpRequest} from '..';
import {TypeContentEnum} from '../../config/enum';

export const getHistoryBible = (userId: number | undefined) =>
  HttpRequest(`bible/readHistory/${userId}`, 'GET');
export const getTagBible = (userId: number | undefined) =>
  HttpRequest(`bible/tag/${userId}`, 'GET');
export const findListImageBible = () => HttpRequest(`bible/list-image`);
export const findListImageBibleByName = (name: string) =>
  HttpRequest(`bible/image/${name}`);
export const findFontList = () => HttpRequest(`listFont`);

export const postHistoryBible = (data: InputHistory) =>
  HttpRequest(`bible/readHistory/`, 'POST', data);

export const postTagBible = (data: InputTagInterface) =>
  HttpRequest(`bible/tag/`, 'POST', data);

export const deleteTagBible = (userId: number) =>
  HttpRequest(`bible/tag/${userId}`, 'DELETE');
export const deleteHistoryBible = (userId: number) =>
  HttpRequest(`bible/readHistory/${userId}`, 'DELETE');
