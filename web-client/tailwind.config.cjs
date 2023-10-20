/** @type {import('tailwindcss').Config} */

const d3 = require('d3-interpolate')

const twColors = require('tailwindcss/colors')

// TODO: depracate this, and convert over app-grey in the codebase
const zincExtension = {
  725: '#2B2B2F',
  750: '#303036',
  850: '#1E1E22',
  875: '#1B1B1F',
  925: '#16161A',
  950: '#141418',
  975: '#111112',
  1000: '#070708',
}

const neutralExtension = {
  450: d3.interpolate(twColors.neutral['400'], twColors.neutral['500'])(0.5),
  475: d3.interpolate(twColors.neutral['400'], twColors.neutral['500'])(0.75),
  525: d3.interpolate(twColors.neutral['500'], twColors.neutral['600'])(0.25),
  550: d3.interpolate(twColors.neutral['500'], twColors.neutral['600'])(0.5),
  575: d3.interpolate(twColors.neutral['500'], twColors.neutral['600'])(0.75),
  625: d3.interpolate(twColors.neutral['600'], twColors.neutral['700'])(0.25),
  650: d3.interpolate(twColors.neutral['600'], twColors.neutral['700'])(0.5),
  725: d3.interpolate(twColors.neutral['700'], twColors.neutral['800'])(0.25),
  750: d3.interpolate(twColors.neutral['700'], twColors.neutral['800'])(0.5),
  775: d3.interpolate(twColors.neutral['700'], twColors.neutral['800'])(0.75),
  850: d3.interpolate(twColors.neutral['800'], twColors.neutral['900'])(0.5),
}

const customizations = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/react-tailwindcss-select/dist/index.esm.js',
  ],
  theme: {
    extend: {
      flexGrow: {
        2: '2',
        3: '3',
        4: '4',
      },
      colors: {
        // General theme
        'app-gray': twColors.neutral, // App specific grays 50-950
        'app-primary': twColors.yellow, // App specific primary 50-950
        'app-secondary': twColors.indigo, // App specific secondary 50-950

        // Specific colors w/in app
        'app-indigo': twColors.indigo['600'],
        'app-green': twColors.lime['500'],
        'app-orange': twColors.amber['500'],
        'app-yellow': twColors.yellow['400'],
        'app-red': twColors.rose['500'],

        'app-link': twColors.sky['600'],

        // deprecated
        primary: '#4D7C0F',
        'primary-light': '#65A30D',
        'primary-dark': '#37580C',
        secondary: '#FACC15',
        zinc: zincExtension, // depracate this, and convert over app-grey in the codebase
        neutral: neutralExtension,
      },
      opacity: {
        2: '.02',
        2.5: '.025',
        3: '.03',
        3.5: '.035',
        4: '.04',
        4.5: '.045',
      },
      spacing: {
        4.5: '1.15rem',
        30: '7.5rem',
      },
      minWidth: {
        20: '5rem',
      },
      width: {
        46: '11.5rem',
        50: '12.5rem',
        68: '17rem',
      },
      fontSize: {
        'sm+': ['0.9375rem', '1.4'],
        '2xs': ['0.65rem', '0.9rem'],
        '3xs': ['0.5rem', '0.7rem'],
      },
      scale: {
        175: '1.75',
        200: '2.00',
        250: '2.50',
        300: '3.00',
      },
    },
  },
  plugins: [],
}

module.exports = customizations
