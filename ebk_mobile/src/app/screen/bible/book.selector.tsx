import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import books, {Book} from '../../helpers/assets/bible_versions/books-desc';
import {useAppSelector} from '../../store/hooks';
import {selectBibleStore, setSelectedBook} from '../../store/bible/bible.slice';
import {useDispatch} from 'react-redux';
import colors from '../../../components/style/colors';
import Feather from 'react-native-vector-icons/Feather';

interface BookSelectorScreenProps {
  onNavigate: (index: number) => void;
}

const BookSelector = ({onNavigate}: BookSelectorScreenProps) => {
  const bible = useAppSelector(selectBibleStore);
  const dispatch = useDispatch();
  const {bookSelected} = bible;

  const isDarkMode = useColorScheme() === 'dark';

  const onBookChange = (book: Book) => {
    onNavigate(1);
    dispatch(setSelectedBook(book));
  };

  // Séparer Ancien et Nouveau Testament
  const oldTestamentBooks = Object.values(books).filter(
    book => book.Numero < 40,
  );
  const newTestamentBooks = Object.values(books).filter(
    book => book.Numero >= 40,
  );

  const renderSection = (title: string, bookList: Book[]) => (
    <View style={{marginBottom: 25}}>
      {/* Titre de section */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          marginBottom: 10,
          marginTop: 15,
          marginLeft: 10,
          color: isDarkMode ? colors.lighter : colors.primary,
        }}>
        {title}
      </Text>

      {/* Liste en ligne */}
      <View style={{borderRadius: 8, overflow: 'hidden'}}>
        {bookList.map((book, index) => {
          const isSelected = book.Numero === bookSelected.Numero;
          return (
            <TouchableOpacity
              key={book.Numero}
              onPress={() => onBookChange(book)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 14,
                paddingHorizontal: 16,
                backgroundColor: isSelected
                  ? isDarkMode
                    ? '#2a3b8f'
                    : '#e6f0ff'
                  : isDarkMode
                  ? colors.dark
                  : colors.white,
                borderBottomWidth: index !== bookList.length - 1 ? 1 : 0,
                borderBottomColor: isDarkMode ? '#444' : '#ddd',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: isSelected
                    ? isDarkMode
                      ? colors.lighter
                      : colors.primary
                    : isDarkMode
                    ? colors.lighter
                    : colors.primary,
                  fontWeight: isSelected ? '600' : '400',
                }}>
                {book.Nom}
              </Text>
              <Feather
                name="chevron-right"
                size={20}
                color={isDarkMode ? colors.lighter : colors.primary}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 30,
      }}>
      {renderSection('Ancien Testament', oldTestamentBooks)}
      {renderSection('Nouveau Testament', newTestamentBooks)}
    </ScrollView>
  );
};

export default BookSelector;

// import React from 'react';
// import {ScrollView, Text, useColorScheme, View} from 'react-native';
// import books, {Book} from '../../helpers/assets/bible_versions/books-desc';
// import BookSelectorItem from './book.selector.item';
// import {useAppSelector} from '../../store/hooks';
// import {selectBibleStore, setSelectedBook} from '../../store/bible/bible.slice';
// import {useDispatch} from 'react-redux';
// import colors from '../../../components/style/colors';

// interface BookSelectorScreenProps {
//   onNavigate: (index: number) => void;
// }

// const BookSelector = ({onNavigate}: BookSelectorScreenProps) => {
//   const bible = useAppSelector(selectBibleStore);
//   const dispatch = useDispatch();
//   const {bookSelected} = bible;

//   const isDarkMode = useColorScheme() === 'dark';

//   const onBookChange = (book: Book) => {
//     onNavigate(1);
//     dispatch(setSelectedBook(book));
//   };

//   // Séparer Ancien et Nouveau Testament
//   const oldTestamentBooks = Object.values(books).filter(
//     book => book.Numero < 40,
//   );
//   const newTestamentBooks = Object.values(books).filter(
//     book => book.Numero >= 40,
//   );

//   const renderSection = (title: string, bookList: Book[], isNT: boolean) => (
//     <View style={{marginBottom: 25}}>
//       {/* Titre de section */}
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'center',
//           marginBottom: 10,
//           marginTop: 10,
//         }}>
//         <View
//           style={{
//             height: 1,
//             flex: 1,
//             backgroundColor: isDarkMode ? colors.gray : colors.primary,
//             opacity: 0.3,
//           }}
//         />
//         <Text
//           style={{
//             fontSize: 18,
//             fontWeight: '700',
//             marginHorizontal: 10,
//             color: isDarkMode ? colors.lighter : colors.primary,
//           }}>
//           {title}
//         </Text>
//         <View
//           style={{
//             height: 1,
//             flex: 1,
//             backgroundColor: isDarkMode ? colors.gray : colors.primary,
//             opacity: 0.3,
//           }}
//         />
//       </View>

//       {/* Liste des livres */}
//       <View
//         style={{
//           flexDirection: 'row',
//           flexWrap: 'wrap',
//           justifyContent: 'space-between',
//         }}>
//         {bookList.map(book => (
//           <View
//             key={book.Numero}
//             style={{
//               width: '48%',
//               marginBottom: 12,
//               borderRadius: 10,
//               backgroundColor: isDarkMode ? colors.dark : colors.white,
//               shadowColor: '#000',
//               shadowOpacity: 0.08,
//               shadowOffset: {width: 0, height: 2},
//               shadowRadius: 4,
//               elevation: 2,
//               padding: 10,
//             }}>
//             <BookSelectorItem
//               isNT={isNT}
//               onChange={onBookChange}
//               book={book}
//               isSelected={book.Numero === bookSelected.Numero}
//             />
//           </View>
//         ))}
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView
//       contentContainerStyle={{
//         paddingHorizontal: 15,
//         paddingTop: 10,
//         paddingBottom: 30,
//       }}>
//       {renderSection('Ancien Testament', oldTestamentBooks, false)}
//       {renderSection('Nouveau Testament', newTestamentBooks, true)}
//     </ScrollView>
//   );
// };

// export default BookSelector;

// import React from 'react';
// import {ScrollView, Text, useColorScheme, View} from 'react-native';
// import books, {Book} from '../../helpers/assets/bible_versions/books-desc';
// import BookSelectorItem from './book.selector.item';
// import {useAppSelector} from '../../store/hooks';
// import {selectBibleStore, setSelectedBook} from '../../store/bible/bible.slice';
// import {useDispatch} from 'react-redux';
// import colors from '../../../components/style/colors';

// interface BookSelectorScreenProps {
//   onNavigate: (index: number) => void;
// }

// const BookSelector = ({onNavigate}: BookSelectorScreenProps) => {
//   const bible = useAppSelector(selectBibleStore);
//   const dispatch = useDispatch();
//   const {bookSelected} = bible;

//   const isDarkMode = useColorScheme() === 'dark';

//   const onBookChange = (book: Book) => {
//     onNavigate(1);
//     dispatch(setSelectedBook(book));
//   };

//   // Séparer Ancien et Nouveau Testament
//   const oldTestamentBooks = Object.values(books).filter(
//     book => book.Numero < 40,
//   );
//   const newTestamentBooks = Object.values(books).filter(
//     book => book.Numero >= 40,
//   );

//   const renderSection = (title: string, bookList: Book[], isNT: boolean) => (
//     <>
//       <Text
//         style={{
//           fontSize: 18,
//           fontWeight: 'bold',
//           marginTop: 20,
//           marginBottom: 10,
//           marginLeft: 10,
//           color: isDarkMode ? colors.lighter : colors.primary,
//         }}>
//         {title}
//       </Text>

//       <View
//         style={{
//           flexDirection: 'row',
//           flexWrap: 'wrap',
//         }}>
//         {bookList.map(book => (
//           <BookSelectorItem
//             isNT={isNT}
//             key={book.Numero}
//             onChange={onBookChange}
//             book={book}
//             isSelected={book.Numero === bookSelected.Numero}
//           />
//         ))}
//       </View>
//     </>
//   );

//   return (
//     <ScrollView
//       contentContainerStyle={{
//         paddingHorizontal: 10,
//         paddingTop: 10,
//         paddingBottom: 20,
//       }}>
//       {renderSection('Ancien Testament', oldTestamentBooks, false)}
//       {renderSection('Nouveau Testament', newTestamentBooks, true)}
//     </ScrollView>
//   );
// };

// export default BookSelector;

// import React from 'react';
// import {
//   ScrollView,
//   SectionList,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import books, {
//   Book,
//   sections,
// } from '../../helpers/assets/bible_versions/books-desc';
// import BookSelectorItem from './book.selector.item';
// import {useAppSelector} from '../../store/hooks';
// import {selectBibleStore, setSelectedBook} from '../../store/bible/bible.slice';
// import {useDispatch} from 'react-redux';
// import colors from '../../../components/style/colors';

// interface BookSelectorScreenProps {
//   onNavigate: (index: number) => void;
// }

// const BookSelector = ({onNavigate}: BookSelectorScreenProps) => {
//   const bible = useAppSelector(selectBibleStore);
//   const dispatch = useDispatch();

//   const {bookSelected} = bible;

//   const onBookChange = (book: Book) => {
//     onNavigate(1);
//     // actions.setTempSelectedBook(book)
//     dispatch(setSelectedBook(book));
//   };

//   // if (selectionMode === 'list') {
//   //   return (
//   //     <SectionList
//   //       contentContainerStyle={{ paddingTop: 0 }}
//   //       sections={sections}
//   //       keyExtractor={item => item.Nom}
//   //       renderSectionHeader={({ section: { title } }) => (
//   //         <View
//   //           style={{
//   //             marginTop: 10,
//   //             paddingVertical: 10,
//   //             paddingHorizontal: 20,
//   //             borderBottomWidth: 3,
//   //             borderColor: colors.blackrgba5,
//   //             alignSelf: 'center'
//   //           }}
//   //         >
//   //           <Text style={{fontSize: 14, textAlign: 'center', fontWeight: "bold" }}>
//   //             {title}
//   //           </Text>
//   //         </View>
//   //       )}
//   //       renderItem={({ item: book }) => (
//   //         <TouchableOpacity style={{padding: 20}} onPress={() => onBookChange(book)}>
//   //           <Text
//   //             style={{fontSize: 16,
//   //               color: book.Numero === bookSelected.Numero ? 'primary' : 'default'
//   //             }}
//   //             {...(book.Numero === selectedBook.Numero && { bold: true })}
//   //           >
//   //             {t(book.Nom)}
//   //           </Text>
//   //         </TouchableOpacity>
//   //       )}
//   //     />
//   //   )
//   // }

//   return (
//     <ScrollView
//       contentContainerStyle={{
//         flexWrap: 'wrap',
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         justifyContent: 'flex-start',
//         paddingTop: 10,
//       }}>
//       {Object.values(books).map(book => (
//         <BookSelectorItem
//           isNT={book.Numero >= 40}
//           key={book.Numero}
//           onChange={onBookChange}
//           book={book}
//           isSelected={book.Numero === bookSelected.Numero}
//         />
//       ))}
//     </ScrollView>
//   );
// };

// export default BookSelector;
