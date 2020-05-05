# @sandvikcode/web-tooling

> Opinionated configs and CLI for JavaScript/TypeScript projects.

## Installation

Add `@sandvikcode/web-tooling` and `husky` as a devDependencies:

```bash
yarn add @sandvikcode/web-tooling husky --dev
```

## Usage

Add this to your `package.json`:

```json
{
  "scripts": {
    "start": "web-tooling webpack-dev-server",
    "build": "web-tooling webpack",
    "analyze": "web-tooling analyze",
    "format": "web-tooling format",
    "lint": "web-tooling lint",
    "storybook": "web-tooling storybook:react",
    "test": "web-tooling test",
    "type-check": "web-tooling type-check"
  },
  "husky": {
    "hooks": {
      "pre-commit": "web-tooling pre-commit",
      "pre-push": "web-tooling pre-push"
    }
  }
}
```

### CLI

```
Usage: web-tooling [options] [command]

Configs and CLI for JavaScript/TypeScript projects.

Options:
  -V, --version                 output the version number
  -h, --help                    output usage information

Commands:
  analyze                       Analyze Webpack build
  format [options] [glob]       Format files using Prettier
  lint [options] [glob]         Lint files using ESLint and Stylelint
  pre-commit                    Run lint-staged commands
  pre-push [options]            Type-check, lint and test
  storybook:html [options]      Run Storybook for HTML
  storybook:react [options]     Run Storybook for React
  test [options]                Run tests using Jest
  type-check [options]          Run type-checking
  webpack [options]             Build using Webpack
  webpack-dev-server [options]  Start webpack-dev-server
```

Run `web-tooling [command] --help` to see options for each command.

### Configuration

Create configuration files depending on which tools you wish to use from this project. Note that configuring these tools in any other way (for example through package.json) is NOT supported.

All configurations that are .js files can be extended like this:

```js
const config = require('@sandvikcode/web-tooling/config/eslint');
config = {
  ...config,
  rules: {
    ...config.rules,
    'no-console': 'off',
  },
};
module.exports = config;
```

#### .eslintrc.js

```js
module.exports = require('@sandvikcode/web-tooling/config/eslint');
```

#### .prettierrc.js

```js
module.exports = require('@sandvikcode/web-tooling/config/prettier');
```

#### .stylelintrc.js

```js
module.exports = require('@sandvikcode/web-tooling/config/stylelint');
```

#### jest.config.js

```js
module.exports = require('@sandvikcode/web-tooling/config/jest');
```

#### lint-staged.config.js

```js
module.exports = require('@sandvikcode/web-tooling/config/lint-staged');
```

#### tsconfig.json

```json
{
  "extends": "@sandvikcode/web-tooling/config/tsconfig",
  "include": ["src/**/*"]
}
```

#### .browserslistrc

This file is optional, it defaults to:

```
>0.5%
not dead
last 2 versions
not ie <= 11
not op_mini all
```

#### babel.config.js

```js
module.exports = require('@sandvikcode/web-tooling/config/babel');
```

#### webpack.config.js

Default entrypoint for webpack config is "/src/" (index.js or index.ts or index.tsx)

```js
const createConfig = require('@sandvikcode/web-tooling/config/webpack');

module.exports = createConfig({
  // environment variables to add to the bundles
  // can be accessed through process.env.VARIABLE_NAME
  envVariables: {
    VARIABLE_NAME: 'true',
  },

  // see config/webpack.js for all the options
});
```

#### .storybook/config.js

```js
const {
  configure,
} = require('@sandvikcode/web-tooling/config/storybook-react');

configure(require.context('../src', true, /\.stories\.tsx$/), module);
```

#### .storybook/webpack.config.js

```js
const {
  webpackConfig,
} = require('@sandvikcode/web-tooling/config/storybook-react');

module.exports = webpackConfig;
```
