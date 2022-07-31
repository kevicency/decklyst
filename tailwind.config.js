/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        lyonar: '#e5c56d',
        songhai: '#db4460',
        vetruvian: '#db8e2b',
        abyssian: '#bf20e1',
        magmar: '#3db586',
        vanar: '#2ba3db',
        neutral: '#ffffff',
        mana: '#2ba9d8',
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /text-(lyonar|songhai|vetruvian|abyssian|magmar|vanar|neutral)/,
    },
  ],
}
