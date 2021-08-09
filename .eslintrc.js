module.exports = {
  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },

  env: {
    browser: true,
  },

  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],

  plugins: ['@typescript-eslint'],

  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
  },

  overrides: [
    {
      files: ['./*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
