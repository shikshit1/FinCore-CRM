/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        surface: {
          light: '#f8fafc',
          dark: '#0f172a',
        },
      },
      transitionProperty: {
        theme: 'background-color, border-color, color, fill, stroke, box-shadow',
      },
    },
  },
  plugins: [],
};
