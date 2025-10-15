import * as RNFS from '@dr.pogodin/react-native-fs';
import {store} from '../../store';

const getState = store.getState();
const bible = getState.bibleStore;
const {dowloadedVersion} = bible;

const defaultBible = require('../../../../assets/json/bible-lsg.json');
const fs = RNFS;

export default async function readJSONFile(VERSIONBIBLE: string) {
  if (dowloadedVersion.length > 1 && VERSIONBIBLE !== 'LSG') {
    const bibleVersion = dowloadedVersion.find(
      item => item.id.toString().toLowerCase() === VERSIONBIBLE.toLowerCase(),
    );

    if (bibleVersion) {
      const file = await fs.readFile(bibleVersion.path, 'utf8');
      const data = JSON.parse(file);
      return data;
    }
  } else {
    const utf8fFile = JSON.stringify(defaultBible);
    const data = JSON.parse(utf8fFile);
    return data;
  }
}

export async function getVerse(
  VERSIONBIBLE: string,
  book: string,
  chapter: string,
  verse: string,
) {
  const data = await readJSONFile(VERSIONBIBLE);
  return data[book][chapter][verse];
}

export async function getChapter(
  VERSIONBIBLE: string,
  book: string,
  chapter: string,
) {
  const data = await readJSONFile(VERSIONBIBLE);

  return Object.keys(data[book][chapter]).map((key, id) => {
    return {
      id: id + 1,
      chapter,
      text: data[book][chapter][key],
    };
  });
}

// Fonction pour obtenir une plage de versets
export async function getVersesRange(
  VERSIONBIBLE: string,
  book: string,
  chapter: string,
  startVerse: number,
  endVerse: number,
) {
  const data = await readJSONFile(VERSIONBIBLE);
  const chapterData = data[book];

  if (!chapterData) {
    return [];
  }

  let verses: {
    id: number;
    chapter: string;
    text: string;
  }[] = [];
  for (let verse = startVerse; verse <= endVerse; verse++) {
    const verseText = chapterData[chapter][verse];
    if (verseText) {
      verses.push({
        id: verse,
        chapter,
        text: verseText,
      });
    } else {
      //
    }
  }

  return verses;
}

export async function countBooks(VERSIONBIBLE: string) {
  const data = readJSONFile(VERSIONBIBLE);
  return Object.keys(data).length;
}

export async function countChapters(VERSIONBIBLE: string, book: string) {
  const data = await readJSONFile(VERSIONBIBLE);
  if (data[book]) {
    return Object.keys(data[book]).length;
  } else {
    return 0;
  }
}

export async function countVerses(
  VERSIONBIBLE: string,
  book: string,
  chapter: string,
) {
  const data = await readJSONFile(VERSIONBIBLE);
  if (data[book] && data[book][chapter]) {
    return Object.keys(data[book][chapter]).length;
  } else {
    // (`Le chapitre ${chapter} dans la section ${book} n'existe pas.`);
    return 0;
  }
}
