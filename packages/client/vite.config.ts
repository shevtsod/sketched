import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // https://vite.dev/config/server-options
  server: {
    watch: {
      // watch for file changes in Docker
      usePolling: true,
    },
  },
});
