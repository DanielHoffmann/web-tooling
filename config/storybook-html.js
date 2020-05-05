const { configure } = require('@storybook/html');

const webpackConfig = ({ config }) => {
  config.resolve.extensions.push('.ts');

  return config;
};

module.exports = { configure, webpackConfig };
