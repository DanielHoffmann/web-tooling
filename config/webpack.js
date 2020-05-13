/* eslint-disable no-process-env */
const CopyPlugin = require('copy-webpack-plugin');
const fs = require('fs-extra');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { DefinePlugin, HashedModuleIdsPlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const browsers = require('./browserslist');

module.exports = ({
  /**
   * folder to put the bundled files and static assets in
   */
  outputDir = path.resolve(process.cwd(), 'build'),

  /**
   * folder with static assets to be copied into outputDir after building
   */
  publicDir = path.resolve(process.cwd(), 'public'),

  /**
   * Folder with the Javascript/Typescript source code of the app
   * entry point will be this folder /index.js or /index.tsx
   */
  sourceDir = path.resolve(process.cwd(), 'src'),

  /**
   * should point to the folder with node_modules packages
   */
  nodeModulesDir = path.resolve(process.cwd(), 'node_modules'),

  /**
   * Folders to pass babel-loader on, useful for node_modules
   * dependencies that are published un-babelfied
   */
  babelLoaderIncludes = [],

  /**
   * path to a file with CSS variables to use
   * see postcss-preset-env importFrom option
   */
  cssVariablesPath,

  /**
   * environment variables to add to the bundle to be used at runtime
   * can be accessed through "process.env.VARIABLE_NAME"
   * all variables should be strings (no booleans or numbers) because CI systems can only use strings
   */
  envVariables = {},

  /**
   * webpack-dev-server options
   */
  devServerOptions = {},

  /**
   * public path to use
   */
  publicPath = '/',

  /**
   * Inlines all the javascript source in the final HTML file
   */
  inlineSource,
} = {}) => {
  const mode = process.env.NODE_ENV;
  if (mode !== 'production' && mode !== 'development') {
    throw new Error(`Invalid NODE_ENV ${mode}`);
  }
  const isProd = mode === 'production';
  const isDev = mode === 'development';

  if (isProd) {
    fs.removeSync(outputDir);
  }

  const getStyleLoaders = modules => [
    ...(isProd ? [{ loader: MiniCssExtractPlugin.loader }] : ['style-loader']),
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        ...(modules
          ? {
              modules: {
                localIdentName: isProd ? '[hash:base64:8]' : '[name]__[local]',
              },
            }
          : {}),
        sourceMap: isDev,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-preset-env')({
            features: {
              'custom-media-queries': true,
              'nesting-rules': true,
            },
            importFrom: cssVariablesPath,
            overrideBrowserslist: browsers,
            preserve: false,
          }),
        ],
        sourceMap: isDev,
      },
    },
  ];

  const processEnvVars = Object.entries(envVariables).reduce(
    (acc, [key, value]) => {
      acc[`process.env.${key}`] = JSON.stringify(process.env[key] || value);
      return acc;
    },
    {},
  );

  const definePluginOpts = {
    /*
    makes const env = process.env; env.ENV_NAME work
    */
    'process.env': JSON.stringify({
      ...processEnvVars,
      NODE_ENV: process.env.NODE_ENV,
      PUBLIC_PATH: publicPath,
    }),
    // makes process.env.ENV_NAME work
    ...processEnvVars,
  };

  const mainConfig = entry => {
    let filename = '[name].[chunkhash:8].js';
    if (isDev) {
      // we can't hash the service workers bundle names because we need those names at runtime to register them
      // also serviceWorkers registration is based on path of the service worker file so we can't have it change on every build
      filename = '[name].js';
    }

    return {
      mode,
      entry,
      target: 'web',
      output: {
        filename,
        path: outputDir,
        publicPath,
        // libraryTarget: 'this',
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            exclude: /\.module\.css$/,
            use: getStyleLoaders(),
          },
          {
            test: /\.module\.css$/,
            use: getStyleLoaders(true),
          },
          {
            test: /\.worker\.(js|tsx?)$/,
            include: [
              sourceDir,
              ...babelLoaderIncludes
                .map(folderPath => {
                  if (fs.existsSync(folderPath)) {
                    return fs.realpathSync(folderPath);
                  }
                  return null;
                })
                .filter(folderPath => folderPath !== null),
            ],
            use: [
              {
                loader: 'worker-loader',
                options: {
                  name: filename,
                },
              },
              {
                loader: 'babel-loader',
                options: {
                  envName: isProd ? 'production' : 'development',
                },
              },
            ],
          },
          {
            test: /\.(js|tsx?)$/,
            include: [
              sourceDir,
              ...babelLoaderIncludes
                .map(folderPath => {
                  if (fs.existsSync(folderPath)) {
                    return fs.realpathSync(folderPath);
                  }
                  return null;
                })
                .filter(folderPath => folderPath !== null),
            ],
            loader: 'babel-loader',
            options: {
              envName: isProd ? 'production' : 'development',
            },
          },
          {
            test: /\.(eot|gif|jpg|otf|pdf|png|svg|ttf|woff2?)$/,
            exclude: /\.icon.svg$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: isProd ? '[name].[hash:8].[ext]' : '[name].[ext]',
                },
              },
            ],
          },
          {
            test: /\.icon.svg$/,
            loader: '@svgr/webpack',
          },
        ],
      },
      plugins: [
        new DefinePlugin(definePluginOpts),
        new CopyPlugin([
          {
            from: publicDir,
            to: outputDir,
          },
        ]),
        new HtmlWebpackPlugin({
          favicon: 'public/favicon.ico',
          inlineSource,
          minify: isProd
            ? {
                collapseWhitespace: true,
                removeScriptTypeAttributes: true,
              }
            : false,
          template: path.resolve(publicDir, 'index.html'),
        }),
        ...(inlineSource ? [new HtmlWebpackInlineSourcePlugin()] : []),
        ...(isProd
          ? [
              new HashedModuleIdsPlugin(),
              new MiniCssExtractPlugin({
                filename: isProd ? '[name].[chunkhash:8].css' : '[name].css',
              }),
              new OptimizeCssAssetsPlugin(),
            ]
          : []),
        ...(process.env.ANALYZE === 'true'
          ? [
              new BundleAnalyzerPlugin({
                analyzerPort: 8888,
              }),
            ]
          : []),
      ],
      optimization: {
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              output: {
                comments: false,
              },
            },
          }),
        ],
        runtimeChunk: 'single',
      },
      resolve: {
        extensions: [
          '.web.js',
          '.js',
          '.json',
          '.web.ts',
          '.web.tsx',
          '.ts',
          '.tsx',
        ],
        modules: [nodeModulesDir],
        alias: {
          'react-native$': 'react-native-web',
          'react-native-svg$': 'react-native-svg-web',
          'react-native-webview$': 'emptyfunction',
          'react-native-linear-gradient$': 'react-native-web-linear-gradient',
        },
      },
      performance: false,
      stats: {
        assets: true,
        builtAt: false,
        children: false,
        entrypoints: false,
        hash: false,
        modules: false,
        version: false,
      },
      devServer: {
        historyApiFallback: true,
        overlay: true,
        port: 8080,
        stats: 'minimal',
        publicPath,
        ...devServerOptions,
      },
      devtool: isProd ? 'source-map' : 'inline-source-map',
    };
  };

  const config = mainConfig({ main: sourceDir });
  return config;
};
