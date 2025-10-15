import React from 'react';

import {Book} from '../../helpers/assets/bible_versions/books-desc';
// import {Text, TouchableOpacity, useColorScheme} from 'react-native';
import {Text, TouchableOpacity} from 'react-native';
import colors from '../../../components/style/colors';
import {wp} from '../../helpers/utils';

const BookSelectorItem = ({
  book,
  isSelected,
  // isNT,
  onChange,
}: {
  book: Book;
  isSelected: boolean;
  isNT: boolean;
  onChange: (book: Book) => void;
}) => {
  // const bookName = book.Nom.replace(/\s/g, '').substr(0, 3);
  const bookName = book.Nom;
  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? colors.primary : colors.lighter,
  // };

  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        // height: 45,
        height: 40,
        width: wp(99) / 5,
      }}
      onPress={() => onChange(book)}>
      <Text
        style={{
          color: isSelected ? colors.blue : colors.gris,
          fontWeight: isSelected ? 'bold' : 'normal',
          fontSize: 12,
        }}>
        {bookName}
      </Text>
    </TouchableOpacity>
  );
};

export default BookSelectorItem;
