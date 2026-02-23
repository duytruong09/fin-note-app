/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          red: '#FF6B6B',
          pink: '#FF85C0',
          purple: '#9775FA',
          blue: '#4C6EF5',
          cyan: '#22B8CF',
          teal: '#20C997',
          green: '#51CF66',
          lime: '#94D82D',
          yellow: '#FCC419',
          orange: '#FF922B',
          indigo: '#5C7CFA',
          violet: '#CC5DE8',
          fuchsia: '#E64980',
          rose: '#F06595',
          sky: '#339AF0',
          emerald: '#12B886',
          amber: '#FAB005',
          slate: '#495057',
          gray: '#868E96',
          neutral: '#ADB5BD',
        },
        expense: '#FF6B6B',
        income: '#51CF66',
      },
    },
  },
  plugins: [],
};
