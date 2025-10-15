import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import colors from '../../../components/style/colors';

const routes = ['Livres', 'Chapitres', 'Versets'];

type Props = {
  index: number;
  onChange: (index: number) => void;
};

const BibleSelectTabBar = ({index, onChange}: Props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.lighter,
        marginHorizontal: 12,
        marginTop: 10,
        borderRadius: 10,
        padding: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}>
      {routes.map((route, routeIndex) => {
        const isActive = routeIndex === index;

        return (
          <TouchableOpacity
            key={routeIndex}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: isActive ? colors.primary : 'transparent',
            }}
            activeOpacity={0.8}
            onPress={() => onChange(routeIndex)}>
            <Text
              style={{
                color: isActive ? colors.white : colors.gris,
                fontWeight: isActive ? '700' : '500',
                fontSize: 14,
              }}>
              {route}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BibleSelectTabBar;

// import React from 'react';
// import {Text, TouchableOpacity, View} from 'react-native';
// import colors from '../../../components/style/colors';

// const routes = ['Livres', 'Chapitres', 'Versets'];

// type Props = {
//   index: number;
//   onChange: (index: number) => void;
// };

// const BibleSelectTabBar = ({index, onChange}: Props) => {
//   return (
//     <View style={{flexDirection: 'row'}}>
//       {routes.map((route, routeIndex) => {
//         const isRouteActive = routeIndex === index;

//         return (
//           <TouchableOpacity
//             key={routeIndex}
//             style={{
//               flex: 1,
//               alignItems: 'center',
//               justifyContent: 'center',
//               height: 35,
//               marginVertical: 5,
//               marginHorizontal: 10,
//               borderWidth: 2,
//               borderColor: 'transparent',
//               ...(isRouteActive && {
//                 borderRadius: 8,
//                 backgroundColor: colors.white,
//                 borderColor: colors.primary,
//                 overflow: 'visible',
//               }),
//             }}
//             onPress={() => {
//               onChange(routeIndex);
//             }}>
//             <Text
//               style={{
//                 color: isRouteActive ? colors.primary : colors.gris,
//                 fontWeight: 'bold',
//               }}>
//               {route}
//             </Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// };

// export default BibleSelectTabBar;
