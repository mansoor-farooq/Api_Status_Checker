
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
//         secure: false,
//         rewrite: (path) => path.replace(/^\/sap/, '/sap'),
//       },
//     },
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
      title: 'Balla Bundle Report',
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/sap': {
        target: 'http://192.168.16.27:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/sap/, '/sap'),
      },
      // Proxy external YoungsFood APIs during local development to avoid CORS
      '/yplrmapp': {
        target: 'https://apps.youngsfood.com',
        changeOrigin: true,
        secure: false, // set to true if remote has valid cert and you want strict verification
        rewrite: (path) => path.replace(/^\/yplrmapp/, '/yplrmapp'),
      },

    },
  },
  build: {
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const parts = id.split('node_modules/')[1].split('/');
            const pkg = parts[0].startsWith('@')
              ? `${parts[0]}/${parts[1]}`
              : parts[0];

            if (/react|react-dom/.test(pkg)) return 'react';
            if (/chart|recharts|echarts/.test(pkg)) return 'charts';
            if (/lodash|lodash-es/.test(pkg)) return 'lodash';
            if (/date-fns|dayjs|moment/.test(pkg)) return 'datetime';

            return `vendor-${pkg.replace('@', '').replace('/', '-')}`;
          }
        },
      },
    },
  },

});
