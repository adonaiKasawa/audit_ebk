import React from 'react';
import {ScrollView} from 'react-native';

import SelectorItem from './selector.item';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  selectBibleStore,
  setSelectedChapter,
} from '../../store/bible/bible.slice';

interface ChapterSelectorScreenProps {
  onNavigate: (index: number) => void;
}

const ChapterSelector = ({onNavigate}: ChapterSelectorScreenProps) => {
  const bible = useAppSelector(selectBibleStore);
  const {bookSelected, chapterSelected} = bible;
  const dispatch = useAppDispatch();

  const onChapterChange = (chapter: number) => {
    onNavigate(2);
    dispatch(setSelectedChapter(chapter));
  };

  const array = Array(...Array(bookSelected.Chapitres)).map((_, i) => i);

  return (
    <ScrollView
      contentContainerStyle={{
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingTop: 10,
      }}>
      {array.map(c => (
        <SelectorItem
          key={c}
          item={c + 1}
          isSelected={chapterSelected === c + 1}
          onChange={onChapterChange}
        />
      ))}
    </ScrollView>
  );
};

export default ChapterSelector;
