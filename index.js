/* eslint-disable no-process-env */
const program = require('commander');
const spawn = require('cross-spawn');
const path = require('path');
const pkg = require('./package.json');

const cwd = process.cwd();

const runNpx = (cmd, args = [], environmentVariables = {}) => {
  return spawn.sync('npx', ['--no-install', cmd, ...args], {
    stdio: 'inherit',
    // for some reason this requires some env variables from the current process
    env: { ...process.env, ...environmentVariables },
  });
};

program
  .version(pkg.version)
  .description(pkg.description)
  .parse(process.argv);

program
  .command('analyze')
  .description('Analyze Webpack build')
  .action(() => {
    const result = runNpx('webpack', ['--progress'], {
      NODE_ENV: 'production',
      ANALYZE: 'true',
    });
    process.exit(result.status);
  });

program
  .command('format [glob]')
  .description('Format files using Prettier')
  .option('-c, --check', 'check if files are formatted')
  .action((glo, { check }) => {
    let glob = glo;
    if (!glob || glob === '') {
      glob = '**/*.{css,html,js,json,md,ts,tsx,yaml}';
    }
    const result = runNpx('prettier', [
      ...(check ? ['--check'] : ['--write']),
      glob,
    ]);
    process.exit(result.status);
  });

program
  .command('lint [glob]')
  .description('Lint files using ESLint and Stylelint')
  .option('--fix', 'automatically fix problems')
  .option('--no-css', 'skip linting css')
  .option('--no-js', 'skip linting js,ts,tsx')
  .action((glo, { css, fix, js }) => {
    let glob = glo;
    if (!glob || glob === '') {
      glob = './src/';
    }
    if (js) {
      const result = runNpx('eslint', [
        '--ext',
        'js,ts,tsx',
        ...(fix ? ['--fix'] : []),
        glob,
      ]);
      if (result.status !== 0) {
        process.exit(result.status);
      }
    }
    if (css) {
      // stylelint glob behaves a little different from eslint
      let cssGlob = glob;
      if (!cssGlob.endsWith('.css')) {
        if (!cssGlob.endsWith('/')) {
          cssGlob += '/';
        }
        cssGlob += '**/*.css';
      }
      const result = runNpx('stylelint', [...(fix ? ['--fix'] : []), cssGlob]);
      if (result.status !== 0) {
        process.exit(result.status);
      }
    }
    process.exit(0);
  });

program
  .command('pre-commit')
  .description('Run lint-staged commands')
  .action(() => {
    const result = runNpx('lint-staged');
    process.exit(result.status);
  });

program
  .command('pre-push')
  .description('Type-check, lint and test')
  .option('--no-lint', 'skip linting')
  .option('--no-lint-css', 'skip linting css')
  .option('--no-lint-js', 'skip linting js,ts,tsx')
  .option('--no-test', 'skip testing')
  .option('--no-type-check', 'skip type-checking')
  .action(({ lint, lintJs, lintCss, test, typeCheck }) => {
    if (typeCheck) {
      const result = runNpx('web-tooling', ['type-check']);
      if (result.status !== 0) {
        process.exit(result.status);
      }
    }

    if (lint) {
      const result = runNpx('web-tooling', [
        'lint',
        [lintCss ? [] : ['--no-css']],
        [lintJs ? [] : ['--no-js']],
      ]);
      if (result.status !== 0) {
        process.exit(result.status);
      }
    }

    if (test) {
      const result = runNpx('web-tooling', ['test']);
      if (result.status !== 0) {
        process.exit(result.status);
      }
    }
    process.exit(0);
  });

program
  .command('storybook:html')
  .description('Run Storybook for HTML')
  .option('-p, --port <port>', 'port to run Storybook')
  .option('-s, --static-dir <dir>', 'directory where to load static files from')
  .action(({ port, staticDir }) => {
    const result = spawn.sync(
      'node',
      [
        path.resolve(cwd, './node_modules/@storybook/html/bin/index.js'),
        ...(port ? ['--port', port] : []),
        ...(staticDir ? ['--static-dir', path.resolve(cwd, staticDir)] : []),
      ],
      {
        stdio: 'inherit',
        env: process.env,
      },
    );
    process.exit(result.status);
  });

program
  .command('storybook:react')
  .description('Run Storybook for React')
  .option('-p, --port <port>', 'port to run Storybook')
  .option('-s, --static-dir <dir>', 'directory where to load static files from')
  .action(({ port, staticDir }) => {
    const result = spawn.sync(
      'node',
      [
        path.resolve(cwd, './node_modules/@storybook/react/bin/index.js'),
        ...(port ? ['--port', port] : []),
        ...(staticDir ? ['--static-dir', path.resolve(cwd, staticDir)] : []),
      ],
      {
        stdio: 'inherit',
        env: process.env,
      },
    );
    process.exit(result.status);
  });

program
  .command('test')
  .description('Run tests using Jest')
  .option('-w, --watch', 'watch files for changes')
  .option('-u, --updateSnapshot', 're-record snaphots')
  .action(({ watch, updateSnapshot }) => {
    const result = runNpx('jest', [
      '--rootDir',
      cwd,
      ...(watch ? ['--watch'] : []),
      ...(updateSnapshot ? ['--updateSnapshot'] : []),
    ]);
    process.exit(result.status);
  });

program
  .command('type-check')
  .description('Run type-checking')
  .option('--watch', 'watch files for changes')
  .action(({ watch }) => {
    const result = runNpx('tsc', ['--noEmit', ...(watch ? ['--watch'] : [])]);
    process.exit(result.status);
  });

program
  .command('webpack')
  .description('Build using Webpack')
  .option(
    '--watch',
    'Builds the project in development mode and watch for changes',
  )
  .action(({ watch }) => {
    const args = ['--progress'];
    let nodeEnv = 'production';
    if (watch) {
      args.push('--watch');
      nodeEnv = 'development';
    }
    const result = runNpx('webpack', args, {
      NODE_ENV: nodeEnv,
    });
    process.exit(result.status);
  });

program
  .command('webpack-dev-server')
  .description('Start webpack-dev-server')
  .option('--host', 'Bind server to a hostname/ip address')
  .action(({ host }) => {
    const result = runNpx(
      'webpack-dev-server',
      ['--hot', ...(host ? ['--host', host] : [])],
      {
        NODE_ENV: 'development',
      },
    );
    process.exit(result.status);
  });

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
