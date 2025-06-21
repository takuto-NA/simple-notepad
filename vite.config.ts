import { defineConfig } from "vite";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;
// @ts-expect-error process is a nodejs global
const isWebBuild = process.env.VITE_BUILD_TARGET === 'web';

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  // Web版用の設定
  ...(isWebBuild && {
    base: '/simple-notepad/',  // GitHub Pages用パス
    build: {
      outDir: 'dist-web'
    },
    define: {
      __IS_WEB_BUILD__: true
    }
  }),
  
  // Tauri版用の設定
  ...(!isWebBuild && {
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // Build optimization
    build: {
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: undefined,
        }
      }
    },
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
      port: 1420,
      strictPort: true,
      host: host || false,
      hmr: host
        ? {
            protocol: "ws",
            host,
            port: 1421,
          }
        : undefined,
      watch: {
        // 3. tell vite to ignore watching `src-tauri`
        ignored: ["**/src-tauri/**"],
      },
    },
    define: {
      __IS_WEB_BUILD__: false
    }
  })
}));
