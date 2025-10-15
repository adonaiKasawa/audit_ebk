import React from 'react';
import {Text} from 'react-native';
import {BottomSheetOpendedByType} from '../bible.viewer';

export interface ReadTextVerserPros {
  id: number;
  chapter: number;
  text: string;
  background: string;
  fontSize: number | undefined;
  color: string;
  bold: number | 'bold' | 'normal';
  textAlign: 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined;
  handlePresentModalPress: (opendedBy: BottomSheetOpendedByType) => void;
  textChapter?: any[];
  verseTextSelected: {id: number; text: string}[];
  setVerseTextSelected: React.Dispatch<
    React.SetStateAction<{id: number; text: string}[]>
  >;
  handleCloseBottomSheetPress: () => void;
}

function ReadTextVerser(props: ReadTextVerserPros) {
  const {
    id,
    text,
    chapter,
    color,
    textAlign,
    fontSize,
    handlePresentModalPress,
    verseTextSelected,
    setVerseTextSelected,
    handleCloseBottomSheetPress,
  } = props;
  const findVerse = verseTextSelected.find(
    item => item.id === id && item.text === text,
  );

  const handelSelected = () => {
    const findVerse = verseTextSelected.find(
      item => item.id === id && item.text === text,
    );
    if (findVerse) {
      setVerseTextSelected(verse => {
        const filter = verse.filter(item => item !== findVerse);
        return filter;
      });
      if (verseTextSelected.length === 1) {
        handleCloseBottomSheetPress();
      }
    } else {
      setVerseTextSelected(verse => [...verse, {id, text}]);
      if (verseTextSelected.length === 0) {
        handlePresentModalPress('VerseClicked');
      }
    }
  };

  return (
    <Text
      onPress={() => {
        handelSelected();
      }}
      style={{
        fontSize,
        color: color,
        textAlign,
        textDecorationLine: findVerse ? 'underline' : 'none',
        lineHeight: fontSize ? fontSize * 1.5 : 40,
        marginVertical: 5,
        fontWeight: 300,
      }}>
      <Text style={{fontSize: fontSize ? fontSize / 1.8 : fontSize}}>{id}</Text>
      <Text> {text}</Text>
    </Text>
  );
}

export function ReadTextVerserRender(props: ReadTextVerserPros) {
  const {
    textChapter,
    color,
    textAlign,
    fontSize,
    handlePresentModalPress,
    verseTextSelected,
    setVerseTextSelected,
    handleCloseBottomSheetPress,
  } = props;

  const handelSelected = ({id, text}: {id: number; text: string}) => {
    const findVerse = verseTextSelected.find(
      item => item.id === id && item.text === text,
    );
    if (findVerse) {
      setVerseTextSelected(verse => {
        const filter = verse.filter(item => item !== findVerse);
        return filter;
      });
      if (verseTextSelected.length === 1) {
        handleCloseBottomSheetPress();
      }
    } else {
      setVerseTextSelected(verse => [...verse, {id, text}]);
      if (verseTextSelected.length === 0) {
        handlePresentModalPress('VerseClicked');
      }
    }
  };

  return (
    <Text style={{lineHeight: fontSize ? fontSize * 1.5 : 40}}>
      {textChapter &&
        textChapter?.map(item => {
          const findVerse = verseTextSelected.find(
            verse => verse.id === item.id && verse.text === item.text,
          );
          return (
            <Text
              onPress={() => {
                handelSelected({id: item.id, text: item.text});
              }}
              style={{
                fontSize,
                color: color,
                textAlign,
                textDecorationLine: findVerse ? 'underline' : 'none',
                // lineHeight: fontSize || 25 * 2,
                fontWeight: 300,
              }}
              key={item.id}>
              <Text style={{fontSize: fontSize ? fontSize / 1.8 : fontSize}}>
                {' '}
                {item.id}{' '}
              </Text>
              <Text style={{}}>{item.text}</Text>
            </Text>
          );
        })}
    </Text>
  );
}

export default ReadTextVerser;
