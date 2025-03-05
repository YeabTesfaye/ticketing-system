import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // proxy: {
    //   '/api': {
    //     target: 'https://ticketing-system-4.onrender.com',
    //     changeOrigin: true,
    //     secure: true, // This is important if your API is not using HTTPS, but since it's HTTPS in your case, you can keep it true.
    //     rewrite: (path) => path.replace(/^\/api/, ''), // Removes the `/api` prefix when making the request
    //   },
    // },
  },
});
