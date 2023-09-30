module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    'indent': ['error', 2],
    'max-len': ['error', 180],
    'no-trailing-spaces': 1,
    'prefer-const': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    'max-len': 0
  }
};
