import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 개발 모드에서 서비스 워커 활성화 (테스트용)
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
      },
      // 서비스 워커 설정
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: [
        'icons/pwa-192x192.png',
        'icons/pwa-512x512.png',
        'icons/favicon-16x16.png',
        'icons/favicon-32x32.png',
        'icons/favicon-48x48.png',
        'firebase-messaging-sw.js',
      ],
      // Workbox 설정 추가
      workbox: {
        // 특정 경로는 서비스 워커에서 제외
        // Firebase 메시징 SW 파일을 캐시하지 않도록 설정
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallbackDenylist: [
          /^\/jenkins\/.*/,
          /^\/sonarqube\/.*/,
          /^\/api\/.*/,
          /^\/images\/.*/,
        ],
        // Firebase 서비스 워커 파일 제외
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/www\.gstatic\.com\/firebasejs\/.*$/,
            handler: 'NetworkFirst',
          },
        ],
      },
      // Firebase 메시징 서비스 워커 설정 추가
      strategies: 'injectManifest',
      manifest: {
        name: '북끄북끄',
        short_name: '북끄북끄',
        description:
          '북(Book)을 끄집어내고, 북(Book)을 (읽고) 끄적이다. 사용자가 소장한 책을 쉽게 등록하고 다른 사람들과 교환할 수 있으며 독서 기록까지 가능한 서비스',
        theme_color: '#fffdf8',
        icons: [
          {
            src: 'icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@types': path.resolve(__dirname, './src/types'),
      '@store': path.resolve(__dirname, './src/store'),
      '@service': path.resolve(__dirname, './src/services'),
    },
  },
});
