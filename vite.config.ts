import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      // Direct variable mapping
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(process.env.GOOGLE_MAPS_PLATFORM_KEY || ''),
      'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || ''),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY || ''),
      
      // CRITICAL FIX: Global object fallback to prevent runtime reference crashes
      'process.env': {},
    },
    server: {
      // HMR configuration kept intact for environment compatibility
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Allow requests coming through a Cloudflare quick tunnel (for phone/device testing).
      // Vite blocks unrecognized Host headers by default - this explicitly trusts
      // any *.trycloudflare.com subdomain, which changes every time you start a new tunnel.
      allowedHosts: ['.trycloudflare.com'],
    },
  };
});