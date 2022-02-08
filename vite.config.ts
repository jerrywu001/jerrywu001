import path from 'path'
import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  server: {
    hmr: {
      overlay: false,
    },
  },
  build: {
    minify: false
  },
  plugins: [
    WindiCSS({
      preflight: false,
    }),
  ],
  resolve: {
    alias: {
      '@vue/theme': path.join(__dirname, './src'),
    },
  },
})
