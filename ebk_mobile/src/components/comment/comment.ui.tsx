import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import colors from '../style/colors';
import Feather from 'react-native-vector-icons/Feather';
import {CommentFileApi, findCommentApi} from '../../app/api/library/library';
import {Commentaires} from '../../app/config/interface';
import {TypeContentEnum} from '../../app/config/enum';
import {useAppDispatch, useAppSelector} from '../../app/store/hooks';
import {selectAuth} from '../../app/store/auth/auth.slice';
import LoadingGif from '../loading/loadingGif';
import moment from 'moment';
import {file_url} from '../../app/api';
import {dispatchCommentByType} from '../../app/helpers/utils';

type commentUIProps = {
  idFile: number;
  typeFile: TypeContentEnum;
  afterComment?: React.Dispatch<React.SetStateAction<number>>;
};

export default function CommentUI({
  idFile,
  typeFile,
  afterComment,
}: commentUIProps) {
  const [Comments, setComments] = useState<Commentaires[]>();
  const [pendindLoadComments, setPendindLoadComments] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [text, onChangeText] = useState<string>('');

  const dispatch = useAppDispatch();

  // const videos = useAppSelector(state => state.homevideos.videos);

  useEffect(() => {
    if (Comments) {
      afterComment?.(Comments.length);
    }
  }, [Comments]);

  const handleCommentFile = async () => {
    if (!text.trim()) {
      Alert.alert(
        'Champ vide',
        "Veuillez écrire un commentaire avant d'envoyer.",
      );
      return;
    }

    setLoading(true);
    try {
      const commentFile = await CommentFileApi(idFile, typeFile, text.trim());

      if (commentFile) {
        const newComment = commentFile.data;
        const updatedComments = Comments
          ? [...Comments, newComment]
          : [newComment];
        setComments(updatedComments);

        // Mettre à jour Redux
        dispatchCommentByType(dispatch, typeFile, idFile, newComment);

        // Mise à jour UI
        onChangeText('');
        afterComment?.(updatedComments.length);
        handleGetCommentFile(); // recharge depuis l'API
      } else {
        Alert.alert(
          'Erreur',
          'Une erreur est survenue lors de l’envoi du commentaire.',
        );
      }
    } catch (error) {
      console.error('Erreur commentaire :', error);
      Alert.alert(
        'Erreur réseau',
        'Impossible d’envoyer le commentaire. Réessayez plus tard.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetCommentFile = useCallback(async () => {
    setPendindLoadComments(true);
    const find = await findCommentApi(idFile, typeFile);
    setPendindLoadComments(false);

    if (find?.status === 200) {
      const fetchedComments = find.data.items;

      setComments(fetchedComments); // Mettre à jour les commentaires locaux
      // Passer la nouvelle longueur à afterComment
      if (afterComment) {
        afterComment(fetchedComments.length); // Met à jour le compteur avec la longueur totale des commentaires
      }
    }
  }, [idFile, typeFile, afterComment]);

  useEffect(() => {
    if (idFile && typeFile) {
      handleGetCommentFile();
    }
  }, [idFile, typeFile]);

  return (
    <View style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={200}>
        <CommentListUI
          comments={Comments ? Comments : []}
          pendindLoadComments={pendindLoadComments}
        />
        <CommentActionUI
          handleCommentFile={handleCommentFile}
          loading={loading}
          text={text}
          onChangeText={onChangeText}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

export function CommentListItemUI({comment}: {comment: any}) {
  const firstname = comment?.users?.user?.prenom;
  const name = comment?.users?.user?.nom;
  const profil = comment?.users?.user?.profil;

  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={{margin: 10}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          {profil ? (
            <Image
              source={{uri: `${file_url}${profil}`}} // Profil AWS
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
              }}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require('../../../assets/img/ecclessia.png')}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
              }}
              resizeMode="cover"
            />
          )}
          <Text
            style={{
              fontWeight: 'bold',
              color: isDarkMode ? colors.light : colors.primary,
            }}>
            {firstname ? firstname : comment?.users?.nom}{' '}
            {name ? name : comment?.users?.prenom}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <Text style={{color: colors.gris, fontSize: 10}}>
            {moment(comment.createdAt).fromNow()}
          </Text>
        </View>
      </View>
      <View
        style={{
          marginLeft: 10,
          paddingLeft: 10,
          paddingBottom: 10,
          borderLeftWidth: 2,
          borderBottomLeftRadius: 10,
          borderLeftColor: colors.gris,
        }}>
        <Text style={{color: isDarkMode ? colors.white : colors.primary}}>
          {comment.commentaire}
        </Text>
      </View>
    </View>
  );
}

export function CommentListUI({
  comments,
  pendindLoadComments,
}: {
  comments: Commentaires[];
  pendindLoadComments: boolean;
}) {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  return (
    <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      {pendindLoadComments ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: isDarkMode ? colors.white : colors.primary}}>
            Chargement...
          </Text>
          <LoadingGif width={50} height={50} />
        </View>
      ) : comments.length > 0 ? (
        <FlatList
          data={comments}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => <CommentListItemUI comment={item} />}
        />
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: colors.gris}}>
            Soyez la première à faire un commentaire !
          </Text>
        </View>
      )}
    </View>
  );
}

export function CommentActionUI({
  handleCommentFile,
  loading,
  text,
  onChangeText,
}: {
  handleCommentFile: () => void;
  loading: boolean;
  text: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
}) {
  const auth = useAppSelector(selectAuth);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: backgroundStyle.backgroundColor,
        paddingHorizontal: 15,
        gap: 10,
        marginTop: 10,
        alignItems: 'center',
        marginBottom: 20,
      }}>
      <Image
        source={require('../../../assets/img/ecclessia.png')}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
        }}
        resizeMode="cover"
      />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isDarkMode ? colors.secondary : colors.light,
          borderRadius: 16,
          paddingHorizontal: 10,
        }}>
        <TextInput
          multiline
          numberOfLines={4}
          style={{
            flex: 1,
            height: 100,
            color: isDarkMode ? colors.white : colors.black,
          }}
          placeholder={'Votre commentaire...'}
          placeholderTextColor={colors.gris}
          onChangeText={onChangeText}
          value={text}
        />
        {auth.isAuthenticated ? (
          loading ? (
            <LoadingGif width={50} height={50} />
          ) : (
            <TouchableOpacity
              onPress={handleCommentFile}
              style={{
                padding: 10,
                backgroundColor: colors.primary,
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Feather name="send" size={25} color={colors.white} />
            </TouchableOpacity>
          )
        ) : (
          <TouchableOpacity>
            <Feather name="lock" size={25} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
