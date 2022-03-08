import { defineConfig } from 'windicss/helpers';
import colors from 'windicss/colors';

export default defineConfig({
  // preflight: true,
  darkMode: 'class',
  attributify: true,
  safelist: 'bg-secondary-darker',
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        primary: {
          50: '#F2FDF9',
          100: '#E6FCF3',
          200: '#BFF6E0',
          300: '#99F1CD',
          400: '#4DE7A8',
          DEFAULT: '#00DC82',
          600: '#00C675',
          700: '#00844E',
          800: '#00633B',
          900: '#004227',
        },
        'secondary-surface': '#E5F9FF',
        'secondary-lightest': '#B7E1ED',
        'secondary-lighter': '#95CDDE',
        'secondary-light': '#71A2B0',
        secondary: '#497A87',
        'secondary-dark': '#255461',
        'secondary-darker': '#003543',
        'secondary-darkest': '#012A35',
        'secondary-black': '#001E26',
        tertiary: '#B2CCCC', // cloud
        'cloud-surface': '#E6F0F0',
        'cloud-lightest': '#D1E2E2',
        'cloud-lighter': '#B2CCCC',
        'cloud-light': '#92ADAD',
        cloud: '#688282',
        'cloud-dark': '#566B6B',
        'cloud-darker': '#334040',
        'cloud-darkest': '#273131',
        'cloud-black': '#1A2121',
        black: '#000',
        white: '#fff',
        blue: colors.sky,
        green: {
          50: '#d0fcde',
          100: '#b0fccb',
          200: '#8cfab7',
          300: '#64f4a3',
          400: '#37e990',
          500: '#00d77d',
          600: '#00bb6a',
          700: '#009956',
          800: '#047342',
          900: '#134d2e',
        },
        red: colors.red,
        rose: colors.rose,
        yellow: colors.amber,
        orange: colors.orange,
        gray: colors.gray,
        purple: colors.purple,
      },
    },
  },
  shortcuts: {
    'd-body-bg': 'bg-white dark:bg-secondary-black',
    'd-body-text-color': 'text-secondary-darker dark:text-white', // text-secondary dark:text-white
    'd-secondary-bg': 'bg-gray-500 dark:bg-cloud-light',
    'd-secondary-text': 'text-gray-500 dark:text-cloud-light',
    'd-secondary-text-hover': 'text-gray-700 dark:text-cloud-lightest',
    'd-secondary-text-active': 'text-gray-900 dark:text-cloud-surface',
    'd-prose-tr-border':
      'border-b border-gray-100 dark:border-secondary-darker',
    'd-prose-blockquote-border':
      'border-l-2 border-gray-200 dark:border-secondary-darker',
    'd-prose-hr-border':
      'border-t border-gray-100 dark:border-secondary-darker',
    'd-prose-blockquote-text': 'd-secondary-text',
    'd-prose-a-headline-border':
      'border-b border-dashed border-gray-900 dark:border-gray-100',
    'd-prose-code-inline-in-heading-border-hover':
      'border-gray-500 dark:border-gray-200',
    'light-img': 'dark:hidden',
    'dark-img': 'light:hidden',
    'd-heading-description': '!mt-2 !mb-0 text-lg font-medium d-secondary-text',
    'text-display-6': {
      fontSize: '1.875rem',
      lineHeight: '2.25rem',
    },
    'text-display-5': {
      fontSize: '2.25rem',
      lineHeight: '2.5rem',
    },
    'text-display-4': {
      fontSize: '3rem',
      lineHeight: '3rem',
    },
    'text-display-3': {
      fontSize: '3.75rem',
      lineHeight: '3.75rem',
    },
    'text-display-2': {
      fontSize: '4.5rem',
      lineHeight: '4.5rem',
    },
    'text-display-1': {
      fontSize: '6rem',
      lineHeight: '6rem',
    },
    'text-body-xs': {
      fontSize: '0.75rem',
      lineHeight: '1rem',
    },
    'text-body-sm': {
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
    },
    'text-body-base': {
      fontSize: '1rem',
      lineHeight: '1.5rem',
    },
    'text-body-lg': {
      fontSize: '1.125rem',
      lineHeight: '1.75rem',
    },
    'text-body-xl': {
      fontSize: '1.25rem',
      lineHeight: '1.75rem',
    },
    'text-body-2xl': {
      fontSize: '1.5rem',
      lineHeight: '2rem',
    },
  },
});
