import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Ensure _redirects file is copied to dist
    copyPublicDir: true,
  },
  // Configure dev server for SPA fallback
  server: {
    historyApiFallback: true,
  },
});
