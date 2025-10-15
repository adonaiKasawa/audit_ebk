import React, {useState} from 'react';
import {StyleSheet, Dimensions, View, Text, useColorScheme} from 'react-native';
import Pdf from 'react-native-pdf';
import {file_url} from '../../api';
import colors from '../../../components/style/colors';
import ActionContent from '../../../components/actions_content/actions.content.ui';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import CommentUI from '../../../components/comment/comment.ui';
import {TypeContentEnum} from '../../config/enum';

export default function BooksPlayerScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const book = route.params.book;
  const [numberOfPages, setNumberOfPages] = useState<number>(0);
  const [currentPages, setCurrentPages] = useState<number>(0);
  const isDarkMode = useColorScheme() === 'dark';

  const [commentCount, setCommentCount] = useState<any>(
    book.commentaire?.length || 0,
  );

  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  };
  const snapPoints = React.useMemo(() => ['100%', '100%'], []);
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  // callbacks
  const handlePresentModalPress = React.useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleSheetChanges = React.useCallback((index: number) => {}, []);

  const handleAfterComment = (value: React.SetStateAction<number>) => {
    setCommentCount(value);
  };

  const source = {uri: `${file_url}${book.lien}`, cache: true};
  return (
    <BottomSheetModalProvider>
      <View style={{flex: 1}}>
        <Pdf
          trustAllCerts={false}
          source={source}
          onLoadProgress={percent => {}}
          onLoadComplete={(numberOfPages, filePath) => {
            setNumberOfPages(numberOfPages);
          }}
          onPageChanged={(page, numberOfPages) => {
            setCurrentPages(page);
          }}
          onError={error => {
            console.error('Erreur de chargement du PDF :', error);
          }}
          onPressLink={uri => {}}
          style={styles.pdf}
        />
        <View
          style={{
            backgroundColor: backgroundStyle.backgroundColor,
            padding: 10,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <Text style={{color: isDarkMode ? colors.white : colors.black}}>
              Total page : {numberOfPages}
            </Text>
            <Text style={{color: isDarkMode ? colors.white : colors.black}}>
              Page courante : {currentPages}
            </Text>
          </View>
          <View style={{height: 50}}>
            <ActionContent
              handlePresentModalPress={handlePresentModalPress}
              typeContent={TypeContentEnum.livres}
              navigation={navigation}
              content={book}
              commentCount={commentCount}
            />
          </View>
        </View>
        <BottomSheetModal
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          snapPoints={snapPoints}
          index={0}>
          <BottomSheetView
            style={{
              flex: 1,
              backgroundColor: backgroundStyle.backgroundColor,
            }}>
            <CommentUI
              idFile={book.id}
              typeFile={TypeContentEnum.livres}
              afterComment={handleAfterComment}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
