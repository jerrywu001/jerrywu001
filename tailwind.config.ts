import type { Config } from 'tailwindcss';
import { iconsPlugin, getIconCollections } from '@egoist/tailwindcss-icons';

export default <Partial<Config>>{
  darkMode: 'class',
  plugins: [
    iconsPlugin({
      // https://icones.js.org
      collections: getIconCollections(['carbon', 'lucide', 'mdi']),
    }),
  ],
  content: [
    './pages/**/*.{vue,tsx}',
    './layouts/**/*.{vue,tsx}',
    './components/**/*.{vue,tsx}',
    './md-components/**/*.{vue,tsx}',
    './sanpack-demos/**/*.{vue,tsx}',
  ],
};
