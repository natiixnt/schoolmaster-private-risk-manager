module.exports = {
  root: false,
  env: {
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    // Use the cwd of the project being linted so workspaces pick up their own tsconfig
    tsconfigRootDir: process.cwd(),
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  ignorePatterns: ['dist', 'node_modules'],
  rules: {
    '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
  },
};
