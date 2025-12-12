module.exports = {
  extends: ['@schoolmaster/config/eslint-base.js'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  env: {
    node: true,
  },
};
