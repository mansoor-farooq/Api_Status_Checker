// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/vite';

// export default defineConfig({
//   plugins: [tailwindcss(), react()],
//   server: {
//     host: '0.0.0.0',
//     port: 5173,
//     proxy: {
//       '/sap': {
//         target: 'http://192.168.16.27:8000',
//         changeOrigin: true,
//       },
//       '/api': {
//         target: 'https://apps.youngsfood.com/yplrmapp',
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) => path.replace(/^\/api/, ''),
//       },
//     },
//   },
// });



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/sap': {
        target: 'http://192.168.16.27:8000',
        changeOrigin: true,
      },
      // '/api': {
      //   target: 'https://apps.youngsfood.com/yplrmapp/',
      //   changeOrigin: true,
      //   secure: false,
      //   rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix for target
      // },
    },
  },
});