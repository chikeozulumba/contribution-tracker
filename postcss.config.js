/* eslint-disable import/no-extraneous-dependencies */
const tailwind = require('tailwindcss');
// const tailwind = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const purgecss = require('@fullhuman/postcss-purgecss');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    tailwind,
    process.env.NODE_ENV === 'production' ? autoprefixer : null,
    process.env.NODE_ENV === 'production'
      ? cssnano({ preset: 'default' })
      : null,
    process.env.NODE_ENV === 'production' ? purgecss({
      content: ['./layouts/**/*.html', './src/**/*.vue', './src/**/*.jsx'],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    }) : null,
  ],
};
