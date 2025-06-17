import { defineConfig } from "vite";

// Web版専用のVite設定
export default defineConfig({
  base: '/simple-notepad/',  // GitHub Pages用パス
  build: {
    outDir: 'dist-web'
  },
  define: {
    __IS_WEB_BUILD__: true
  }
}); 