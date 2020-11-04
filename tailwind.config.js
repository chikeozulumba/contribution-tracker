const tailwindUi = require('@tailwindcss/ui');

module.exports = {
  purge: ['./src/**/*.vue'],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  theme: {
    extend: {
      fontFamily: {
        primary: 'Bree Serif',
        secondary: 'Krub',
      },
    },
  },
  variants: {},
  plugins: [
    tailwindUi,
  ],
};
