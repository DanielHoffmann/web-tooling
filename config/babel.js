const browsers = require('./browserslist');

module.exports = api => {
  api.cache(true);

  return {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        { modules: false, targets: browsers },
      ],
      require.resolve('@babel/preset-react'),
      require.resolve('@babel/preset-typescript'),
    ],
    plugins: [
      [
        require.resolve('@babel/plugin-proposal-class-properties'),
        { loose: true },
      ],
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      require.resolve('@babel/plugin-transform-runtime'),
    ],
    env: {
      test: {
        presets: [
          [
            require.resolve('@babel/preset-env'),
            {
              targets: {
                node: 'current',
              },
            },
          ],
        ],
      },
    },
  };
};
