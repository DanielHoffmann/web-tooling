const { configure } = require('@storybook/react');

const webpackConfig = ({ config }) => {
  config.module.rules.push({
    test: /\.tsx?$/,
    loader: 'babel-loader',
  });

  config.resolve.alias['react-native$'] = 'react-native-web';
  config.resolve.alias['react-native-svg$'] = 'react-native-svg-web';
  config.resolve.alias['react-native-webview$'] = 'emptyfunction';
  config.resolve.alias['react-native-linear-gradient$'] =
    'react-native-web-linear-gradient';
  config.resolve.alias['@storybook/react-native$'] = '@storybook/react';
  config.resolve.extensions = [
    '.web.js',
    '.js',
    '.json',
    '.web.ts',
    '.web.tsx',
    '.ts',
    '.tsx',
  ];

  return config;
};

module.exports = { configure, webpackConfig };
