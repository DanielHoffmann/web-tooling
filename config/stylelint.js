module.exports = {
  extends: ['stylelint-config-recommended', 'stylelint-config-prettier'],
  plugins: ['stylelint-order', 'stylelint-value-no-unknown-custom-properties'],
  rules: {
    'at-rule-no-vendor-prefix': true,
    'color-hex-length': 'short',
    'color-named': [
      'never',
      {
        ignoreProperties: ['/composes/'],
      },
    ],
    'color-no-hex': true,
    'declaration-block-no-redundant-longhand-properties': true,
    'declaration-no-important': [true, { severity: 'warning' }],
    'font-family-name-quotes': 'always-where-recommended',
    'font-family-no-missing-generic-family-keyword': true,
    'function-url-no-scheme-relative': true,
    'length-zero-no-unit': true,
    'media-feature-name-no-vendor-prefix': true,
    'no-descending-specificity': null,
    'no-unknown-animations': true,
    'order/order': ['custom-properties', 'declarations', 'rules', 'at-rules'],
    'order/properties-alphabetical-order': true,
    'property-blacklist': ['font-weight'],
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['/composes/'],
      },
    ],
    'property-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['/global/'] },
    ],
    'shorthand-property-no-redundant-values': true,
    'value-no-vendor-prefix': true,
  },
};
