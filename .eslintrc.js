module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'on' : 'warn',
    'prefer-const': process.env.NODE_ENV === 'production' ? 'on' : 'warn',
    'guard-for-in': 'off',
    'max-len': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
