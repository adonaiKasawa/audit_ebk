// import React from 'react';
// import {View, TouchableOpacity, Text} from 'react-native';
// import Feather from 'react-native-vector-icons/Feather';
// import colors from '../style/colors';
// import {blockContentApi} from '../../app/api/blocks/bloack.content.api';
// import {signaleContentApi} from '../../app/api/signale/signale.req';
// import {useSelector, useDispatch} from 'react-redux';
// import {TypeContentEnum} from '../../app/config/enum';
// import {updateSignaledContent} from '../../app/store/datahome/home.signaled.slice';
// import {useAppSelector} from '../../app/store/hooks';
// import {PayloadUserInterface} from '../../app/config/interface';
// import {selectAuth} from '../../app/store/auth/auth.slice';
// import {jwtDecode} from 'jwt-decode';

// export default function MenuOptionsUI({
//   idFile,
//   typeFile,
//   onClose,
// }: {
//   idFile: number;
//   typeFile: string;
//   onClose: () => void;
// }) {
//   const dispatch = useDispatch();
//   // const user = useSelector((state: any) => state.auth.user); // utilisateur connecté

//   const auth = useAppSelector(selectAuth);

//   const user = auth.access_token
//     ? jwtDecode<PayloadUserInterface>(auth.access_token)
//     : undefined;

//   console.log('user : ', user);

//   // 🔹 Sélection du contenu selon le type
//   const content = useSelector((state: any) => {
//     switch (typeFile) {
//       case TypeContentEnum.images:
//         return state.homeimages.images.find((img: any) => img.id === idFile);
//       case TypeContentEnum.videos:
//         return state.homevideos.videos.find((v: any) => v.id === idFile);
//       case TypeContentEnum.audios:
//         return state.homeaudios.audios.find((a: any) => a.id === idFile);
//       default:
//         return null;
//     }
//   });

//   console.log('content : ', content?.signale);

//   const isAlreadySignaled = content?.signale?.some(
//     (signal: any) => signal?.users?.id === user?.sub,
//   );

//   const handleBlockContent = async () => {
//     const id = idFile;
//     const contentType = typeFile;
//     await onClose();
//     const response = await blockContentApi(contentType, id);
//     console.log('response blocked content : ', response?.data);
//   };

//   const handleSignaleContent = async () => {
//     if (isAlreadySignaled) {
//       console.log('Ce contenu est déjà signalé par cet utilisateur.');
//       return;
//     }

//     const id = idFile;
//     const contentType = typeFile;
//     await onClose();
//     const response = await signaleContentApi(contentType, id);
//     console.log('response signale content : ', response?.data);

//     // 🔹 Mettre à jour le state global avec le nouveau signalement
//     dispatch(
//       updateSignaledContent({contentType, contentId: id, data: response?.data}),
//     );
//     console.log('content : ', content);
//   };

//   return (
//     <View style={{padding: 20}}>
//       <TouchableOpacity
//         onPress={handleSignaleContent}
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           paddingVertical: 10,
//         }}>
//         <Feather name="flag" size={20} color={colors.primary} />
//         <Text
//           style={{
//             marginLeft: 10,
//             fontSize: 16,
//             fontWeight: '500',
//             color: colors.primary,
//           }}>
//           {isAlreadySignaled
//             ? 'Ce contenu est déjà signalé'
//             : 'Signaler ce contenu'}
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         onPress={handleBlockContent}
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           paddingVertical: 10,
//         }}>
//         <Feather name="x-circle" size={20} color={colors.gris} />
//         <Text
//           style={{
//             marginLeft: 10,
//             fontSize: 16,
//             fontWeight: '500',
//             color: colors.primary,
//           }}>
//           Je ne veux plus voir ce contenu
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../style/colors';
import {blockContentApi} from '../../app/api/blocks/bloack.content.api';
import {signaleContentApi} from '../../app/api/signale/signale.req';
import {useSelector, useDispatch} from 'react-redux';
import {TypeContentEnum} from '../../app/config/enum';
import {updateSignaledContent} from '../../app/store/datahome/home.signaled.slice';
import {useAppSelector} from '../../app/store/hooks';
import {PayloadUserInterface} from '../../app/config/interface';
import {selectAuth} from '../../app/store/auth/auth.slice';
import {jwtDecode} from 'jwt-decode';
import {addSignalToImage} from '../../app/store/datahome/home.image.slice';

// ✅ importer ton reducer spécifique images

export default function MenuOptionsUI({
  idFile,
  typeFile,
  onClose,
}: {
  idFile: number;
  typeFile: string;
  onClose: () => void;
}) {
  const dispatch = useDispatch();

  const auth = useAppSelector(selectAuth);

  const user = auth.access_token
    ? jwtDecode<PayloadUserInterface>(auth.access_token)
    : undefined;

  // 🔹 Sélection du contenu selon le type
  const content = useSelector((state: any) => {
    switch (typeFile) {
      case TypeContentEnum.images:
        return state.homeimages.images.find((img: any) => img.id === idFile);
      case TypeContentEnum.videos:
        return state.homevideos.videos.find((v: any) => v.id === idFile);
      case TypeContentEnum.audios:
        return state.homeaudios.audios.find((a: any) => a.id === idFile);
      default:
        return null;
    }
  });

  const isAlreadySignaled = content?.signale?.some(
    (signal: any) => signal?.users?.id === user?.sub,
  );

  const handleBlockContent = async () => {
    const id = idFile;
    const contentType = typeFile;
    await onClose();
    const response = await blockContentApi(contentType, id);
    console.log('response blocked content : ', response?.data);
  };

  const handleSignaleContent = async () => {
    if (isAlreadySignaled) {
      console.log('Ce contenu est déjà signalé par cet utilisateur.');
      return;
    }

    const id = idFile;
    const contentType = typeFile;
    await onClose();
    const response = await signaleContentApi(contentType, id);

    // 🔹 Mettre à jour le state global
    dispatch(
      updateSignaledContent({contentType, contentId: id, data: response?.data}),
    );

    // 🔹 Mise à jour directe du slice images si c'est une image
    if (contentType === TypeContentEnum.images) {
      dispatch(addSignalToImage({imageId: id, signal: response?.data}));
    }

    console.log('content : ', content);
  };

  return (
    <View style={{padding: 20}}>
      <TouchableOpacity
        onPress={handleSignaleContent}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
        }}>
        <Feather name="flag" size={20} color={colors.primary} />
        <Text
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '500',
            color: colors.primary,
          }}>
          {isAlreadySignaled
            ? 'Ce contenu est déjà signalé'
            : 'Signaler ce contenu'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleBlockContent}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
        }}>
        <Feather name="x-circle" size={20} color={colors.gris} />
        <Text
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '500',
            color: colors.primary,
          }}>
          Je ne veux plus voir ce contenu
        </Text>
      </TouchableOpacity>
    </View>
  );
}
