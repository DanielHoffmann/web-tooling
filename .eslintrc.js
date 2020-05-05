const config = require('./config/eslint');

module.exports = {
  ...config,
  env: {
    ...(config.env || {}),
    node: true,
  },
  rules: {
    ...(config.rules || {}),
    'import/no-commonjs': 'off',
    'import/no-nodejs-modules': 'off',
  },
};
