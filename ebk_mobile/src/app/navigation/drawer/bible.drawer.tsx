// // bible.drawer.tsx
// import React from 'react';
// import {createDrawerNavigator} from '@react-navigation/drawer';
// import BibleViewer from '../../screen/bible/bible.viewer';
// // import BibleIntroScreen from './bible.intro.screen';
// // import BibleViewer from './bible.viewer';

// const Drawer = createDrawerNavigator();

// export default function BibleDrawer() {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Bible"
//       screenOptions={{
//         headerShown: true, // ✅ garde le header avec bouton ☰
//         // headerStyle: {height: 50}, // ✅ ajuste la hauteur du header
//         // headerTitleAlign: 'center',
//       }}>
//       {/* <Drawer.Screen name="Intro" component={BibleIntroScreen} /> */}
//       <Drawer.Screen name="Bible" component={BibleViewer} />
//       <Drawer.Screen name="Plan de la Bible" component={BibleViewer} />
//       <Drawer.Screen name="Verset du jour" component={BibleViewer} />
//       <Drawer.Screen name="Dernier verset lu" component={BibleViewer} />
//       <Drawer.Screen name="Quiz" component={BibleViewer} />
//       <Drawer.Screen name="Paramètres" component={BibleViewer} />
//       <Drawer.Screen name="Autres" component={BibleViewer} />
//     </Drawer.Navigator>
//   );
// }

import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BibleViewer from '../../screen/bible/bible.viewer';
import BibleSelectScreen from '../../screen/bible/bible.select.screen';
import VersetDay from '../../screen/bible/verset.day';

const Drawer = createDrawerNavigator();

export default function BibleDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Bible"
      // initialRouteName="Plan de la Bible"
      screenOptions={{
        headerShown: false, // ❌ enlève le header auto qui crée l’espace
      }}>
      <Drawer.Screen name="Bible" component={BibleViewer} />
      <Drawer.Screen name="Plan de la Bible" component={BibleSelectScreen} />
      <Drawer.Screen name="Verset du jour" component={VersetDay} />
      <Drawer.Screen name="Plan de lecture" component={BibleViewer} />
      <Drawer.Screen name="Note" component={BibleViewer} />
      {/* <Drawer.Screen name="Dernier verset lu" component={BibleViewer} /> */}
      <Drawer.Screen name="Quiz" component={BibleViewer} />
      <Drawer.Screen name="Paramètres" component={BibleViewer} />
      {/* <Drawer.Screen name="Autres" component={BibleViewer} /> */}
    </Drawer.Navigator>
  );
}
