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
      red: colors.red,
      green: colors.green,
      amber: colors.amber,

      // semantic colors
      gray: {
        ...colors.neutral,
        850: '#202020',
        1000: '#101010',
      },
      alt: { ...colors.gray, 850: '#18212F', 1000: '#090C14' },
      accent: colors.teal,
      mana: '#2ba9d8',
      attack: colors.amber[400],
      health: colors.red[600],

      // faction
      lyonar: '#e5c56d',
      songhai: '#db4460',
      vetruvian: '#db8e2b',
      abyssian: '#bf20e1',
      magmar: '#3db586',
      vanar: '#2ba3db',

      // rarity
      neutral: colors.neutral['100'],
      common: colors.neutral['100'],
      basic: colors.neutral['300'],
      rare: '#396cfd',
      epic: '#bf20e1',
      legendary: '#e39f28',

      // shadow
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
