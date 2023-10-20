module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
    'jest',
    'import',
  ],
  globals: {
    AbortController: 'readonly',
    detox: false,
    device: false,
    expect: false,
    waitFor: false,
    element: false,
    by: false,
  },
  rules: {
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
        "error",
        { 
          "ignoreRestSiblings": true,
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
    ],
    'import/prefer-default-export': 'off',
    'prefer-const': 'off',
    'quote-props': 'off',
    'padded-blocks': 'off',
    'multiline-ternary': 'off',
    'no-multi-spaces': ['error', { ignoreEOLComments: true }],
    'operator-linebreak': 'off',
    'spaced-comment': 'off',
    'react/jsx-key': 'off', // because does not detect key in spread operator
    'react/display-name': 'off',
  },
  env: {
    'jest/globals': true,
    'browser': true,
    'es2021': true
  },
  // As recommended by typescript-eslint, check https://github.com/typescript-eslint/typescript-eslint/blob/main/docs/linting/TROUBLESHOOTING.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
}
