module.exports = {
  root: true,
  extends: ['@dev/eslint-config-superdao'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['.eslintrc.cjs', 'preload-script.js'],
};
