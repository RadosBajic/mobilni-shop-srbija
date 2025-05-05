
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Eksplicitno definišemo globalne objekte za specifične platforme
  define: {
    // Samo ako je potrebno za klijentski JavaScript kod
    'process.env': {}, // Prazan objekat umesto process.env za klijent
  },
  // Eksplicitno navodimo Node.js module koje treba isključiti
  optimizeDeps: {
    exclude: ['pg', 'pg-native', 'pg-pool']
  },
  // Eksplicitno definišemo eksterne module za Rollup
  build: {
    rollupOptions: {
      external: [
        'pg', 
        'pg-native', 
        'pg-pool', 
        'cloudflare:sockets',
        'net',
        'tls',
        'fs',
        'crypto',
        'stream',
        'events',
        'util',
        'path',
        'dns',
        'process'
      ]
    }
  }
}));
