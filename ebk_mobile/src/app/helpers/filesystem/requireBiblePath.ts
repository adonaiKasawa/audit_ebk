import * as RNFS from '@dr.pogodin/react-native-fs';

export const requireBiblePath = (id: string) => {
  // if (id === 'INT') {
  const sqliteDirPath = `${RNFS.DocumentDirectoryPath}/`;
  // return `${sqliteDirPath}`
  return `${sqliteDirPath}bible-${id}.json`;
  // }

  // return `${FileSystem.documentDirectory}bible-${id}.json`
};
