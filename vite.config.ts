/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        id: 'poc-pwa-ionic-photo-gallery',
        name: 'ionicPhotoGalleryPoc',
        short_name: 'PhotoGallery',
        description: 'poc pws ionic framework',
        start_url: '/tab2',
        display: 'standalone',
        icons: [{
          src: 'favicon.png',
          sizes: '64x64 32x32 24x24 16x16',
          type: 'image/png'
        }],
        theme_color: '#ffffff',
        background_color: '#ffffff',
        lang: 'zh-Hant-TW',
        orientation: 'portrait'
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
