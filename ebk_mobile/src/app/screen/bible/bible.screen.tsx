// import {useState} from 'react';
// import {View} from 'react-native';
// import {useAppSelector} from '../../store/hooks';
// import {selectBibleStore} from '../../store/bible/bible.slice';
// import BibleIntroScreen from './bible.intro.screen';
// import BibleViewer from './bible.viewer';

// function BibleScreen({navigation}: any) {
//   const bibleStore = useAppSelector(selectBibleStore);
//   const [showIntro, setShowIntro] = useState(true); // ✅ État local

//   const handleStartReading = () => {
//     setShowIntro(false);
//     navigation.navigate('BibleSelectScreen'); // ✅ redirection vers la liste des livres
//   };

//   return (
//     <View style={{backgroundColor: bibleStore.font.theme.background, flex: 1}}>
//       {showIntro ? (
//         <BibleIntroScreen onStartReading={handleStartReading} />
//       ) : (
//         <BibleViewer navigation={navigation} />
//       )}
//     </View>
//   );
// }

// export default BibleScreen;

import {View} from 'react-native';
import {useAppSelector} from '../../store/hooks';
import {selectBibleStore} from '../../store/bible/bible.slice';
import BibleHomeScreen from './home.bible';
// import BibleDrawer from './bible.drawer';

function BibleScreen() {
  const bibleStore = useAppSelector(selectBibleStore);

  return (
    <View style={{backgroundColor: bibleStore.font.theme.background, flex: 1}}>
      {/* <BibleDrawer /> */}
      <BibleHomeScreen />
    </View>
  );
}

export default BibleScreen;
