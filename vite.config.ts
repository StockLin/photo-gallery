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
        start_url: '.',
        display: 'standalone',
        icons: [
          {
            src: '/pwa-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
        ],
        theme_color: '#ffffff',
        background_color: '#ffffff',
        lang: 'zh-Hant-TW',
        orientation: 'portrait',
        scope: '/'
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
