const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import("tailwindcss").Config} */

module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    colors: {
      // tw colors
      inherit: 'inherit',
      transparent: 'transparent',
      current: 'currentColor',
      gray: colors.gray,
      teal: colors.teal,
      red: colors.red,
      green: colors.green,
      zinc: colors.zinc,
      neutral: {
        ...colors.neutral,
        850: '#202020',
        DEFAULT: colors.neutral[100], // rarity neutral workaround
      },

      // faction
      lyonar: '#e5c56d',
      songhai: '#db4460',
      vetruvian: '#db8e2b',
      abyssian: '#bf20e1',
      magmar: '#3db586',
      vanar: '#2ba3db',

      // rarity
      // neutral: colors.neutral['100'],
      common: colors.neutral['100'],
      basic: colors.neutral['300'],
      rare: '#396cfd',
      epic: '#bf20e1',
      legendary: '#e39f28',

      // semantic
      mana: '#2ba9d8',

      dark: '#0c0c0cc0',
    },
    extend: {
      fontFamily: {
        mono: ['Roboto Mono', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
  safelist: [
    {
      pattern: /!?(text|bg|border)-(lyonar|songhai|vetruvian|abyssian|magmar|vanar|neutral)/,
      variants: ['hover'],
    },
    {
      pattern: /!?(text)-(common|basic|rare|epic|legendary)/,
      variants: ['hover'],
    },
  ],
}
