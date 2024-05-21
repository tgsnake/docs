export default {
  content: ['./styles/global.css', './pages/**', './components/**', './app/**'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('rippleui'), require('@tailwindcss/typography')],
};
