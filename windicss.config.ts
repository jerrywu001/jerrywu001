import { defineConfig } from 'windicss/helpers';
import colors from 'windicss/colors';

export default defineConfig({
  // preflight: true,
  darkMode: 'class',
  attributify: true,
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'cloud-surface': '#E6F0F0',
        'cloud-lightest': '#D1E2E2',
        'cloud-light': '#92ADAD',
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
    'd-secondary-text': 'text-gray-500 dark:text-cloud-light',
    'd-secondary-text-hover': 'text-gray-700 dark:text-cloud-lightest',
    'd-heading-description': '!mt-2 !mb-0 text-lg font-medium d-secondary-text',
  },
});
