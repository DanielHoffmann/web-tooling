const config = require('./eslint-react');

module.exports = {
  ...config,
  env: {
    ...(config.env || {}),
    browser: false,
  },
  globals: {
    ...(config.globals || {}),
    __DEV__: true,
    clearInterval: false,
    clearTimeout: false,
    console: false,
    fetch: false,
    global: false,
    module: false,
    process: false,
    setInterval: false,
    setTimeout: false,
    window: false,
  },
};
