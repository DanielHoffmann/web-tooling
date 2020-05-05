module.exports = {
  '*.{html,json,md,yaml}': ['./bin/web-tooling format ', 'git add'],
  '*.{js,ts,tsx}': [
    './bin/web-tooling format',
    './bin/web-tooling lint --fix --no-css ./config/',
    'git add',
  ],
};
