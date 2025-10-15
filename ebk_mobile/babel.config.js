const path = require('path');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'react-native-reanimated/plugin',
      {
        processNestedWorklets: true,
      },
    ],
    ['react-native-worklets-core/plugin'],
    [
      'module-resolver',
      {
        alias: {
          ['EcclesiaBooK']: path.join(__dirname, '..', 'index'),
        },
      },
    ],
  ],
};
