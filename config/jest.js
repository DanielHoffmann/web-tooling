const path = require('path');

module.exports = {
  moduleNameMapper: {
    '\\.(eot|gif|jpg|otf|pdf|png|svg|ttf|woff2)$': path.resolve(
      __dirname,
      '../__mocks__/fileMock.js',
    ),
    '\\.css$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
};
