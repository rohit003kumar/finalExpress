


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';
// import viteCompression from 'vite-plugin-compression';
// import { visualizer } from 'rollup-plugin-visualizer';

// export default defineConfig({
//   plugins: [
//     react(),

//     VitePWA({
//       registerType: 'autoUpdate',
//       includeAssets: [
//         'icons/favicon.svg',
//         'robots.txt',
//         'icons/icon-192x192.webp',
//         'icons/icon-512x512.webp',
//         'icons/screenshots/home-wide.webp',
//         'icons/screenshots/home-square.webp'
//       ],
//       manifest: {
//         name: 'Dobhi Laundry Services',
//         short_name: 'Dobhi',
//         description: 'Book washermen for pickup, wash, and delivery of clothes.',
//         start_url: '/',
//         scope: '/',
//         display: 'standalone',
//         background_color: '#ffffff',
//         theme_color: '#0ea5e9',
//         icons: [
//           {
//             src: 'icons/icon-192x192.webp',
//             sizes: '192x192',
//             type: 'image/webp'
//           },
//           {
//             src: 'icons/icon-512x512.webp',
//             sizes: '512x512',
//             type: 'image/webp'
//           }
//         ],
//         screenshots: [
//           {
//             src: 'icons/screenshots/home-wide.webp',
//             sizes: '1280x720',
//             type: 'image/webp',
//             form_factor: 'wide'
//           },
//           {
//             src: 'icons/screenshots/home-square.webp',
//             sizes: '720x720',
//             type: 'image/webp',
//             form_factor: 'narrow'
//           }
//         ]
//       },
//       workbox: {
//         runtimeCaching: [
//           {
//             urlPattern: /\/api\//,
//             handler: 'NetworkFirst',
//             options: {
//               cacheName: 'api-cache',
//               expiration: {
//                 maxEntries: 50,
//                 maxAgeSeconds: 3600
//               }
//             }
//           }
//         ]
//       }
//     }),

//     viteCompression(),
//     visualizer({ open: false })
//   ],

//   build: {
//     outDir: '../Backend/public',
//     emptyOutDir: true,
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           vendor: ['react', 'react-dom', 'react-router-dom']
//         }
//       }
//     }
//   },

//   optimizeDeps: {
//     exclude: ['lucide-react']
//   },

//   server: {
//     proxy: {
//       '/api': 'http://localhost:5000'
//     }
//   }
// });







import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),

    // ✅ PWA configuration
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'icons/favicon.svg',
        'robots.txt',
        'icons/icon-192x192.png',
        'icons/icon-512x512.png',
        'icons/screenshots/home-wide.webp',
        'icons/screenshots/home-square.webp'
      ],
      manifest: {
        name: 'Dobhi Laundry Services',
        short_name: 'Dobhi',
        description: 'Book washermen for pickup, wash, and delivery of clothes.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0ea5e9',
        icons: [
          {
            src: 'icons/icon-192x192.webp',
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: 'icons/icon-512x512.webp',
            sizes: '512x512',
            type: 'image/webp'
          }
        ],
        screenshots: [
          {
            src: 'icons/screenshots/home-wide.webp',
            sizes: '1280x720',
            type: 'image/webp',
            form_factor: 'wide'
          },
          {
            src: 'icons/screenshots/home-square.webp',
            sizes: '720x720',
            type: 'image/webp',
            form_factor: 'narrow'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 3600 // 1 hour
              }
            }
          }
        ]
      }
    }),

    // ✅ Gzip compression for production assets
    viteCompression({
      algorithm: 'gzip',
      threshold: 1024, // compress files over 1kb
    }),

    // ✅ Bundle visualizer (optional)
    visualizer({ open: false })
  ],

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },

  optimizeDeps: {
    exclude: ['lucide-react']
  },

  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
});











// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';
// import viteCompression from 'vite-plugin-compression';
// import { visualizer } from 'rollup-plugin-visualizer';

// export default defineConfig({
//   plugins: [
//     react(),

//     // ✅ PWA configuration
//     VitePWA({
//       // Change this to 'prompt' to allow manual control of install prompt
//       registerType: 'prompt',

//       includeAssets: [
//         'icons/favicon.svg',
//         'robots.txt',
//         'icons/icon-192x192.png',
//         'icons/icon-512x512.png',
//         'icons/screenshots/home-wide.webp',
//         'icons/screenshots/home-square.webp'
//       ],

//       manifest: {
//         name: 'Dobhi Laundry Services',
//         short_name: 'Dobhi',
//         description: 'Book washermen for pickup, wash, and delivery of clothes.',
//         start_url: '/', // ✅ Keep this at root unless you're redirecting to /mainapp
//         scope: '/',
//         display: 'standalone',
//         background_color: '#ffffff',
//         theme_color: '#0ea5e9',

//         icons: [
//           {
//             src: 'icons/icon-192x192.png',
//             sizes: '192x192',
//             type: 'image/png'
//           },
//           {
//             src: 'icons/icon-512x512.png',
//             sizes: '512x512',
//             type: 'image/png'
//           },
//           {
//             src: 'icons/icon-512x512.png',
//             sizes: '512x512',
//             type: 'image/png',
//             purpose: 'any maskable'
//           }
//         ],

//         screenshots: [
//           {
//             src: 'icons/screenshots/home-wide.webp',
//             sizes: '1280x720',
//             type: 'image/webp',
//             form_factor: 'wide'
//           },
//           {
//             src: 'icons/screenshots/home-square.webp',
//             sizes: '720x720',
//             type: 'image/webp',
//             form_factor: 'narrow'
//           }
//         ]
//       },

//       workbox: {
//         runtimeCaching: [
//           {
//             urlPattern: /\/api\//,
//             handler: 'NetworkFirst',
//             options: {
//               cacheName: 'api-cache',
//               expiration: {
//                 maxEntries: 50,
//                 maxAgeSeconds: 3600 // 1 hour
//               }
//             }
//           }
//         ]
//       },

//       devOptions: {
//         enabled: true
//       }
//     }),

//     viteCompression({
//       algorithm: 'gzip',
//       threshold: 1024
//     }),

//     visualizer({ open: false })
//   ],

//   build: {
//     outDir: 'dist',
//     emptyOutDir: true,
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           vendor: ['react', 'react-dom', 'react-router-dom']
//         }
//       }
//     }
//   },

//   optimizeDeps: {
//     exclude: ['lucide-react']
//   },

//   server: {
//     proxy: {
//       '/api': 'http://localhost:8080'
//     }
//   }
// });


