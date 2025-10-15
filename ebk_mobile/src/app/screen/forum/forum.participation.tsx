import * as React from 'react';
import {
  View,
  useColorScheme,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import colors from '../../../components/style/colors';
import {CardForumSubjectUI} from '../../../components/card/forum/card.forum';
import CommentUI from '../../../components/comment/comment.ui';
import {Commentaires, subjectForum} from '../../config/interface';
import {TypeContentEnum} from '../../config/enum';
import {findCommentApi} from '../../api/library/library';

const width = Dimensions.get('screen').width;

function ForumParticipationScreen({navigation, route}: any) {
  const sujets: subjectForum = route.params.sujets;
  const forum = route.params.forum;
  const isDarkMode = useColorScheme() === 'dark';

  const [Comments, setComments] = React.useState<Commentaires[]>();

  React.useEffect(() => {
    const getComment = async () => {
      let find = await findCommentApi(forum?.id, TypeContentEnum.forum);
      if (find?.status === 200) {
        const fetchedComments = find.data.items;
        setComments(fetchedComments);
      }
    };
    getComment();
  }, [forum?.id, TypeContentEnum.forum]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'height' : 'height'}
      style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
        <View style={{paddingHorizontal: 10}}>
          <CardForumSubjectUI
            sujets={sujets}
            index={route?.params?.index}
            navigation={navigation}
            forum={forum}
            Comments={Comments}
          />
        </View>
        <View style={{flex: 1}}>
          <CommentUI idFile={forum.id} typeFile={TypeContentEnum.forum} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
export default ForumParticipationScreen;
