module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: (theme) => ({
      ...theme('colors'),
      primary: '#2B2A30',
      secondary: '#9d0000',
      green: '#00aa51'
    }),
    letterSpacing: {
      widest: '0.6em'
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/aspect-ratio')]
};
