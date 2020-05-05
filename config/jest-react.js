const config = require('./jest');

module.exports = {
  ...config,
  moduleNameMapper: {
    ...(config.moduleNameMapper || {}),
    '^react-native$': 'react-native-web',
    '^react-native-svg$': 'react-native-svg-web',
    '^react-native-webview$': 'emptyfunction',
    '^react-native-linear-gradient$': 'react-native-web-linear-gradient',
  },
};
