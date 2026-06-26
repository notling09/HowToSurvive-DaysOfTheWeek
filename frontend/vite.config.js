import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Frontend läuft auf Port 5173 und leitet API-Anfragen an das Backend (3001) weiter.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
