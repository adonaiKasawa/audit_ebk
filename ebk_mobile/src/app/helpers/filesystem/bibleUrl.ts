import {file_url} from '../../api';

export const CDN_URL = `${file_url}bible_version/res/bible/`;
export const cdnUrl = (path: string) => `${CDN_URL}${path}`;

export const databasesRef = {
  MHY: cdnUrl('databases/commentaires-mhy.sqlite'),
  TRESOR: cdnUrl('databases/commentaires-tresor.sqlite'),
  DICTIONNAIRE: cdnUrl('databases/dictionnaire.sqlite'),
  INTERLINEAIRE: cdnUrl('databases/interlineaire.sqlite'),
  NAVE: cdnUrl('databases/nave-fr.sqlite'),
  STRONG: cdnUrl('databases/strong.sqlite'),
  TIMELINE: cdnUrl('databases/bible-timeline-events.json'),
  SEARCH: cdnUrl('databases/idx-light.json'),
};

export const databasesEnRef = {
  MHY: cdnUrl('databases/en/commentaires-mhy.sqlite'),
  TRESOR: cdnUrl('databases/commentaires-tresor.sqlite'),
  DICTIONNAIRE: cdnUrl('databases/en/dictionnaire.sqlite'),
  INTERLINEAIRE: cdnUrl('databases/en/interlineaire.sqlite'),
  NAVE: cdnUrl('databases/en/nave.sqlite'),
  STRONG: cdnUrl('databases/en/strong.sqlite'),
  TIMELINE: cdnUrl('databases/en/bible-timeline-events.json'),
  SEARCH: cdnUrl('databases/en/idx-light.json'),
};

interface DatabasesRef {
  [DATABASEID: string]: string;
  MHY: string;
  TRESOR: string;
  DICTIONNAIRE: string;
  INTERLINEAIRE: string;
  NAVE: string;
  STRONG: string;
  TIMELINE: string;
  SEARCH: string;
}

export const getDatabasesRef = (): DatabasesRef => {
  // if (getLangIsFr()) {
  return databasesRef;
  // }

  // return databasesEnRef
};

export const biblesRef: {
  [version: string]: string;
} = {
  LSG: cdnUrl('bible-lsg.json'),
  DBY: cdnUrl('bible-dby.json'),
  OST: cdnUrl('bible-ost.json'),
  BDS: cdnUrl('bible-bds.json'),
  CHU: cdnUrl('bible-chu.json'),
  FMAR: cdnUrl('bible-fmar.json'),
  FRC97: cdnUrl('bible-frc97.json'),
  NBS: cdnUrl('bible-nbs.json'),
  NEG79: cdnUrl('bible-neg79.json'),
  NVS78P: cdnUrl('bible-nvs78p.json'),
  S21: cdnUrl('bible-s21.json'),
  KJF: cdnUrl('bible-kjf.json'),
  KJV: cdnUrl('bible-kjv.json'),
  NKJV: cdnUrl('bible-nkjv.json'),
  ESV: cdnUrl('bible-esv.json'),
  NIV: cdnUrl('bible-niv.json'),
  POV: cdnUrl('bible-pov.json'),
  BHS: cdnUrl('bible-hebrew.json'),
  SBLGNT: cdnUrl('bible-greek.json'),
  NFC: cdnUrl('bible-nfc.json'),
  PDV2017: cdnUrl('bible-pdv2017.json'),
  BFC: cdnUrl('bible-bfc.json'),
  BCC1923: cdnUrl('bible-bcc1923.json'),
  // JER: cdnUrl('bible-jer.json'),
  LXX: cdnUrl('bible-lxx.json'),
  TR1624: cdnUrl('bible-TR1624.json'),
  TR1894: cdnUrl('bible-TR1894.json'),
  AMP: cdnUrl('bible-amp.json'),
  DEL: cdnUrl('bible-del.json'),
  NASB2020: cdnUrl('bible-nasb2020.json'),
  EASY: cdnUrl('bible-easy.json'),
  TLV: cdnUrl('bible-tlv.json'),
  NET: cdnUrl('bible-net.json'),
  GW: cdnUrl('bible-gw.json'),
  CSB: cdnUrl('bible-csb.json'),
  NLT: cdnUrl('bible-nlt.json'),
};
