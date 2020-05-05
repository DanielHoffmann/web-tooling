const config = require('./eslint');

module.exports = {
  ...config,
  extends: [
    ...(config.extends || []),
    'plugin:react/recommended',
    'prettier/react',
  ],
  plugins: [...(config.plugins || []), 'react-hooks'],
  rules: {
    ...(config.rules || {}),
    'react/default-props-match-prop-types': 'error',
    'react/jsx-boolean-value': ['error', 'never'],
    'react/jsx-fragments': ['error'],
    'react/jsx-pascal-case': 'error',
    'react/jsx-sort-default-props': 'error',
    'react/jsx-sort-props': 'error',
    'react/no-danger': 'error',
    'react/no-this-in-sfc': 'error',
    'react/no-typos': 'error',
    'react/no-unused-prop-types': 'error',
    'react/no-unused-state': 'error',
    'react/prefer-es6-class': 'error',
    'react/prefer-stateless-function': 'error',
    'react/prop-types': 'off',
    'react/sort-prop-types': 'error',
    'react/void-dom-elements-no-children': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
  },
  settings: {
    ...(config.settings || {}),
    react: {
      version: 'detect',
    },
    linkComponents: [{ name: 'Link', linkAttribute: 'to' }],
  },
};
