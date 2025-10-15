import {VersionCode} from '../../store/bible/bible.slice';

export const getIfVersionNeedsUpdate = async (versionId: string) => {
  return false;
};

// export const getIfVersionNeedsDownload = async (versionId: string) => {
//   if (versionId === 'INT') {
//     const sqliteDirPath = `${RNFS.DocumentDirectoryPath}SQLite`

//     await initSQLiteDir()

//     const dbPath = `${sqliteDirPath}/${databaseInterlineaireName}`
//     const file = await RNFS.getFSInfo()

//     if (!file.exists) {
//       return true
//     }

//     return false
//   }

// if (versionId === 'LSGS' || versionId === 'KJVS') {
//   const sqliteDirPath = `${RNFS.documentDirectory}SQLite`

//   await initSQLiteDir()

//   const dbPath = getDatabases().STRONG.path
//   const file = await RNFS.getInfoAsync(dbPath)

//   if (!file.exists) {
//     return true
//   }

//   return false
// }

// const path = `${RNFS.documentDirectory}bible-${versionId}.json`
// const file = await RNFS.getInfoAsync(path)

// if (__DEV__) {
//   if (file.exists) {
//     RNFS.deleteAsync(file.uri)
//     file = await RNFS.getInfoAsync(path)
//   }
// }

//   if (!file.exists) {
//     return true
//   }

//   return false
// }

const bibleStudyToolsBookMapping = [
  'ge',
  'ex',
  'le',
  'nu',
  'de',
  'jos',
  'jud',
  'ru',
  '1sa',
  '2sa',
  '1ki',
  '2ki',
  '1ch',
  '2ch',
  'ezr',
  'ne',
  'es',
  'job',
  'ps',
  'pr',
  'ec',
  'so',
  'isa',
  'jer',
  'la',
  'eze',
  'da',
  'ho',
  'joe',
  'am',
  'ob',
  'jon',
  'mic',
  'na',
  'hab',
  'zen',
  'hag',
  'zec',
  'mal',
  'mt',
  'mr',
  'lu',
  'joh',
  'ac',
  'ro',
  '1co',
  '2co',
  'ga',
  'eph',
  'php',
  'col',
  '1th',
  '2th',
  '1ti',
  '2ti',
  'tit',
  'phm',
  'heb',
  'jas',
  '1pe',
  '2pe',
  '1jo',
  '2jo',
  '3jo',
  'jude',
  're',
];

export interface Version {
  id: VersionCode;
  name: string;
  name_en?: string;
  c?: string;
  type: string | null; // 'en' | 'fr' | 'other'
  hasAudio?: boolean;
  // getAudioUrl?: (bookNum: number, chapterNum: number) => string
}

export const versions: {[key: string]: Version} = {
  LSG: {
    id: 'LSG',
    name: 'Bible Segond 1910',
    c: '1910 - Libre de droit',
    type: 'fr',
    hasAudio: true,
    // getAudioUrl: getLsgAudioUrl,
  },
  LSGS: {
    id: 'LSGS',
    name: 'Bible Segond 1910 + Strongs',
    c: '1910 - Libre de droit',
    type: 'fr',
    hasAudio: true,
    // getAudioUrl: getLsgAudioUrl,
  },
  NBS: {
    id: 'NBS',
    name: 'Nouvelle Bible Segond',
    c: '© 2002 Société Biblique Française',
    type: 'fr',
  },
  NEG79: {
    id: 'NEG79',
    name: 'Nouvelle Edition de Genève 1979',
    c: '© 1979 Société Biblique de Genève',
    type: 'fr',
  },
  NVS78P: {
    id: 'NVS78P',
    name: 'Nouvelle Segond révisée',
    c: '© Alliance Biblique Française',
    type: 'fr',
  },
  S21: {
    id: 'S21',
    name: 'Bible Segond 21',
    c: '© 2007 Société Biblique de Genève',
    type: 'fr',
  },
  INT: {
    id: 'INT',
    name: 'Bible Interlinéaire',
    name_en: 'Interlinear Bible',
    c: '©',
    type: null,
  },
  KJF: {
    id: 'KJF',
    name: 'King James Française',
    c: '© 1611 Traduction française, Bible des réformateurs 2006',
    type: 'fr',
  },
  DBY: {
    id: 'DBY',
    name: 'Bible Darby',
    c: '1890 Libre de droit',
    type: 'fr',
  },
  OST: {
    id: 'OST',
    name: 'Ostervald',
    c: '1881 Libre de droit',
    type: 'fr',
  },
  // JER: {
  //   id: 'JER',
  //   name: 'Bible Jérusalem',
  //   c: '© 1966',
  // },
  CHU: {
    id: 'CHU',
    name: 'Bible Chouraqui 1985',
    c: '© 1977 Editions Desclée de Brouwer',
    type: 'fr',
  },
  BDS: {
    id: 'BDS',
    name: 'Bible du Semeur',
    c: '© 2000 Société Biblique Internationale',
    type: 'fr',
    hasAudio: true,
    // getAudioUrl: (bookNum: number, chapterNum: number) => {
    //   return `https://www.bible.audio/media/sem/${
    //     bookNum > 39 ? 'nt' : 'at'
    //   }/${bookNum.toString().padStart(2, '0')}_${chapterNum
    //     .toString()
    //     .padStart(3, '0')}.mp3`
    // },
  },
  FMAR: {
    id: 'FMAR',
    name: 'Martin 1744',
    c: '1744 Libre de droit',
    type: 'fr',
  },
  BFC: {
    id: 'BFC',
    name: 'Bible en Français courant',
    c: '© Alliance Biblique Française',
    type: 'fr',
  },
  FRC97: {
    id: 'FRC97',
    name: 'Français courant',
    c: '© Alliance Biblique Française',
    type: 'fr',
  },
  NFC: {
    id: 'NFC',
    name: 'Nouvelle Français courant',
    c: "Alliance biblique française Bibli'0, ©2019",
    type: 'fr',
  },
  KJV: {
    id: 'KJV',
    name: 'King James Version',
    c: '1611 Libre de droit',
    type: 'en',
    hasAudio: true,
    // getAudioUrl: (bookNum: number, chapterNum: number) => {
    //   return `https://www.wordpocket.org/bibles/app/audio/1/${bookNum}/${chapterNum}.mp3`
    // },
  },
  KJVS: {
    id: 'KJVS',
    name: 'King James Version Strong',
    c: '1611 Libre de droit',
    type: 'en',
    hasAudio: true,
    // // getAudioUrl: (bookNum: number, chapterNum: number) => {
    //   return `https://www.wordpocket.org/bibles/app/audio/1/${bookNum}/${chapterNum}.mp3`
    // },
  },
  NKJV: {
    id: 'NKJV',
    name: 'New King James Version',
    c: '© 1982 Thomas Nelson, Inc',
    type: 'en',
  },
  ESV: {
    id: 'ESV',
    name: 'English Standard Version',
    c: '© 2001 Crossway Bibles',
    type: 'en',
    hasAudio: true,
    // getAudioUrl: (bookNum: number, chapterNum: number) => {
    //   return `https://content.swncdn.com/biblestudytools/audio/esv-mp3/${bookNum
    //     .toString()
    //     .padStart(2, '0')}_${
    //     bibleStudyToolsBookMapping[bookNum - 1]
    //   }_${chapterNum.toString().padStart(3, '0')}.mp3`
    // },
  },
  NIV: {
    id: 'NIV',
    name: 'New International Version',
    c: '© NIV® 1973, 1978, 1984, 2011 Biblica',
    type: 'en',
    hasAudio: true,
    // getAudioUrl: (bookNum: number, chapterNum: number) => {
    //   return `https://www.bible.audio/media/niv/${
    //     bookNum > 39 ? 'nt' : 'at'
    //   }/${(bookNum > 39 ? bookNum - 39 : bookNum)
    //     .toString()
    //     .padStart(2, '0')}_${chapterNum.toString().padStart(3, '0')}.mp3`
    // },
  },
  BCC1923: {
    id: 'BCC1923',
    name: 'Bible catholique Crampon 1923',
    c: '© mission-web.com',
    type: 'fr',
  },
  PDV2017: {
    id: 'PDV2017',
    name: 'Parole de Vie 2017',
    c: "© 2000 Société biblique française - Bibli'O",
    type: 'fr',
  },
  POV: {
    id: 'POV',
    name: 'Parole vivante (NT)',
    c: '© 2013',
    type: 'fr',
  },
  EASY: {
    id: 'EASY',
    name: 'EasyEnglish Bible 2018',
    c: 'Copyright © MissionAssist 2018',
    type: 'en',
  },
  TLV: {
    id: 'TLV',
    name: 'Tree of Life Version',
    c: '© 2015 The Messianic Jewish Family Bible Society',
    type: 'en',
  },
  NASB2020: {
    id: 'NASB2020',
    name: 'New American Standard Bible 2020',
    c: '© 2020 The Lockman Foundation',
    type: 'en',
  },
  NET: {
    id: 'NET',
    name: 'New English Translation',
    c: '© 1996-2016 Biblical Studies Press, L.L.C.',
    type: 'en',
  },
  GW: {
    id: 'GW',
    name: 'God’s Word Translation',
    c: '© 1995 God’s Word to the Nations Bible Society',
    type: 'en',
  },
  CSB: {
    id: 'CSB',
    name: 'Christian Standard Bible',
    c: '© 2017 Holman Bible Publishers',
    type: 'en',
  },
  NLT: {
    id: 'NLT',
    name: 'New Living Translation',
    c: '© 1996, 2004, 2015 Tyndale House Foundation',
    type: 'en',
    hasAudio: true,
    // getAudioUrl: (bookNum: number, chapterNum: number) => {
    //   return `https://content.swncdn.com/biblestudytools/audio/nlt-mp3/${bookNum
    //     .toString()
    //     .padStart(2, '0')}_${
    //     bibleStudyToolsBookMapping[bookNum - 1]
    //   }_${chapterNum.toString().padStart(3, '0')}.mp3`
    // },
  },
  AMP: {
    id: 'AMP',
    name: 'Amplified Bible',
    c: '© 2015 by The Lockman Foundation, La Habra, CA 90631',
    type: 'en',
  },
  BHS: {
    id: 'BHS',
    name: 'Biblia Hebraica Stuttgartensia (AT)',
    name_en: 'Biblia Hebraica Stuttgartensia (OT)',
    c: '© Deutsche Bibelgesellschaft, Stuttgart 1967/77',
    type: 'other',
  },
  LXX: {
    id: 'LXX',
    name: 'Septante (AT)',
    name_en: 'Septuagint (OT)',
    type: 'other',
  },
  SBLGNT: {
    id: 'SBLGNT',
    name: 'SBL NT. Grec (NT)',
    name_en: 'SBL NT. Greek (NT)',
    c: '© 2010 Society of Bible Litterature',
    type: 'other',
  },
  TR1624: {
    id: 'TR1624',
    name: 'Elzevir Textus Receptus 1624 (NT)',
    type: 'other',
  },
  TR1894: {
    id: 'TR1894',
    name: 'Scrivener’s Textus Receptus 1894 (NT)',
    type: 'other',
  },
  DEL: {
    id: 'DEL',
    name: "Tanach and Delitzsch's Hebrew New Testament",
    c: '© Bible Society in Israel, 2018.',
    type: 'other',
  },
};

export const getVersions = () => {
  return versions;
};

interface VersionsBySection {
  title: string;
  data: Version[];
}

export const versionsBySections: VersionsBySection[] = Object.values(
  versions,
).reduce(
  (sectionArray, version) => {
    switch (version.id) {
      case 'LSG':
      case 'LSGS':
      case 'NBS':
      case 'NEG79':
      case 'NVS78P':
      case 'S21': {
        sectionArray[0].data.push(version);

        return sectionArray;
      }
      case 'KJV':
      case 'NKJV':
      case 'NIV':
      case 'ESV':
      case 'BHS':
      case 'SBLGNT':
      case 'TR1624':
      case 'TR1894':
      case 'AMP':
      case 'NASB2020':
      case 'EASY':
      case 'TLV':
      case 'NET':
      case 'GW':
      case 'CSB':
      case 'NLT':
      case 'DEL':
      case 'LXX': {
        sectionArray[2].data.push(version);
        return sectionArray;
      }
      case 'KJVS': {
        return sectionArray;
      }
      default: {
        sectionArray[1].data.push(version);
        return sectionArray;
      }
    }
  },
  <VersionsBySection[]>[
    {title: 'Versions Louis Segond', data: []},
    {title: 'Autres versions', data: []},
    {title: 'Versions étrangères', data: []},
  ],
);

export const getVersionsBySections = () => {
  return versionsBySections;
};

export const isStrongVersion = (version: string) =>
  version === 'INT' || version === 'LSGS' || version === 'KJVS';
