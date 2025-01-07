const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'emsi-blue': '#0056b3',
        'emsi-green': '#4CAF50',
        'emsi-red': '#F44336',
        'emsi-yellow': '#FFEB3B',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'strong': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
