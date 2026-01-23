import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';
import viteCompression from 'vite-plugin-compression';
import {enhancedImages} from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      $components: path.resolve('./src/lib/components/'),
      $features: path.resolve('./src/lib/features/'),
      $data: path.resolve('./src/lib/data/'),
      $utils: path.resolve('./src/lib/utils'),
      $settings: path.resolve('./src/lib/settings'),
      $styles: path.resolve('./src/lib/styles'),
      $theme: path.resolve('./src/lib/styles/theme.css')
    }
  },
  plugins: [
    // Brotli compression only - Cloudflare serves this preferentially
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false,
      threshold: 512 // Compress smaller files too
    }),

    enhancedImages({
      formats: ['webp', 'avif'],
      sizes: [320, 640, 1280, 1920],
      defaultFormat: 'webp',
      optimize: true
    }),

    sveltekit(),
    tailwindcss()
  ],
  build: {
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    // Disable sourcemaps in production (saves 30-50% bundle size)
    sourcemap: false,
    // Report compressed sizes for accurate metrics
    reportCompressedSize: true,
    // Warn on large chunks
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Optimized chunking for better caching and lazy loading
        manualChunks: (id) => {
          // Three.js core - loaded only when needed
          if (id.includes('node_modules/three')) {
            return 'three';
          }
          // Supabase - separate chunk for auth/data features
          if (id.includes('@supabase')) {
            return 'supabase';
          }
          // Svelte runtime
          if (id.includes('svelte')) {
            return 'svelte';
          }
          return undefined;
        }
      }
    }
  },
  server: {
    cors: true,
    strictPort: true
  }
});
