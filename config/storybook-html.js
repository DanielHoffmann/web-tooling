const { configure } = require('@storybook/html');

const webpackConfig = ({ config }) => {
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
