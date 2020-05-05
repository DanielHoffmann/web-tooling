module.exports = {
  '*.{html,json,md,yaml}': ['web-tooling format', 'git add'],
  '*.{js,ts,tsx}': [
    'web-tooling format',
    'web-tooling lint --fix --no-css',
    'git add',
  ],
  '*.css': ['web-tooling format', 'web-tooling lint --fix --no-js', 'git add'],
};
