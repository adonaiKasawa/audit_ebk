import React from 'react';
import {ScrollView} from 'react-native';
import SelectorItem from './selector.item';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {selectBibleStore} from '../../store/bible/bible.slice';
import countLsgChapters from '../../helpers/assets/bible_versions/countLsgChapters';

interface VerseSelectorScreenProps {
  onComplete: () => void;
}

const VerseSelector = ({onComplete}: VerseSelectorScreenProps) => {
  const bible = useAppSelector(selectBibleStore);
  const dispatch = useAppDispatch();
  const {bookSelected, chapterSelected, verseSelected} = bible;

  const versesInCurrentChapter =
    countLsgChapters[`${bookSelected.Numero}-${chapterSelected}`];

  const onValidate = (verse: number) => {
    // actions.setTempSelectedVerse(verse)
    // actions.validateTempSelected()
    onComplete();
  };

  const onLongValidate = (verse: number) => {
    // actions.setTempSelectedVerse(verse)
    // onLongPressComplete?.(verse)
  };

  if (!versesInCurrentChapter) {
    return null;
  }

  const array = Array(...Array(versesInCurrentChapter)).map((_, i) => i);

  return (
    <ScrollView
      contentContainerStyle={{
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingTop: 10,
      }}>
      {array.map(v => (
        <SelectorItem
          key={v}
          item={v + 1}
          isSelected={verseSelected === v + 1}
          onChange={onValidate}
          onLongChange={onLongValidate}
        />
      ))}
    </ScrollView>
  );
};

export default VerseSelector;
