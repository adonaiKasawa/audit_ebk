import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState} from '..';
import {versions} from '../../helpers/filesystem/bibleVersions';
import books, {
  Book,
  sections,
} from '../../helpers/assets/bible_versions/books-desc';
import colors from '../../../components/style/colors';

export const Theme = [
  {
    background: colors.lighter,
    color: colors.black,
  },
  {
    background: '#f7efed',
    color: colors.black,
  },
  {
    background: '#edefee',
    color: colors.black,
  },
  {
    background: '#fef6ea',
    color: colors.black,
  },
  {
    background: '#2b3131',
    color: colors.white,
  },
  {
    background: '#121212',
    color: colors.white,
  },
  {
    background: colors.primary,
    color: colors.white,
  },
];

export type VersionCode = keyof typeof versions;
export type DowloadedVersionType = {
  path: string;
  id: VersionCode;
};
export interface Verse {
  Livre: string | number;
  Chapitre: string | number;
  Verset: string | number;
  Texte: string;
}

export type VerseIds = {
  [verse: string]: true;
};
export type BibleResource =
  | 'strong'
  | 'commentary'
  | 'dictionary'
  | 'nave'
  | 'reference';

export interface StateBible {
  firstOpen: boolean;
  version: VersionCode;
  dowloadedVersion: DowloadedVersionType[];
  bookSelected: Book;
  chapterSelected: number;
  verseSelected: number;
  focusVerses?: string[];
  font: {
    theme: {background: string; color: string};
    size: number;
    textAlign: 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined;
    content: 'ligne' | 'continu';
  };
  noteCreated: {
    uuid: string;
    verse: {id: number; text: string}[];
    chapter: number;
    book: Book;
    version: VersionCode;
    title: string;
    description: string;
  }[];
  imageCreated: {
    verse: {id: number; text: string}[];
    chapter: number;
    book: Book;
    version: VersionCode;
    imageLink: string;
  }[];
  verseUnderline: {
    verse: {id: number; text: string}[];
    chapter: number;
    book: Book;
    version: VersionCode;
    backgroundColor: string;
    textColor: string;
  }[];
}

const initialState: StateBible = {
  firstOpen: true,
  version: 'LSG',
  dowloadedVersion: [
    {id: 'LSG', path: '../../../../assets/json/bible-lsg.json'},
  ],
  bookSelected: books[0],
  chapterSelected: 1,
  verseSelected: 1,
  font: {
    theme: {background: '', color: ''},
    size: 25,
    textAlign: 'justify',
    content: 'ligne',
  },
  noteCreated: [],
  imageCreated: [],
  verseUnderline: [],
};

export const bibleStoreSlice = createSlice({
  name: 'bibleStore',
  initialState,
  reducers: {
    setBibleFirstOpen: state => {
      state.firstOpen = false;
    },
    setSelectedVersion: (
      state,
      action: PayloadAction<{version: VersionCode}>,
    ) => {
      state.version = action.payload.version;
    },
    setDowloadVersion: (state, action: PayloadAction<DowloadedVersionType>) => {
      const find = state.dowloadedVersion.find(
        item => item.id === action.payload.id,
      );
      if (find) {
        const filter = state.dowloadedVersion.filter(
          item => item.id !== action.payload.id,
        );
        state.dowloadedVersion = [...filter, action.payload];
      } else {
        state.dowloadedVersion = [...state.dowloadedVersion, action.payload];
      }
    },
    setRomoveVersionDownloaded: (
      state,
      action: PayloadAction<DowloadedVersionType>,
    ) => {
      const find = state.dowloadedVersion.find(
        item => item.id === action.payload.id,
      );
      if (find) {
        const filter = state.dowloadedVersion.filter(
          item => item.id !== action.payload.id,
        );
        state.dowloadedVersion = filter;
      }
    },
    setSelectedBook: (state, action: PayloadAction<Book>) => {
      state.bookSelected = action.payload;
    },
    setSelectedChapter: (state, action: PayloadAction<number>) => {
      state.chapterSelected = action.payload;
    },
    setSelectedVerse: (state, action: PayloadAction<number>) => {
      state.verseSelected = action.payload;
    },
    setBibleTheme: (
      state,
      action: PayloadAction<{background: string; color: string}>,
    ) => {
      state.font.theme = action.payload;
    },
    setBibleFontSize: (state, action: PayloadAction<number>) => {
      state.font.size = action.payload;
    },
    setBibleModeContent: (
      state,
      action: PayloadAction<'ligne' | 'continu'>,
    ) => {
      state.font.content = action.payload;
    },
    setBibleAlignText: (
      state,
      action: PayloadAction<
        'auto' | 'left' | 'right' | 'center' | 'justify' | undefined
      >,
    ) => {
      state.font.textAlign = action.payload;
    },
    setImageCreated: (
      state,
      action: PayloadAction<StateBible['imageCreated']>,
    ) => {
      state.imageCreated;
    },
    setNoteCreated: (
      state,
      action: PayloadAction<StateBible['noteCreated'][0]>,
    ) => {
      const find = state.noteCreated.find(
        item => item.uuid === action.payload.uuid,
      );
      console.log('find note ', find);

      if (!find) {
        console.log('note saved', action.payload.uuid);

        state.noteCreated = [...state.noteCreated, action.payload];
      } else {
        console.log('note: action.payload.uuid', action.payload.uuid);
      }
    },
    setDeleteNote: (state, action: PayloadAction<{uuid: string}>) => {
      state.noteCreated = [
        ...state.noteCreated.filter(item => item.uuid !== action.payload.uuid),
      ];
      console.log('state.noteCreated', state.noteCreated.length);
    },
    setUpdateNote: (
      state,
      action: PayloadAction<StateBible['noteCreated'][0]>,
    ) => {
      const noteToUpdateIndex = state.noteCreated.findIndex(
        item => item.uuid === action.payload.uuid,
      );
      if (noteToUpdateIndex) {
        state.noteCreated[noteToUpdateIndex] = action.payload;
      }
    },
  },
});

export const {
  setBibleFirstOpen,
  setSelectedVersion,
  setDowloadVersion,
  setRomoveVersionDownloaded,
  setSelectedBook,
  setSelectedChapter,
  setSelectedVerse,
  setBibleTheme,
  setBibleFontSize,
  setBibleModeContent,
  setBibleAlignText,
  setImageCreated,
  setNoteCreated,
  setDeleteNote,
  setUpdateNote,
} = bibleStoreSlice.actions;

export const selectBibleStore = (state: AppState) => state.bibleStore;

export default bibleStoreSlice.reducer;

export const persistConfigBibleStore = {
  key: 'bible_store_ecclesia_book_mobile',
  version: 1,
  storage: AsyncStorage,
};
