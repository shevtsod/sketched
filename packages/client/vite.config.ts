/// <reference types="vitest/config" />
/// <reference types="vitest/browser" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // https://vite.dev/config/server-options
  server: {
    proxy: {
      "/api": {
        target: `http://${process.env.HOST ?? "127.0.0.1"}:${process.env.PORT ?? 3000}`,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    watch: {
      // watch for file changes in Docker
      usePolling: true,
    },
  },
  // https://testing-library.com/docs/react-testing-library/setup
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["tests/setup/setup.ts"],
  },
});
