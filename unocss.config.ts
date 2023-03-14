import { defineConfig } from 'unocss';
import presetAttributify from '@unocss/preset-attributify';
import { presetIcons } from '@unocss/preset-icons';
import presetWebFonts from '@unocss/preset-web-fonts';
import { presetUno } from '@unocss/preset-uno';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    // https://icones.js.org/
    // http://localhost:3000/__unocss
    presetIcons(),
    presetWebFonts({
      // https://github.com/unocss/unocss/tree/main/packages/preset-web-fonts
      // http://googlefonts.cn/
      provider: 'google',
      fonts: {
        montserrat: 'Montserrat',
        titilliumWeb: 'Titillium Web',
      },
    }),
  ],
});
