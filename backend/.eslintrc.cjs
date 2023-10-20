module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest', 'import'],
  root: true,
  rules: {
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    "no-unused-vars": "off",
    "@typescript-eslint/ban-ts-comment": "off",
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
    'spaced-comment': 'off'
  },
  overrides: [
    {
      files: ['*.ts', '*.cjs', '*.d.ts'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
