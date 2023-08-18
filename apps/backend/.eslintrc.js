module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  extends: ['@dev/eslint-config-superdao'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 2017,
  },
  rules: {
    '@typescript-eslint/no-extraneous-class': ['warn', { 'allowEmpty': true }],
  },
  ignorePatterns: ['dist', '.eslintrc.js'],
};
