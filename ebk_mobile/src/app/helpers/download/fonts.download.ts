import * as RNFS from '@dr.pogodin/react-native-fs';
import {addFont} from '../../store/fonts/fonts.slice';
import {loadFontFromFile} from '@vitrion/react-native-load-fonts';

export const downloadFont = async (
  fontName: string,
  fontUrl: string,
  fontSize: number,
  dispatch: any,
  calculateProgress: (
    res: RNFS.DownloadProgressCallbackResultT,
    fontFileSize: number,
  ) => void,
) => {
  try {
    console.log(fontUrl);

    const destinationPath = `${RNFS.DocumentDirectoryPath}/${fontName}`;

    // Téléchargement
    const result = await RNFS.downloadFile({
      fromUrl: fontUrl,
      toFile: destinationPath,
      progress: (res: RNFS.DownloadProgressCallbackResultT) => {
        calculateProgress(res, fontSize);
      },
    }).promise;

    if (result.statusCode === 200) {
      dispatch(addFont(fontName)); // Ajout au store Redux
      loadFontFromFile(fontName.replace('.ttf', ''), destinationPath).then(
        function (name) {
          console.log(destinationPath);

          console.log('Loaded font successfully. Font name is: ', name);
        },
      );
      return destinationPath;
    } else {
      console.error('Erreur lors du téléchargement');
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement', error);
  }
};
