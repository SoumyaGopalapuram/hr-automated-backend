import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({}) // ✅ pass an empty object
  ],
  server: {
    port: 5173
  }
});
