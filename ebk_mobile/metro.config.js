// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
// const defaultConfig = getDefaultConfig(__dirname);

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('metro-config').MetroConfig}
//  */
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);

// // metro.config.js
// const path = require('path');

// module.exports = {
//   resolver: {
//     extraNodeModules: {
//       'react-native-video-trim': path.resolve(
//         __dirname,
//         '__mocks__/react-native-video-trim.js',
//       ),
//     },
//   },
// };

/**
 * Metro configuration for React Native
 * https://reactnative.dev/docs/metro
 *
 * @format
 */

const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const {
  resolver: {sourceExts, assetExts},
} = defaultConfig;

const customConfig = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    extraNodeModules: {
      'react-native-video-trim': path.resolve(
        __dirname,
        '__mocks__/react-native-video-trim.js',
      ),
    },
  },
};

module.exports = mergeConfig(defaultConfig, customConfig);
