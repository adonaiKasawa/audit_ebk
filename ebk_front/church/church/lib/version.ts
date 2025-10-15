export interface Version {
  id: string;
  name: string;
  name_en?: string;
  c?: string;
  type?: "en" | "fr" | "other";
}

export const versions = [
  {
    id: "LSG",
    name: "Bible Segond 1910",
    c: "1910 - Libre de droit",
    type: "fr",
  },
  // LSGS: {
  //   id: "LSGS",
  //   name: "Bible Segond 1910 + Strongs",
  //   c: "1910 - Libre de droit",
  //   type: "fr",
  // },
  {
    id: "NBS",
    name: "Nouvelle Bible Segond",
    c: "© 2002 Société Biblique Française",
    type: "fr",
  },
  // NEG79: {
  //   id: "NEG79",
  //   name: "Nouvelle Edition de Genève 1979",
  //   c: "© 1979 Société Biblique de Genève",
  //   type: "fr",
  // },
  // NVS78P: {
  //   id: "NVS78P",
  //   name: "Nouvelle Segond révisée",
  //   c: "© Alliance Biblique Française",
  //   type: "fr",
  // },
  {
    id: "S21",
    name: "Bible Segond 21",
    c: "© 2007 Société Biblique de Genève",
    type: "fr",
  },
  // INT: {
  //   id: "INT",
  //   name: "Bible Interlinéaire",
  //   name_en: "Interlinear Bible",
  //   c: "©",
  //   type: null,
  // },
  {
    id: "KJF",
    name: "King James Française",
    c: "© 1611 Traduction française, Bible des réformateurs 2006",
    type: "fr",
  },
  {
    id: "DBY",
    name: "Bible Darby",
    c: "1890 Libre de droit",
    type: "fr",
  },
  {
    id: "OST",
    name: "Ostervald",
    c: "1881 Libre de droit",
    type: "fr",
  },
  // JER: {
  //   id: 'JER',
  //   name: 'Bible Jérusalem',
  //   c: '© 1966',
  // },
  {
    id: "CHU",
    name: "Bible Chouraqui 1985",
    c: "© 1977 Editions Desclée de Brouwer",
    type: "fr",
  },
  {
    id: "BDS",
    name: "Bible du Semeur",
    c: "© 2000 Société Biblique Internationale",
    type: "fr",
  },
  {
    id: "FMAR",
    name: "Martin 1744",
    c: "1744 Libre de droit",
    type: "fr",
  },
  {
    id: "BFC",
    name: "Bible en Français courant",
    c: "© Alliance Biblique Française",
    type: "fr",
  },
  {
    id: "FRC97",
    name: "Français courant",
    c: "© Alliance Biblique Française",
    type: "fr",
  },
  {
    id: "NFC",
    name: "Nouvelle Français courant",
    c: "Alliance biblique française Bibli'0, ©2019",
    type: "fr",
  },
  {
    id: "KJV",
    name: "King James Version",
    c: "1611 Libre de droit",
    type: "en",
  },
  // KJVS: {
  //   id: "KJVS",
  //   name: "King James Version Strong",
  //   c: "1611 Libre de droit",
  //   type: "en",
  // },
  // NKJV: {
  //   id: "NKJV",
  //   name: "New King James Version",
  //   c: "© 1982 Thomas Nelson, Inc",
  //   type: "en",
  // },
  {
    id: "ESV",
    name: "English Standard Version",
    c: "© 2001 Crossway Bibles",
    type: "en",
  },
  {
    id: "NIV",
    name: "New International Version",
    c: "© NIV® 1973, 1978, 1984, 2011 Biblica",
    type: "en",
  },
  {
    id: "BCC1923",
    name: "Bible catholique Crampon 1923",
    c: "© mission-web.com",
    type: "fr",
  },
  {
    id: "PDV2017",
    name: "Parole de Vie 2017",
    c: "© 2000 Société biblique française - Bibli'O",
    type: "fr",
  },
  {
    id: "POV",
    name: "Parole vivante (NT)",
    c: "© 2013",
    type: "fr",
  },
  // EASY: {
  //   id: "EASY",
  //   name: "EasyEnglish Bible 2018",
  //   c: "Copyright © MissionAssist 2018",
  //   type: "en",
  // },
  // TLV: {
  //   id: "TLV",
  //   name: "Tree of Life Version",
  //   c: "© 2015 The Messianic Jewish Family Bible Society",
  //   type: "en",
  // },
  // NASB2020: {
  //   id: "NASB2020",
  //   name: "New American Standard Bible 2020",
  //   c: "© 2020 The Lockman Foundation",
  //   type: "en",
  // },
  // NET: {
  //   id: "NET",
  //   name: "New English Translation",
  //   c: "© 1996-2016 Biblical Studies Press, L.L.C.",
  //   type: "en",
  // },
  // GW: {
  //   id: "GW",
  //   name: "God’s Word Translation",
  //   c: "© 1995 God’s Word to the Nations Bible Society",
  //   type: "en",
  // },
  // CSB: {
  //   id: "CSB",
  //   name: "Christian Standard Bible",
  //   c: "© 2017 Holman Bible Publishers",
  //   type: "en",
  // },
  // NLT: {
  //   id: "NLT",
  //   name: "New Living Translation",
  //   c: "© 1996, 2004, 2015 Tyndale House Foundation",
  //   type: "en",
  // },
  {
    id: "AMP",
    name: "Amplified Bible",
    c: "© 2015 by The Lockman Foundation, La Habra, CA 90631",
    type: "en",
  },
  // BHS: {
  //   id: "BHS",
  //   name: "Biblia Hebraica Stuttgartensia (AT)",
  //   name_en: "Biblia Hebraica Stuttgartensia (OT)",
  //   c: "© Deutsche Bibelgesellschaft, Stuttgart 1967/77",
  //   type: "other",
  // },
  // LXX: {
  //   id: "LXX",
  //   name: "Septante (AT)",
  //   name_en: "Septuagint (OT)",
  //   type: "other",
  // },
  // SBLGNT: {
  //   id: "SBLGNT",
  //   name: "SBL NT. Grec (NT)",
  //   name_en: "SBL NT. Greek (NT)",
  //   c: "© 2010 Society of Bible Litterature",
  //   type: "other",
  // },
  {
    id: "TR1624",
    name: "Elzevir Textus Receptus 1624 (NT)",
    type: "other",
  },
  {
    id: "TR1894",
    name: "Scrivener’s Textus Receptus 1894 (NT)",
    type: "other",
  },
  // DEL: {
  //   id: "DEL",
  //   name: "Tanach and Delitzsch's Hebrew New Testament",
  //   c: "© Bible Society in Israel, 2018.",
  //   type: "other",
  // },
];

export const getVersions = () => {
  return versions;
};
