/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      backgroundImage: {
        'bg-main': "url('images/bg-main.png')",
      },
      colors: {
        backgorund: '#093545',
        card: '#092c39',
        input: '#224957'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
