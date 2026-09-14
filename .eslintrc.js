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
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  rules: {
    'indent': ['error', 2],
    'max-len': 0,
    'no-trailing-spaces': 1,
    'prefer-const': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-explicit-any': 'error',
    // `!` is used throughout as a deliberate style where the compiler can't follow the
    // reasoning. NOTE: typescript-eslint v8 dropped this rule from 'recommended' too.
    '@typescript-eslint/no-non-null-assertion': 0,
  }
};
